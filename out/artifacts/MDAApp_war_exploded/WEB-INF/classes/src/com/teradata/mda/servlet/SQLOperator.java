package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.teradata.mda.dao.JobOperator;
import com.teradata.mda.model.MdaJob;
import com.teradata.mda.model.UserDefinedSQL;
import com.teradata.mda.sql.CreateSQL;
import com.teradata.mda.util.JSONResponse;
import com.teradata.mda.util.MdaAppException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.*;
import java.io.BufferedReader;
import java.io.IOException;

/**
 * Created by YS186019 on 2015/10/30.
 */
@WebServlet(name = "SQLOperator")

public class SQLOperator extends BaseServlet {

    Logger logger= LoggerFactory.getLogger(SQLOperator.class);

/*    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request,response);
    }*/
    protected String doService(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        //SaveTask saver=new SaveTask();
        //saver.doService(request,response);
        String URI=request.getRequestURI();
        int pos=URI.lastIndexOf('/');
        String key=URI.substring(pos + 1);
        String ret="";
        if(key.compareToIgnoreCase("preview")==0){
            ret=this.sqlPreview(sqlSession, keyMethod, request, response);
        }else if(key.compareToIgnoreCase("saveusersql")==0){
            ret=this.saveUserDefinedSQL(sqlSession,keyMethod, request, response);
        }else if(key.compareToIgnoreCase("resultpreview")==0){
            ret=this.resultPreview(sqlSession, keyMethod, request, response);
        }else{
            throw new MdaAppException("不支持的操作");
        }
        return(ret);
    }

    protected String sqlPreview(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String jobIdStr=request.getParameter("jobid");
        int jobId=-1;
        try{
            jobId=Integer.parseInt(jobIdStr);
        }catch(Exception ignore){
        }
        if(jobId<=0){
            logger.debug("wrong jobid number");
            throw (new MdaAppException("分析任务ID号错误"));
/*            response.getWriter().write(JSONResponse.getErrorResponse("分析任务ID号错误"));
            return();*/
        }
        //ServletContext context=request.getServletContext();
        //SqlSessionFactory factory = (SqlSessionFactory) context.getAttribute("MDACONNECTIONS");
        CreateSQL creator=new CreateSQL(session);
        String sql=creator.createSql(jobId);
        Gson gson=new Gson();
        //session=factory.openSession();
        JobOperator operator=session.getMapper(JobOperator.class);
        MdaJob job=operator.getJobByID(jobId);
        job.setSqlstatement(sql);
        operator.updateJob(job);
        session.commit();
        String ret=gson.toJson(job);
        logger.debug("the sql preview response is {}",ret);
        return(ret);
    }

    protected String saveUserDefinedSQL(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            throw new MdaAppException("读取输入错误");
        }
        Gson gson = new Gson();
        UserDefinedSQL info = gson.fromJson(jb.toString(), UserDefinedSQL.class);
        if(info.getJobid()<=0){
            logger.debug("wrong jobid number");
            throw (new MdaAppException("分析任务ID号错误"));
/*            response.getWriter().write(JSONResponse.getErrorResponse("分析任务ID号错误"));
            return();*/
        }
        JobOperator operator=session.getMapper(JobOperator.class);
        MdaJob job=operator.getJobByID(info.getJobid());
        job.setUsersql(info.getUserSql());
        operator.updateJob(job);
        session.commit();
        String ret=JSONResponse.success();
        logger.debug("the sql preview response is {}", ret);
        return(ret);
    }

    protected String resultPreview(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String jobIdStr=request.getParameter("jobid");
        String sqlChoiceStr=request.getParameter("sqlchoice");
        String sampleCountStr=request.getParameter("samplecount");
        int jobId=-1;
        int sqlChoice=1;
        int sampleCount=100;
        //begin to process the submited parameters
        try{
            jobId=Integer.parseInt(jobIdStr);
            sqlChoice=Integer.parseInt(sqlChoiceStr);
            sampleCount=Integer.parseInt(sampleCountStr);
        }catch (Exception ignore){
            logger.warn("Error while process the parameter, use default value,Exception {}",ignore.toString());
        }
        if(jobId<=0){
            throw new MdaAppException("错误的任务编号");
        }
        JobOperator jop=session.getMapper(JobOperator.class);
        MdaJob job=jop.getJobByID(jobId);
        if(job==null){
            throw new MdaAppException("错误的任务编号");
        }
        String sql;
        if(sqlChoice==1){
            sql=job.getSqlstatement();
        }else if(sqlChoice==2){
            sql=job.getUsersql();
        }else{
            sql="";
        }
        if(sql.isEmpty()){
            throw new MdaAppException("SQL 脚本为空");
        }
        // if we arrive here, that means all parameters are correct,and the sql script exists
        sql=sql.trim();
        while(sql.endsWith(";")){
            sql=sql.substring(0,sql.length()-1);
        }
        logger.debug("the executed sql is {}",sql);
        sql = sql + " sample " +sampleCount;
        ServletContext context=request.getServletContext();
        SqlSessionFactory mainFactory=(SqlSessionFactory)context.getAttribute("MAINDW");
        SqlSession dwSession=null;
        Connection connection=null;
        String ret="";
        try {
            dwSession=mainFactory.openSession();
            connection=dwSession.getConnection();
            Statement state =connection.createStatement();
            ResultSet rset=state.executeQuery(sql);
            ret=processResult(rset);
            logger.debug("the returned trace is {}",ret);
            return(ret);
        }catch(Exception e){
            logger.warn("Error while query the database or process the result set, {}",e.toString());
            throw new MdaAppException("Error while query the database or process the result set, " + e.getMessage());
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

}
