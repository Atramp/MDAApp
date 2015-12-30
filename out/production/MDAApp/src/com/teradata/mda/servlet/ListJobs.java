package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.teradata.mda.dao.JobOperator;
import com.teradata.mda.model.MdaJob;
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
import java.util.List;

/**
 * Created by YS186019 on 2015/8/25.
 */
@WebServlet(name = "listjobs")
public class ListJobs extends BaseServlet {
    private static Logger logger = LoggerFactory.getLogger(ListJobs.class);

//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request,response);
//    }
//
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request,response);
//    }

    @Override
    protected String doService(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        //response.setCharacterEncoding("UTF-8");
        //ServletContext context=request.getSession().getServletContext();
        String taskName = request.getParameter("taskname");
        logger.debug("the search task name is {}", taskName);
        String jobIdStr = request.getParameter("jobid");
        logger.debug("the request job id is {}", jobIdStr);
        String ret = "";
        //SqlSession session = null;
        //try {
        //    SqlSessionFactory factory = (SqlSessionFactory) context.getAttribute("MDACONNECTIONS");
        //session = factory.openSession();
        JobOperator operator = session.getMapper(JobOperator.class);
        List<MdaJob> list;
/*            if(jobIdStr!=null && !jobIdStr.isEmpty()){
            int jobId=Integer.parseInt(jobIdStr);
            list=operator.getJobByID(jobId);
        }else */
        if (taskName != null && !taskName.isEmpty()) {
            list = operator.getJobByName(taskName.trim());
        } else {
            list = operator.getAllJobs();
        }
        Gson gson = new Gson();
        ret = gson.toJson(list);
        logger.debug("the response is {}", ret);
        return ret;
        //    response.getWriter().write(ret);
        //return (ret);
        //} catch (Exception e) {
        //    e.printStackTrace();
        //logger.error(e.toString());
        //    if (session != null) {
        //        session.rollback();
        //    }
        //    response.getWriter().write(JSONResponse.getErrorResponse(e.toString()));
        //} finally {
        //    try {
        //        session.close();
        //    } catch (Exception ignore) {

        //    }
        //}

    }
}
