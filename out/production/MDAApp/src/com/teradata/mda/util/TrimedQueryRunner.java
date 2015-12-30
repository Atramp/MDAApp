package com.teradata.mda.util;



import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.wrappers.StringTrimmedResultSet;

import java.sql.ResultSet;

/**
 * Created by YS186019 on 2015/8/31.
 */
public class TrimedQueryRunner extends QueryRunner {
    protected ResultSet wrap(ResultSet rs) {
        return StringTrimmedResultSet.wrap(rs);
    }
}
