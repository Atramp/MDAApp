package com.teradata.mda.servlet;

//import com.alibaba.fastjson.JSON;

import com.google.gson.Gson;
//import com.teradata.mda.config.MdaConfig;
import com.teradata.mda.dao.SelectorCandidate;
import com.teradata.mda.model.FilterCandidate;
import com.teradata.mda.util.JSONResponse;
//import com.mda.util.TrimedQueryRunner;
//import org.apache.commons.dbutils.QueryRunner;
//import org.apache.commons.dbutils.handlers.BeanListHandler;
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
 * Created by YS186019 on 2015/9/21.
 */
@WebServlet(name = "GetSelectorCandidate")
public class GetSelectorCandidate extends BaseServlet {
    private Logger logger = LoggerFactory.getLogger(GetSelectorCandidate.class);

//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request, response);
//    }
//
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doService(request,response);
//    }

    @Override
    protected String doService(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String idStr = request.getParameter("filterId");
        String place = request.getParameter("place");
        String paramStr = request.getParameter("paramid");
        String colIdStr=request.getParameter("colId");
        String ret = "";

        //MdaConfig config=(MdaConfig)context.getAttribute("configuration");
        //boolean showCommonOperation=Boolean.parseBoolean(config.getProperty("show_field_common_operation","false"));
        //boolean showFilter=Boolean.parseBoolean(config.getProperty("show_field_filter","true"));
        int filterId = -1;
        int paramId = -1;
        int colId=-1;
        try {
            filterId = Integer.parseInt(idStr);
            paramId = Integer.parseInt(paramStr);
            colId=Integer.parseInt(colIdStr);
        } catch (Exception e) {
            ret = JSONResponse.getErrorResponse("filterId", "empty filterId");
            logger.warn("cannot find the filterId or Parameter ID,return a error response {}", ret);
            throw new MdaAppException(ret);
            //response.getWriter().write(ret);
            //return;
        }

        if (place == null || place.isEmpty()) {
            ret = JSONResponse.getErrorResponse("operationplace", "empty operation place");
            logger.warn("cannot find the operation place parameters,return a error response {}", ret);
            throw new MdaAppException(ret);
            //response.getWriter().write(ret);
            //return;
        }
        logger.debug("get Selector Candidate, filterId {}, colId {}, paramId {}, place is {}", filterId,colId,paramId,place);
        //DataSource source=(DataSource)context.getAttribute("MDACONNECTIONS");
        //Connection conn=null;
        // SqlSession session=null;
        //try{
        //SqlSessionFactory factory=(SqlSessionFactory)context.getAttribute("MDACONNECTIONS");
        //session = factory.openSession();
        SelectorCandidate operator = session.getMapper(SelectorCandidate.class);
        List<FilterCandidate> list = operator.getSelectorCandidate(place, filterId, colId,paramId);
        Gson gson = new Gson();
        ret = gson.toJson(list);

        logger.debug("the response is {}", ret);
        return ret;
        //response.getWriter().write(ret);
//        }catch(Exception e){
//            e.printStackTrace();
//            if(session!=null){
//                session.rollback();
//            }
//            logger.error(e.toString());
//        }
    }

}
