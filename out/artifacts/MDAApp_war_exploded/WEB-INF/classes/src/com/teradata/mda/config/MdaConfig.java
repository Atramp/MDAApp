package com.teradata.mda.config;

import java.util.Properties;

/**
 * Created by YS186019 on 2015/9/7.
 */
public class MdaConfig extends Properties{
    public MdaConfig(){}


    public int getInt(String keyName,int defaultVal){
        int val;
        try{
            String str=getProperty(keyName);
            val=Integer.parseInt(str);
        }catch(Exception e){
            val=defaultVal;
        }
        return(val);
    }
    //public synchronized get(


}
