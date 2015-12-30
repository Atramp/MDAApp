package com.teradata.mda.test.TestData;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;

/**
 * Created by YS186019 on 2015/11/23.
 */
public class TestData {
    public static void main(String [] args) throws Exception{
        BufferedReader reader=new BufferedReader(new FileReader("d:\\data3.txt"));
        BufferedWriter writer=new BufferedWriter(new FileWriter("D:\\data3.sql"));
        String line;
        while((line=reader.readLine())!=null){
            if(line.startsWith("#")){
                continue;
            }
           // System.out.println(line);
            String [] strs=line.split("\\s");
            int len=strs.length;

            StringBuilder sql;
            if(len==13) {
                sql = new StringBuilder("insert into dwpmart.RP_STAR_SERVICE_DIMENSION_MON values (");
                sql.append(strs[0]).append(",'").append(strs[1]).append("',").append(strs[2]).append(',');
                sql.append(strs[3]).append(",").append(strs[4]).append(",'").append(strs[5]).append("','");
                sql.append(strs[6]).append("',").append(strs[7]).append(",").append(strs[8]).append(',');
                sql.append(strs[9]).append(",").append(strs[10]).append(",").append(strs[11]).append(',');
                sql.append(strs[12]).append(");");
            }else if(len==12){
                //System.out.println(len);
                //System.out.println(line);
                sql=new StringBuilder("insert into dwpmart.RP_STAR_SERVICE_DIMENSION_MON values (");
                sql.append(strs[0]).append(",'").append(strs[1]).append("',").append(strs[2]).append(',');
                sql.append(strs[3]).append(",").append(strs[4]).append(",'").append(strs[5]).append("','");
                sql.append(" ").append("',").append(strs[6]).append(",").append(strs[7]).append(',');
                sql.append(strs[8]).append(",").append(strs[9]).append(",").append(strs[10]).append(',');
                sql.append(strs[11]).append(");");
            }else if(len==11){
                //System.out.println(len);
                //System.out.println(line);
                sql=new StringBuilder("insert into dwpmart.RP_STAR_SERVICE_DIMENSION_MON values (");
                sql.append(strs[0]).append(",'").append(strs[1]).append("',").append(strs[2]).append(',');
                sql.append(strs[3]).append(",").append(strs[4]).append(",'").append(strs[5]).append("','");
                sql.append(" ").append("',").append(" ").append(",").append(strs[6]).append(',');
                sql.append(strs[7]).append(",").append(strs[8]).append(",").append(strs[9]).append(',');
                sql.append(strs[10]).append(");");
            }else{
                System.out.println(len);
                System.out.println(line);
                sql=new StringBuilder("insert into dwpmart.RP_STAR_SERVICE_DIMENSION_MON values (");
            }
            writer.write(sql.append('\r').toString());
            //System.out.println(sql.toString());
        }

        writer.close();
        reader.close();



    }



}
