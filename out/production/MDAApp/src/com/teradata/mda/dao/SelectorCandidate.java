package com.teradata.mda.dao;

import com.teradata.mda.model.FilterCandidate;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by YS186019 on 2015/10/13.
 */
public interface SelectorCandidate {
    //select * from filtercandidate where place=#{place} and filterId=#{filterId} and paramid=#{paramid}
    //place, filterId, colId,paramId
    public List<FilterCandidate> getSelectorCandidate(@Param("place")String place,@Param("filterId")int filterId,@Param("colId")int colId,@Param("paramId")int paramId);

    public List<FilterCandidate> getByFilterId(@Param("filterId")int filterId);

    public List<FilterCandidate> getFilterCandidate(@Param("place")String place,@Param("filterId")int filterId);

    public List<FilterCandidate> getColFilterCandidate(@Param("place")String place,@Param("colId")int colId,@Param("filterId")int filterId);

    public int  getMaxId();

    public void insertCandidate(@Param("candidate")FilterCandidate candidate);

    public void addCandidate(@Param("candidate")FilterCandidate candidate);

    public void updateCandidate(@Param("candidate") FilterCandidate candidate);

    public void deleteCandidate(@Param("candidateId") int candidateId);

    public void removeUnusedCandidate(@Param("filterId")int filterId,@Param("idList")int [] idList);

    public void deleteByFilterId(@Param("filterId")int filterId);


}
