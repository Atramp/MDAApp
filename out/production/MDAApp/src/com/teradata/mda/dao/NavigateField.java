package com.teradata.mda.dao;

import com.teradata.mda.guimodel.TreeGridModel;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/12.
 */
public interface NavigateField {
    public List<TreeGridModel> getTableList(@Param("dbName")String dbName,@Param("tableName")String tableName);
    public List<TreeGridModel> getColumnList(@Param("tableId")int tableId);

}
