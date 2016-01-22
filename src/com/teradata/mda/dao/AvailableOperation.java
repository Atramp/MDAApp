package com.teradata.mda.dao;

import com.teradata.mda.model.CommonOperation;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/12.
 * this class is designed as a interface between the MyBatis and the Java application.
 * the Mybatis is isolated from the application by interface
 * this interface contains all needed operation of table COMMONOPERATION, which is a
 * collection of SQL operator such as = ,min,max and etc. </>
 * the SQL query is defined in config.mybatis.mdaappsql.operations.xml
 *
 */
public interface AvailableOperation {

    /**
     * 根据ID获取操作符信息
     * @param id
     * @return 包含操作符信息的bean
     */
    public CommonOperation getOperationById(@Param("id")int id);

    /**
     * 根据数据库类型、字段类型、SQL子句位置获取可用操作符
     * @param dbType  数据库类型
     * @param colType  字段类型
     * @param place  SQL子句位置，
     * @return  List<CommonOperation> ，包含操作符信息的bean链表
     */
    public List<CommonOperation> getOperations(@Param("dbType")String dbType,@Param("colType")String colType,@Param("place")String place);

    /**
     * 根据指定的id值数组，返回 包含操作符信息的bean链表，目前程序中尚未使用
     * @param candidates 整数数组，包含需要获取的操作符 ID
     * @return 包含操作符信息的bean链表
     */
    public List<CommonOperation> getCandidate(@Param("candidates")int [] candidates);

    /**
     * 获取全部的操作符信息
     * @return List<CommonOperation> 包含操作符信息的bean链表
     */
    public List<CommonOperation> getAllOperation();
}
