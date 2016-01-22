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

    /**
     * 根据ID获取字段信息
     * @param colId 字段ID
     * @return  字段信息的Java Bean
     */
    public ColumnInfo getColumnInfoById(@Param("colId")int colId);

    /**
     * 根据job ID 获取所有的相关字段信息链表
     * @param jobId  多维分析任务ID
     * @return  List<ColumnInfo> 字段信息的Java Bean链表
     */
    public List<ColumnInfo> getColumnsByJobId(@Param("jobId") int jobId);

    /**
     * 获取所有的字段信息列表
     * @return 字段信息的Java Bean链表
     */
    public List<ColumnInfo> getAllColumns();

    /**
     * 删除数据表记录
     * @param tableId 数据表 ID
     */
    public void deleteTable(@Param("tableId")int tableId);

    /**
     * 删除字段信息
     * @param colId 字段ID
     */
    public void deleteColumn(@Param("colId")int colId);

    /**
     * 删除表的全部所属字段
     * @param tableId 数据表ID
     */
    public void deleteTableColumn(@Param("tableId")int tableId);

    /**
     * 删除数据表前，在删除对应得字段前，需要删除使用相关字段的维度的选择值
     * 调用此方法可以删除选择值
     * @param tableId 数据表几率ID
     */
    public void deleteFilterCandidateByTable(@Param("tableId")int tableId);

    /**
     * 删除某字段后，需要调用此方法删除使用此字段的维度的选择值
     * @param colId  字段ID
     */
    public void deleteFilterCandidateByColumn(@Param("colId")int colId);
}
