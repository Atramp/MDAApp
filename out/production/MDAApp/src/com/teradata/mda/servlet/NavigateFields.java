package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.teradata.mda.guimodel.TreeGridModel;
import com.teradata.mda.dao.NavigateField;
import com.teradata.mda.util.JSONResponse;

import com.teradata.mda.util.MdaAppException;
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
import java.io.IOException;
import java.util.*;

/**
 * Created by YS186019 on 2015/8/28.
 */
@WebServlet(name = "navigatefields")
public class NavigateFields extends BaseServlet {
    private static Logger logger= LoggerFactory.getLogger(NavigateField.class);

    @Override
    protected String doService(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String dbName=request.getParameter("databasename");
        logger.debug("the database name is {}", dbName);
        String tableName=request.getParameter("tablename");
        logger.debug("the table name is {}" , tableName);
        NavigateField operator=session.getMapper(NavigateField.class);
        List<TreeGridModel> list=operator.getTableList(dbName,tableName);
        Iterator<TreeGridModel> it= list.iterator();
        while(it.hasNext()){
            TreeGridModel bean=it.next();
            //List<TreeGridModel> collist=runner.query(conn, sql,new BeanListHandler<TreeGridModel>(TreeGridModel.class),bean.getTableid());
            List<TreeGridModel> collist=operator.getColumnList(bean.getTableid());
            bean.setChildren(collist);
        }
        Map<String,Object> map=new HashMap<String,Object>();
        map.put("text",".");
        map.put("children",list);
        Gson gson=new Gson();
        String ret = gson.toJson(map);
        logger.debug("the response is {}", ret);
        //response.getWriter().write(ret);
        return(ret);
    }

    /*protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request, response);
    }*/

/*
    private void doService(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        response.setCharacterEncoding("UTF-8");
        String dbName=request.getParameter("databasename");
        String tableName=request.getParameter("tablename");
        logger.debug("the database name is {}", dbName);
        logger.debug("the table name is {}" , tableName);
        ServletContext context=request.getSession().getServletContext();
        String ret="";
        SqlSession session=null;
        try{
            SqlSessionFactory factory=(SqlSessionFactory)context.getAttribute("MDACONNECTIONS");
            session = factory.openSession();
            NavigateField operator=session.getMapper(NavigateField.class);
            List<TreeGridModel> list=operator.getTableList(dbName,tableName);
            Iterator<TreeGridModel> it= list.iterator();
            while(it.hasNext()){
                TreeGridModel bean=it.next();
                //List<TreeGridModel> collist=runner.query(conn, sql,new BeanListHandler<TreeGridModel>(TreeGridModel.class),bean.getTableid());
                List<TreeGridModel> collist=operator.getColumnList(bean.getTableid());
                bean.setChildren(collist);
            }
            Map<String,Object> map=new HashMap<String,Object>();
            map.put("text",".");
            map.put("children",list);
            Gson gson=new Gson();
            ret = gson.toJson(map);
            logger.debug("the response is {}", ret);
            response.getWriter().write(ret);
        }catch(Exception e){
            e.printStackTrace();
            ret= JSONResponse.getErrorResponse(e.toString());
            logger.error(e.toString());
            if(session!=null){
                session.rollback();
            }
            response.getWriter().write(ret);
        }finally{
                session.close();
        }
    }



    private String makeWhere(String dbname, String tablename){
        StringBuilder where=new StringBuilder(" where ");
        if(dbname!=null && (!dbname.isEmpty())){
            where.append("dbname='").append(dbname).append("' and ");
        }
        if(tablename!=null && (!tablename.isEmpty())){
            where.append("tablename='").append(tablename).append("' and ");
        }
        int len=where.length();
        if(len>7){
            return(where.delete(len-4,len).toString());
        }else{
            return("");
        }

    }
*/
}
