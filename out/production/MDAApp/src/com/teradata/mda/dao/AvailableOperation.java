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

    public CommonOperation getOperationById(@Param("id")int id);
    public List<CommonOperation> getOperations(@Param("dbType")String dbType,@Param("colType")String colType,@Param("place")String place);
    //public List<CommonOperation> getCandidate(@Param("candidates")String candidates);
    public List<CommonOperation> getCandidate(@Param("candidates")int [] candidates);
    public List<CommonOperation> getAllOperation();
}
