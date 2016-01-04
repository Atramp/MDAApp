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
	
	
	// 获取任务
	public MdaJob loadTask() {
		SqlSession session = null;
		try {
			session = mdaFactory.openSession();
			JobOperator operator = session.getMapper(JobOperator.class);
			int jobId = operator.getTaskJobId();
			MdaJob job = operator.getJobByID(jobId);
			if(job!=null){
				throw new MdaAppException("错误的任务编号");
			}
			String state = job.getCurrentstatus();
			if (state.compareToIgnoreCase("R") == 0) {
				throw new MdaAppException("分析任务正在运行");
			} else if (state.compareToIgnoreCase("E") == 0 || state.compareToIgnoreCase("F") == 0) {
				throw new MdaAppException("前一次任务已经结束或发生错误，请重置任务状态");
			}
			Date now = new Date(System.currentTimeMillis());
			SimpleDateFormat format = new SimpleDateFormat("YYYYMMddHHmmss");
			String outFileName = "";
			if (outFileName == null || outFileName.trim().isEmpty()) {
				outFileName = "results/" + job.getJobname() + "-" + jobId + "-" + format.format(now) + ".xlsx";
			}
			job.setCurrentstatus("R");
			format.applyPattern("YYYY年MM月dd日HH:mm:ss");
			String msg = "任务在" + format.format(now) + "启动,输出文件名为" + outFileName;
			job.setStatusdescription(msg);
			job.setOutputfilename(outFileName);
			operator.updateJob(job);
			session.commit();
			return job;
		} catch (Exception e) {
			logger.error(" load task error !  " + e.getMessage());
			//e.printStackTrace();
			if (session != null) {
				session.rollback();
			}
		} finally {
			try {
				session.close();
			} catch (Exception ignore) {

			}
		}
		return null;
	}

	public void runTask(MdaJob job) throws MdaAppException {
		String userSql = job.getUsersql();
		String createdSQl = job.getSqlstatement();
		String sql;
		if (userSql != null && userSql.isEmpty()) {
			sql = userSql;
		} else {
			sql = createdSQl;
		}
		if (sql.isEmpty()) {
			throw new MdaAppException("SQL脚本为空");
		}
		String rfn = sc.getRealPath(outFilePath + File.separator + job.getOutputfilename());
		HashMap<Integer, SQLTask> taskList = (HashMap<Integer, SQLTask>) sc.getAttribute("TASKLIST");
		SQLTask task = new SQLTask(job.getJobid(), mdaFactory, mainDWFactory, sql, rfn,taskList);
		task.run();
		logger.info("the job id: {} jobName:{} start at {} output file name {}",job.getJobid(), job.getJobname(), new Date(System.currentTimeMillis()), job.getOutputfilename());
	}

	public void mainFunExcute() {
		for (int i = 0; i < this.threadPoolSize; ++i) {
			TimedTaskThread localTimedTaskThread = new TimedTaskThread(this,this.sleepInterval);
			localTimedTaskThread.setName(String.valueOf(i + 1));
			localTimedTaskThread.start();
		}
	}


	public static void main(String[] args) {
		TimedTaskDaemon damon = new TimedTaskDaemon(null,null,null);
		damon.mainFunExcute();
	}

}