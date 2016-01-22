package com.teradata.mda.config;

import java.util.Properties;

/**
 * Created by YS186019 on 2015/9/7.
 * this class is original designed to handle the golbal configuration of
 * application servlet code
 * the class is single instance pattern and was initialize when application start at
 *
 */
public class MdaConfig extends Properties{
    private MdaConfig(){}
    private static MdaConfig handle;

    public static MdaConfig getInstance(){
        if(handle==null){
            handle=new MdaConfig();
        }
        return(handle);
    }


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

    public String getString(String keyName,String defaultVal){
        return(getProperty(keyName, defaultVal));
    }
}
