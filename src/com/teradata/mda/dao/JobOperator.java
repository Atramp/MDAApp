package com.teradata.mda.dao;


import com.teradata.mda.model.MdaJob;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/12.
 * 
 * Modified by HY186013 on 2015/12/31
 * add method 
 * 		getTaskJobId 获取预约任务
 * 	    updateTask  更新预约任务状态  
 */

public interface JobOperator {

    public MdaJob getJobByID(int id);
    public List<MdaJob> getAllJobs();
    public List<MdaJob> getJobByName(String name);
    
    public int getMaxJobId();
    public Integer getTaskJobId();
    //public int insertJob(MdaJob jobInfo);
    public void insertJob(@Param("jobInfo")MdaJob jobInfo);
    public void updateJob(@Param("jobInfo")MdaJob jobInfo);
    public void deleteJob(@Param("jobId")int jobId);

    public void updateSqlStatement(@Param("jobId") int jobId,@Param("sql")String sql);
    public void updateUserSql(@Param("jobId") int jobId,@Param("sql")String sql);
    public void updateStatusDescription(@Param("jobId")int jobId,@Param("description")String description);
}
