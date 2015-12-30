package com.teradata.mda.sql;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.teradata.mda.dao.JobOperator;
import com.teradata.mda.model.MdaJob;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.HashMap;

/**
 * Created by YS186019 on 2015/10/27.
 */
public class SQLTask extends Thread{
    Logger logger= LoggerFactory.getLogger(SQLTask.class);
    SqlSessionFactory mdaFactory;
    SqlSessionFactory mainDWFactory;
    String sql;
    String outputFileName;
    int jobId;
    long startTime;
    private boolean running;
    HashMap<Integer,SQLTask> taskList;

    public SQLTask(int jobId,SqlSessionFactory mdaFactory,SqlSessionFactory mainDWFactory,String sql,String outputFileName,HashMap<Integer,SQLTask> taskList){
        this.mdaFactory=mdaFactory;
        this.mainDWFactory=mainDWFactory;
        this.sql=sql;
        this.outputFileName=outputFileName;
        this.setDaemon(true);
        //this.setName("RUNNING-JOB-" + jobId);
        this.jobId=jobId;
        this.taskList=taskList;
    }



    public void generateExecl2003(){
        startTime=System.currentTimeMillis();
        SimpleDateFormat format=new SimpleDateFormat("YYYY年MM月dd日HH:mm:ss");
        String msg="任务在" + format.format(startTime)+ "启动";
        this.updateJobStatus(msg);

        HSSFWorkbook workbook2003 = new HSSFWorkbook();
        // 创建工作表对象并命名
        HSSFSheet sheet = workbook2003.createSheet();
        SqlSession dwSession=null;
        Connection connection=null;
        String ret="";
        try {
            dwSession=mainDWFactory.openSession();
            connection=dwSession.getConnection();
            Statement state =connection.createStatement();
            ResultSet rset=state.executeQuery(sql);
            ResultSetMetaData meta=rset.getMetaData();
            int count=0;
            int colCount=meta.getColumnCount();
            HSSFRow row = sheet.createRow(count);
            for(int i=1;i<=colCount;i++){
                String label=meta.getColumnLabel(i);
                if(label==null || label.isEmpty()){
                    label=meta.getColumnName(i);
                }
                HSSFCell cell=row.createCell(i);
                cell.setCellValue(label);

            }

            while(rset.next()){

                row = sheet.createRow(count);

                for(int i=1;i<=colCount;i++){
                    String val=rset.getString(i);
                    if(val!=null){
                        val=val.trim();
                    }else{
                        val="";
                    }
                    HSSFCell cell=row.createCell(i);
                    cell.setCellValue(val);
                }
                count++;
                if(count%1000==0){
                    //workbook2003.write(os);
                    msg="已生成" + count +"条数据";
                    if(this.isRunning()) {
                        updateJobStatus(msg);
                    }else{
                        msg="任务终止，"+msg;
                        String time=(new Timestamp(System.currentTimeMillis())).toString();
                        updateJobStatus("E", time,msg);
                        return;
                    }

                }
                BufferedOutputStream os=new BufferedOutputStream(new FileOutputStream(this.outputFileName));
                workbook2003.write(os);
            }

            msg="任务成功，一共"+ count + "条记录，任务执行时间： " +((System.currentTimeMillis()-startTime)/1000) + "秒" ;
            String time=(new Timestamp(System.currentTimeMillis())).toString();
            updateJobStatus("S", time,msg);
            logger.debug("task {} succeed",ret);
            return;
        }catch(Exception e){
            logger.warn("Error while query the database or process the result set, {}", e.toString());
            msg="运行任务 " + this.getName() + " 错误: " +e.getMessage();
            String time=(new Timestamp(System.currentTimeMillis())).toString();
            updateJobStatus("E", time,msg);
        }finally {
            try {
                if (connection != null) {
                    connection.close();
                }
                if(dwSession!=null){
                    dwSession.close();
                }
            }catch(SQLException ignore){

            }
        }
    }


    public void generateExecl2007(){
        startTime=System.currentTimeMillis();
        SimpleDateFormat format=new SimpleDateFormat("YYYY年MM月dd日HH:mm:ss");
        String msg="任务在" + format.format(startTime)+ "启动";
        this.updateJobStatus(msg);
        int rowaccess=1000;//内存中缓存记录行数
           /*keep 100 rowsin memory,exceeding rows will be flushed to disk*/
        SXSSFWorkbook wb = new SXSSFWorkbook(rowaccess);
        // 创建工作表对象并命名
        Sheet sheet = wb.createSheet();
        SqlSession dwSession=null;
        Connection connection=null;
        String ret="";
        try {

            dwSession=mainDWFactory.openSession();
            connection=dwSession.getConnection();
            Statement state =connection.createStatement();
            ResultSet rset=state.executeQuery(sql);
            ResultSetMetaData meta=rset.getMetaData();
            int count=0;
            int colCount=meta.getColumnCount();
            Row row = sheet.createRow(count);
            for(int i=1;i<=colCount;i++){
                String label=meta.getColumnLabel(i);
                if(label==null || label.isEmpty()){
                    label=meta.getColumnName(i);
                }
                Cell cell=row.createCell(i-1);
                cell.setCellValue(label);
            }
            count++;
            while(rset.next()){

                row = sheet.createRow(count);

                for(int i=1;i<=colCount;i++){
                    String val=rset.getString(i);
                    if(val!=null){
                        val=val.trim();
                    }else{
                        val="";
                    }
                    Cell cell=row.createCell(i-1);
                    cell.setCellValue(val);
                }
                count++;
                if(count%rowaccess==0){
                    ((SXSSFSheet)sheet).flushRows();
                    msg="已生成" + count +"条数据";
                    //sleep(2000);
                    if(this.isRunning()) {
                        updateJobStatus(msg);
                    }else{
                        msg="任务终止，"+msg;
                        String time=(new Timestamp(System.currentTimeMillis())).toString();
                        updateJobStatus("E", time,msg);
                        return;
                    }
                }
            }
            BufferedOutputStream os=new BufferedOutputStream(new FileOutputStream(this.outputFileName));
            wb.write(os);
            os.close();
            msg="任务成功，一共"+ count + "条记录"
                    + "任务执行时间： " +((System.currentTimeMillis()-startTime)/1000) + "秒" ;
            String time=(new Timestamp(System.currentTimeMillis())).toString();
            updateJobStatus("S", time,msg);
            logger.debug("task {} succeed",ret);
            return;
        }catch(Exception e){
            logger.warn("Error while query the database or process the result set, {}", e.toString());
            //String msg="运行任务 " + this.getName() + " 错误: " +e.getMessage();
            String time=(new Timestamp(System.currentTimeMillis())).toString();
            updateJobStatus("E", time,e.getMessage());
        }finally {
            try {
                if (connection != null) {
                    connection.close();
                }
                if(dwSession!=null){
                    dwSession.close();
                }

            }catch(SQLException ignore){

            }
        }
    }





    //we can also call create 2003 excel here, but currently we make it a 2007 file
    public void run(){
        this.running=true;
        this.taskList.put(new Integer(jobId),this);
        this.generateExecl2007();
        this.taskList.remove(new Integer(jobId));

    }

    private void updateJobStatus(String msg){
        SqlSession session = null;
        try {
            session = this.mdaFactory.openSession();
            JobOperator operator = session.getMapper(JobOperator.class);
            MdaJob job=operator.getJobByID(jobId);
            job.setStatusdescription(msg);
            operator.updateJob(job);
            session.commit();//return (ret);
        } catch (Exception e) {
            e.printStackTrace();
            //logger.error(e.toString());
            if (session != null) {
                session.rollback();
            }
        } finally {
            try {
                session.close();
            } catch (Exception ignore) {

            }
        }
    }

    private void updateJobStatus(String status,String timestamp, String msg){
        SqlSession session = null;
        try {
            session = this.mdaFactory.openSession();
            JobOperator operator = session.getMapper(JobOperator.class);
            MdaJob job=operator.getJobByID(jobId);
            job.setStatusdescription(msg);
            job.setCurrentstatus(status);
            job.setPreviousfinished(timestamp);
            operator.updateJob(job);
            session.commit();//return (ret);
        } catch (Exception e) {
            e.printStackTrace();
            //logger.error(e.toString());
            if (session != null) {
                session.rollback();
            }
        } finally {
            try {
                session.close();
            } catch (Exception ignore) {

            }
        }
    }


    protected String processResult(ResultSet rset) throws SQLException{
        Gson gson=new Gson();
        ResultSetMetaData meta=rset.getMetaData();
        JsonObject data=new JsonObject();
        int colCount=meta.getColumnCount();
        data.addProperty("columnCount",colCount);
        for(int i=1;i<=colCount;i++){
            String label=meta.getColumnLabel(i);
            if(label==null || label.isEmpty()){
                label=meta.getColumnName(i);
            }
            data.addProperty("title"+i,label);
        }
        JsonArray array=new JsonArray();
        int count=0;
        while(rset.next()){
            JsonObject columns=new JsonObject();
            for(int i=1;i<=colCount;i++){
                String val=rset.getString(i);
                if(val!=null){
                    val=val.trim();
                }else{
                    val="";
                }
                columns.addProperty("col"+i,val);
            }
            array.add(columns);
            count++;
        }
        data.addProperty("totalResutl",count);
        data.add("columnData",array);
        JsonObject jo=new JsonObject();
        jo.add("previewdata",data);
        String ret=gson.toJson(jo);
        return(ret);
    }

    public synchronized boolean isRunning() {
        return running;
    }

    public synchronized  void setRunning(boolean running) {
        this.running = running;
    }
}
