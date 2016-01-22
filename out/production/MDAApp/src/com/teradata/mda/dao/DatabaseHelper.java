package com.teradata.mda.dao;

import org.apache.ibatis.annotations.Param;

/**
 * Created by YS186019 on 2015/10/13.
 * this class is designed as a interface between the MyBatis and the Java application.
 * the Mybatis is isolated from the application by interface
 * this interface contains all needed operation to get the column information from other database,
 * it use help table XXX to get the information from other database and insert them into mdaapp database
 * the SQL query is defined in config/mybatis/mdaappsql/databasehelper.xml
 * in the future we may need to andd more operation to maintain other information
 *
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
