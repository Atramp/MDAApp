package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/10/16.
 */
public class Result extends SQLRule {
    boolean distinct;

    public boolean isDistinct() {
        return distinct;
    }

    public void setDistinct(boolean distinct) {
        this.distinct = distinct;
    }
}
