package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/8/27.
 */
public class ColumnInfo {
    int colId;
    int tableid;
    String dbtype;
    String dbname;
    String schemaname;
    String tablename;
    String colname;
    String coltype;
    String colformat;
    int colmaxlength;
    String comments;
    String coltitle;
    int coldecimal;
    int colfraction;
    String creatorname;
    String tabletype;
    String virtualtype;
    String defaultCodeTable;
    String defaultInputType;
    int enableDetail;
    int enableResult;
    int enableWhere;
    int enableGroupBy;
    int enableOrderBy;
    String preventOperator;



    public int getColId() {
        return colId;
    }

    public void setColId(int colId) {
        this.colId = colId;
    }

    public String getDbtype() {
        return dbtype;
    }

    public void setDbtype(String dbtype) {
        this.dbtype = dbtype;
    }

    public String getDbname() {
        return dbname;
    }

    public void setDbname(String dbname) {
        this.dbname = dbname;
    }

    public String getSchemaname() {
        return schemaname;
    }

    public void setSchemaname(String schemaname) {
        this.schemaname = schemaname;
    }

    public String getTablename() {
        return tablename;
    }

    public void setTablename(String tablename) {
        this.tablename = tablename;
    }

    public String getColname() {
        return colname;
    }

    public void setColname(String colname) {
        this.colname = colname;
    }

    public String getColtype() {
        return coltype;
    }

    public void setColtype(String coltype) {
        this.coltype = coltype;
    }

    public String getColformat() {
        return colformat;
    }

    public void setColformat(String colformat) {
        this.colformat = colformat;
    }

    public int getColmaxlength() {
        return colmaxlength;
    }

    public void setColmaxlength(int colmaxlength) {
        this.colmaxlength = colmaxlength;
    }


    public String getColtitle() {
        return coltitle;
    }

    public void setColtitle(String coltitle) {
        this.coltitle = coltitle;
    }

    public int getColdecimal() {
        return coldecimal;
    }

    public void setColdecimal(int coldecimal) {
        this.coldecimal = coldecimal;
    }

    public int getColfraction() {
        return colfraction;
    }

    public void setColfraction(int colfraction) {
        this.colfraction = colfraction;
    }

    public int getTableid() {
        return tableid;
    }

    public void setTableid(int tableid) {
        this.tableid = tableid;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getCreatorname() {
        return creatorname;
    }

    public void setCreatorname(String creatorname) {
        this.creatorname = creatorname;
    }

    public String getTabletype() {
        return tabletype;
    }

    public void setTabletype(String tabletype) {
        this.tabletype = tabletype;
    }

    public String getVirtualtype() {
        return virtualtype;
    }

    public void setVirtualtype(String virtualtype) {
        this.virtualtype = virtualtype;
    }

    public String getDefaultCodeTable() {
        return defaultCodeTable;
    }

    public void setDefaultCodeTable(String defaultCodeTable) {
        this.defaultCodeTable = defaultCodeTable;
    }

    public String getDefaultInputType() {
        return defaultInputType;
    }

    public void setDefaultInputType(String defaultInputType) {
        this.defaultInputType = defaultInputType;
    }

    public int getEnableDetail() {
        return enableDetail;
    }

    public void setEnableDetail(int enableDetail) {
        this.enableDetail = enableDetail;
    }

    public int getEnableResult() {
        return enableResult;
    }

    public void setEnableResult(int enableResult) {
        this.enableResult = enableResult;
    }

    public int getEnableWhere() {
        return enableWhere;
    }

    public void setEnableWhere(int enableWhere) {
        this.enableWhere = enableWhere;
    }

    public int getEnableGroupBy() {
        return enableGroupBy;
    }

    public void setEnableGroupBy(int enableGroupBy) {
        this.enableGroupBy = enableGroupBy;
    }

    public int getEnableOrderBy() {
        return enableOrderBy;
    }

    public void setEnableOrderBy(int enableOrderBy) {
        this.enableOrderBy = enableOrderBy;
    }

    public String getPreventOperator() {
        return preventOperator;
    }

    public void setPreventOperator(String preventOperator) {
        this.preventOperator = preventOperator;
    }
}
