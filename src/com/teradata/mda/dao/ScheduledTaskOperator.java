package com.teradata.mda.dao;

import org.apache.ibatis.annotations.Param;

/**
 * Created by alex on 16/1/6.
 */
public interface ScheduledTaskOperator {
    int updateTaskScheduleTimeByID(@Param("jobId") int jobId, @Param("jobTime") String scheduleTime);
}
