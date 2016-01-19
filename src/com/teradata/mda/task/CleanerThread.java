package com.teradata.mda.task;

import com.teradata.mda.config.MdaConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import java.io.File;

/**
 * Created by YS186019 on 2016/1/19.
 * this thread will clean the file of output directory,
 *  after it exceed the configured period, delete it
 *  in the future we may also need to clean the task that not finished
 */
public class CleanerThread extends Thread{
    Logger logger= LoggerFactory.getLogger(CleanerThread.class);
    private boolean runFlag=true;
    private String output_dir="result";
    private int expireDays=10;
    //ServletContext context;

    public CleanerThread(ServletContext context){
        super();
        //this.context=context;
        MdaConfig config=MdaConfig.getInstance();
        output_dir=context.getRealPath("/") + "/" +config.getString("output_dir","results") + "/";
        expireDays=config.getInt("output_expire",10);
    }


    public synchronized  void stopRunning(){
        runFlag=false;
    }

    private void cleanExpiredFile(){
        try {
            File dir = new File(output_dir);
            long now = System.currentTimeMillis();
            String[] fns = dir.list();
            for (int i = 0, len = fns.length; i < len; i++) {
                File file = new File(output_dir + fns[i]);
                long fileTime = file.lastModified();
                if ((now - 86400000 * expireDays) > fileTime) {
                    file.delete();
                }
            }
        }catch (Exception e){
            logger.warn("Error while delete the exipre file, {} ", e.getMessage());
        }
    }


    public void run(){
        while(true){
            boolean flag=true;
            synchronized (this){
                flag=runFlag;
            }
            if(!flag){
                break;
            }
            cleanExpiredFile();
            try{
                sleep(60000);
            }catch (InterruptedException ignore){
            }
        }




    }


}
