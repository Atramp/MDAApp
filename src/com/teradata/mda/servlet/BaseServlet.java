package com.teradata.mda.servlet;

import com.google.gson.Gson;
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
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created by YS186019 on 2015/10/30.
 */
@WebServlet(name = "BaseServlet")
public abstract  class BaseServlet extends HttpServlet {

    private Logger logger= LoggerFactory.getLogger(BaseServlet.class);

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setCharacterEncoding("UTF-8");
        logger.debug("the request get {}",request.toString());
/*        if(needLogin(request,response)){
            return;
        }*/
        ServletContext context = request.getSession().getServletContext();
        SqlSession session = null;
        try {

            SqlSessionFactory factory = (SqlSessionFactory) context.getAttribute("MDACONNECTIONS");
            String URI = request.getRequestURI();
            int pos = URI.lastIndexOf('/');
            String key = URI.substring(pos + 1);
            session = factory.openSession();
            String ret = doService(session, key, request, response);
            //logger.debug("the response JSON String is '{}'",ret);
            response.getWriter().write(ret);
        }catch(MdaAppException e){
            String ret= JSONResponse.getErrorResponse(e.getMessage());
            logger.warn("error while process the Http request {}, the response JSON str is {}",e.toString(),ret);
            response.getWriter().write(ret);
        }catch(Exception e ){
            e.printStackTrace();
            if(session!=null){
                session.rollback();
            }
            String ret= JSONResponse.getErrorResponse(e.toString());
            logger.warn("error while process the Http request {},the response JSON str is {}",e.toString(),ret);
            response.getWriter().write(ret);
        }finally{
            if(session!=null){
                session.close();
            }
        }

    }


    private boolean needLogin(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession httpSession=request.getSession();
        if( (System.currentTimeMillis()-httpSession.getLastAccessedTime()) > httpSession.getMaxInactiveInterval())
        {
            httpSession.invalidate();
            System.out.println("session invalidate");;
            //((HttpServletRequest) request).getRequestDispatcher("/test/logon.jsp").forward(request, response);
            response.addHeader("needlogin","true");
        }
        if(httpSession.isNew()){
            response.addHeader("_needlogin","true");
            return(true);
            //httpSession.setMaxInactiveInterval(seconds);
        }else if(httpSession != null && (System.currentTimeMillis()-httpSession.getLastAccessedTime()) > httpSession.getMaxInactiveInterval())
        {
            httpSession.invalidate();
            System.out.println("session invalidate");;
            //((HttpServletRequest) request).getRequestDispatcher("/test/logon.jsp").forward(request, response);
            response.addHeader("_needlogin","true");
            response.addHeader("_timeout","true");
            return(true);
        }
        String userName=(String)httpSession.getAttribute("userName");
        if(userName==null || userName.isEmpty()){
            response.addHeader("_needlogin","true");
            return(true);
        }
        return(false);

    }

    protected abstract String doService(SqlSession sqlSession,String keyMethod,HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException,MdaAppException;

}
