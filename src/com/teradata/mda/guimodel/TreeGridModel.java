package com.teradata.mda.guimodel;

import com.teradata.mda.model.ColumnInfo;

import java.util.List;

/**
 * Created by YS186019 on 2015/8/31.
 */
public class TreeGridModel extends ColumnInfo{

    String names;
    boolean leaf;
    List<TreeGridModel> children;


    public boolean isLeaf() {
        return leaf;
    }

    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }

    public List<TreeGridModel> getChildren() {
        return children;
    }

    public void setChildren(List<TreeGridModel> children) {
        this.children = children;
    }

    public String getNames() {
        return names;
    }

    public void setNames(String names) {
        this.names = names;
    }



}
