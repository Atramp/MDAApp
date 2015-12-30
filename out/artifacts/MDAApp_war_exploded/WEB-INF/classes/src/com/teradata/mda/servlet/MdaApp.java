package com.teradata.mda.servlet;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.HashMap;

import com.teradata.mda.config.MdaConfig;
import com.teradata.mda.sql.SQLTask;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by YS186019 on 2015/8/25.
 */
public class MdaApp extends HttpServlet {

    /**
     * called by the HttpServlet Container (Tomcat) automatically when application start up
     */

    private static Logger logger=LoggerFactory.getLogger(MdaApp.class);
    public void init(ServletConfig config) throws ServletException {

        logger.info("MdaApp Application starts..info..");
        //logger.debug("mdaapp debug");
        //logger.trace("MdaApp Application starts..trace..");

        super.init(config);


        ServletContext context=this.getServletContext();
        String configPath=context.getRealPath("/")+ "web/WEB-INF/conf/";
        String configFileName=configPath+ "mdaapp.conf";
        MdaConfig mdaConfig=new MdaConfig();
        try {
            mdaConfig.load(new FileReader(configFileName));
        }catch(Exception e){
            logger.error("Can not read the configuration file {}",configFileName );
        }
        context.setAttribute("configuration", mdaConfig);

        try{
            Reader reader    = Resources.getResourceAsReader("config/mybatis/configuration.xml");
            //Reader reader    = Resources.getResourceAsReader("WEB-INF/conf/configuration.xml");
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader, "mdaapp");
            context.setAttribute("MDACONNECTIONS",sqlSessionFactory);
            reader.close();
            //read again to create the connection pool for main DW
            //reader    = Resources.getResourceAsReader("web/WEB-INF/conf/main_dw_config.xml");
            reader    = Resources.getResourceAsReader("config/mybatis/main_dw_config.xml");
            SqlSessionFactory mainDWSqlSessionFactory = new SqlSessionFactoryBuilder().build(reader,"maindw");
            context.setAttribute("MAINDW",mainDWSqlSessionFactory);
            HashMap<Integer,SQLTask> runningList=new HashMap<Integer,SQLTask>();
            context.setAttribute("TASKLIST",runningList);
        }catch(Exception e){
            e.printStackTrace();
        }


        //although impossible, but we would like to test if the application
        // has already initialized.
/*        if(!initDBConnections(context)){
            throw new ServletException("unable to initialize database connection pool");
        }*/


    }


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.getWriter().write("1111111111111111111111111111111");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.getWriter().write("1111111111111111111111111111111");
    }
}
