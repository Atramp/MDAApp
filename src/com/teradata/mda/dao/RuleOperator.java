package com.teradata.mda.dao;

import com.teradata.mda.model.JobRule;
import com.teradata.mda.model.RuleFilter;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

/**
 * Created by YS186019 on 2015/10/19.
 */
public interface RuleOperator {

    public void lockTable();

    public void unlockTable();

    public int getMaxRuleId();

    public JobRule getRuleById(int id);

    public void insertRule(@Param("ruleInfo")JobRule ruleInfo);

    public void deleteByJobId(@Param("jobId")int jobId);

    public List<JobRule> getRulesByJobId(@Param("id")int jobId);
    public List<JobRule> getRulesByJobIdPlace(@Param("id")int jobId,@Param("place")String place);

    public void updateRule(@Param("ruleInfo")JobRule ruleInfo);

    public List<JobRule> getOrphanRule(@Param("jobId")int jobId,@Param("keyMap")HashMap<String,Integer> keyMap);
    public void deleteUnusedRule(@Param("jobId")int jobId,@Param("keyMap")HashMap<String,Integer> keyMap);

    public List<RuleFilter> getRuleFilterByRuleId(@Param("ruleId")int ruleId);
    public List<RuleFilter> getRuleFilterByJobId(@Param("jobId")int jobId);

    public int getColumnReferenceCount(@Param("colId") int colId);
    public int getTableReferenceCount(@Param("tableId") int tableId);

}
