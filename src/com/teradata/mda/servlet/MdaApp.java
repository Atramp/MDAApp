package com.teradata.mda.servlet;

import com.teradata.mda.config.MdaConfig;
import com.teradata.mda.sql.SQLTask;
import com.teradata.mda.task.TimedTaskDaemon;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Reader;
import java.util.HashMap;

/**
 * Created by YS186019 on 2015/8/25.
 */
public class MdaApp extends HttpServlet {

    /**
     * called by the HttpServlet Container (Tomcat) automatically when application start up
     */

    private static Logger logger = LoggerFactory.getLogger(MdaApp.class);

    public void init(ServletConfig config) throws ServletException {
        logger.info("MdaApp Application starts..info..");
        super.init(config);
        ServletContext context = this.getServletContext();
        MdaConfig mdaConfig = new MdaConfig();
        try {
            mdaConfig.load(this.getClass().getClassLoader().getResourceAsStream("config/mdaapp.conf"));
        } catch (Exception e) {
            logger.error("Can not read the configuration file {}", "conf/mdaapp.conf");
        }
        context.setAttribute("configuration", mdaConfig);

        try {
            Reader reader = Resources.getResourceAsReader("config/mybatis/configuration.xml");
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader, "mdaapp");
            context.setAttribute("MDACONNECTIONS", sqlSessionFactory);
            reader.close();
            reader = Resources.getResourceAsReader("config/mybatis/main_dw_config.xml");
            SqlSessionFactory mainDWSqlSessionFactory = new SqlSessionFactoryBuilder().build(reader, "maindw");
            context.setAttribute("MAINDW", mainDWSqlSessionFactory);
            HashMap<Integer, SQLTask> runningList = new HashMap<Integer, SQLTask>();
            context.setAttribute("TASKLIST", runningList);

            // 启动预约执行后台线程
            TimedTaskDaemon taskDaemon = new TimedTaskDaemon(sqlSessionFactory, mainDWSqlSessionFactory, context);
            taskDaemon.mainFunExcute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.getWriter().write("1111111111111111111111111111111");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.getWriter().write("1111111111111111111111111111111");
    }
}
