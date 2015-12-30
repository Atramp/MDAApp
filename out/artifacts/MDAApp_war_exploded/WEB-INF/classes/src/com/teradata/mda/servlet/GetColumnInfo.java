package com.teradata.mda.servlet;


import com.google.gson.Gson;
import com.teradata.mda.dao.ColInfoOperator;
import com.teradata.mda.model.ColumnInfo;
import com.teradata.mda.util.JSONResponse;
//import com.mda.util.TrimedQueryRunner;

import com.teradata.mda.util.MdaAppException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by YS186019 on 2015/9/1.
 */
@WebServlet(name = "getcolinfo")
public class GetColumnInfo extends BaseServlet {
    private static Logger logger = LoggerFactory.getLogger(GetColumnInfo.class);

/*    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request,response);
    }*/

    @Override
    protected String doService(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {

        if (keyMethod == null || keyMethod.isEmpty()) {
            return (getAllColumns(sqlSession, keyMethod, request, response));
        } else {
            if ("getall".compareToIgnoreCase(keyMethod) == 0) {
                return (getAllColumns(sqlSession, keyMethod, request, response));
            } else if ("getbycolId".compareToIgnoreCase(keyMethod) == 0) {
                return (getByColId(sqlSession, keyMethod, request, response));
            } else if ("getByJobId".compareToIgnoreCase(keyMethod) == 0) {
                return (getByJobId(sqlSession, keyMethod, request, response));
            } else {
                return ("");
            }
        }
    }

    protected String getAllColumns(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        logger.debug("get all column informations");
        ColInfoOperator operator = session.getMapper(ColInfoOperator.class);
        List<ColumnInfo> list = operator.getAllColumns();
        Gson gson = new Gson();
        String ret = gson.toJson(list);
        logger.debug("the response is {}", ret);
        return (ret);
    }

    protected String getByJobId(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String jobIdStr = request.getParameter("colId");
        String ret = "";
        int jobId = -1;
        try {
            jobId = Integer.parseInt(jobIdStr);
        } catch (Exception e) {
            ret = JSONResponse.getErrorResponse("jobid", "empty colId");
            logger.warn("cannot find the colId parameters,return a error response {}", ret);
            throw new MdaAppException(ret);
        }
        logger.debug("the column id is {}", jobIdStr);
        ColInfoOperator operator = session.getMapper(ColInfoOperator.class);
        List<ColumnInfo> list = operator.getColumnsByJobId(jobId);
        Gson gson = new Gson();
        ret = gson.toJson(list);
        logger.debug("the response is {}", ret);
        return (ret);
    }

    protected String getByColId(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String idStr = request.getParameter("colId");
        String ret = "";
        int colId = -1;
        try {
            colId = Integer.parseInt(idStr);
        } catch (Exception e) {
            ret = JSONResponse.getErrorResponse("colId", "empty colId");
            logger.warn("cannot find the colId parameters,return a error response {}", ret);
            throw new MdaAppException(ret);
        }
        logger.debug("the column id is {}", idStr);
        ColInfoOperator operator = session.getMapper(ColInfoOperator.class);
        ColumnInfo info = operator.getColumnInfoById(colId);
        Gson gson = new Gson();
        ret = gson.toJson(info);
        logger.debug("the response is {}", ret);
        return (ret);
    }

}
