package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/11/2.
 */
public class UserDefinedSQL {
    int jobid;
    String userSql;

    public int getJobid() {
        return jobid;
    }

    public void setJobid(int jobid) {
        this.jobid = jobid;
    }

    public String getUserSql() {
        return userSql;
    }

    public void setUserSql(String userSql) {
        this.userSql = userSql;
    }
}
