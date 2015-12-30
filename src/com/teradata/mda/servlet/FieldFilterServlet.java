package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.teradata.mda.dao.FieldFilterOperator;
import com.teradata.mda.dao.GroupLayerOperator;
import com.teradata.mda.dao.SelectorCandidate;
import com.teradata.mda.guimodel.SaveFilterData;
import com.teradata.mda.model.FieldFilter;
import com.teradata.mda.model.FieldFilterTemplate;
import com.teradata.mda.model.FilterCandidate;
import com.teradata.mda.model.GroupLayer;
import com.teradata.mda.util.JSONResponse;
import com.teradata.mda.util.MdaAppException;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by YS186019 on 2015/11/9.
 */
@WebServlet(name = "FieldFilterServlet")
public class FieldFilterServlet extends BaseServlet {
    private Logger logger = LoggerFactory.getLogger(FieldFilterServlet.class);

    @Override
    protected String doService(SqlSession sqlSession, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        if (keyMethod == null || keyMethod.isEmpty()) {
            throw new MdaAppException("不支持的操作");
        } else if ("getAll".compareToIgnoreCase(keyMethod) == 0) {
            return (getAll(sqlSession, keyMethod, request, response));
        } else if ("getPredefinedFilter".compareToIgnoreCase(keyMethod) == 0) {
            return (getPredefinedFilter(sqlSession, keyMethod, request, response));
        } else if ("getFilterTemplate".compareToIgnoreCase(keyMethod) == 0) {
            return (getFilterTemplate(sqlSession, keyMethod, request, response));
        } else if ("defineFilterTemplate".compareToIgnoreCase(keyMethod) == 0) {
            return (getTemplateBase(sqlSession, keyMethod, request, response));
        } else if ("duplicateFilterTemplate".compareToIgnoreCase(keyMethod) == 0) {
            return (duplicateFilterTemplate(sqlSession, keyMethod, request, response));
        } else if ("saveFilterTemplate".compareToIgnoreCase(keyMethod) == 0) {
            return (saveFilterTemplate(sqlSession, keyMethod, request, response));
        } else if ("saveFilter".compareToIgnoreCase(keyMethod) == 0) {
            return (saveFilter(sqlSession, keyMethod, request, response));
        } else if ("deleteTemplate".compareToIgnoreCase(keyMethod) == 0) {
            return (deleteFilterTemplate(sqlSession, keyMethod, request, response));
        } else if ("getLayerData".compareToIgnoreCase(keyMethod) == 0) {
            return (getLayerData(sqlSession, keyMethod, request, response));
        } else {
            throw new MdaAppException("不支持的操作");
        }
    }


    protected String getTemplateBase(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        String place = request.getParameter("place");
        List<FieldFilter> list;
        if (place == null || place.isEmpty()) {
            place = "result";
        }
        if ("where".compareToIgnoreCase(place) == 0) {
            list = operator.getWhereTemplate();
        } else if ("result".compareToIgnoreCase(place) == 0) {
            list = operator.getResultTemplate();
        } else if ("groupby".compareToIgnoreCase(place) == 0) {
            list = operator.getGroupByTemplate();
        } else {
            list = operator.getOrderByTemplate();
        }
        //list = operator.getWhereTemplate();
        Gson gson = new Gson();
        String ret = gson.toJson(list);
        logger.debug("the response is {}", ret);
        return (ret);
    }


    protected String getAll(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        String templateName = request.getParameter("templatename");
        List<FieldFilterTemplate> list;
        if (templateName == null || templateName.isEmpty()) {
            list = operator.getAllFilterTemplate();
        } else {
            list = operator.queryFilters(templateName);
        }

        Gson gson = new Gson();
        String ret = gson.toJson(list);
        logger.debug("the response is {}", ret);
        return (ret);
    }

    protected String getPredefinedFilter(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String ret = "";
        String idStr = request.getParameter("colId");
        int colId = -1;
        try {
            colId = Integer.parseInt(idStr);
        } catch (Exception e) {
            logger.warn("cannot find the colId parameters,ignore it {}");
            colId = -1;
        }
        logger.debug("the column id is {}", colId);
        String place = request.getParameter("place");
        if (place == null || place.isEmpty()) {
            ret = JSONResponse.getErrorResponse("operationplace", "empty operation place");
            logger.warn("cannot find the operation place parameters,return a error response {}", ret);
            throw new MdaAppException("请提供操作域参数");
        }
        logger.debug("the operation place is {}", place);
        String tableList = request.getParameter("tablelist");
        if (tableList == null || tableList.isEmpty()) {
            //ret= JSONResponse.getErrorResponse("tableList","empty table list");
            logger.warn("cannot find the tableList parameters,ignore the error ");
            //response.getWriter().write(ret);
            //return;
        }
        logger.debug("the tableList is {}", tableList);

        String action = request.getParameter("action");
        logger.debug("the action is {}", action);

        String templateStr=request.getParameter("defineTemplate");
        boolean defineTemplate=false;
        if(templateStr!=null){
            defineTemplate=Boolean.parseBoolean(templateStr.trim());
        }
        logger.debug("the defineTemplate paramter is {}, and parsed to {}",templateStr,defineTemplate);

        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        List<FieldFilter> list = null;

        if(defineTemplate){
            if(action==null || action.trim()=="" || action.trim().compareToIgnoreCase("new")==0){
                if ("where".compareToIgnoreCase(place) == 0) {
                    list = operator.getWhereTemplate();
                } else if ("result".compareToIgnoreCase(place) == 0) {
                    list = operator.getResultTemplate();
                } else if ("groupby".compareToIgnoreCase(place) == 0) {
                    list = operator.getGroupByTemplate();
                } else {
                    list = operator.getOrderByTemplate();
                }
            }else {
                list = operator.getFieldFilter(place, colId);
            }
        }else {
            if (action == null || action.isEmpty() || action.compareToIgnoreCase("predefined") != 0) {
                //if(colId>0){
                list = operator.getFieldFilter(place, colId);
            } else {
                String[] str = tableList.split(",");
                int[] tid = new int[str.length];
                for (int i = 0, len = str.length; i < len; i++) {
                    try {
                        tid[i] = Integer.parseInt(str[i]);
                    } catch (Exception e) {
                        tid[i] = -1;
                    }
                }
                list = operator.getPredefinedFilter(place, tid);
            }
        }
        Gson gson = new Gson();
        ret = gson.toJson(list);
        logger.debug("the response is {}", ret);
        return (ret);

    }

    public String getFilterTemplate(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        String idStr = request.getParameter("filterId");
        int filterId = -1;
        try {
            filterId = Integer.parseInt(idStr);
        } catch (Exception e) {
            logger.warn("cannot find the filterId parameters,ignore it {}");
            throw new MdaAppException("模板ID号错误");
        }
        FieldFilterTemplate template = operator.getFilterTemplate(filterId);
        Gson gson = new Gson();
        String ret = gson.toJson(template);
        logger.debug("the response is {}", ret);
        return (ret);
    }


    protected String saveFilter(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            throw new MdaAppException(e.getMessage()); /*report an error*/
        }
        logger.debug("the json filter data is " + jb.toString());
        Gson gson = new Gson();
        SaveFilterData filter = gson.fromJson(jb.toString(), SaveFilterData.class);
        int newFilterId = -1;
        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        //boolean createNew = false;
        if (filter.isNewfilter()) {
            //createNew = true;
            newFilterId = createNewFilter(session, operator, filter);
        } else {
            if (filter.getFilterId() < 100) {
                //createNew = true;
                newFilterId = createNewFilter(session, operator, filter);
            } else {
                //createNew = false;
                operator.updateFilter(filter.getOptitle(), filter.getDescription(), filter.getOp1Id(), filter.getOp2Id(), filter.getOpconnectorid(),
                        filter.getParam1value(), filter.getParam2value(), filter.getOutputtitle(), filter.getResultoperatorid(), filter.getFilterId());
                if(filter.getPlace().compareToIgnoreCase("groupby")==0){
                    updateLayerInfo(session, filter, filter.getFilterId(), false);
                }
                newFilterId = filter.getFilterId();
            }
        }
        session.commit();
        JsonObject ret = new JsonObject();
        ret.addProperty("hasError", "false");
        ret.addProperty("newFilterId", newFilterId);
        return (ret.toString());
    }

    private int createNewFilter(SqlSession session, FieldFilterOperator operator, FieldFilter filter) throws MdaAppException {
        /* this function will be called when user click save in job edit interface some some information may
            NOT exits in the json data, so duplicate a new filter first.
         */
        FieldFilter nf;
        if (filter.getFilterId() <=0) {
            throw new MdaAppException("业务维度为空，不保存");
            //create a new filter from begining
//            nf = new FieldFilter();
//            nf.setColId(filter.getColId());
//            nf.setPlace(filter.getPlace());
//            //int connectorId=filter.getOpconnectorid();
//            nf.setParamcount(2);
//
//            nf.setOpsql(filter.getOpsql());
//            nf.setShowoperator1(true);
//            nf.setShowoperator2(true);
//            nf.setShowdescription(false);
        } else {
            //create filter from oldtemplate
            nf = operator.getFilterById(filter.getFilterId());

        }
        nf.setColId(filter.getColId());
        nf.setPlace(filter.getPlace());
        nf.setOp1Id(filter.getOp1Id());
        nf.setOp2Id(filter.getOp2Id());
        nf.setOptitle(filter.getOptitle());
        nf.setDescription(filter.getDescription());
        //int connectorId=filter.getOpconnectorid();
        nf.setOpconnectorid(filter.getOpconnectorid());
        nf.setParam1value(filter.getParam1value());
        nf.setParam2value(filter.getParam2value());
        nf.setOutputtitle(filter.getOutputtitle());
        nf.setResultoperatorid(filter.getResultoperatorid());
        nf.setCreatetime(new Timestamp(System.currentTimeMillis()).toString());
        //create new filter id for new filter
        nf.setParam1style(filter.getParam1style());
        nf.setParam2style(filter.getParam1style());

        int newId = operator.getMaxId() + 1;

        nf.setFilterId(newId);
        // now begin to update the database
        operator.insertFilter(nf);
        String param1Style = nf.getParam1style();
        String param2Style = nf.getParam2style();
        String place = nf.getPlace();
        if (place.compareToIgnoreCase("where") == 0) {
            if (param1Style != null && (param1Style.compareToIgnoreCase("comboselector") == 0 || param1Style.compareToIgnoreCase("multiselector") == 0)) {
                createSelectorCandidate(session,filter,newId,1);
            }
            if (param2Style != null && (param2Style.compareToIgnoreCase("comboselector") == 0 || param2Style.compareToIgnoreCase("multiselector") == 0)) {
                createSelectorCandidate(session,filter,newId,2);
            }
        }else if(place.compareToIgnoreCase("groupby")==0){
            updateLayerInfo(session,filter,newId,true);
        }else if(place.compareToIgnoreCase("result")==0){

        }else if(place.compareToIgnoreCase("orderby")==0){

        }else{

        }
        return (nf.getFilterId());
    }

    private void createSelectorCandidate(SqlSession session,FieldFilter filter,int newFilterId,int paramId){
        SelectorCandidate candidateOperator = session.getMapper(SelectorCandidate.class);
        int maxId = candidateOperator.getMaxId() + 1;
        List<FilterCandidate> list ;
        if(filter.getFilterId()<100){
            list=candidateOperator.getColFilterCandidate(filter.getPlace(), filter.getColId(),filter.getFilterId());
            Iterator<FilterCandidate> it = list.iterator();
            while (it.hasNext()) {
                FilterCandidate candidate = it.next();
                candidate.setCandidateid(maxId++);
                candidate.setFilterId(newFilterId);
                candidate.setColId(filter.getColId());
                candidate.setParamid(paramId);
                candidateOperator.insertCandidate(candidate);
            }
        }else{
            //getSelectorCandidate(@Param("place")String place,@Param("filterId")int filterId,@Param("colId")int colId,@Param("paramId")int paramId);
            list= candidateOperator.getSelectorCandidate(filter.getPlace(),filter.getFilterId(),filter.getColId(),paramId);
            Iterator<FilterCandidate> it = list.iterator();
            while (it.hasNext()) {
                FilterCandidate candidate = it.next();
                candidate.setCandidateid(maxId++);
                candidate.setFilterId(newFilterId);
                candidate.setColId(filter.getColId());
                candidate.setParamid(paramId);
                candidateOperator.insertCandidate(candidate);
            }
        }
    }

//    private int createNewFilter(SqlSession session, FieldFilterOperator operator, FieldFilter filter) {
//
//
//        int newId = operator.getMaxId() + 1;
//        filter.setFilterId(newId);
//        filter.setCreatetime(new Timestamp(System.currentTimeMillis()).toString());
//        //create new filter id for new filter
//        filter.setCreator("userName");
//
//        // now begin to update the database
//        operator.insertFilter(filter);
//        String param1Style = filter.getParam1style();
//        String param2Style = filter.getParam2style();
//        String place = filter.getPlace();
//        if (place.compareToIgnoreCase("where") == 0) {
//            boolean needCandidate = false;
//            if (param1Style != null && (param1Style.compareToIgnoreCase("comboselector") == 0 || param1Style.compareToIgnoreCase("multiselector") == 0)) {
//                needCandidate = true;
//            }
//            if (param2Style != null && (param2Style.compareToIgnoreCase("comboselector") == 0 || param2Style.compareToIgnoreCase("multiselector") == 0)) {
//                needCandidate = true;
//            }
//            if (needCandidate) {
//                //duplicate the filter candidate
//                SelectorCandidate candidateOperator = session.getMapper(SelectorCandidate.class);
//                List<FilterCandidate> list = candidateOperator.getFilterCandidate(filter.getPlace(), filter.getFilterId());
//                Iterator<FilterCandidate> it = list.iterator();
//                int maxId = candidateOperator.getMaxId() + 1;
//                while (it.hasNext()) {
//                    FilterCandidate candidate = it.next();
//                    candidate.setCandidateid(maxId++);
//                    candidate.setFilterId(newId);
//                    candidateOperator.insertCandidate(candidate);
//                }
//                //candidate.duplicateCandidate(filter.getFilterId());
//            }
//        }else if(place.compareToIgnoreCase("groupby")==0){
//            updateLayerInfo(session,filter,newId,true);
//        }else if(place.compareToIgnoreCase("result")==0){
//
//        }else if(place.compareToIgnoreCase("orderby")==0){
//
//        }else{
//
//        }
//        return (filter.getFilterId());
//    }



    private void updateLayerInfo(SqlSession session, FieldFilter filter, int newId, boolean createNew) {
        GroupLayerOperator lop = session.getMapper(GroupLayerOperator.class);
        if(filter.getResultoperatorid()==0){
            lop.deleteByFilterId(filter.getFilterId());
            return; // this is a normal group by field , not a layer field
        }
        ArrayList<GroupLayer> newList = filter.getLayerInfo();
        if (newList == null) {
            lop.deleteByFilterId(filter.getFilterId());
            return;
        }

        int newLayerId = lop.getMaxId();
        Iterator<GroupLayer> it = newList.iterator();
        int[] layerIdArray = new int[newList.size()];
        if(layerIdArray.length==0){
            lop.deleteByFilterId(filter.getFilterId());
            return;
        }
        int idx = 0;
        int colId=filter.getColId();
        while (it.hasNext()) {
            GroupLayer layer = it.next();
            if (layer == null) {
                continue;
            }

            if (createNew) {
                //layer.setFilterId(0);
                layer.setLayerId(0);
            }
            layer.setColId(colId);
            layer.setRuleId(0);
            if (layer.getLayerId() > 0) {
                layer.setFilterId(newId);
                lop.updateLayer(layer);
            } else {
                newLayerId++;
                layer.setLayerId(newLayerId);
                layer.setFilterId(newId);
                lop.insertLayer(layer);
            }
            layerIdArray[idx] = layer.getLayerId();
            idx++;
        }
        if(!createNew) {
            lop.removeOrphanByFilterId(newId, layerIdArray);
        }
    }


    private String duplicateFilterTemplate(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String idStr = request.getParameter("filterId");
        int filterId = -1;
        try {
            filterId = Integer.parseInt(idStr);
        } catch (Exception e) {
            logger.warn("cannot find the filterId parameters,ignore it {}");
            throw new MdaAppException("模板ID号错误");
        }
        String optitle = request.getParameter("optitle");
        String description = request.getParameter("description");
        logger.debug("the new filter opptitle is '{}' and description is '{}'", optitle, description);
        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        FieldFilter filter = operator.getFilterById(filterId);
        int newId = operator.getMaxId() + 1;
        filter.setFilterId(newId);
        filter.setOptitle(optitle);
        filter.setDescription(description);
        operator.insertFilter(filter);

        String place = filter.getPlace();
        if (place.compareToIgnoreCase("where") == 0) {
            SelectorCandidate candiOper = session.getMapper(SelectorCandidate.class);
            List<FilterCandidate> list = candiOper.getByFilterId(filterId);
            Iterator<FilterCandidate> it = list.iterator();
            while (it.hasNext()) {
                FilterCandidate candidate = it.next();
                candidate.setFilterId(newId);
                candidate.setColId(filter.getColId());
                candiOper.addCandidate(candidate);
            }
        } else if (place.compareToIgnoreCase("groupby") == 0) {
            GroupLayerOperator lop=session.getMapper(GroupLayerOperator.class);
            List<GroupLayer> layerList=lop.getByFilterId(filterId);
            ArrayList<GroupLayer> l=new ArrayList<GroupLayer>(layerList);
            filter.setLayerInfo(l);
            updateLayerInfo(session,filter,newId,true);
        } else if (place.compareToIgnoreCase("result") == 0) {

        } else if (place.compareToIgnoreCase("orderby") == 0) {

        } else {

        }
        session.commit();
        JsonObject ret = new JsonObject();
        ret.addProperty("hasError", "false");
        ret.addProperty("newFilterId", newId);
        String retStr = ret.toString();
        logger.debug("the response is {}", retStr);
        return (retStr);
    }








    protected String saveFilterTemplate(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            throw new MdaAppException(e.getMessage()); /*report an error*/
        }
        logger.debug("the json filter data is " + jb.toString());
        Gson gson = new Gson();
        FieldFilterTemplate filter = gson.fromJson(jb.toString(), FieldFilterTemplate.class);
        int newFilterId = -1;
        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        if (filter.isNewFilter()) {
            newFilterId = createNewFilterTemplate(session, operator, filter);
        } else {
            if (filter.getFilterId() < 100) {
                newFilterId = createNewFilterTemplate(session, operator, filter);
            } else {
                updateFilterTemplate(session, operator, filter);
                newFilterId = filter.getFilterId();
            }
        }
        session.commit();
        JsonObject ret = new JsonObject();
        ret.addProperty("hasError", "false");
        ret.addProperty("newFilterId", newFilterId);
        return (ret.toString());
    }

    private int createNewFilterTemplate(SqlSession session, FieldFilterOperator operator, FieldFilterTemplate filter) {
        int oldFilterId = filter.getFilterId();
        int newId = operator.getMaxId() + 1;
        filter.setCreatetime((new Timestamp(System.currentTimeMillis())).toString());
        //filter.setCreator(HttpSesison.getusername());
        filter.setCreator("username");
        filter.setFilterId(newId);
        //@fixed me we should have a better way to setup paramcount
        //filter.setParamcount(2);
        operator.insertFilter(filter);
        String place = filter.getPlace();
        if (place.compareToIgnoreCase("where") == 0) {
            String param1Style = filter.getParam1style();
            String param2Style = filter.getParam2style();
            boolean needCandidate = false;
            if (param1Style != null && (param1Style.compareToIgnoreCase("comboselector") == 0 || param1Style.compareToIgnoreCase("multiselector") == 0)) {
                needCandidate = true;
            }
            if (param2Style != null && (param2Style.compareToIgnoreCase("comboselector") == 0 || param2Style.compareToIgnoreCase("multiselector") == 0)) {
                needCandidate = true;
            }
            if (needCandidate) {
                //duplicate the filter candidate
                //String place = filter.getPlace();
                SelectorCandidate candidateOperator = session.getMapper(SelectorCandidate.class);
                List<FilterCandidate> list = filter.getParam1candidate();
                Iterator<FilterCandidate> it = list.iterator();
                int maxId = candidateOperator.getMaxId() + 1;
                while (it.hasNext()) {
                    FilterCandidate candidate = it.next();
                    candidate.setCandidateid(maxId++);
                    candidate.setFilterId(newId);
                    candidate.setParamid(1);
                    candidate.setPlace(place);
                    candidate.setColId(filter.getColId());
                    candidateOperator.addCandidate(candidate);
                }
                list = filter.getParam2candidate();
                it = list.iterator();
                while (it.hasNext()) {
                    FilterCandidate candidate = it.next();
                    candidate.setCandidateid(maxId++);
                    candidate.setFilterId(newId);
                    candidate.setParamid(2);
                    candidate.setColId(filter.getColId());
                    candidate.setPlace(place);
                    candidateOperator.addCandidate(candidate);
                }
            }
            //candidate.duplicateCandidate(filter.getFilterId());
        }else if(place.compareToIgnoreCase("result")==0){

        }else if(place.compareToIgnoreCase("groupby")==0){
            updateLayerInfo(session, filter, newId, true);
        }else if(place.compareToIgnoreCase("orderby")==0){

        }else{

        }
        return (newId);
    }

    protected int updateFilterTemplate(SqlSession session, FieldFilterOperator operator, FieldFilterTemplate filter) throws ServletException, IOException, MdaAppException {

        int fid = filter.getFilterId();
        filter.setCreatetime((new Timestamp(System.currentTimeMillis())).toString());
        operator.updateFilterTemplate(filter);
        String place=filter.getPlace();
        if(place.compareToIgnoreCase("where")==0) {
            String param1Style = filter.getParam1style();
            String param2Style = filter.getParam2style();
            boolean needCandidate = false;
            if (param1Style != null) {
                if ((param1Style.compareToIgnoreCase("comboselector") == 0 || param1Style.compareToIgnoreCase("multiselector") == 0)) {
                    needCandidate = true;
                }
            }
            if (param2Style != null) {
                if ((param2Style.compareToIgnoreCase("comboselector") == 0 || param2Style.compareToIgnoreCase("multiselector") == 0)) {
                    needCandidate = true;
                }
            }
            if (needCandidate) {
                //duplicate the filter candidate

                SelectorCandidate candidateOperator = session.getMapper(SelectorCandidate.class);
                List<FilterCandidate> list = filter.getParam1candidate();
                Iterator<FilterCandidate> it = list.iterator();
                int maxId = candidateOperator.getMaxId() + 1;
                ArrayList<Integer> idList = new ArrayList<Integer>();
                while (it.hasNext()) {
                    FilterCandidate candidate = it.next();
                    int cid = candidate.getCandidateid();
                    if (cid <= 0) {
                        candidate.setCandidateid(maxId);
                        candidate.setFilterId(fid);
                        candidate.setParamid(1);
                        candidate.setPlace(place);
                        candidate.setColId(filter.getColId());
                        candidateOperator.insertCandidate(candidate);
                        idList.add(new Integer(maxId));
                        maxId++;
                    } else {
                        //candidate.setFilterId(fid);
                        //candidate.setParamid(1);
                        //candidate.setPlace(place);
                        candidate.setColId(filter.getColId());
                        candidateOperator.updateCandidate(candidate);
                        idList.add(new Integer(cid));
                    }
                }
                list = filter.getParam2candidate();
                it = list.iterator();
                while (it.hasNext()) {
                    FilterCandidate candidate = it.next();
                    int cid = candidate.getCandidateid();
                    if (cid <= 0) {
                        candidate.setCandidateid(maxId);
                        candidate.setFilterId(fid);
                        candidate.setParamid(2);
                        candidate.setPlace(place);
                        candidate.setColId(filter.getColId());
                        candidateOperator.insertCandidate(candidate);
                        idList.add(new Integer(maxId));
                        maxId++;
                    } else {
                        //candidate.setFilterId(fid);
                        //candidate.setParamid(1);
                        //candidate.setPlace(place);
                        candidate.setColId(filter.getFilterId());
                        candidateOperator.updateCandidate(candidate);
                        idList.add(new Integer(cid));
                    }
                }
                int len = idList.size();
                int[] array = new int[len];
                for (int i = 0; i < len; i++) {
                    array[i] = idList.get(i).intValue();
                }
                logger.debug("the used candidate id is ", array);
                candidateOperator.removeUnusedCandidate(fid, array);

            }
        }else if(place.compareToIgnoreCase("groupby")==0){
            updateLayerInfo(session, filter, filter.getFilterId(), false);
        }else if(place.compareToIgnoreCase("result")==0){

        }else if(place.compareToIgnoreCase("orderby")==0){

        }
        return (fid);
    }

    protected String deleteFilterTemplate(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String idStr = request.getParameter("filterId");
        int filterId = -1;
        try {
            filterId = Integer.parseInt(idStr);
        } catch (Exception e) {
            logger.warn("cannot find the filterId parameters,ignore it {}");
            throw new MdaAppException("模板ID号错误");
        }
        //delete where select candidate
        SelectorCandidate candidate = session.getMapper(SelectorCandidate.class);
        candidate.deleteByFilterId(filterId);
        //delete filter layer information
        GroupLayerOperator lop=session.getMapper(GroupLayerOperator.class);
        lop.deleteByFilterId(filterId);
        //delete he filter
        FieldFilterOperator operator = session.getMapper(FieldFilterOperator.class);
        operator.deleteFilter(filterId);
        session.commit();
        String ret = JSONResponse.success();
        logger.debug("the response is {}", ret);
        return (ret);
    }


    protected String getLayerData(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
        String idStr = request.getParameter("filterId");
        int filterId = -1;
        try {
            filterId = Integer.parseInt(idStr);
        } catch (Exception e) {
            logger.warn("cannot find the filterId parameters,ignore it {}", idStr);
            throw new MdaAppException("模板ID号错误");
        }
        idStr = request.getParameter("ruleId");
        int ruleId = -1;
        try {
            ruleId = Integer.parseInt(idStr);
        } catch (Exception e) {
            logger.warn("cannot find the filterId parameters,ignore it {}", idStr);
            throw new MdaAppException("SQL rule ID号错误");
        }
        GroupLayerOperator lop = session.getMapper(GroupLayerOperator.class);
        List<GroupLayer> list;
        if (ruleId == 0) {
            list = lop.getByFilterId(filterId);
        } else {
            list = lop.getByRuleId(ruleId);
        }
        Gson g = new Gson();
        String ret = g.toJson(list);
        logger.debug("the response is {}", ret);
        return (ret);
    }
}