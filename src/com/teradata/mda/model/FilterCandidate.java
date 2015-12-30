package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/9/21.
 */
public class FilterCandidate {
    int candidateid;
    int colId;
    int filterId;
    int paramid;
    String candidatetitle;
    String candidatevalue;
    String place;

    public int getCandidateid() {
        return candidateid;
    }

    public void setCandidateid(int candidateid) {
        this.candidateid = candidateid;
    }

    public int getFilterId() {
        return filterId;
    }

    public void setFilterId(int filterId) {
        this.filterId = filterId;
    }

    public int getParamid() {
        return paramid;
    }

    public void setParamid(int paramid) {
        this.paramid = paramid;
    }

    public String getCandidatetitle() {
        return candidatetitle;
    }

    public void setCandidatetitle(String candidatetitle) {
        this.candidatetitle = candidatetitle;
    }

    public String getCandidatevalue() {
        return candidatevalue;
    }

    public void setCandidatevalue(String candidatevalue) {
        this.candidatevalue = candidatevalue;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public int getColId() {
        return colId;
    }

    public void setColId(int colId) {
        this.colId = colId;
    }
}
