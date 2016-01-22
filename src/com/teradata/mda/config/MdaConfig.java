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

    /**
     * 获取市里
     * @return
     */
    public static MdaConfig getInstance(){
        if(handle==null){
            handle=new MdaConfig();
        }
        return(handle);
    }

    /**
     * 按整数方式获取配置项数据
     * @param keyName 配置项名称
     * @param defaultVal 缺省值
     * @return 配置值（如果存在且为合法整数）或缺省值
     */
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

    /**
     * 按字符串方式获取配置项数据
     * @param keyName 配置项名称
     * @param defaultVal 缺省值
     * @return 配置值或缺省值
     */
    public String getString(String keyName,String defaultVal){
        return(getProperty(keyName, defaultVal));
    }
}
