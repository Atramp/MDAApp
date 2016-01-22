package com.teradata.mda.dao;

import com.teradata.mda.model.FieldFilter;
import com.teradata.mda.model.FieldFilterTemplate;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/12.
 * this class is designed as a interface between the MyBatis and the Java application.
 * the Mybatis is isolated from the application by interface
 * this interface contains all needed operation to  operate table FIELDFILTER, that table is
 * a core table to store the filter ( or called dimension (or 维度 in chinese))
 * the SQL query is defined in config/mybatis/mdaappsql/fieldfilter.xml
 *
 */
public interface FieldFilterOperator {

    /**
     * 根据数据表id，以及SQL 子句类型 （位置） 获取有关的预定义维度
     * @param place  SQL 子句类型 （位置）
     * @param tableIdList 数据表id 数组
     * @return  预定义维度信息的链表 List<FieldFilter>
     */
    public List<FieldFilter> getPredefinedFilter(@Param("place")String place,@Param("tableIdList")int [] tableIdList);

    /**
     * 根据数据字段id，以及SQL 子句类型 （位置） 获取有关的预定义维度
     * @param place SQL 子句类型 （位置）
     * @param colId 数据字段ID
     * @return 预定义维度信息的链表 List<FieldFilter>
     */
    public List<FieldFilter> getFieldFilter(@Param("place")String place,@Param("colId")int colId);

    /**
     * 获取当前最大的 维度ID
     * @return 最大ID
     */
    public int getMaxId();

    /**
     * 根据维度ID获取维度信息
     * @param filterId 维度ID
     * @return 维度信息的 java bean
     */
    public FieldFilter getFilterById(@Param("filterId")int filterId);

    /**
     * 更新维度信息
     * @param opTitle 维度标题
     * @param description  维度描述
     * @param op1Id  操作符1 ID
     * @param op2Id  操作符2 ID
     * @param opConnectorId  关系操作符 ID
     * @param param1value  参数1数值
     * @param param2value  参数2数值
     * @param outputtitle  输出标题
     * @param resultOperatorId  计算结果操作符
     * @param filterId  维度ID
     */
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

    /**
     * 插入维度信息
     * @param filter 维度的 JAVA Bean，注意实现计算ID
     */
    public void insertFilter(@Param("filter")FieldFilter filter);

    /**
     * 获取所有的维度模板，用户在定义完维度后，可以选择将其保存为相应的维度模板，用此方法可以获取所有的维度模板
     * 此方法主要用于在用户定义维度模板的时候，在一个方法中可以返回维度相关信息和字段相关信息
     * @return  维度模板信息的 JAVA BEAN 链表
     */
    public List<FieldFilterTemplate> getAllFilterTemplate();

    /**
     * 用户查找所有预定的维度时需要输入全部或部分维度名称，系统根据名称返回维度的链表
     * @param templateName  部分或全部维度名称
     * @return  维度模板链表 List<FieldFilterTemplate>
     */
    public List<FieldFilterTemplate> queryFilters(@Param("templateName")String templateName);

    /**
     * 根据维度ID获取维度模板，用户定义维度模板功能使用
     * @param filterId 维度模板 ID
     * @return 维度模板
     */
    public FieldFilterTemplate getFilterTemplate(@Param("filterId")int filterId);

    /**
     * 获取所有的用户自定义模板中where SQL子句模板
     * @return 维度模板链表 List<FieldFilterTemplate>
     */
    public List<FieldFilter> getWhereTemplate();

    /**
     * 获取所有的用户自定义模板中结果（Select） SQL子句模板
     * @return 维度模板链表 List<FieldFilterTemplate>
     */
    public List<FieldFilter> getResultTemplate();

    /**
     * 获取所有的用户自定义模板中分组和分档 group by SQL子句模板
     * @return 维度模板链表 List<FieldFilterTemplate>
     */
    public List<FieldFilter> getGroupByTemplate();

    /**
     *  获取所有的用户自定义模板中排序 （order by） SQL子句模板
     * @return 维度模板链表 List<FieldFilterTemplate>
     */
    public List<FieldFilter> getOrderByTemplate();

    /**
     * 更新维度模板信息
     * @param filter 维度信息
     */
    public void updateFilterTemplate(@Param("filter")FieldFilter filter);

    /**
     * 删除维度模板信息
     * @param filterId
     */
    public void deleteFilter(@Param("filterId")int filterId);

    /**
     * 获取某个字段定义的维度模板数量
     * @param colId 字段ID
     * @return
     */
    public int getColumnReferenceCount(@Param("colId") int colId);

    /**
     * 获取表中所包含字段的所有的维度模板数量
     * @param tableId 数据表ID
     * @return
     */
    public int getTableReferenceCount(@Param("tableId") int tableId);
}
