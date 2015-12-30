package com.teradata.mda.guimodel;

import com.teradata.mda.model.FieldFilter;

/**
 * Created by YS186019 on 2015/10/13.
 */
public class SaveFilterData extends FieldFilter {
    boolean newfilter;

    public boolean isNewfilter() {
        return newfilter;
    }

    public void setNewFilter(boolean newFilter) {
        this.newfilter = newFilter;
    }
}
