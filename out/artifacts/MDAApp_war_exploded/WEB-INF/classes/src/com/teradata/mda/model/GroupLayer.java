package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/11/27.
 */
public class GroupLayer {

    int  layerId;
    int filterId;
    int colId;
    int ruleId;
    String layerName;
    String operator1;
    String boundary1;
    String connector;
    String operator2;
    String boundary2;

    public int getLayerId() {
        return layerId;
    }

    public void setLayerId(int layerId) {
        this.layerId = layerId;
    }

    public int getFilterId() {
        return filterId;
    }

    public void setFilterId(int filterId) {
        this.filterId = filterId;
    }

    public int getColId() {
        return colId;
    }

    public void setColId(int colId) {
        this.colId = colId;
    }

    public int getRuleId() {
        return ruleId;
    }

    public void setRuleId(int ruleId) {
        this.ruleId = ruleId;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getOperator1() {
        return operator1;
    }

    public void setOperator1(String operator1) {
        this.operator1 = operator1;
    }

    public String getBoundary1() {
        return boundary1;
    }

    public void setBoundary1(String boundary1) {
        this.boundary1 = boundary1;
    }

    public String getConnector() {
        return connector;
    }

    public void setConnector(String connector) {
        this.connector = connector;
    }

    public String getOperator2() {
        return operator2;
    }

    public void setOperator2(String operator2) {
        this.operator2 = operator2;
    }

    public String getBoundary2() {
        return boundary2;
    }

    public void setBoundary2(String boundary2) {
        this.boundary2 = boundary2;
    }
}
