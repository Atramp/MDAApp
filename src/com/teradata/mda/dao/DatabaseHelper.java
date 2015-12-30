package com.teradata.mda.dao;

import org.apache.ibatis.annotations.Param;

/**
 * Created by YS186019 on 2015/10/13.
 */
public interface DatabaseHelper {
    //public List<HelpDatabase> helpDatabase(@Param("dbName") String dbName);

    public void insertTable(@Param("dbName")String dbName,@Param("tableName")String tableName,@Param("tableType")String tableType,
                            @Param("comments")String Comments,@Param("creatorName")String creatorName);

    public int getTableId(@Param("dbName")String dbName,@Param("tableName")String tableName);

    public void insertColumn(
            @Param("tableId")int tableId,
            @Param("colName")String colName,
            @Param("colType")String colType,
            @Param("colFormat")String colFormat,
            @Param("colMaxLength")int colMaxLength,
            @Param("colDecimal")int colDecimal,
            @Param("colFraction")int colFraction,
            @Param("comments")String comments,
            @Param("colTitle")String colTitle);
}
