package com.teradata.mda.task;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Properties;

import javax.servlet.ServletContext;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.teradata.mda.dao.JobOperator;
import com.teradata.mda.model.MdaJob;
import com.teradata.mda.sql.SQLTask;
import com.teradata.mda.util.MdaAppException;
/**
 * Created by HY186013 on 2015/12/31.
 */
public class TimedTaskDaemon {
	private static Logger logger = LoggerFactory.getLogger(TimedTaskDaemon.class.getName());
	SqlSessionFactory mdaFactory;
	SqlSessionFactory mainDWFactory;
	ServletContext sc;
	private int threadPoolSize = 5;
	private int sleepInterval = 30 * 1000;
	private String outFilePath;
	Object lock = new Object();
	
	
	public TimedTaskDaemon(SqlSessionFactory mdaFactory,SqlSessionFactory mainDWFactory, ServletContext sc) {
		this.mdaFactory = mdaFactory;
		this.mainDWFactory = mainDWFactory;
		this.sc = sc;
		Properties localProperties = new Properties();
		try {
			localProperties.load(this.getClass().getClassLoader().getResourceAsStream("time.properties"));
			this.threadPoolSize = Integer.parseInt(localProperties.getProperty("work_thread_size"));
			this.sleepInterval = (Integer.parseInt(localProperties.getProperty("work_thread_sleep_interval")) * 1000);
			this.outFilePath = localProperties.getProperty("out_file_path");
			if(this.outFilePath==null){
				this.outFilePath = "";
			}
			logger.debug("threadPoolSize=" + threadPoolSize + ",sleepInterval="+ sleepInterval);
			logger.debug("outFilePath=" + outFilePath);
		} catch (IOException ex) {
			ex.printStackTrace();
			logger.error("properties file load error !" + ex.getMessage());
		}
	}
	
	 
	/**
	 * 加载预约任务
	 */
	public MdaJob loadTask() {
		SqlSession session = null;
		MdaJob job =null;
		try {
			session = mdaFactory.openSession();
			JobOperator operator = session.getMapper(JobOperator.class);
			synchronized(lock){
				Integer jobId = operator.getTaskJobId();
				job = operator.getJobByID(jobId);
				if(job!=null){
					Date now = new Date(System.currentTimeMillis());
					SimpleDateFormat format = new SimpleDateFormat("YYYYMMddHHmmss");
					String outFileName = "";
					if(outFileName==null || outFileName.trim().isEmpty()){
						outFileName=outFilePath + File.separator + job.getJobname()+"-"+jobId+"-" + format.format(now)+".xlsx";
					}
					format.applyPattern("YYYY年MM月dd日HH:mm:ss");
					String msg = "任务在" + format.format(now) + "启动,输出文件名为" + outFileName;
					job.setStatusdescription(msg);
					job.setOutputfilename(outFileName);
					job.setCurrentstatus("R");
					operator.updateJob(job);
					session.commit();
				}
			}
		} catch (Exception e) {
			if (session != null) {
				session.rollback();
			}
		} finally {
			try {
				session.close();
			} catch (Exception ignore) {
				
			}
		}
		return job;
	}

	/**
	 * 执行预约任务
	 * @param job 任务对象 
	 * @throws MdaAppException 应用异常
	 */
	public void runTask(MdaJob job) throws MdaAppException{
		int jobId = job.getJobid();
		String userSql = job.getUsersql();
		String createdSQl = job.getSqlstatement();
		String sql;
		if (userSql != null && userSql.isEmpty()) {
			sql = userSql;
		} else {
			sql = createdSQl;
		}
		if (sql.isEmpty()) {
			throw new MdaAppException("任务["+jobId+"]SQL脚本为空");
		}
		String outFileName = job.getOutputfilename();
		String rfn=sc.getRealPath(outFileName);
		File file = new File(rfn);
		String path = file.getParent();
		if(!new File(path).exists()){
			new File(path).mkdirs();
		}
		HashMap<Integer, SQLTask> taskList = (HashMap<Integer, SQLTask>) sc.getAttribute("TASKLIST");
		SQLTask task = new SQLTask(jobId, mdaFactory, mainDWFactory, sql, rfn, taskList);
		task.run();
		logger.info("the job id: {} jobName:{} start at {} output file name {}",jobId, job.getJobname(), new Date(System.currentTimeMillis()), outFileName);
	}

	/**
	 * 创建执行预约任务的进程，调度程序
	 */
	public void mainFunExcute() {
		for (int i = 0; i < this.threadPoolSize; ++i) {
			TimedTaskThread localTimedTaskThread = new TimedTaskThread(this,this.sleepInterval);
			localTimedTaskThread.setName("ThreadTask"+String.valueOf(i + 1));
			localTimedTaskThread.start();
		}
	}

}