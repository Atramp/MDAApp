package com.teradata.mda.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by YS186019 on 2015/8/27.
 */
public class JSONResponse {
    public static String getErrorResponse(String error_message){
       JsonObject obj=new JsonObject();
       obj.addProperty("hasError", new Boolean(true));
       obj.addProperty("error",wrapLongString(error_message));
       return(obj.toString());
    }

    public static String getErrorByMessageID(String ResourceID){
        //return(getResponse(MetastarMsg.getMessage(ResourceID)));
        return(getErrorResponse("not support now"));
    }

    public static String getByMessageID(String field_name,String ResourceID){
        //return(getResponse(field_name,MetastarMsg.getMessage(ResourceID)));
        return(getErrorResponse("not support now"));
    }


    public static String success(){
        JsonObject obj=new JsonObject();
        obj.addProperty("hasError", new Boolean(false));
        return(obj.toString());
/*
        JSONObject obj=new JSONObject();
        obj.put("hasError",false);
        return(obj.toJSONString());
*/
    }

    public static String success(String msg){
        JsonObject obj=new JsonObject();
        obj.addProperty("hasError", new Boolean(false));
        obj.addProperty("message",msg);
        return(obj.toString());
/*
        JSONObject obj=new JSONObject();
        obj.put("hasError",false);
        return(obj.toJSONString());
*/
    }

    public static String getErrorResponse(String field_name,String error_message){

        JsonObject obj=new JsonObject();
        obj.addProperty("hasError",new Boolean(true));
        obj.addProperty("filed",field_name);
        obj.addProperty("error",wrapLongString(error_message));
        return(obj.toString());

//        JSONObject obj=new JSONObject();
//        obj.put("hasError",true);
//        obj.put("field", field_name);
//        obj.put("error", wrapLongString(error_message));
//        return(obj.toJSONString());
    }

    private static String wrapLongString(String message){
        if(message.length()<80){
            return(message);
        }
        StringBuilder sb=new StringBuilder(message);
        int i=70;
        while(i<sb.length()){
            while(i<sb.length() && sb.charAt(i)!=' ' && sb.charAt(i)!=',' && sb.charAt(i)!='.'){
                i++;
            }
            if(i<sb.length()) {
                sb.insert(i, "<br>");
                i = i + 70;
            }
        }
        return(sb.toString());
    }



}
