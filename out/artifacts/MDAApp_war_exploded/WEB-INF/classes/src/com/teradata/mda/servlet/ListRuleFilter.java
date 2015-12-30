package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.teradata.mda.dao.RuleOperator;
import com.teradata.mda.model.RuleFilter;
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
import java.sql.Connection;
import java.util.List;

/**
 * Created by YS186019 on 2015/10/22.
 */
@WebServlet(name = "ListRuleFilter")
public class ListRuleFilter extends BaseServlet {
    Logger logger = LoggerFactory.getLogger(ListRuleFilter.class);

//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request,response);
//    }
//
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request,response);
//    }


    @Override
    protected String doService(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {

        // response.setCharacterEncoding("UTF-8");
        //ServletContext context=request.getSession().getServletContext();
        //SqlSessionFactory factory=(SqlSessionFactory)context.getAttribute("MDACONNECTIONS");
        //Connection conn=null;
        String ruleIdStr = request.getParameter("ruleId");
        logger.debug("the request job id is {}", ruleIdStr);
        String ret = "";
        //SqlSession session=null;
        //try{
        //session = factory.openSession();
        RuleOperator operator = sqlSession.getMapper(RuleOperator.class);
        int ruleId = Integer.parseInt(ruleIdStr);
        List<RuleFilter> list = operator.getRuleFilterByRuleId(ruleId);
        Gson gson = new Gson();
        ret = gson.toJson(list);
        logger.debug("the response is {}", ret);
        return (ret);
        //    response.getWriter().write(ret);
        //}catch(Exception e){
        //    if(session!=null){
        //        session.rollback();
        //    }
        //    logger.error(e.toString());
        //}finally{
        //    if (session!=null) {
        //        session.close();
        //    }
        //}
    }
}
