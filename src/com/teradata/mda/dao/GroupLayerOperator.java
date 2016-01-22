package com.teradata.mda.dao;

import com.teradata.mda.model.GroupLayer;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/11/28.
 */
public interface GroupLayerOperator {

    /**
     * 获取维度对应的分档信息
     * @param filterId 维度ID
     * @return List<GroupLayer>，分档信息的Java Bean 链表
     */
    public List<GroupLayer> getByFilterId(@Param("filterId") int filterId);

    /**
     * 获取多维分析任务对应的分档信息
     * @param ruleId 多维分析任务的某规则ID
     * @return List<GroupLayer>，分档信息的Java Bean 链表
     */
    public List<GroupLayer> getByRuleId(@Param("ruleId") int ruleId);

    /**
     * 获取某个特定的分档信息
     * @param layerId
     * @return GroupLayer，分档信息的Java Bean
     */
    public GroupLayer getByLayerId(@Param("layerId")int layerId);

    /**
     * 删除某维度相关的分档信息
     * @param filterId 维度ID
     */
    public void deleteByFilterId(@Param("filterId") int filterId);

    /**
     * 删除某多维分析任务中某规则对应的分档信息
     * @param ruleId 规则 ID
     */
    public void deleteByRuleId(@Param("ruleId") int ruleId);

    /**
     * 删除某分档信息
     * @param layerId 分档ID
     */
    public void deleteByLayerId(@Param("layerId")int layerId);

    /**
     * 获取最大的分档ID号
     * @return id
     */
    public int getMaxId();

    /**
     * 更新某分档信息
     * @param layer 分档的java bean 封装
     */
    public void updateLayer(@Param("layer")GroupLayer layer);

    /**
     * 插入分档信息
     * @param layer
     */
    public void insertLayer(@Param("layer")GroupLayer layer);

    /**
     * 用户增减分档信息后，删除不再使用的分层信息
     * @param filterId  维度ID
     * @param layerId  修改后维度使用的分档ID信息
     */
    public void removeOrphanByFilterId(@Param("filterId") int filterId, @Param("layerId") int[] layerId);

    /**
     * 用户增减分档信息后，删除不再使用的分层信息
     * @param ruleId 规则ID
     * @param layerId 修改后规则使用的分档ID信息
     */
    public void removeOrphanByRuleId(@Param("ruleId") int ruleId, @Param("layerId") int[] layerId);

}
