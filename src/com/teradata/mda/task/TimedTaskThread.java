package com.teradata.mda.task;

import com.teradata.mda.util.MdaAppException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.teradata.mda.model.MdaJob;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by HY186013 on 2015/12/31.
 */
public class TimedTaskThread extends Thread {
    private static Logger logger = LoggerFactory.getLogger(TimedTaskThread.class.getName());
    private int sleepInterval = 5000;
    private TimedTaskDaemon daemon;

    public TimedTaskThread(TimedTaskDaemon daemon, int paramInt) {
        this.daemon = daemon;
        this.sleepInterval = paramInt;
    }

    //预约查询任务
    public void run() {
        while (true) {
            try {
                MdaJob job = daemon.loadTask();
                if (job != null) {
                    daemon.runTask(job);
                    continue;
                }
                logger.info(Thread.currentThread().getName() + " no task !");
                logger.debug(Thread.currentThread().getName() + " sleep " + this.sleepInterval / 1000 + "S");
            } catch (MdaAppException e) {
                e.printStackTrace();
            }

            try {
                Thread.sleep(this.sleepInterval);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }


}