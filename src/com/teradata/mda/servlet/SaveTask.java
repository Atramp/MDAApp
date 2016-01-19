package com.teradata.mda.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.teradata.mda.dao.GroupLayerOperator;
import com.teradata.mda.dao.JobOperator;
import com.teradata.mda.dao.RuleOperator;
import com.teradata.mda.model.*;
import com.teradata.mda.sql.CreateSQL;
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
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * Created by YS186019 on 2015/10/16.
 */
@WebServlet(name = "SaveTask")
public class SaveTask extends BaseServlet {
    Logger logger = LoggerFactory.getLogger(SaveTask.class);

    int maxRuleId;

/*
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doService(request, response);
    }
*/


    protected synchronized String doService(SqlSession session, String keyMethod, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, MdaAppException {
//        response.setCharacterEncoding("UTF-8");
//        ServletContext context = request.getSession().getServletContext();

        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) { /*report an error*/ }
        Map<String, Integer> compRuleId = new HashMap<String, Integer>();
        int jobId = -1;
        logger.debug("the Task json  data is " + jb.toString());
        HashMap<String, Integer> keyMap = new HashMap<String, Integer>();
        //SqlSession session = null;
        //SqlSessionFactory factory = (SqlSessionFactory) context.getAttribute("MDACONNECTIONS");
        Gson gson = new Gson();
        TaskInfo info = gson.fromJson(jb.toString(), TaskInfo.class);
        //session = factory.openSession();
        if (info.getJobid() < 0) {
            // user requires to create a new job
            jobId = addJob(session, info);
            info.setJobid(jobId);
            RuleOperator rop = session.getMapper(RuleOperator.class);
            maxRuleId = rop.getMaxRuleId();
            //addRules(session,newJobId,"where",info);
            SQLRule rules = info.getResult();
            insertRules(rop, jobId, "result", rules, keyMap, session);
            rules = info.getWhere();
            insertRules(rop, jobId, "where", rules, keyMap, session);
            rules = info.getGroupby();
            insertRules(rop, jobId, "groupby", rules, keyMap, session);
            rules = info.getOrderby();
            insertRules(rop, jobId, "orderby", rules, keyMap, session);
            String sql = createSQL(jobId, session);
            JobOperator jop = session.getMapper(JobOperator.class);
            jop.updateSqlStatement(jobId, sql);

        } else {
            //user requires to update an exists job
            jobId = info.getJobid();
            if (!updateJob(session, jobId, info)) {
                session.rollback();
                throw new MdaAppException("不能修改正在运行的分析任务");
                //response.getWriter().write(JSONResponse.getErrorResponse("不能修改正在运行的分析任务"));
                //return;
            }
            ;
            RuleOperator rop = session.getMapper(RuleOperator.class);
            maxRuleId = rop.getMaxRuleId();

            SQLRule rules = info.getResult();
            editRules(rop, jobId, "result", rules, keyMap, session);
            rules = info.getWhere();
            editRules(rop, jobId, "where", rules, keyMap, session);
            rules = info.getGroupby();
            editRules(rop, jobId, "groupby", rules, keyMap, session);
            rules = info.getOrderby();
            editRules(rop, jobId, "orderby", rules, keyMap, session);
            // now delete from the job rule which rule id doesn't belong to the new job
            //deleteUnusedRule(rop,jobId,keyMap);
            //here we need to fix, we need to get the rule to be delete and delete related data form grouplayer

            deleteUnusedRule(session,rop, jobId, keyMap); // here place not we need to delete the layer information
            String sql = createSQL(jobId, session);
            JobOperator jop = session.getMapper(JobOperator.class);
            jop.updateSqlStatement(jobId, sql);
        }
        session.commit();
        //session.rollback();
        JsonObject ret = new JsonObject();
        ret.addProperty("hasError", "false");
        ret.addProperty("jobId", jobId);
        ret.addProperty("jobName", info.getJobname());
        ret.addProperty("jobDescription", info.getDescription());
        JsonArray array = new JsonArray();
        Iterator<String> it = keyMap.keySet().iterator();
        while (it.hasNext()) {
            JsonObject obj = new JsonObject();
            String key = it.next();
            obj.addProperty("componentId", key);
            int value = keyMap.get(key).intValue();
            obj.addProperty("ruleId", value);
            array.add(obj);
        }
        ret.add("keyMap", array);
        String retstr = gson.toJson(ret);
        logger.debug("the response is {}", retstr);
        //response.getWriter().write(retstr);
        return (retstr);


    }

    //rop, jobId, "orderby", rules, keyMap
    private void editRules(RuleOperator rop, int jobId, String place, SQLRule rules, HashMap<String, Integer> keyMap, SqlSession session) {
        //first pass we get all the componentID and ruleID map from the json data
        // and at the same time ,we update the rules that still exist

        ArrayList<JobRule> fields = rules.getField();
        if (fields == null || fields.size() == 0) {
            return;
        }
        for (int i = 0, len = fields.size(); i < len; i++) {
            JobRule rule = fields.get(i);
            int ruleId = rule.getRuleId();
            if (rules.isdistinct()) {
                rule.setIsdistinct(1);
            } else {
                rule.setIsdistinct(0);
            }
            if (ruleId > 0) {
                keyMap.put(rule.getComponentid(), ruleId);
                rop.updateRule(rule);
                if (rule.getPlace().compareToIgnoreCase("groupby") == 0) {
                    updateGroupLayer(session, rule, false);
                }
            } else {
                rule.setJobid(jobId);
                maxRuleId++;
                rule.setRuleId(maxRuleId);
                rop.insertRule(rule);
                if (rule.getPlace().compareToIgnoreCase("groupby") == 0) {
                    updateGroupLayer(session, rule, true);
                }
                keyMap.put(rule.getComponentid(), maxRuleId);
            }
        }
        ArrayList<Connector> connectors = rules.getFieldRelation();
        if (connectors == null || connectors.size() == 0) {
            return;
        }

        // now begin to save all the connector data
        // first we add all connectors to a map for future use  to -1
        Map<String, Connector> connectorMap = new HashMap<String, Connector>();
        for (int i = 0, len = connectors.size(); i < len; i++) {
            Connector connector = connectors.get(i);
            connectorMap.put(connector.getId(), connector);
        }
        //second we check all submited connectors, if anyone of them already has a
        //rule id , that means it was not changed.
        for (int i = 0, len = connectors.size(); i < len; i++) {
            Connector connector = connectors.get(i);
            int ruleId = connector.getRuleId();
            if (ruleId > 0) {
                // the connector does not support edit, so if the ruleId still exists
                // it means that connector was not changed
                keyMap.put(connector.getId(), ruleId);
            } else {
                // add new connector to database and update the map
                keyMap.put(connector.getId(), getConnectorId(jobId, place, connector.getId(), rop, connectorMap, keyMap));
            }
        }

    }


    private int addJob(SqlSession session, TaskInfo info) {
        MdaJob job = new MdaJob();
        SimpleDateFormat formater = new SimpleDateFormat("YYYY-mm-dd HH:MM:SS");
        JobOperator operator = session.getMapper(JobOperator.class);
        int maxId = operator.getMaxJobId() + 1;
        job.setJobid(maxId);
        job.setJobname(info.getJobname());
        job.setDescription(info.getDescription());
        job.setCreatetime((new Timestamp(System.currentTimeMillis())).toString());
        //job.setCreatetime(tmp);
        //job.setPreviousfinished(tmp);
        job.setCreatorname("userName");
        job.setCurrentstatus("W");
        job.setSqlstatement("");
        //job.setJsonstr("");
        operator.insertJob(job);
        //Connection conn=session.getConnection();
        //QueryRunner runner=new QueryRunner();
        //runner.update(conn,"insert into mdaapp.mdajob ( jobid,jobname,description,creatorname,createtime,previousfinished) values ( ?,?,?,?,?,?)",
        // maxId,info.getJobName(),info.getDescription(),"userName",tmp,tmp);
        //session.insert("com.mda.dao.JobOperator.insertJob", 3);
        return (maxId);
    }

    private String createSQL(int jobId, SqlSession session) throws MdaAppException{
        CreateSQL creator = new CreateSQL(session);
        String sql = creator.createSql(jobId);
        return (sql);
    }


    private boolean updateJob(SqlSession session, int jobId, TaskInfo info) {
        JobOperator operator = session.getMapper(JobOperator.class);
        //int maxId=operator.getMaxJobId()+1;
        MdaJob job = operator.getJobByID(jobId);
        String currentStatus = job.getCurrentstatus();
        if (!(currentStatus == null || currentStatus.isEmpty() || currentStatus.compareToIgnoreCase("W") == 0)) {
            //we can not edit a job which is currently running
            return (false);
        }
        job.setJobname(info.getJobname());
        job.setDescription(info.getDescription());
        job.setCreatetime((new Timestamp(System.currentTimeMillis())).toString());
        job.setCreatorname("userName");
        operator.updateJob(job);
        //Connection conn=session.getConnection();
        //QueryRunner runner=new QueryRunner();
        //runner.update(conn,"insert into mdaapp.mdajob ( jobid,jobname,description,creatorname,createtime,previousfinished) values ( ?,?,?,?,?,?)",
        // maxId,info.getJobName(),info.getDescription(),"userName",tmp,tmp);
        //session.insert("com.mda.dao.JobOperator.insertJob", 3);
        return (true);
    }

//    private void insertGroupLayer(SqlSession session, ArrayList<GroupLayer> layerList, int ruleId) {
//        GroupLayerOperator op = session.getMapper(GroupLayerOperator.class);
//        int layerId = op.getMaxId();
//        Iterator<GroupLayer> it = layerList.iterator();
//        while (it.hasNext()) {
//            GroupLayer layer = it.next();
//            if (layer == null) {
//                continue;
//            }
//            layerId++;
//            layer.setLayerId(layerId);
//            layer.setRuleId(ruleId);
//            op.insertLayer(layer);
//        }
//    }

    private void updateGroupLayer(SqlSession session,JobRule rule, boolean createNew) {
        ArrayList<GroupLayer> layerList=rule.getLayerInfo();
        GroupLayerOperator op = session.getMapper(GroupLayerOperator.class);
        int ruleId=rule.getRuleId();
        //op.deleteByRuleId(ruleId);
        if(layerList==null || layerList.size()==0){
            op.deleteByRuleId(ruleId);
            return;
        }
        int [] layerIdArray=new int[layerList.size()];
        int newLayerId = op.getMaxId();
        int colId=rule.getColId();
        Iterator<GroupLayer> it = layerList.iterator();
        int idx=0;
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
            layer.setFilterId(rule.getFilterId());
            if (layer.getLayerId() > 0) {
                layer.setRuleId(ruleId);

                op.updateLayer(layer);
            } else {
                newLayerId++;
                layer.setLayerId(newLayerId);
                layer.setRuleId(ruleId);
                op.insertLayer(layer);
            }
            layerIdArray[idx] = layer.getLayerId();
            idx++;
        }
        if(!createNew && idx>0) {
            op.removeOrphanByRuleId(ruleId, layerIdArray);
        }

    }




    private void insertRules(RuleOperator rop, int jobId, String place, SQLRule rules, HashMap<String, Integer> keyMap, SqlSession session) {
        ArrayList<JobRule> fields = rules.getField();
        if (fields == null || fields.size() == 0) {
            return;
        }
        // add all field information to database
        int len = fields.size();
        for (int i = 0; i < len; i++) {
            JobRule rule = fields.get(i);
            String compId = rule.getComponentid();
            rule.setJobid(jobId);
            if (rules.isdistinct()) {
                rule.setIsdistinct(1);
            } else {
                rule.setIsdistinct(0);
            }
            rule.setPlace(place);
            maxRuleId++;
            rule.setRuleId(maxRuleId);
            keyMap.put(compId, new Integer(maxRuleId));
            rop.insertRule(rule);
            if (rule.getPlace().compareToIgnoreCase("groupby") == 0) {
                updateGroupLayer(session, rule, true);
            }
        }
        // insert all connectors
        ArrayList<Connector> connectors = rules.getFieldRelation();
        if (connectors == null || connectors.size() == 0) {
            return;
        }
        // now begin to save all the connector data
        // first we initialize all the connector keymap  to -1

        Map<String, Connector> connectorMap = new HashMap<String, Connector>();
        len = connectors.size();
        for (int i = 0; i < len; i++) {
            Connector connector = connectors.get(i);
            connectorMap.put(connector.getId(), connector);
        }
        for (int i = 0; i < len; i++) {
            Connector connector = connectors.get(i);
            String connId = connector.getId();
            Integer ruleId = keyMap.get(connId);
            String relation = connector.getRelation();
            if (ruleId == null || ruleId.intValue() <= 0) {
                // new connector,add it to database
                keyMap.put(connId, new Integer(getConnectorId(jobId, place, connId, rop, connectorMap, keyMap)));
            } else {
                continue;
            }
        }


    }





/*        // now begin to save all the connector data
        // first we initialize all the connector keymap  to -1

        Map<String,Connector> connMap
        len = connectors.size();
        for (int i = 0; i < len; i++) {
            Connector connector = connectors.get(i);
            connMap.put(connector.getId(), new Integer(-1));
        }

        // now begin to browse all connector map
        while (true) {
            boolean allSaved = true;
            for (int i = 0; i < len; i++) {
                Connector connector = connectors.get(i);
                String connId = connector.getId();
                int ruleId = connMap.get(connId).intValue();
                if (ruleId > 0) {
                    // this connector has been saved, so it already have a rule ID
                    continue;
                }
                boolean allKeyFound = true;
                String children = connector.getChildren();
                String[] child = children.split(",");
                for (int j = 0; j < child.length; j++) {
                    child[j] = child[j].trim();
                    if (keymap.containsKey(child[j])) {
                        int fieldRuleId = keymap.get(child[j].trim());
                        child[j] = "fieldRuleId-" + fieldRuleId;
                        continue;
                    }
                    if (connMap.containsKey(child[j])) {
                        ruleId = connMap.get(child[j]).intValue();
                        if (ruleId > 0) {
                            // this connector has been saved, so it already have a rule ID
                            child[j] = "ConnectorRuleId-" + ruleId;
                            continue;
                        }
                    }
                    allKeyFound = false;
                    break;
                }
                if (allKeyFound) {
                    //all request all has been saved, we can update this rule to database
                    StringBuilder sb = new StringBuilder("");
                    for (int j = 0; j < child.length; j++) {
                        sb.append(child[j]).append(',');
                    }
                    children = sb.substring(0, sb.length() - 1);
                    JobRule rule = new JobRule();
                    maxId++;
                    rule.setRuleId(maxId);
                    rule.setJobid(newJobId);
                    rule.setFilterId(-1);
                    rule.setColId(-1);
                    rule.setPlace(place + "Connector");
                    rule.setParam1value(children);
                    rule.setParam2value(connector.getRelation());
                    rop.insertRule(rule);
                    connMap.put(connId, new Integer(maxId));
                } else {
                    allSaved = false;
                }
            }
            if (allSaved) {
                break;
            }
        }*/


    private int getConnectorId(int jobId, String place, String connId,
                               RuleOperator rop, Map<String, Connector> connectorMap, Map<String, Integer> keyMap) {
        Integer cid = keyMap.get(connId);
        int connectorId;
        if (cid == null) {
            connectorId = -1;
        } else {
            connectorId = cid.intValue();
        }
        if (connectorId > 0) {
            return (connectorId);
        }
        Connector conn = connectorMap.get(connId);
        String children = conn.getChildren();
        String[] child = children.split(",");
        for (int j = 0; j < child.length; j++) {
            child[j] = child[j].trim();
            if (keyMap.containsKey(child[j])) {
                int fieldRuleId = keyMap.get(child[j].trim());
                child[j] = Integer.toString(fieldRuleId);
                continue;
            } else {
                // this child does not contain field only
                child[j] = Integer.toString(getConnectorId(jobId, place, child[j], rop, connectorMap, keyMap));
            }
        }
        // now all child has already has a rule id , add it to database;
        StringBuilder sb = new StringBuilder("");
        for (int j = 0; j < child.length; j++) {
            sb.append(child[j]).append(',');
        }
        children = sb.substring(0, sb.length() - 1);
        JobRule rule = new JobRule();
        maxRuleId++;
        rule.setRuleId(maxRuleId);
        rule.setJobid(jobId);
        rule.setFilterId(-1);
        rule.setColId(-1);
        rule.setPlace(place + "Connector");
        rule.setParam1value(children);
        rule.setParam2value(conn.getRelation());
        rop.insertRule(rule);
        keyMap.put(connId, new Integer(maxRuleId));
        return (maxRuleId);
    }

    private void deleteUnusedRule(SqlSession session,RuleOperator rop, int jobId, HashMap<String, Integer> keyMap) {
        Set<String> set = keyMap.keySet();
        List<JobRule> orphan;
        if (set.size() == 0) {
            orphan=rop.getRulesByJobId(jobId);

            rop.deleteByJobId(jobId);
        } else {
            orphan=rop.getOrphanRule(jobId,keyMap);
            rop.deleteUnusedRule(jobId, keyMap);
        }
        if(orphan!=null) {
            GroupLayerOperator lop = session.getMapper(GroupLayerOperator.class);
            Iterator<JobRule> it = orphan.iterator();
            while(it.hasNext()){
                JobRule rule=it.next();
                int ruleId=rule.getRuleId();
                lop.deleteByRuleId(ruleId);
            }
        }
    }
}


