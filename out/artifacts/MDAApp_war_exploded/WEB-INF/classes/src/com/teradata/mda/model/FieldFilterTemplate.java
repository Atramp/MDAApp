package com.teradata.mda.model;

import java.util.ArrayList;

/**
 * Created by YS186019 on 2015/11/10.
 */
public class FieldFilterTemplate extends FieldFilter {
    // this class contains all properties from ColumnInfo and FieldFilter
    int tableid;
    String dbtype;
    String dbname;
    String schemaname;
    String coltype;
    String colformat;
    int colmaxlength;
    String comments;
    int coldecimal;
    int colfraction;
    String creatorname;
    String tabletype;
    String virtualtype;
    String tableName;
    String colName;
    String coltitle;
    int referenceCount;
    boolean newFilter;
    ArrayList<FilterCandidate> param1candidate;
    ArrayList<FilterCandidate> param2candidate;



    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getColName() {
        return colName;
    }

    public void setColName(String colName) {
        this.colName = colName;
    }

    public String getColtitle() {
        return coltitle;
    }

    public void setColtitle(String coltitle) {
        this.coltitle = coltitle;
    }

    public int getTableid() {
        return tableid;
    }

    public void setTableid(int tableid) {
        this.tableid = tableid;
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

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
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

    public int getReferenceCount() {
        return referenceCount;
    }

    public void setReferenceCount(int referenceCount) {
        this.referenceCount = referenceCount;
    }

    public ArrayList<FilterCandidate> getParam1candidate() {
        return param1candidate;
    }

    public void setParam1candidate(ArrayList<FilterCandidate> param1candidate) {
        this.param1candidate = param1candidate;
    }

    public ArrayList<FilterCandidate> getParam2candidate() {
        return param2candidate;
    }

    public void setParam2candidate(ArrayList<FilterCandidate> param2candidate) {
        this.param2candidate = param2candidate;
    }

    public boolean isNewFilter() {
        return newFilter;
    }

    public void setNewFilter(boolean newFilter) {
        this.newFilter = newFilter;
    }


}
