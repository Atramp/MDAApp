package com.teradata.mda.test.gson;

import com.google.gson.JsonObject;

/**
 * Created by YS186019 on 2015/10/12.
 */
public class TestGson {
    public void t(int i){
        System.out.println();
    }
    public void t1(Integer i){
        System.out.println(i.intValue());
    }

    public static void main(String args[]){
        JsonObject obj=new JsonObject();
        obj.addProperty("HasError",new Boolean(true));
        obj.addProperty("filed","111111");
        obj.addProperty("error", "222222222222");
        System.out.println(obj.toString());
        TestGson t=new TestGson();
        t.t(5);
        t.t1(null);
    }
}
