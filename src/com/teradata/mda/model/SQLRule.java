package com.teradata.mda.model;

import java.util.ArrayList;

/**
 * Created by YS186019 on 2015/10/16.
 */
public class SQLRule {
    boolean isdistinct;
    ArrayList<JobRule> field;
    ArrayList<Connector> fieldRelation;

    public ArrayList<JobRule> getField() {
        return field;
    }

    public void setField(ArrayList<JobRule> field) {
        this.field = field;
    }

    public ArrayList<Connector> getFieldRelation() {
        return fieldRelation;
    }

    public void setFieldRelation(ArrayList<Connector> fieldRelation) {
        this.fieldRelation = fieldRelation;
    }

    public boolean isdistinct() {
        return isdistinct;
    }

    public void setIsdistinct(boolean isdistinct) {
        this.isdistinct = isdistinct;
    }
}
