package com.teradata.mda.dao;

import com.teradata.mda.model.ColumnInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/12.
 * this class is designed as a interface between the MyBatis and the Java application.
 * the Mybatis is isolated from the application by interface
 * this interface contains all needed operation to get the column information from database,
 * the information either from table or view.
 * the SQL query is defined in config/mybatis/mdaappsql/columninfo.xml
 *
 */
public interface ColInfoOperator {

    public ColumnInfo getColumnInfoById(@Param("colId")int colId);
    public List<ColumnInfo> getColumnsByJobId(@Param("jobId") int jobId);
    public List<ColumnInfo> getAllColumns();

    public void deleteTable(@Param("tableId")int tableId);
    public void deleteColumn(@Param("colId")int colId);
    public void deleteTableColumn(@Param("tableId")int tableId);
    public void deleteFilterCandidateByTable(@Param("tableId")int tableId);
    public void deleteFilterCandidateByColumn(@Param("colId")int colId);
}
