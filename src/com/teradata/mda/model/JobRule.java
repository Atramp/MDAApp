package com.teradata.mda.model;

import java.util.ArrayList;

/**
 * Created by YS186019 on 2015/10/16.
 */
public class JobRule {
    int ruleId;
    int jobid;
    int filterId;
    int colId;
    int resultoperatorid;
    int isdistinct;
    int ordernum;
    String componentid;
    int op1Id;
    int op2Id;
    String place;
    int opconnectorid;
    String param1value;
    String param1type;
    String param2value;
    String param2type;  // can be field or ruleId or whatever meaningful
    String outputtitle;
    int windowx;    // this value is the window position, used when pass the value back to client for edit
    int windowy;
    ArrayList<GroupLayer> layerInfo;

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

    public int getResultoperatorid() {
        return resultoperatorid;
    }

    public void setResultoperatorid(int resultoperatorid) {
        this.resultoperatorid = resultoperatorid;
    }

    public int getOrdernum() {
        return ordernum;
    }

    public void setOrdernum(int ordernum) {
        this.ordernum = ordernum;
    }

    public int getOp1Id() {
        return op1Id;
    }

    public void setOp1Id(int op1Id) {
        this.op1Id = op1Id;
    }

    public int getOp2Id() {
        return op2Id;
    }

    public void setOp2Id(int op2Id) {
        this.op2Id = op2Id;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public int getOpconnectorid() {
        return opconnectorid;
    }

    public void setOpconnectorid(int opconnectorid) {
        this.opconnectorid = opconnectorid;
    }

    public String getParam1value() {
        return param1value;
    }

    public void setParam1value(String param1value) {
        this.param1value = param1value;
    }

    public String getParam1type() {
        return param1type;
    }

    public void setParam1type(String param1type) {
        this.param1type = param1type;
    }

    public String getParam2value() {
        return param2value;
    }

    public void setParam2value(String param2value) {
        this.param2value = param2value;
    }

    public String getParam2type() {
        return param2type;
    }

    public void setParam2type(String param2type) {
        this.param2type = param2type;
    }

    public String getOutputtitle() {
        return outputtitle;
    }

    public void setOutputtitle(String outputtitle) {
        this.outputtitle = outputtitle;
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

    public String getComponentid() {
        return componentid;
    }

    public void setComponentid(String componentid) {
        this.componentid = componentid;
    }

    public int getIsdistinct() {
        return isdistinct;
    }

    public void setIsdistinct(int isdistinct) {
        this.isdistinct = isdistinct;
    }


    public ArrayList<GroupLayer> getLayerInfo() {
        return layerInfo;
    }

    public void setLayerInfo(ArrayList<GroupLayer> layerInfo) {
        this.layerInfo = layerInfo;
    }
}
