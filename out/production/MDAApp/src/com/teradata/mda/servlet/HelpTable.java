package com.teradata.mda.servlet;

//import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import com.teradata.mda.dao.*;
import com.teradata.mda.model.FilterCandidate;
import com.teradata.mda.model.HelpTableColumn;
import com.teradata.mda.model.TaskInfo;
import com.teradata.mda.util.JSONResponse;
//import com.mda.util.TrimedQueryRunner;
//import org.apache.commons.dbutils.QueryRunner;
//import org.apache.commons.dbutils.ResultSetHandler;
//import org.apache.commons.dbutils.handlers.BeanListHandler;
//import org.apache.commons.dbutils.handlers.MapListHandler;
//import org.apache.commons.dbutils.handlers.ScalarHandler;
//import org.apache.commons.dbutils.wrappers.StringTrimmedResultSet;
import com.teradata.mda.util.MdaAppException;
import com.teradata.mda.util.TrimedQueryRunner;
import org.apache.commons.dbutils.handlers.MapListHandler;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.*;
import java.util.*;

/**
 * Created by YS186019 on 2015/8/25.
 */
@WebServlet(name = "helptable")
public class HelpTable extends BaseServlet {
    private static Logger logger= LoggerFactory.getLogger(HelpTable.class);

//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request,response);
//    }
//
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request,response);
//    }
    protected String doService(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        if (keyMethod == null || keyMethod.isEmpty()) {
            throw new MdaAppException("不支持的操作");
        }
        if ("import".compareToIgnoreCase(keyMethod) == 0) {
            return (doImport(sqlSession, keyMethod, request, response));
        } else if ("delete".compareToIgnoreCase(keyMethod) == 0) {
            return (doDelete(sqlSession, keyMethod, request, response));
        }else if ("listcandidate".compareToIgnoreCase(keyMethod) == 0) {
            return (listCandidate(sqlSession, keyMethod, request, response));
        }else if ("updatecolumn".compareToIgnoreCase(keyMethod) == 0) {
            return (doUpdate(sqlSession, keyMethod, request, response));
        }else{
            throw new MdaAppException("不支持的操作");
        }
    }

    protected String listCandidate(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String idStr = request.getParameter("filterId");
        //String place = request.getParameter("place");
        String colIdStr=request.getParameter("colId");
        String ret = "";

        //MdaConfig config=(MdaConfig)context.getAttribute("configuration");
        //boolean showCommonOperation=Boolean.parseBoolean(config.getProperty("show_field_common_operation","false"));
        //boolean showFilter=Boolean.parseBoolean(config.getProperty("show_field_filter","true"));
        int filterId = 1;
        int paramId = 0;
        int colId=-1;
        try {
            colId=Integer.parseInt(colIdStr);
        } catch (Exception e) {
            ret = JSONResponse.getErrorResponse("filterId", "invalid colId");
            logger.warn("cannot find the colId ,return a error response {}", ret);
            throw new MdaAppException(ret);
        }

//        if (place == null || place.isEmpty()) {
//            ret = JSONResponse.getErrorResponse("operationplace", "empty operation place");
//            logger.warn("cannot find the operation place parameters,return a error response {}", ret);
//            throw new MdaAppException(ret);
//            //response.getWriter().write(ret);
//            //return;
//        }
        String place="where";
        logger.debug("get Selector Candidate, filterId {}, colId {}, paramId {}, place is {}", filterId,colId,paramId,place);
        SelectorCandidate operator = session.getMapper(SelectorCandidate.class);
        List<FilterCandidate> list = operator.getSelectorCandidate(place, filterId, colId,paramId);
        Gson gson = new Gson();
        ret = gson.toJson(list);

        logger.debug("the response is {}", ret);
        return ret;
    }


    protected String doDelete(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String idStr = request.getParameter("filterId");
        //String place = request.getParameter("place");
        String colIdStr=request.getParameter("colId");
        String tableIdStr=request.getParameter("tableId");
        String ret = "";

        //MdaConfig config=(MdaConfig)context.getAttribute("configuration");
        //boolean showCommonOperation=Boolean.parseBoolean(config.getProperty("show_field_common_operation","false"));
        //boolean showFilter=Boolean.parseBoolean(config.getProperty("show_field_filter","true"));
        int tableId = -1;
        int colId=-1;
        try {
            tableId=Integer.parseInt(tableIdStr);
            colId=Integer.parseInt(colIdStr);
        } catch (Exception e) {
            logger.warn("cannot find the tableId {} or colId  {},", tableIdStr,colIdStr);
            ret = JSONResponse.getErrorResponse("tableId", "invalid colId");
            logger.warn("cannot find the tableId or colId ,return a error response {}", ret);
            throw new MdaAppException(ret);
        }

        int count;
        if(colId<0){
            RuleOperator rop = session.getMapper(RuleOperator.class);
            count = rop.getTableReferenceCount(tableId);
            if(count>0){
                logger.warn("this table has been referenced in job rules, cannot delete");
                throw new MdaAppException("此表已经在分析任务中引用，不能删除");
            }
            FieldFilterOperator fop=session.getMapper(FieldFilterOperator.class);
            count=fop.getTableReferenceCount(tableId);
            if(count>0){
                logger.warn("this table has been referenced in field filter, cannot delete");
                throw new MdaAppException("此表在预定义维度中引用，不能删除");
            }
            ColInfoOperator cop=session.getMapper(ColInfoOperator.class);
            cop.deleteFilterCandidateByTable(tableId);
            cop.deleteTableColumn(tableId);
            cop.deleteTable(tableId);

        }else{
            RuleOperator rop = session.getMapper(RuleOperator.class);
            count = rop.getColumnReferenceCount(colId);
            if(count>0){
                logger.warn("this column has been referenced in job rules, cannot delete");
                throw new MdaAppException("此字段已经在分析任务中引用，不能删除");
            }
            FieldFilterOperator fop=session.getMapper(FieldFilterOperator.class);
            count=fop.getColumnReferenceCount(colId);
            if(count>0){
                logger.warn("this column has been referenced in field filter, cannot delete");
                throw new MdaAppException("此字段已经在预定义维度中引用，不能删除");
            }
            ColInfoOperator cop=session.getMapper(ColInfoOperator.class);
            cop.deleteFilterCandidateByColumn(colId);
            cop.deleteColumn(colId);
        }
        session.commit();
        return(JSONResponse.success());
    }

    protected String doUpdate(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) { /*report an error*/ }
        Map<String, Integer> compRuleId = new HashMap<String, Integer>();
        logger.debug("the updated column info json  data is " + jb.toString());
        //SqlSession session = null;
        //SqlSessionFactory factory = (SqlSessionFactory) context.getAttribute("MDACONNECTIONS");
        Gson gson = new Gson();
        HelpTableColumn column = gson.fromJson(jb.toString(), HelpTableColumn.class);
        //session = factory.openSession();
        int colId=column.getColId();
        if(colId<0){
            //edit columns
            TableHelper helper=sqlSession.getMapper(TableHelper.class);
            helper.updateTableComment(column.getTableid(),column.getColtitle());
        }else{
            String defaultInputType=column.getDefaultInputType();
            if(defaultInputType==null || defaultInputType.isEmpty()){
                defaultInputType="textinput";
            }
            TableHelper helper=sqlSession.getMapper(TableHelper.class);
            helper.updateColumnInfo(colId,column.getColtitle(),defaultInputType);
            if(defaultInputType.compareToIgnoreCase("comboselector")==0 || defaultInputType.compareToIgnoreCase("multiselector")==0){
                SelectorCandidate selector=sqlSession.getMapper(SelectorCandidate.class);
                ArrayList<FilterCandidate> list=column.getEditCandidates();
                Iterator<FilterCandidate> it;
                if(list!=null){
                    it=list.iterator();
                    while(it.hasNext()){
                        FilterCandidate candidate=it.next();
                        candidate.setColId(colId);
                        candidate.setFilterId(1);
                        candidate.setParamid(0);
                        candidate.setPlace("where");
                        selector.updateCandidate(candidate);
                    }
                }
                list=column.getAddCandidates();
                if(list!=null){
                    it=list.iterator();
                    while(it.hasNext()){
                        FilterCandidate candidate=it.next();
                        candidate.setColId(colId);
                        candidate.setFilterId(1);
                        candidate.setParamid(0);
                        candidate.setPlace("where");
                        selector.addCandidate(candidate);
                    }
                }
                list=column.getRemoveCandidates();
                if(list!=null){
                    it=list.iterator();
                    while(it.hasNext()){
                        FilterCandidate candidate=it.next();
                        selector.deleteCandidate(candidate.getCandidateid());
                    }
                }
            }

        }
        //throw new MdaAppException("不支持的操作");
        sqlSession.commit();
        return(JSONResponse.success());
    }

    protected String doImport(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String dbName=request.getParameter("databasename");
        String tablename=request.getParameter("tablename");
        logger.debug("the database name is {}" , dbName);
        logger.debug("the table name is {}" , tablename);
        if(dbName==null || dbName.isEmpty()){
            throw new MdaAppException("Empty database name");
        }
        if(tablename==null || tablename.isEmpty()){

            //response.getWriter().write(JSONResponse.getErrorResponse("Empty table name"));
            throw new MdaAppException("Empty table name");
        }

        ServletContext context=request.getSession().getServletContext();
        SqlSession mdasession=null;
        SqlSession mainDwSession=null;
        try{
            //SqlSessionFactory mdafactory=(SqlSessionFactory)context.getAttribute("MDACONNECTIONS");
            //mdasession = mdafactory.openSession();
            mdasession=sqlSession;
            SqlSessionFactory mainDwFactory=(SqlSessionFactory)context.getAttribute("MAINDW");
            mainDwSession = mainDwFactory.openSession();

            Connection conn=mainDwSession.getConnection();
            TrimedQueryRunner runner=new TrimedQueryRunner();
            List<Map<String,Object>> list=runner.query(conn, "help database " + dbName, new MapListHandler());

            Iterator<Map<String,Object>> it=list.iterator();
//
            Map<String,Object> map=null;
            boolean found=false;
            while(it.hasNext()){
                map=it.next();
                String tname=map.get("Table/View/Macro name").toString();
                if(tablename.compareToIgnoreCase(tname)==0){
                    found=true;
                    break;
                }
                //runner.update(conn, sql, dbName, tablename, map.get("Kind"), map.get("Comment"), map.get("Creator Name"));
                //logger.debug("new table information was created");
            }
            if(!found){
                conn.close();
                throw new MdaAppException("table name does not found!");
            }
            DatabaseHelper helper=mdasession.getMapper(DatabaseHelper.class);
            helper.insertTable(dbName, tablename, (String)map.get("Kind"), (String)map.get("Comment"), (String)map.get("Creator Name"));
            int tableId=helper.getTableId(dbName, tablename);
            list=runner.query(conn, "help table " + dbName + "." + tablename, new MapListHandler());
            it=list.iterator();
//            Connection mdaConnectoin=mdasession.getConnection();
//            String sql="insert into columns (tableid,colname,coltype,colformat,colmaxlength" +
//                    ",coldecimal,colfraction,comments,coltitle) values (?,?,?,?,?,?,?,?,?)";
//
//            while(it.hasNext()){
//                Map<String,Object> map=it.next();
//                runner.update(conn, sql, tableID.intValue(),map.get("Column Name"), map.get("Type"), map.get("Format")
//                        , map.get("Max Length"), map.get("Decimal Total Digits"), map.get("Decimal Fractional Digits")
//                        , (String)map.get("Comment"), (String)map.get("Title"));
            while(it.hasNext()){
                map=it.next();
                int length=-1;
                int decimal=-1;
                int fraction=-1;
                try{
                    length=Integer.parseInt((String)map.get("Max Length"));
                    decimal=Integer.parseInt((String)map.get("Decimal Total Digits"));
                    fraction=Integer.parseInt((String)map.get("Decimal Fractional Digits"));
                }catch(Exception ignore){

                }
                //fucking stupid mybatis can not handle the null value, the configuration is greatly increase
                helper.insertColumn(tableId, (String) map.get("Column Name"), (String) map.get("Type"), (String)map.get("Format")
                        ,length ,decimal ,fraction, (String) map.get("Comment"), (String) map.get("Title"));
            }
            mdasession.commit();
            String ret= JSONResponse.success();
            logger.debug(" the response is {}",ret);
            return ret;
        }catch(Exception e){
            e.printStackTrace();
            logger.error(e.toString());
//            if(mdasession!=null){
//                mdasession.rollback();
//            }
            if(mainDwSession!=null){
                mainDwSession.rollback();
            }
            throw new MdaAppException(e.getMessage());
        }finally{
            try {
                //mdasession.close();  // this session will be colsed in parent class
                mainDwSession.close();
            }catch(Exception ignore){
                logger.error(ignore.toString());
            }
        }
    }



}
