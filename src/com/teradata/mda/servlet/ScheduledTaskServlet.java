package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.teradata.mda.dao.ScheduledTaskOperator;
import com.teradata.mda.util.MdaAppException;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by alex on 16/1/6.
 */
@WebServlet(urlPatterns = "/scheduleTask")
public class ScheduledTaskServlet extends BaseServlet {
    @Override
    protected String doService(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        Map result = new HashMap<>();
        String jobID = request.getParameter("jobid");
        String scheduleTime = request.getParameter("time");
        if (StringUtils.isEmpty(jobID)) {
            result.put("hasError", true);
            result.put("error", "任务不能为空");
        }
        ScheduledTaskOperator stOp = sqlSession.getMapper(ScheduledTaskOperator.class);
        try {
            if (stOp.updateTaskScheduleTimeByID(Integer.parseInt(jobID), new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new SimpleDateFormat("yyyyMMddHHmmss").parse(scheduleTime))) == 0) {
                result.put("hasError", true);
                result.put("error", "预约失败");
            } else {
                sqlSession.commit();
            }
        } catch (ParseException e) {
            result.put("hasError", true);
            result.put("error", "时间格式错误");
        }
        return new Gson().toJson(result);
    }
}
