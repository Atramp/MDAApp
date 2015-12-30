package com.teradata.mda.model;

/**
 * Created by YS186019 on 2015/10/13.
 */
public class HelpDatabase {

    String name;
    String kind;
    String comment;
    String protection;
    String creatorName;
    String commitOption;
    String transactionLog;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getCommitOption() {
        return commitOption;
    }

    public void setCommitOption(String commitOption) {
        this.commitOption = commitOption;
    }

    public String getTransactionLog() {
        return transactionLog;
    }

    public void setTransactionLog(String transactionLog) {
        this.transactionLog = transactionLog;
    }

    public String getProtection() {
        return protection;
    }

    public void setProtection(String protection) {
        this.protection = protection;
    }

    public String toString(){
        StringBuilder sb=new StringBuilder();
        sb.append("name:").append(name).append(" | ");
        sb.append("kind:").append(kind).append(" | ");
        sb.append("comment:").append(comment).append(" | ");
        sb.append("protection:").append(protection).append(" | ");
        sb.append("creatorName:").append(creatorName).append(" | ");
        sb.append("commitOption:").append(commitOption).append(" | ");
        sb.append("transactionLog:").append(transactionLog).append(" | ");
        return(sb.toString());
    }

}
