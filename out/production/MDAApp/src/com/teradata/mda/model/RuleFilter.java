package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/10/22.
 */
public class RuleFilter extends FieldFilter {
    int ruleId;
    int jobid;
    int isdistinct;
    int ordernum;
    String param1type;
    String param2type;
    int windowx;
    int windowy;
    boolean processed;

    public int getRuleId() {
        return ruleId;
    }

    public void setRuleId(int ruleId) {
        this.ruleId = ruleId;
    }

    public int getJobid() {
        return jobid;
    }

    public void setJobid(int jobid) {
        this.jobid = jobid;
    }

    public int getIsdistinct() {
        return isdistinct;
    }

    public void setIsdistinct(int isdistinct) {
        this.isdistinct = isdistinct;
    }

    public int getOrdernum() {
        return ordernum;
    }

    public void setOrdernum(int ordernum) {
        this.ordernum = ordernum;
    }

    public String getParam1type() {
        return param1type;
    }

    public void setParam1type(String param1type) {
        this.param1type = param1type;
    }

    public String getParam2type() {
        return param2type;
    }

    public void setParam2type(String param2type) {
        this.param2type = param2type;
    }

    public int getWindowx() {
        return windowx;
    }

    public void setWindowx(int windowx) {
        this.windowx = windowx;
    }

    public int getWindowy() {
        return windowy;
    }

    public void setWindowy(int windowy) {
        this.windowy = windowy;
    }

    public boolean isProcessed() {
        return processed;
    }

    public void setProcessed(boolean processed) {
        this.processed = processed;
    }
}
