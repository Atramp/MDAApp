package com.teradata.mda.model;

import java.sql.Timestamp;
import java.util.ArrayList;

/**
 * Created by YS186019 on 2015/9/15.
 */
public class FieldFilter {
    int filterId;
    int colId;
    String opsql;
    String extraSql;
    String place;
    String optitle;
    String op1label;
    String op1candidate;
    boolean showoperator1;
    String param1leftlabel;
    String param1style;
    String param1rightlabel;
    //String opconnectiontitle;
    String connectorcandidate;
    int opconnectorid;
    String op2label;
    String op2candidate;
    boolean showoperator2;
    String param2leftlabel;
    String param2rightlabel;
    String param2style;
    //String paramcount;
    int paramcount;
    String param1checkrule;
    String param2checkrule;
    String paramscheckrule;
    String description;
    boolean showdescription;
    String creator;
    String createtime;
    //Timestamp createtime;
    int resultoperatorid;
    int op1Id;
    int op2Id;

    String param1value;
    String param2value;
    String outputtitle;
    boolean showConnector;

    ArrayList<GroupLayer> layerInfo;

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

    public String getOpsql() {
        return opsql;
    }

    public void setOpsql(String opsql) {
        this.opsql = opsql;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getOptitle() {
        return optitle;
    }

    public void setOptitle(String optitle) {
        this.optitle = optitle;
    }

    public String getOp1label() {
        return op1label;
    }

    public void setOp1label(String op1label) {
        this.op1label = op1label;
    }

    public String getOp1candidate() {
        return op1candidate;
    }

    public void setOp1candidate(String op1candidate) {
        this.op1candidate = op1candidate;
    }

    public String getParam1leftlabel() {
        return param1leftlabel;
    }

    public void setParam1leftlabel(String param1leftlabel) {
        this.param1leftlabel = param1leftlabel;
    }

    public String getParam1style() {
        return param1style;
    }

    public void setParam1style(String param1style) {
        this.param1style = param1style;
    }

    public String getParam1rightlabel() {
        return param1rightlabel;
    }

    public void setParam1rightlabel(String param1rightlabel) {
        this.param1rightlabel = param1rightlabel;
    }

/*    public String getOpconnectiontitle() {
        return opconnectiontitle;
    }

    public void setOpconnectiontitle(String opconnectiontitle) {
        this.opconnectiontitle = opconnectiontitle;
    }*/

    public String getOp2label() {
        return op2label;
    }

    public void setOp2label(String op2label) {
        this.op2label = op2label;
    }

    public String getOp2candidate() {
        return op2candidate;
    }

    public void setOp2candidate(String op2candidate) {
        this.op2candidate = op2candidate;
    }

    public String getParam2leftlabel() {
        return param2leftlabel;
    }

    public void setParam2leftlabel(String param2leftlabel) {
        this.param2leftlabel = param2leftlabel;
    }

    public String getParam2rightlabel() {
        return param2rightlabel;
    }

    public void setParam2rightlabel(String param2rightlabel) {
        this.param2rightlabel = param2rightlabel;
    }

    public String getParam2style() {
        return param2style;
    }

    public void setParam2style(String param2style) {
        this.param2style = param2style;
    }

//    public String getParamcount() {
//        return paramcount;
//    }
//
//    public void setParamcount(String paramcount) {
//        this.paramcount = paramcount;
//    }

    public int getParamcount() {
        return paramcount;
    }

    public void setParamcount(int paramcount) {
        this.paramcount = paramcount;
    }

    public String getParam1checkrule() {
        return param1checkrule;
    }

    public void setParam1checkrule(String param1checkrule) {
        this.param1checkrule = param1checkrule;
    }

    public String getParam2checkrule() {
        return param2checkrule;
    }

    public void setParam2checkrule(String param2checkrule) {
        this.param2checkrule = param2checkrule;
    }

    public String getParamscheckrule() {
        return paramscheckrule;
    }

    public void setParamscheckrule(String paramscheckrule) {
        this.paramscheckrule = paramscheckrule;
    }

    public boolean isShowoperator1() {
        return showoperator1;
    }

    public void setShowoperator1(boolean showoperator1) {
        this.showoperator1 = showoperator1;
    }

    public boolean isShowoperator2() {
        return showoperator2;
    }

    public void setShowoperator2(boolean showoperator2) {
        this.showoperator2 = showoperator2;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isShowdescription() {
        return showdescription;
    }

    public void setShowdescription(boolean showdescription) {
        this.showdescription = showdescription;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatetime() {
        return createtime;
    }

    public void setCreatetime(String createtime) {
        this.createtime = createtime;
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

    public String getParam1value() {
        return param1value;
    }

    public void setParam1value(String param1value) {
        this.param1value = param1value;
    }

    public String getParam2value() {
        return param2value;
    }

    public void setParam2value(String param2value) {
        this.param2value = param2value;
    }

    public String getOutputtitle() {
        return outputtitle;
    }

    public void setOutputtitle(String outputtitle) {
        this.outputtitle = outputtitle;
    }

    public int getResultoperatorid() {
        return resultoperatorid;
    }

    public void setResultoperatorid(int resultoperatorid) {
        this.resultoperatorid = resultoperatorid;
    }

    public String getConnectorcandidate() {
        return connectorcandidate;
    }

    public void setConnectorcandidate(String connectorcandidate) {
        this.connectorcandidate = connectorcandidate;
    }

    public int getOpconnectorid() {
        return opconnectorid;
    }

    public void setOpconnectorid(int opconnectorid) {
        this.opconnectorid = opconnectorid;
    }

    public String getExtraSql() {
        return extraSql;
    }

    public void setExtraSql(String extraSql) {
        this.extraSql = extraSql;
    }

    public boolean isShowConnector() {
        return showConnector;
    }

    public void setShowConnector(boolean showConnector) {
        this.showConnector = showConnector;
    }

//    public Timestamp getCreatetime() {
//        return createtime;
//    }
//
//    public void setCreatetime(Timestamp createtime) {
//        this.createtime = createtime;
//    }
public ArrayList<GroupLayer> getLayerInfo() {
    return layerInfo;
}

    public void setLayerInfo(ArrayList<GroupLayer> layerInfo) {
        this.layerInfo = layerInfo;
    }
}
