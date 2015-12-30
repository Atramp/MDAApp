package com.teradata.mda.dao;

import com.teradata.mda.model.GroupLayer;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/11/28.
 */
public interface GroupLayerOperator {
    public List<GroupLayer> getByFilterId(@Param("filterId") int filterId);
    public List<GroupLayer> getByRuleId(@Param("ruleId") int ruleId);
    public GroupLayer getByLayerId(@Param("layerId")int layerId);
    public void deleteByFilterId(@Param("filterId") int filterId);
    public void deleteByRuleId(@Param("ruleId") int ruleId);
    public void deleteByLayerId(@Param("layerId")int layerId);

    public int getMaxId();

    public void updateLayer(@Param("layer")GroupLayer layer);
    public void insertLayer(@Param("layer")GroupLayer layer);

    public void removeOrphanByFilterId(@Param("filterId") int filterId, @Param("layerId") int[] layerId);
    public void removeOrphanByRuleId(@Param("ruleId") int ruleId, @Param("layerId") int[] layerId);

}
