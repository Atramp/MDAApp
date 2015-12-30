package com.teradata.mda.dao;

import com.teradata.mda.model.CommonOperation;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/12.
 */
public interface AvailableOperation {

    public CommonOperation getOperationById(@Param("id")int id);
    public List<CommonOperation> getOperations(@Param("dbType")String dbType,@Param("colType")String colType,@Param("place")String place);
    //public List<CommonOperation> getCandidate(@Param("candidates")String candidates);
    public List<CommonOperation> getCandidate(@Param("candidates")int [] candidates);
    public List<CommonOperation> getAllOperation();
/*    public void updateFilter(@Param("op1Id")int op1Id,
                             @Param("op2Id")int op2Id,
                             @Param("opConnectorId")int opConnectorId,
                             @Param("param1value")String param1value,
                             @Param("param2value")String param2value,
                             @Param("filterId")int filterId);

    public void insertFilter(@Param("filter")FieldFilter filter);*/
}
