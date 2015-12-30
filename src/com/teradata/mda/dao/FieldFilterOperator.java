package com.teradata.mda.dao;

import com.teradata.mda.model.FieldFilter;
import com.teradata.mda.model.FieldFilterTemplate;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/12.
 */
public interface FieldFilterOperator {
    public List<FieldFilter> getPredefinedFilter(@Param("place")String place,@Param("tableIdList")int [] tableIdList);
    //public List<FieldFilter> getPredefinedFilter(@Param("place")String place,@Param("tableIdList")String tableIdList);

    public List<FieldFilter> getFieldFilter(@Param("place")String place,@Param("colId")int colId);

    public int getMaxId();

    public FieldFilter getFilterById(@Param("filterId")int filterId);

    public void updateFilter(
            @Param("opTitle")String opTitle,
            @Param("description")String description,
            @Param("op1Id")int op1Id,
            @Param("op2Id")int op2Id,
            @Param("opConnectorId")int opConnectorId,
            @Param("param1value")String param1value,
            @Param("param2value")String param2value,
            @Param("outputTitle")String outputtitle,
            @Param("resultOperatorId") int resultOperatorId,
            @Param("filterId")int filterId
    );

    public void insertFilter(@Param("filter")FieldFilter filter);

    public List<FieldFilterTemplate> getAllFilterTemplate();

    public List<FieldFilterTemplate> queryFilters(@Param("templateName")String templateName);

    public FieldFilterTemplate getFilterTemplate(@Param("filterId")int filterId);

    public List<FieldFilter> getWhereTemplate();

    public List<FieldFilter> getResultTemplate();

    public List<FieldFilter> getGroupByTemplate();

    public List<FieldFilter> getOrderByTemplate();

    public void updateFilterTemplate(@Param("filter")FieldFilter filter);

    public void deleteFilter(@Param("filterId")int filterId);

    public int getColumnReferenceCount(@Param("colId") int colId);

    public int getTableReferenceCount(@Param("tableId") int tableId);
}
