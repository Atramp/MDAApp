package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/9/15.
 */
public class CommonOperation {
    int operationid;
    String dbtype;
    String coltype;
    String sqloperator;
    String sqltemplate;
    String operationplace;
    String operationtitle;
    String paramcount;
    String virtualtype;

    public int getOperationid() {
        return operationid;
    }

    public void setOperationid(int operationid) {
        this.operationid = operationid;
    }

    public String getDbtype() {
        return dbtype;
    }

    public void setDbtype(String dbtype) {
        this.dbtype = dbtype;
    }

    public String getColtype() {
        return coltype;
    }

    public void setColtype(String coltype) {
        this.coltype = coltype;
    }

    public String getSqloperator() {
        return sqloperator;
    }

    public void setSqloperator(String sqloperator) {
        this.sqloperator = sqloperator;
    }

    public String getSqltemplate() {
        return sqltemplate;
    }

    public void setSqltemplate(String sqltemplate) {
        this.sqltemplate = sqltemplate;
    }

    public String getOperationplace() {
        return operationplace;
    }

    public void setOperationplace(String operationplace) {
        this.operationplace = operationplace;
    }

    public String getOperationtitle() {
        return operationtitle;
    }

    public void setOperationtitle(String operationtitle) {
        this.operationtitle = operationtitle;
    }

    public String getParamcount() {
        return paramcount;
    }

    public void setParamcount(String paramcount) {
        this.paramcount = paramcount;
    }

    public String getVirtualtype() {
        return virtualtype;
    }

    public void setVirtualtype(String virtualtype) {
        this.virtualtype = virtualtype;
    }
}
