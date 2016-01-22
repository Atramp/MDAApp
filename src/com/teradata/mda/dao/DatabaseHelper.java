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

    /**
     * 运行 help table 后，系统将解析返回的结果集，并将表记录插入数据库
     * @param dbName  数据库名称
     * @param tableName  数据表名称
     * @param tableType  数据表类型  view table
     * @param Comments  数据表注释
     * @param creatorName  数据表创建人
     */

    public void insertTable(@Param("dbName")String dbName,@Param("tableName")String tableName,@Param("tableType")String tableType,
                            @Param("comments")String Comments,@Param("creatorName")String creatorName);

    /**
     * 根据数据库名称和数据表名称查询表 ID
     * @param dbName
     * @param tableName
     * @return
     */
    public int getTableId(@Param("dbName")String dbName,@Param("tableName")String tableName);


    /**
     * 运行 help table 后，系统将解析返回的结果集，并将字段记录插入数据库
     * @param tableId  所属数据表ID
     * @param colName  字段名称
     * @param colType  字段类型
     * @param colFormat  字段格式
     * @param colMaxLength  字段最大长度
     * @param colDecimal  字段如果为数字型，记录其长度，否者为空
     * @param colFraction  字段如果为数字型，小数部分长度
     * @param comments  字段描述
     * @param colTitle  字段标题
     */
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
