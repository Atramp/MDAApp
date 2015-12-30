package com.teradata.mda.test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by YS186019 on 2015/11/24.
 */
public class TestRegex {
    public void test(String sqlTemplate){
        Pattern p=Pattern.compile("\\bcount\\b|\\bmax\\b|\\bmaximum\\b|\\baverage\\b|\\bave\\b|\\bavg\\b|\\bmin\\b|\\bminimum\\b|\\bsum\\b",Pattern.CASE_INSENSITIVE);
        Matcher m=p.matcher(sqlTemplate);
        if(m.find()){
            System.out.println(sqlTemplate +" matchs");
        }else{
            System.out.println(sqlTemplate +" not matchs");
        }
    }
    public static void main(String [] args) throws Exception{
        TestRegex t=new TestRegex();
        t.test("count(abc)");
        t.test("counttt(abc)");
        t.test("maxi(abc)");
        t.test("max(abc)");
        t.test("abc");

    }

}
