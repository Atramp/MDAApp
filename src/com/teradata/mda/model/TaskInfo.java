package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/10/16.
 */
public class TaskInfo {
    int jobid;
    String jobname;
    String description;
    SQLRule where;
    Result result;
    SQLRule orderby;
    SQLRule groupby;

    public int getJobid() {
        return jobid;
    }

    public void setJobid(int jobid) {
        this.jobid = jobid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public SQLRule getWhere() {
        return where;
    }

    public void setWhere(SQLRule where) {
        this.where = where;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public SQLRule getOrderby() {
        return orderby;
    }

    public void setOrderby(SQLRule orderby) {
        this.orderby = orderby;
    }

    public SQLRule getGroupby() {
        return groupby;
    }

    public void setGroupby(SQLRule groupby) {
        this.groupby = groupby;
    }

    public String getJobname() {
        return jobname;
    }

    public void setJobname(String jobname) {
        this.jobname = jobname;
    }
}
