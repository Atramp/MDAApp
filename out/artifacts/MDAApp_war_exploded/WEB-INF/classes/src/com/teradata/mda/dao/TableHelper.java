package com.teradata.mda.dao;

import org.apache.ibatis.annotations.Param;

/**
 * Created by YS186019 on 2015/12/16.
 */
public interface TableHelper {
    public void updateTableComment(@Param("tableId")int tableId,@Param("comment")String comment);
    public void updateColumnInfo(@Param("colId")int colId,@Param("coltitle")String colTitle,@Param("defaultInputType")String defaultInputType);

}
