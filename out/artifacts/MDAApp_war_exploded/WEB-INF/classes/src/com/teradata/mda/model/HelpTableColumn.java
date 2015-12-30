package com.teradata.mda.model;

import java.util.ArrayList;

/**
 * Created by YS186019 on 2015/12/16.
 */
public class HelpTableColumn extends ColumnInfo {
    ArrayList<FilterCandidate> editCandidates;
    ArrayList<FilterCandidate> addCandidates;
    ArrayList<FilterCandidate> removeCandidates;

    public ArrayList<FilterCandidate> getEditCandidates() {
        return editCandidates;
    }

    public void setEditCandidates(ArrayList<FilterCandidate> editCandidates) {
        this.editCandidates = editCandidates;
    }

    public ArrayList<FilterCandidate> getAddCandidates() {
        return addCandidates;
    }

    public void setAddCandidates(ArrayList<FilterCandidate> addCandidates) {
        this.addCandidates = addCandidates;
    }

    public ArrayList<FilterCandidate> getRemoveCandidates() {
        return removeCandidates;
    }

    public void setRemoveCandidates(ArrayList<FilterCandidate> removeCandidates) {
        this.removeCandidates = removeCandidates;
    }
}
