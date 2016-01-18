package com.teradata.mda.model;

import java.sql.Timestamp;

/**
 * Created by YS186019 on 2015/8/25.
 */
public class MdaJob {


    public int jobid;
    public String jobname;
    public String description;
    public String creatorname;
    public String createtime;
    public String currentstatus;
    public String previousfinished;
    public String sqlstatement;
    public String resultlink;
    //public String jsonstr;
    public String usersql;
    int referencecount;
    String statusdescription;
    String outputfilename;
    String jobtime;

    //public Timestamp previousfinishedObj;
    //public Timestamp createtimeObj;

    public int getJobid() {
        return jobid;
    }

    public void setJobid(int jobid) {
        this.jobid = jobid;
    }

    public String getJobname() {
        return jobname;
    }

    public void setJobname(String jobname) {
        this.jobname = jobname;
    }


    public String getCreatetime() {
        return createtime;
    }

    public void setCreatetime(String createtime) {
        this.createtime = createtime;
    }

    public String getCurrentstatus() {
        return currentstatus;
    }

    public void setCurrentstatus(String currentstatus) {
        this.currentstatus = currentstatus;
    }

    public String getSqlstatement() {
        return sqlstatement;
    }

    public void setSqlstatement(String sqlstatement) {
        this.sqlstatement = sqlstatement;
    }

    public String getPreviousfinished() {
        return previousfinished;
    }

    public void setPreviousfinished(String previousfinished) {
        this.previousfinished = previousfinished;
    }

    public String getResultlink() {
        return resultlink;
    }

    public void setResultlink(String resultlink) {
        this.resultlink = resultlink;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

/*
    public String getJsonstr() {
        return jsonstr;
    }

    public void setJsonstr(String jsonstr) {
        this.jsonstr = jsonstr;
    }
*/

/*    public void setPreviousfinishedObj(Timestamp previousfinishedObj) {
        this.previousfinishedObj = previousfinishedObj;
    }

    public void setCreatetimeObj(Timestamp createtimeObj) {
        this.createtimeObj = createtimeObj;
    }*/

    public String getCreatorname() {
        return creatorname;
    }

    public void setCreatorname(String creatorname) {
        this.creatorname = creatorname;
    }

    public int getReferencecount() {
        return referencecount;
    }

    public void setReferencecount(int referencecount) {
        this.referencecount = referencecount;
    }

    public String getUsersql() {
        return usersql;
    }

    public void setUsersql(String usersql) {
        this.usersql = usersql;
    }

    public String getStatusdescription() {
        return statusdescription;
    }

    public void setStatusdescription(String statusdescription) {
        this.statusdescription = statusdescription;
    }

    public String getOutputfilename() {
        return outputfilename;
    }

    public void setOutputfilename(String outputFileName) {
        this.outputfilename = outputFileName;
    }

    public String getJobtime() {
        return jobtime;
    }

    public void setJobtime(String jobtime) {
        this.jobtime = jobtime;
    }
}
