package com.teradata.mda.sql;

import com.teradata.mda.dao.AvailableOperation;
import com.teradata.mda.dao.ColInfoOperator;
import com.teradata.mda.dao.GroupLayerOperator;
import com.teradata.mda.dao.RuleOperator;
import com.teradata.mda.model.*;
import com.teradata.mda.util.MdaAppException;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import java.io.Reader;
import java.sql.SQLException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by YS186019 on 2015/10/27.
 */
public class CreateSQL {
    Logger logger = LoggerFactory.getLogger(CreateSQL.class);

    ServletContext context;
    HashMap<Integer, CommonOperation> operationCache;
    HashMap<Integer, RuleFilter> ruleCache;
    HashMap<Integer, FieldFilter> filterCache;
    HashMap<Integer, ColumnInfo> fieldCache;
    HashMap<Integer, String> havingMap;
    HashMap<Integer, String> whereMap;
    HashMap<Integer, String> autoGroupMap;
    MdaJob jobInfo;
    //SqlSessionFactory factory;
    SqlSession session;
    private boolean isDistinct = false;
    private boolean useHaving = false;
    private boolean calculateResult = false;
    StringBuilder resultStr = new StringBuilder("");
    StringBuilder whereStr = new StringBuilder("");
    StringBuilder groupByStr = new StringBuilder("");
    StringBuilder orderbyStr = new StringBuilder("");
    StringBuilder havingStr = new StringBuilder("");

    HashMap<String,String> tableNameMap;
    int tableIndex;
    HashMap<String,String> layerNameMap;
    int layerIndex;

    //public CreateSQL(ServletContext context){
    public CreateSQL(SqlSession session) {
        operationCache = new HashMap<Integer, CommonOperation>();
        ruleCache = new HashMap<Integer, RuleFilter>();
        filterCache = new HashMap<Integer, FieldFilter>();
        fieldCache = new HashMap<Integer, ColumnInfo>();
        autoGroupMap = new HashMap<Integer, String>();
        tableNameMap=new HashMap<String,String>();
        tableIndex=1;
        layerNameMap=new HashMap<String,String>();
        layerIndex=1;
        //this.context=context;
        //this.factory=(SqlSessionFactory)context.getAttribute("MDACONNECTIONS");
        //this.factory = factory;
        this.session = session;
        havingMap = new HashMap<Integer, String>();
        whereMap = new HashMap<Integer, String>();
    }

    public String createSql(int jobId) throws MdaAppException{
        //SqlSession session = null;
        useHaving = false;
        isDistinct = false;
        calculateResult = false;
        String tableName = "";
        try {
            //session = factory.openSession();
            //create all necessary cache to reduce the database access;
            AvailableOperation opDao = session.getMapper(AvailableOperation.class);
            List<CommonOperation> oplist = opDao.getAllOperation();
            Iterator<CommonOperation> it = oplist.iterator();
            while (it.hasNext()) {
                CommonOperation op = it.next();
                operationCache.put(new Integer(op.getOperationid()), op);
            }
            RuleOperator operator = session.getMapper(RuleOperator.class);
            List<RuleFilter> rulelist = operator.getRuleFilterByJobId(jobId);
            Iterator<RuleFilter> rit = rulelist.iterator();
            while (rit.hasNext()) {
                RuleFilter rule = rit.next();
                ruleCache.put(new Integer(rule.getRuleId()), rule);
            }
            ColInfoOperator cop = session.getMapper(ColInfoOperator.class);
            List<ColumnInfo> colList = cop.getColumnsByJobId(jobId);
            Iterator<ColumnInfo> cit = colList.iterator();
            while (cit.hasNext()) {
                ColumnInfo cinf = cit.next();
                fieldCache.put(new Integer(cinf.getColId()), cinf);
                tableName = cinf.getDbname()+"."+cinf.getTablename();
            }
            // now begin to process the rule list to create sql
            rit = rulelist.iterator();
            while (rit.hasNext()) {
                RuleFilter filter = rit.next();
                // check the rule to test if it is illegal, for example, it is forbidden for detail output
                checkRules(filter);
                // if no exception while check the rule, continue to execute
                if (filter.getPlace().compareToIgnoreCase("where") == 0) {
                    String where = createWhereElement(filter);
                    whereMap.put(filter.getRuleId(), where);
                } else if (filter.getPlace().compareToIgnoreCase("result") == 0) {
                    String result = createResult(filter);
                    if (!result.isEmpty()) {
                        //resultStr. = '\t' + resultStr + result + ",\n ";
                        resultStr.append('\t').append(result).append(", \n");
                    }
                } else if (filter.getPlace().compareToIgnoreCase("groupby") == 0) {
                    String group = createGroupBy(filter);
                    if (!group.isEmpty()) {
                        //groupByStr=groupByStr+group+", ";
                        groupByStr.append("\t").append(group).append(", \n");
                    }
                } else if (filter.getPlace().compareToIgnoreCase("orderby") == 0) {
                    String order = createOrderby(filter);
                    if (!order.isEmpty()) {
                        //orderbyStr=orderbyStr+order+", ";
                        orderbyStr.append('\t').append(order).append(", \n");
                    }
                } else if (filter.getPlace().compareToIgnoreCase("whereconnector") == 0) {

                } else if (filter.getPlace().compareToIgnoreCase("resultconnector") == 0) {

                }
            }
            //remove the exta comma and space
            int len = resultStr.length();
            if (len > 3) {
                resultStr = resultStr.delete(len - 3, len);
            }
            len = orderbyStr.length();
            if (len > 3) {
                orderbyStr.delete(len - 3, len);
            }
            if (calculateResult) {
                addAutoGroupby(rulelist);
            } else {
                groupByStr = new StringBuilder("");
/*                if (!groupByStr.isEmpty()) {
                    int len=groupByStr.length();
                    if(len>2){
                        groupByStr = groupByStr.substring(0, len - 2);
                    }
                }*/
            }
            havingStr.append(createHaving(rulelist));
            whereStr.append(createWhere(rulelist));
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null) {
                session.rollback();
            }
            throw new MdaAppException(e.getMessage());
        } /*finally {
            if (session != null) {
                session.close();
            }
        }*/
        logger.debug("result: {}", resultStr);
        logger.debug("having: {}", havingStr);
        logger.debug("where: {}", whereStr);
        logger.debug("orderby: {}", orderbyStr);
        logger.debug("groupby: {}", groupByStr);
        StringBuilder sql = new StringBuilder(" SELECT ");
        if (isDistinct) {
            sql.append(" DISTINCT ");
        }
        if (resultStr.length() != 0) {
            sql.append("\n").append(resultStr).append('\n');
        }
        sql.append(" FROM \n\t").append(tableName).append(" t1 ").append("\n ");
        if (whereStr.length() != 0) {
            sql.append(" where \n").append(whereStr).append(" ");
        }
        if (groupByStr.length() != 0) {
            sql.append(" group by \n").append(groupByStr).append("\n ");
        }
        if (havingStr.length() != 0) {
            sql.append(" having \n").append(havingStr).append(" ");
        }
        if (orderbyStr.length() != 0) {
            sql.append(" order by \n").append(orderbyStr);
        }
        String ret = sql.toString();
        logger.debug("the created sql is: {}", ret);
        return (ret);
    }

    private String createResult(RuleFilter rule) {
        String ret = "";
        if (rule.getIsdistinct() == 1) {
            this.isDistinct = true;
        }
        if (rule.getResultoperatorid() > 0) {
            calculateResult = true;
        }
        // get the full quliafy the field name
        int colId = rule.getColId();
        String fullName = getColumnName(colId);
        int filterId = rule.getFilterId();

        String outputTemplate = "";
        String havingTemplate = "";
        if (filterId >= 100) {
            // use a user defined special
            String sqlTemplate = rule.getOpsql();
            if (sqlTemplate == null || sqlTemplate.isEmpty()) {
                //if user does not assign a special sql template for this object, we just use full name as template
                //outputTemplate = fullName;
                int resultId = rule.getResultoperatorid();
                if (resultId <= 0) {
                    outputTemplate = fullName;
                } else {
                    CommonOperation operation = operationCache.get(new Integer(resultId));
                    outputTemplate = operation.getSqltemplate();
                }
            }else{
                outputTemplate=sqlTemplate;
            }
            havingTemplate=rule.getExtraSql();
            if(havingTemplate==null || havingTemplate.isEmpty()){
                havingTemplate=createCommonSQLTemplate(rule);
            }
        } else if (filterId == 2) {
            // this rule will use just result comparison
            int resultId = rule.getResultoperatorid();
            if (resultId == 0) {
                outputTemplate = fullName;
            } else {
                CommonOperation operation = operationCache.get(new Integer(resultId));
                outputTemplate = operation.getSqltemplate();
                // add default comparison rules to the SQL template
                havingTemplate = createCommonSQLTemplate(rule);
            }
        } else {
            int resultId = rule.getResultoperatorid();
            if (resultId <= 0) {
                outputTemplate = fullName;
            } else {
                CommonOperation operation = operationCache.get(new Integer(resultId));
                outputTemplate = operation.getSqltemplate();
            }
            havingTemplate = "";
        }

        String output = doReplace(outputTemplate, fullName, rule).trim();
        if (output.startsWith("(") && output.endsWith(")")) {
            output = output.substring(2, output.length() - 1);
        }
        output = ' ' + output + ' ';
        String title = rule.getOutputtitle();

        //create a having filter first before we create AS
        String hStr = "";
        havingTemplate=havingTemplate.trim();
        if (!havingTemplate.isEmpty()) {
            if (title != null && !title.isEmpty()) {
                //hStr = createRuleHaving(havingTemplate, title, rule);
                //hStr = doReplace(havingTemplate, title, rule);
                hStr = doReplace(havingTemplate, output, rule);
            } else {
                hStr = doReplace(havingTemplate, output, rule);
            }
            hStr=hStr.trim();
            if (!hStr.isEmpty()) {
                havingMap.put(rule.getRuleId(), hStr);
            }
        }
//        if (title != null && !title.isEmpty()) {
//            output = output + " AS " + title;
//        }
        if (title != null && !title.isEmpty()) {
            output = output + " AS \"" + title +"\" ";
        }
        return (output); // the return value is useless;
    }

    private String getColumnName(int colId) {
        String tableName = "";
        String columnName = "";
        if (colId <= 0) {
            //how come?
            return ("");  // skip this column
        } else {
            ColumnInfo info = fieldCache.get(new Integer(colId));
            tableName = info.getTablename();
            columnName = info.getColname();
        }
        return ("t1." + columnName); //get full name end
    }

    ;


    private String createCommonSQLTemplate(RuleFilter rule) {
        String part1 = "";
        String partConn = "";
        String part2 = "";
        int op1Id = rule.getOp1Id();
        String value = rule.getParam1value();
        boolean isEmpty = (value == null || value.isEmpty());
        CommonOperation op = null;
        if (op1Id <= 0 && isEmpty) {
            // no operation 1 will be created
        } else if (op1Id > 0) {
            op = operationCache.get(new Integer(op1Id));
            //part1 = op.getSqltemplate();
            part1 = createSectionTemplate(op,rule,1);
            if (!isEmpty) {
                part1 = part1.replaceAll("\\$PARAM1", value);
            }
        } else if (op1Id <= 0 && !isEmpty) {
            part1 = " $OPERATOR1 " + value;
        }
        int connId = rule.getOpconnectorid();
        if (connId > 0) {
            op = operationCache.get(new Integer(connId));
            partConn = op.getSqltemplate();
        }
        int op2Id = rule.getOp2Id();
        value = rule.getParam2value();
        isEmpty = (value == null || value.isEmpty());
        if (op2Id <= 0 && isEmpty) {
            // no operation 1 will be created
        } else if (op2Id > 0) {
            op = operationCache.get(new Integer(op2Id));
            //part2 = op.getSqltemplate();
            part2=createSectionTemplate(op,rule,2);
            part2 = part2.replaceAll("\\$PARAM1", "\\$PARAM2");
            if (!isEmpty) {
                part2 = part2.replaceAll("\\$PARAM2", value);
            }
        } else if (op2Id <= 0 && !isEmpty) {
            part2 = " $OPERATOR2 " + value;
        }
        return (part1 + ' ' + partConn + ' ' + part2);
    }

    private void addAutoGroupby(List<RuleFilter> list) {
        StringBuilder aggregated = new StringBuilder("");
        Iterator<RuleFilter> it = list.iterator();
        //first we add the field in result section which is not aggregated to groupby cause
        while (it.hasNext()) {
            RuleFilter rule = it.next();
            if (rule.getPlace().compareToIgnoreCase("result") != 0) {
                continue;
            }
            String colName = getColumnName(rule.getColId());
            if (colName.isEmpty()) {
                continue;
            }
            String sqlTemplate=rule.getOpsql();
            if (rule.getResultoperatorid() > 0) {
                aggregated.append(colName).append(',');
                continue;
            }
            if( sqlTemplate !=null && (!(sqlTemplate.trim().isEmpty()))){
                //Pattern p=Pattern.compile("\\bcount|\\bmax|\\bmaximum\\baverage|\\bave|\\bavg|\\bmin|\\bminimum\\bsum",Pattern.CASE_INSENSITIVE);
                //Matcher m=p.matcher(sqlTemplate);
                //if(m.matches()){
                Pattern p=Pattern.compile("\\bcount\\b|\\bmax\\b|\\bmaximum\\b|\\baverage\\b|\\bave\\b|\\bavg\\b|\\bmin\\b|\\bminimum\\b|\\bsum\\b",Pattern.CASE_INSENSITIVE);
                Matcher m=p.matcher(sqlTemplate);
                if(m.find()){
                    aggregated.append(colName).append(',');
                    continue;
                }
            }
            groupByStr.append("\t").append(colName).append(",\n ");
//            else  {
//
//            }else  {
//                if (rule.getResultoperatorid() > 0) {
//                    aggregated.append(colName).append(',');
//                } else {
//                    groupByStr.append("\t").append(colName).append(",\n ");
//                }
//            }else{
//                // if sqltemplate contains some calculation such as count, max, but the resultoperatorid is 0
//                // we will not add the column to group by section.
//            }
        }
        // now begin to process the order by section, for any un-aggregated filed, add to
        //group by clause
        it = list.iterator();
        //first we add the field in result section which is not aggregated to groupby cause
        while (it.hasNext()) {
            RuleFilter rule = it.next();
            if (rule.getPlace().compareToIgnoreCase("orderby") != 0) {
                continue;
            }
            String colName = getColumnName(rule.getColId());
            if (colName.isEmpty()) {
                continue;
            }
            if (groupByStr.indexOf(colName) >= 0 || aggregated.indexOf(colName) >= 0) {
                continue;
            } else {
                groupByStr.append('\t').append(colName).append(",\n ");
            }
        }
        int len = groupByStr.length();
        if (len >= 3) {
            groupByStr.delete(len - 3, len);
        }
        //groupByStr=.toString();
    }

    private String createHaving(List<RuleFilter> list) {
        logger.debug("begin to create having ");
        StringBuilder ret = new StringBuilder("");
        if (havingMap.size() == 0) {
            return ("");
        }
        Set<Map.Entry<Integer, String>> entrys = havingMap.entrySet();
        Iterator<Map.Entry<Integer, String>> tit = entrys.iterator();
        while (tit.hasNext()) {
            Map.Entry<Integer, String> entry = tit.next();
            logger.debug("the having map key {} value {}", entry.getKey(), entry.getValue());
        }
        boolean continueLoop = true;
        while (continueLoop) {
            continueLoop = false;
            Iterator<RuleFilter> rit = list.iterator();
            while (rit.hasNext()) {
                RuleFilter rule = rit.next();
                if (rule.getPlace().compareToIgnoreCase("resultconnector") != 0) {
                    continue;
                }
                if (rule.isProcessed()) {
                    continue;
                }
                String param1 = rule.getParam1value();
                String param2 = rule.getParam2value();
                String[] strs = param1.split(",");
                StringBuilder having = new StringBuilder("");
                boolean relatedToOther = false;
                for (int i = 0; i < strs.length; i++) {
                    String tmp = havingMap.get(new Integer(strs[i]));
                    if (tmp == null) {
                        relatedToOther = true;
                        break;
                    } else {
                        having.append("\t (").append(tmp).append(") ").append(param2).append("\n ");
                    }
                }
                if (relatedToOther) {
                    continueLoop = true;
                    continue;
                }
                int extralen = param2.length() + 2;
                int len = having.length();
                having = having.delete(len - extralen, len);
                //add new creaeted having to having Map
                havingMap.put(rule.getRuleId(), having.toString());
                for (int i = 0; i < strs.length; i++) {
                    //remove all process certification from having map
                    havingMap.remove(new Integer(strs[i]));
                }
                rule.setProcessed(true);
            }
        }
        Collection<String> set = havingMap.values();
        Iterator<String> it = set.iterator();
        while (it.hasNext()) {
            ret.append("\t (").append(it.next()).append(") \n and");
        }
        int len = ret.length();
        ret.delete(len - 4, len);
        return (ret.toString());
    }


    private String createWhere(List<RuleFilter> list) {
        logger.debug("begin to create where");
        StringBuilder ret = new StringBuilder("");
        if (whereMap.size() == 0) {
            return ("");
        }

        Set<Map.Entry<Integer, String>> entrys = whereMap.entrySet();
        Iterator<Map.Entry<Integer, String>> it = entrys.iterator();
        while (it.hasNext()) {
            Map.Entry<Integer, String> entry = it.next();
            logger.debug("the having map key {} value {}", entry.getKey(), entry.getValue());
        }
        boolean continueLoop = true;
        while (continueLoop) {
            continueLoop = false;
            Iterator<RuleFilter> wit = list.iterator();
            while (wit.hasNext()) {
                RuleFilter rule = wit.next();
                if (rule.getPlace().compareToIgnoreCase("whereconnector") != 0) {
                    continue;
                }
                if (rule.isProcessed()) {
                    continue;
                }
                String param1 = rule.getParam1value();
                String param2 = rule.getParam2value();
                String[] strs = param1.split(",");
                StringBuilder whereBuilder = new StringBuilder("");
                boolean relatedToOther = false;
                for (int i = 0; i < strs.length; i++) {
                    String tmp = whereMap.get(new Integer(strs[i]));
                    if (tmp == null) {
                        relatedToOther = true;
                        break;
                    } else {
                        whereBuilder.append("\t (").append(tmp).append(") ").append(param2).append("\n ");
                    }
                }
                if (relatedToOther) {
                    continueLoop = true;
                    continue;
                }
                int extralen = param2.length() + 2;
                int len = whereBuilder.length();
                whereBuilder = whereBuilder.delete(len - extralen, len);
                //add new creaeted having to having Map
                whereMap.put(rule.getRuleId(), whereBuilder.toString());
                for (int i = 0; i < strs.length; i++) {
                    //remove all process certification from having map
                    whereMap.remove(new Integer(strs[i]));
                }
                rule.setProcessed(true);
            }
        }
        Collection<String> set = whereMap.values();
        Iterator<String> rit = set.iterator();
        while (rit.hasNext()) {
            ret.append("\t (").append(rit.next()).append(") \n and");
        }
        int len = ret.length();
        ret.delete(len - 4, len);
        return (ret.toString());
    }

    private String createWhereElement(RuleFilter rule) {
        // get the full quliafy the field name
        int colId = rule.getColId();
        String fullName = getColumnName(colId); //get full name end
        int filterId = rule.getFilterId();
        String sqlTemplate = "";
        if (filterId >= 100) {
            // use a user defined special
            sqlTemplate = rule.getOpsql();
            if (sqlTemplate == null || sqlTemplate.isEmpty()) {
                //if user does not assign a special sql template for this object, we just use full name as template
                //sqlTemplate = fullName;
                sqlTemplate = createCommonSQLTemplate(rule);
            }
        } else if (filterId == 1) {
            // this rule will use just data comparison, so we create a common
            sqlTemplate = createCommonSQLTemplate(rule);
        } else {
            // user use a common comparasion filter
            sqlTemplate = fullName;
        }
        String output = doReplace(sqlTemplate, fullName, rule).trim();
        if (output.startsWith("(") && output.endsWith(")")) {
            output = output.substring(2, output.length() - 1);
        }
        output = ' ' + output + ' ';
        return (output); // the return value is useless;
    }

    private String createOrderby(RuleFilter rule) {
        int op1Id = rule.getOp1Id();
        if (op1Id == 0) {
            return ("");
        }
        int colId = rule.getColId();
        String fullName = getColumnName(colId); //get full name end
        CommonOperation op = operationCache.get(new Integer(op1Id));
        String sqltemplate = op.getSqltemplate();
        if (sqltemplate == null || sqltemplate.isEmpty()) {
            return ("");
        }
        String output = doReplace(sqltemplate, fullName, rule).trim();
        return (output);
    }

    public String createGroupBy(RuleFilter rule) {
        int colId = rule.getColId();
        String fullName = getColumnName(colId); //get full name end
        //if result operator id is 1, we will use layer, otherwise we consider it as a normal groupby operation
        if(rule.getResultoperatorid()!=1){
            String sql=rule.getOpsql();
            if(sql==null || sql.trim().isEmpty()){
                return (fullName.trim());
            }else{
                return(doReplace(sql, fullName, rule).trim());
            }
        }else{
//            ,CASE
//            WHEN mer_tot_fee >= 0
//            AND mer_tot_fee <= 10
//            THEN '0-10'
//            WHEN mer_tot_fee > 10
//            AND mer_tot_fee <= 20
//            THEN '10-20'
//            WHEN mer_tot_fee > 20
//            AND mer_tot_fee <= 50
//            THEN '20-50'
//            WHEN mer_tot_fee > 50
//            THEN '50以上'
//            END


            GroupLayerOperator lop=session.getMapper(GroupLayerOperator.class);
            List<GroupLayer> list=lop.getByRuleId(rule.getRuleId());
            Iterator<GroupLayer> it=list.iterator();
            String colName=this.getColumnName(colId);
            StringBuilder sql=new StringBuilder(" CASE \n");
            while(it.hasNext()){
                GroupLayer layer=it.next();
                sql.append('\t').append(" WHEN ").append(colName).append(' ').append(layer.getOperator1()).append(' ').append(layer.getBoundary1());
                sql.append(' ').append(layer.getConnector()).append(' ');
                sql.append(colName).append(' ').append(layer.getOperator2()).append(' ').append(layer.getBoundary2());
                sql.append("\t THEN '").append(layer.getLayerName()).append(" ' \n");
            }
            sql.append("\t else '其它' end ");
            // create a output field name
            String colTitle="";
            ColumnInfo info = fieldCache.get(new Integer(colId));
            colTitle = info.getColtitle();
            if(colTitle==null || colTitle.trim().isEmpty()){
                colTitle=info.getColname();
            }
            if(rule.getFilterId()<100){
                colTitle = "按" + colTitle + "分档";
            }else {
                String outputName = rule.getOptitle();
                if (outputName == null || outputName.trim().isEmpty()) {
                    colTitle = "按"+ colTitle + "分档";
                }else{
                    colTitle=outputName;
                }
            }
            sql.append(" AS ").append('"').append(colTitle).append('"');

            layerNameMap.put("layer" + layerIndex, sql.toString());
            resultStr.append('\t').append(sql.toString()).append(", \n");
            if(rule.getOp1Id()==0){
                orderbyStr.append('\t').append('"').append(colTitle).append('"').append(", \n");
            }else if(rule.getOp1Id()==1){
                orderbyStr.append('\t').append('"').append(colTitle).append('"').append(" ASC, \n");
            }else if(rule.getOp1Id()==2){
                orderbyStr.append('\t').append('"').append(colTitle).append('"').append(" DESC, \n");
            }


            //result operator id is 1, we will use layer
            return('"'+colTitle + '"');

        }

    }


    private String doReplace(String str, String fieldName, RuleFilter rule) {
        int resultId = rule.getResultoperatorid();
        String ret = str;
        logger.debug(" the replace template is {}", ret);
        ret = ret.replaceAll("\\$FN", fieldName);
        CommonOperation op;
        if (resultId == 0) {
            ret = ret.replaceAll("\\$RESULTOPERATOR", "");
        } else {
            op = operationCache.get(new Integer(resultId));
//            if(op.getSqloperator()==null){
//                op.setSqloperator("");
//            }
            if (op == null) {
                ret = ret.replaceAll("\\$RESULTOPERATOR", "");
            } else if (op.getSqloperator() == null) {
                ret = ret.replaceAll("\\$RESULTOPERATOR", "");
            } else {
                ret = ret.replaceAll("\\$RESULTOPERATOR", op.getSqloperator());
            }
        }
        int op1Id = rule.getOp1Id();
        if (op1Id <= 0) {
            ret = ret.replaceAll("\\$OPERATOR1", "");
        } else {
            op = operationCache.get(new Integer(op1Id));
            //logger.debug("the operation id: {} the operation object: {}" ,op1Id, op);
            if (op == null) {
                ret = ret.replaceAll("\\$OPERATOR1", "");
            } else if (op.getSqloperator() == null) {
                ret = ret.replaceAll("\\$OPERATOR1", "");
            } else {
                ret = ret.replaceAll("\\$OPERATOR1", op.getSqloperator());
            }

        }
        String value = rule.getParam1value();
        if (value == null || value.isEmpty()) {
            ret = ret.replaceAll("\\$PARAM1", "");
        } else {
            ret = ret.replaceAll("\\$PARAM1", value);
        }
        int connId = rule.getOpconnectorid();
        if (connId <= 0) {
            ret = ret.replaceAll("\\$CONNECTOR", "");
        } else {
            op = operationCache.get(new Integer(connId));
            if (op == null) {
                ret = ret.replaceAll("\\$CONNECTOR", "");
            } else if (op.getSqloperator() == null) {
                ret = ret.replaceAll("\\$CONNECTOR", "");
            } else {
                ret = ret.replaceAll("\\$CONNECTOR", op.getSqloperator());
            }
        }
        int op2Id = rule.getOp2Id();
        if (op2Id <= 0) {
            ret = ret.replaceAll("\\$OPERATOR2", "");
        } else {
            op = operationCache.get(new Integer(op2Id));
            if (op == null) {
                ret = ret.replaceAll("\\$OPERATOR2", "");
            } else if (op.getSqloperator() == null) {
                ret = ret.replaceAll("\\$OPERATOR2", "");
            } else {
                ret = ret.replaceAll("\\$OPERATOR2", op.getSqloperator());
            }
        }
        value = rule.getParam2value();
        if (value == null || value.isEmpty()) {
            ret = ret.replaceAll("\\$PARAM2", "");
        } else {
            ret = ret.replaceAll("\\$PARAM2", value);
        }
        logger.debug("the replace result is {} ", ret);
        return (ret);
    }


    private void createAllCache(SqlSession session, int jobId) throws SQLException {
        AvailableOperation opDao = session.getMapper(AvailableOperation.class);
        List<CommonOperation> oplist = opDao.getAllOperation();
        Iterator<CommonOperation> it = oplist.iterator();
        while (it.hasNext()) {
            CommonOperation op = it.next();
            operationCache.put(new Integer(op.getOperationid()), op);
        }
        RuleOperator operator = session.getMapper(RuleOperator.class);
        List<RuleFilter> rulelist = operator.getRuleFilterByJobId(jobId);
        Iterator<RuleFilter> rit = rulelist.iterator();
        while (rit.hasNext()) {
            RuleFilter rule = rit.next();
            ruleCache.put(new Integer(rule.getRuleId()), rule);
        }
        ColInfoOperator cop = session.getMapper(ColInfoOperator.class);
        List<ColumnInfo> colList = cop.getColumnsByJobId(jobId);
        Iterator<ColumnInfo> cit = colList.iterator();
        while (cit.hasNext()) {
            ColumnInfo cinf = cit.next();
            fieldCache.put(new Integer(cinf.getColId()), cinf);
        }
    }


    public String  createSectionTemplate(CommonOperation op,RuleFilter rule,int idx){
        String operator=op.getSqloperator();
        String paramType;
        String paramValue=rule.getParam1value();
        if(idx==1) {
            paramType=rule.getParam1type();
            paramValue=rule.getParam1value();
        }else{
            paramType=rule.getParam2type();
            paramValue=rule.getParam2value();
        }
        if(rule.getFilterId()<100){
            ColumnInfo info = fieldCache.get(new Integer(rule.getColId()));
            paramType=info.getDefaultInputType();
        }
        if(operator==null || operator.isEmpty()){
            return(op.getSqltemplate());
        }
        if(paramType==null || paramType.isEmpty()){
            return(op.getSqltemplate());
        }
        if(paramType.compareToIgnoreCase("multiselector")==0) {
            if (operator.compareToIgnoreCase("=") == 0 ) {
                if (paramValue.indexOf(',') != 0) {
                    return ("$FN in ( $PARAM"+idx+" )");
                }
            }else if(operator.compareToIgnoreCase("<>")==0){
                if (paramValue.indexOf(',') != 0) {
                    return ("$FN NOT IN ( $PARAM"+idx+" )");
                }
            }else{
                return(op.getSqltemplate());
            }
        }
        return(op.getSqltemplate());
    }

/*    public static void main(String[] args) {
        try {

            Reader reader = Resources.getResourceAsReader("configuration.xml");
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader, "mdaapp");
            reader.close();
            CreateSQL creator = new CreateSQL(sqlSessionFactory.openSession());
            creator.createSql(1);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/

    public void checkRules(RuleFilter rule) throws MdaAppException {
        ColumnInfo info = fieldCache.get(new Integer(rule.getColId()));
        String colDisplayName=info.getColname() + "(" + info.getColtitle() + ")";
        String place=rule.getPlace();
        // check if the filed can output detail
        int enableDetail=info.getEnableDetail();
        if(enableDetail==0){
            // if the field enableDetail=0 then it will not be used as a groupby field
            //if(place.compareToIgnoreCase("groupby")==0){
            //    throw new MdaAppException("字段" + colDisplayName +"禁止输出明细，不能进行分组和分档操作");
            //}
            // if the field enableDetail=0 then it will not be used in result output segment without any operator
            if(place.compareToIgnoreCase("result")==0){
                if(rule.getResultoperatorid()==0){
                    throw new MdaAppException("字段" + colDisplayName +"禁止输出明细,请选择统计操作");
                }
            }
            // now we test if the operator is equal to special restrict in preventOperator section, if true,
            // we also stop to create a SQL statement
            String prevent=info.getPreventOperator();
            if(prevent!=null && !prevent.isEmpty()){
                String [] operator = prevent.split(",");
                for(int i=0;i<operator.length;i++){
                    try{
                        int code=Integer.parseInt(operator[i]);
                        if(code==rule.getResultoperatorid()){
                            throw new MdaAppException("字段" + colDisplayName +"禁止使用选定操作,请重新选择");
                        }
                    }catch(Exception ignore){
                    }
                }
            }
        }
        // check if the field can in result
        if(place.compareToIgnoreCase("result")==0){
            if(info.getEnableResult()==0){
                throw new MdaAppException("字段" + colDisplayName +"禁止在输出列表中使用，请删除");
            }
        }
        // check if the field can in where
        if(place.compareToIgnoreCase("where")==0){
            if(info.getEnableWhere()==0){
                throw new MdaAppException("字段" + colDisplayName +"禁止在条件维度列表中使用，请删除");
            }
        }
        // check if the field can in group by
        if(place.compareToIgnoreCase("groupby")==0){
            if(info.getEnableGroupBy()==0){
                throw new MdaAppException("字段" + colDisplayName +"禁止在分组和分档列表中使用，请删除");
            }
        }
        // check if the field can in group by
        if(place.compareToIgnoreCase("orderby")==0){
            if(info.getEnableOrderBy()==0){
                throw new MdaAppException("字段" + colDisplayName +"禁止在排序列表中使用，请删除");
            }
        }

    }
}
