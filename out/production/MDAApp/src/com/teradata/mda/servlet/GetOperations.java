package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.teradata.mda.dao.AvailableOperation;
import com.teradata.mda.model.CommonOperation;
import com.teradata.mda.util.MdaAppException;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by YS186019 on 2015/10/31.
 */
@WebServlet(name = "GetOperations")
public class GetOperations extends BaseServlet {

    private Logger logger= LoggerFactory.getLogger(GetOperations.class);

    protected String doService(SqlSession session,String key,HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException,MdaAppException {
        String ret="";
        if(key.compareToIgnoreCase("getAll")==0){
            return(getAllOperations(session,key,request,response));
        }else if(key.compareToIgnoreCase("getByIdList")==0){

        }else if(key.compareToIgnoreCase("getByPlace")==0){

        }else{
            return(getAllOperations(session,key,request,response));
        }
        return("");
    };

    private String getAllOperations(SqlSession session,String key,HttpServletRequest request,HttpServletResponse response) {
        AvailableOperation ope = session.getMapper(AvailableOperation.class);
        List<CommonOperation> list = ope.getAllOperation();
        Gson gson = new Gson();
        String ret=gson.toJson(list);
        logger.debug(" /GetOperation/getAll response is {}",ret);
        return (ret);
    }

}
