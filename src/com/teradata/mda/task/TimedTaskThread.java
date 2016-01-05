package com.teradata.mda.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.teradata.mda.model.MdaJob;
/**
 * Created by HY186013 on 2015/12/31.
 */
public class TimedTaskThread extends Thread {
	private static Logger logger = LoggerFactory.getLogger(TimedTaskThread.class.getName());
	private int sleepInterval = 5000;
	private TimedTaskDaemon daemon ;

	public TimedTaskThread(TimedTaskDaemon daemon, int paramInt) {
		this.daemon = daemon;
		this.sleepInterval = paramInt;
	}

	//预约查询任务
	public void run() {
		while (true) {
			try {
				MdaJob job;
				synchronized(daemon.lock){
					job = daemon.loadTask();
				}
				if (job!=null){
					daemon.runTask(job);
					continue;
				}
			} catch (Exception ex) {
				logger.error("TimedTaskThread run ", ex.getMessage());
			}
			try {
				logger.debug(Thread.currentThread().getName() + " no task ! sleep " + this.sleepInterval+ "S");
				Thread.sleep(this.sleepInterval);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	
	
}