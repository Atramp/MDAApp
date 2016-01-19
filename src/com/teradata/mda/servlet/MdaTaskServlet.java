package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.teradata.mda.config.MdaConfig;
import com.teradata.mda.dao.GroupLayerOperator;
import com.teradata.mda.dao.JobOperator;
import com.teradata.mda.dao.RuleOperator;
import com.teradata.mda.model.GroupLayer;
import com.teradata.mda.model.JobRule;
import com.teradata.mda.model.MdaJob;
import com.teradata.mda.sql.SQLTask;
//import com.teradata.mda.sql.SaveTask;
import com.teradata.mda.util.JSONResponse;
import com.teradata.mda.util.MdaAppException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by YS186019 on 2015/11/5.
 */
@WebServlet(name = "MdaTaskServlet")
public class MdaTaskServlet extends BaseServlet {
    Logger logger = LoggerFactory.getLogger(MdaTaskServlet.class);

    @Override
    protected String doService(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        //return null;
        if (keyMethod == null || keyMethod.isEmpty()) {
            throw new MdaAppException("不支持的操作");
        }
        if ("duplicateTask".compareToIgnoreCase(keyMethod) == 0) {
            return (duplicateTask(sqlSession, keyMethod, request, response));
        } else if ("deletetask".compareToIgnoreCase(keyMethod) == 0) {
            return (deleteTask(sqlSession, keyMethod, request, response));
        }else if ("resettask".compareToIgnoreCase(keyMethod) == 0) {
            return (resetTask(sqlSession, keyMethod, request, response));
        }else if ("runtask".compareToIgnoreCase(keyMethod) == 0) {
            return (runTask(sqlSession, keyMethod, request, response));
        }else{
            throw new MdaAppException("不支持的操作");
        }
    }

    protected String duplicateTask(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String jobIdStr = request.getParameter("jobid");
        int jobId = -1;
        try {
            jobId = Integer.parseInt(jobIdStr);
        } catch (Exception ignore) {
            logger.warn("Error while process the parameter, use default value,Exception {}", ignore.toString());
        }
        if (jobId <= 0) {
            throw new MdaAppException("任务ID号错误");
        }
        String jobName=request.getParameter("jobName");
        String jobDescription=request.getParameter("jobDescription");
        //first we duplicate the mdajob information
        JobOperator jop = session.getMapper(JobOperator.class);
        MdaJob job = jop.getJobByID(jobId);
        if (job == null) {
            throw new MdaAppException("任务ID号错误");
        }
        job.setCurrentstatus("W");
        job.setResultlink("");
        job.setReferencecount(0);
        if(jobName!=null) {
            job.setJobname(jobName);
        }
        if(jobDescription!=null){
            job.setDescription(jobDescription);
        }
        job.setStatusdescription("");
        int newJobId = jop.getMaxJobId() + 1;
        job.setJobid(newJobId);
        job.setCurrentstatus("W");
        job.setStatusdescription("");
        jop.insertJob(job);
        //now we begin to update the rule related information
        HashMap<Integer, Integer> ruleIdMap = new HashMap<Integer, Integer>();
        HashMap<Integer, Integer> reverseRuleIdMap = new HashMap<Integer, Integer>();
        RuleOperator rop = session.getMapper(RuleOperator.class);
        int newRuleId = rop.getMaxRuleId();
        List<JobRule> list = rop.getRulesByJobId(jobId);
        Iterator<JobRule> it = list.iterator();
        //first pass of list, we change all data from old one to new one
        while (it.hasNext()) {
            JobRule rule = it.next();
            int oldId = rule.getRuleId();
            newRuleId++;
            rule.setJobid(newJobId);
            rule.setRuleId(newRuleId);
            ruleIdMap.put(new Integer(oldId), new Integer(newRuleId));
            reverseRuleIdMap.put(new Integer(newRuleId),new Integer(oldId));
        }
        //second pass, change all the whereconnector and result connector param1value, which contains the ruldid of the relationship
        it = list.iterator();
        while (it.hasNext()) {
            JobRule rule = it.next();
            if ("resultconnector".compareToIgnoreCase(rule.getPlace()) == 0 || "whereconnector".compareToIgnoreCase(rule.getPlace()) == 0) {
                String param1 = rule.getParam1value();
                if (param1 == null || param1.isEmpty()) {
                    continue;
                }
                String[] ids = param1.split(",");
                StringBuilder sb = new StringBuilder("");
                for (int i = 0; i < ids.length; i++) {
                    int oid = Integer.parseInt(ids[i]);
                    int nid = ((Integer) ruleIdMap.get(new Integer(oid))).intValue();
                    sb.append(nid).append(',');
                }
                int len = sb.length();
                sb.delete(len - 1, len);
                rule.setParam1value(sb.toString());
            }
        }
        //third pass, we insert all new rules to table;
        it = list.iterator();
        while (it.hasNext()) {
            JobRule rule = it.next();
            rop.insertRule(rule);
            if(rule.getPlace().compareToIgnoreCase("groupby")==0 && rule.getResultoperatorid()==1){
                //we have related group layer information , so we duplicate them
                int nid=rule.getRuleId();
                int oid=reverseRuleIdMap.get(new Integer(nid)).intValue();
                GroupLayerOperator lop=session.getMapper(GroupLayerOperator.class);
                int newLayerId=lop.getMaxId();
                List<GroupLayer> layerList=lop.getByRuleId(oid);
                Iterator<GroupLayer> lit=layerList.iterator();
                while(lit.hasNext()){
                    GroupLayer layer=lit.next();
                    newLayerId++;
                    layer.setLayerId(newLayerId);
                    layer.setRuleId(nid);
                    lop.insertLayer(layer);
                }
            }
        }
        session.commit();
        logger.debug("task duplicate succeed");
        Gson gson=new Gson();
        JsonObject gobj=new JsonObject();
        gobj.addProperty("hasError","false");
        gobj.addProperty("newJobId",newJobId);
        return(gson.toJson(gobj));
    }


    protected String deleteTask(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String jobIdStr = request.getParameter("jobid");
        int jobId = -1;
        try {
            jobId = Integer.parseInt(jobIdStr);
        } catch (Exception e) {
            jobId = -1;
        }
        if (jobId <= 0) {
            String ret = JSONResponse.getErrorResponse("jobid", "wrong job id");
            logger.warn("cannot find the jobid parameters,return a error response {}", ret);
            throw new MdaAppException("任务ID号错误");
        }
        JobOperator jobOperator = session.getMapper(JobOperator.class);
        RuleOperator ruleOperator = session.getMapper(RuleOperator.class);
        MdaJob job = jobOperator.getJobByID(jobId);
        if (job.getCurrentstatus().compareToIgnoreCase("R") == 0) {
            session.rollback();
            throw new MdaAppException("不能删除正在运行的任务");
        };
        //delete the output file
        String outputFile=job.getOutputfilename();
        if(outputFile!=null && !outputFile.isEmpty()){
            String path="";
            try {
                path = request.getServletContext().getRealPath(outputFile);
                File fn = new File(path);
                fn.delete();
            }catch(Exception ignore){
                logger.warn("Fail to delete the output file: '{}',error is:{}",path,ignore.toString());
            }
        }
        //delete all data in group layer
        List<JobRule> orphan=ruleOperator.getRulesByJobId(jobId);
        if(orphan!=null) {
            GroupLayerOperator lop = session.getMapper(GroupLayerOperator.class);
            Iterator<JobRule> it = orphan.iterator();
            while(it.hasNext()){
                JobRule rule=it.next();
                int ruleId=rule.getRuleId();
                lop.deleteByRuleId(ruleId);
            }
        }
        //delete all data from jobrules
        ruleOperator.deleteByJobId(jobId);
        //delete all data from mdajob
        jobOperator.deleteJob(jobId);
        session.commit();
        String ret = JSONResponse.success();
        logger.debug("the response is {} ", ret);
        return (ret);
    }

    protected String resetTask(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String jobIdStr = request.getParameter("jobid");
        int jobId = -1;
        try {
            jobId = Integer.parseInt(jobIdStr);
        } catch (Exception e) {
            jobId = -1;
        }
        if (jobId <= 0) {
            String ret = JSONResponse.getErrorResponse("jobid", "wrong job id");
            logger.warn("cannot find the jobid parameters,return a error response {}", ret);
            throw new MdaAppException("任务ID号错误");
        }
        JobOperator jobOperator = session.getMapper(JobOperator.class);
        RuleOperator ruleOperator = session.getMapper(RuleOperator.class);
        MdaJob job = jobOperator.getJobByID(jobId);
        //kill the task if it is runnning
        HashMap<Integer,SQLTask> taskList=(HashMap<Integer,SQLTask>)request.getServletContext().getAttribute("TASKLIST");
        SQLTask task=taskList.get(new Integer(jobId));
        if(task!=null){
            task.setRunning(false);
            try {
                task.interrupt();
                //task.join(5000);

            }catch(Exception ignore){

            }
            logger.debug("the task id is {} was killed", jobId);
        }

        //delete the output file
        String outputFile=job.getOutputfilename();
        if(outputFile!=null && !outputFile.isEmpty()){
            String path="";
            try {
                path = request.getServletContext().getRealPath(outputFile);
                File fn = new File(path);
                fn.delete();
            }catch(Exception ignore){
                logger.warn("Fail to delete the output file: '{}',error is:{}",path,ignore.toString());
            }
        }
        job.setCurrentstatus("W");
        job.setOutputfilename("");
        job.setStatusdescription("");
        jobOperator.updateJob(job);
        session.commit();
        String ret = JSONResponse.success();
        logger.debug("the response is {} ", ret);
        return (ret);
    }


    protected String runTask(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String jobIdStr=request.getParameter("jobid");
        String sqlChoiceStr=request.getParameter("sqlchoice");
        String outFileName=request.getParameter("outputfilename");
        int jobId=-1;
        int sqlChoice=1;
        //begin to process the submited parameters
        try{
            jobId=Integer.parseInt(jobIdStr);
            sqlChoice=Integer.parseInt(sqlChoiceStr);
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
        String userSql=job.getUsersql();
        String createdSQl=job.getSqlstatement();
        String sql;
        if(userSql!=null && userSql.isEmpty()){
            sql=userSql;
        }else{
            sql=createdSQl;
        }
        if(sql.isEmpty()){
            throw new MdaAppException("SQL 脚本为空");
        }
        Date now=new Date(System.currentTimeMillis());
        SimpleDateFormat format=new SimpleDateFormat("YYYYMMddHHmmss");
        MdaConfig config=MdaConfig.getInstance();
        String dir=config.getString("output_dir","results");
        if(outFileName==null || outFileName.trim().isEmpty()){
            outFileName=dir +"/"+job.getJobname()+"-"+jobId+"-" + format.format(now);
        }

        int use2007=config.getInt("generate_excel_2007",1);
        if(use2007==1){
            outFileName=outFileName+".xlsx";
        }else{
            outFileName=outFileName+".xls";
        }



        String state=job.getCurrentstatus();
        if(state.compareToIgnoreCase("R")==0) {
            throw new MdaAppException("分析任务正在运行");
        }else if(state.compareToIgnoreCase("E")==0 || state.compareToIgnoreCase("F")==0){
            throw new MdaAppException("前一次任务已经结束或发生错误，请重置任务状态");
        }
        SqlSessionFactory mdaFactory=(SqlSessionFactory)request.getServletContext().getAttribute("MDACONNECTIONS");
        SqlSessionFactory mainDBFactory=(SqlSessionFactory)request.getServletContext().getAttribute("MAINDW");
        String rfn=request.getServletContext().getRealPath(outFileName);
        HashMap<Integer,SQLTask> taskList=(HashMap<Integer,SQLTask>)request.getServletContext().getAttribute("TASKLIST");
        SQLTask task=new SQLTask(job.getJobid(),mdaFactory,mainDBFactory,sql,rfn,taskList);

        job.setCurrentstatus("R");
        format.applyPattern("YYYY年MM月dd日HH:mm:ss");
        String msg="任务在" + format.format(now)+ "启动,输出文件名为" +outFileName;
        job.setStatusdescription(msg);
        job.setOutputfilename(outFileName);
        jop.updateJob(job);
        session.commit();
        task.start();
        // chage the output file to real path name
        logger.info("the job id: {} jobName:{} start at {} output file name {}",
                job.getJobid(),job.getJobname(),now,outFileName);
        String ret=JSONResponse.success(msg);
        return(ret);
    }
}
