Create database mdaapp as perm=20000000,spool=10000000;

drop table commonoperation;
drop table columns;
drop table tables;
drop table codetable;
drop TABLE  mdajob;
drop TABLE fieldfilter;


create table mdajob
(  jobid integer not null
   ,jobname varchar(50) not NULL
   ,description varchar(500)
   ,creatorname varchar(50) not NULL
   ,createtime timestamp
   ,currentstatus varchar(2) not null DEFAULT 'R'  --W wait, R--running S--success F-fail
   ,previousfinished timestamp
   ,referencecount INTEGER
   ,resultlink varchar(1000)
   ,sqlstatement varchar(31000)
   ,usersql varchar(31000)
   ,statusdescription varchar(200)
   ,outputfilename varchar(200)
   ,primary key(jobid)
);


 create table starcodetable
 (
    codetype integer
   ,codevalue varchar(20)
   ,codetext varchar(50)
 ) primary index (codetype,codevalue,codetext);
insert into starcodetable values ( 1,'01' ,'五星钻' );
insert into starcodetable values ( 1,'02' ,'五星金');
insert into starcodetable values ( 1,'03' ,'五星银');
insert into starcodetable values ( 1,'04' ,'四星');
insert into starcodetable values ( 1,'05' ,'三星');
insert into starcodetable values ( 1,'06' ,'二星');
insert into starcodetable values ( 1,'07' ,'一星');
insert into starcodetable values ( 1,'08' ,'准星');
insert into starcodetable values ( 1,'09' ,'未评级');

 create table provincecodetable
 (
    codetype integer
   ,codevalue integer
   ,codetext varchar(50)
 ) primary index (codetype,codevalue,codetext);




--drop table tables;
create table tables(
  tableid INTEGER not null GENERATED BY DEFAULT AS IDENTITY
    (START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    )
  ,dbtype varchar(20) not null default 'TERADATA'
  ,dbname varchar(30) not null default ''
  ,schemaname varchar(30) not null default ''
  ,tablename varchar(50) not null
  ,tabletype varchar(20)
  ,comments varchar(200)
  ,creatorname varchar(100)
--  ,transactionlog varchar(10) not NULL
--  ,protection varchar(10)
--  ,commitoption varchar(200)
  ,primary key(tableid)
  ,unique(dbtype,dbname,schemaname,tablename)
) ;

--drop table columns;
create table columns(
  colId INTEGER not null GENERATED BY DEFAULT AS IDENTITY
    (START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    )
  ,tableid integer not null references tables(tableid)
  ,colname varchar(50) not NULL
  ,coltype varchar(20) not NULL
  ,colformat varchar(40) not NULL
  ,colmaxlength integer
  ,coldecimal INTEGER
  ,colfraction INTEGER
  ,comments varchar(200)
  ,coltitle varchar(200)
  ,defaultInputType varchar(20) not null default 'textinput',
  ,defaultCodeTable varchar(50)
  ,primary key(colId)
  ,unique (tableid,colname)
) ;

create table commonoperation(
  operationid integer not null GENERATED BY DEFAULT AS IDENTITY
    (START WITH 100
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    )
  ,dbtype varchar (20) not NULL
  ,virtualtype varchar(20) not NULL
  ,sqloperator varchar(20) not null
  ,sqltemplate varchar(100) not NULL
  ,operationplace varchar(20) not NULL  --either in where, select result, order by ,group by,inner join
  ,operationtitle varchar(100) not NULL
  ,paramcount INTEGER not null default 0
  ,primary key(operationid)
);

--drop table commonoperation;

insert into commonoperation (operationid,dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values (0,'any','any','','','any','无操作',0);
insert into commonoperation (operationid,dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values (1,'TERADATA','any','asc',' $FN asc ','orderby','升序',0);
insert into commonoperation (operationid,dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values (2,'TERADATA','any','desc',' $FN desc ','orderby','降序',0);
insert into commonoperation (operationid,dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values (3,'TERADATA','any',' and ',' and ','connector','并且',0);
insert into commonoperation (operationid,dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values (4,'TERADATA','any',' or ',' or ','connector','或者',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','>','$FN > $PARAM1','where','大于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','>=','$FN >= $PARAM1','where','大于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','=','$FN = $PARAM1','where','等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','<=','$FN <= $PARAM1','where','小于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','<','$FN < $PARAM1','where','小于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','<>','$FN <> $PARAM1','where','不等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','SUM','SUM($FN)','result','求和',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','AVERAGE','Average($FN)','result','求平均',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','MAX','MAX($FN)','result','求最大值',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','MIN','MIN($FN)','result','求最小值',0);

insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','','count($FN)','result','计数',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','','count( distinct $FN)','result','去重计数',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','','count($FN)','result','计数',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','','count( distinct $FN)','result','去重计数',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','','count($FN)','result','计数',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','','count( distinct $FN)','result','去重计数',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','','count($FN)','result','计数',0);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','','count( distinct $FN)','result','去重计数',0);




insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','>','$FN > $PARAM1','having','大于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','>=',' $FN >= $PARAM1','having','大于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','=',' $FN= $PARAM1','having','等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','<=',' $FN<= $PARAM1','having','小于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','<',' $FN< $PARAM1','having','小于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER','<>',' $FN<> $PARAM1','having','不等于',1);


insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','>','$FN > ''$PARAM1''','where','大于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','>=','$FN >= ''$PARAM1''','where','大于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','=','$FN = ''$PARAM1''','where','等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','<=','$FN <= ''$PARAM1''','where','小于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','<','$FN < ''$PARAM1''','where','小于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','DA','<>','$FN <> ''$PARAM1''','where','不等于',1);

insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','>','$FN > ''$PARAM1''','where','大于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','>=','$FN >= ''$PARAM1''','where','大于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','=','$FN = ''$PARAM1''','where','等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','<=','$FN <= ''$PARAM1''','where','小于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','<','$FN < ''$PARAM1''','where','小于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TS','<>','$FN <> ''$PARAM1''','where','不等于',1);

insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','>','$FN > $PARAM1','where','大于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','>=','$FN >= ''PARAM1''','where','大于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','=','$FN = ''$PARAM1''','where','等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','<=','$FN <= ''$PARAM1''','where','小于等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','<','$FN < ''$PARAM1''','where','小于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','<>','$FN <> ''$PARAM1''','where','不等于',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT','like','$FN like ''%$PARAM1%''','where','类似于',1);

insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','NUMBER',' in ',' $FN in ($PARAM1)','where','包含',1);
insert into commonoperation (dbtype,virtualtype,sqloperator,sqltemplate,operationplace,operationtitle,paramcount) values ('TERADATA','TEXT',' in ',' $FN in ($PARAM1)','where','包含',1);

create table typemapping(
  coltype not null varchar(10)
  ,virtualtype VARCHAR(20)
) primary index(coltype);;
insert into typemapping values ('I2','NUMBER');
insert into typemapping values ('I','NUMBER');
insert into typemapping values ('D','NUMBER');
insert into typemapping values ('CF','TEXT');
insert into typemapping values ('CV','TEXT');
insert into typemapping values ('DA','TEXT');
insert into typemapping values ('DA','date');
insert into typemapping values ('TS','TIMESTAMP');
insert into typemapping values ('any','any');


create table fieldfilter(
  filterId integer not null GENERATED BY DEFAULT AS IDENTITY
    (START WITH 100
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    )
    --op=operation
  ,colId integer not null default -1  -- if colId is not null, we can assing some speical op to specific column
  ,opsql varchar(10000) --   $FN $OPERATOR1 $PARAM1 $CONNECTOR $FN $OPERATOR2 $PARAM2
  ,extrasql varchar(10000) -- store the extra sql such as having
  ,place varchar(20) not NULL  --either in where, select result, order by ,group by,inner join
  ,optitle varchar(100) not NULL
  ,description varchar(500)
  ,showdescription INTEGER not null default 0
  ,creator varchar(20)
  ,createtime TIMESTAMP not null default current_timestamp
  ,resultoperatorid integer
  ,op1label varchar(50)     --$op1label $OPERATOR1 $param1_left_label $PARAM1 $param1_right_label
  ,op1candidate varchar (500)  -- 1,2,3,4 ��Ӧcommonoperation id
  ,showoperator1 smallint not null DEFAULT 1
  ,param1leftlabel varchar(20) --can be combo,radio, date,month,time,timestamp , null or ''( means normal text input operation)
  ,param1style varchar(100)       --can be combo,radio, date,month,time,timestamp , null or ''( means normal text input operation)
  ,param1rightlabel varchar(20)
  ,showconnector smallint not NULL default 1
  ,connectorcandidate varchar(50)
  ,opconnectorid integer
  --,opconnectiontitle varchar(50)  -- $CONNECTOR $OPERATOR2 $PARAM2
  ,op2label varchar(50)  --$op2label $OPERATOR2 $ param2_left_label $PARAM2 $param2rightlabel
  ,param2leftlabel varchar(20)
  ,op2candidate varchar(500) -- ,3,4 ��Ӧcommonoperation id
  ,showoperator2 smallint not null DEFAULT 1
  ,param2rightlabel varchar(20)
  ,param2style varchar(100)   --can be combo,radio, date,month,time,timestamp , null or ''( means normal text input operation)
  ,paramcount INTEGER not null default 0
  ,param1checkrule varchar(100)  -- for example $PARAM1<$PARAM2  ,we may try to use 'select' to test if the value is true, for example select 5>1 and 5<100
  ,param2checkrule varchar(100)
  ,paramscheckrule varchar(100) -- if we have both param1 and param2, we can check their value relation
  -- following field are used when user save the filter
  ,op1Id INTEGER
  ,op2Id INTEGER
  ,param1value VARCHAR (500)
  ,param2value varchar (500)
  ,outputtitle varchar(100)
  ,primary key(filterId)
);

insert into  fieldfilter (filterId,colId,opsql,place,optitle,showconnector,paramcount) values (0,0,'','','无操作',0,0);
insert into  fieldfilter (filterId,colId,opsql,place,optitle,showconnector,paramcount) values (1,0,'','where','条件筛选',1,2);
insert into  fieldfilter (filterId,colId,opsql,place,optitle,showconnector,paramcount) values (2,0,'','result','运算结果过滤',2);
--insert into  fieldfilter (filterId,colId,opsql,place,optitle,paramcount) values (3,0,'','result','计算结果过滤',2);
insert into  fieldfilter (filterId,colId,opsql,place,optitle,showconnector,paramcount,resultoperatorid) values (3,0,'','groupby','数据分组',0,0,0);
insert into  fieldfilter (filterId,colId,opsql,place,optitle,showconnector,paramcount,resultoperatorid) values (4,0,'','groupby','数据分档',0,0,1);
--update fieldfilter set optitle='数值判断操作' where filterId=1;



insert into  fieldfilter (filterId,colId,opsql,place,optitle) values (0,0,'','','无操作');
insert into  fieldfilter (filterId,colId,opsql,place,optitle,paramcount) values (1,0,'','where','常规判断操作',1);
insert into  fieldfilter (filterId,colId,opsql,place,optitle,paramcount) values (2,0,'','result','常规判断操作',1);
--update fieldfilter set optitle='数值判断操作' where filterId=1;


create table filtercandidate(
  candidateid integer not null GENERATED BY DEFAULT AS IDENTITY
    (START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    )
  ,filterId INTEGER not null default 1
  ,colId INTEGER not null
  ,paramid INTEGER   not null default 0--can be 0,1,2 which corresponing to $Connector, $param1,$Param2
  ,place varchar(50) not null default 'where'
  ,candidatetitle varchar(50)   -- this is a display value in combobox or radio box
  ,candidatevalue varchar(50)   -- this is a SQL value which will fill in param1 value
  ,primary key (candidateid)
);


insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'01' ,'五星钻' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'02' ,'五星金');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'03' ,'五星银');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'04' ,'四星');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'05' ,'三星');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'06' ,'二星');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'07' ,'一星');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'08' ,'准星');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (6,'09' ,'未评级');

insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10100', '北京');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10200', '上海');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10300', '天津');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10400', '重庆');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10500', '贵州');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10600', '湖北');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10700', '陕西');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10800', '河北');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'10900', '河南');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11000', '安徽');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11100', '福建');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11200', '青海');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11300', '甘肃');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11400', '浙江');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11500', '海南');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11600', '黑龙江');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11700', '江苏' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11800', '吉林' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'11900', '宁夏');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12000', '山东');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12100', '山西');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12200', '新疆' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12300', '广东' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12400', '辽宁' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12500', '广西' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12600', '湖南' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12700', '江西' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12800', '内蒙古');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'12900', '云南' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'13000', '四川' );
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (3,'13100', '西藏');

insert into filtercandidate (colId,candidatevalue,candidatetitle) values (5,'1', '是');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (5,'0', '否');

insert into filtercandidate (colId,candidatevalue,candidatetitle) values (8,'1', '是');
insert into filtercandidate (colId,candidatevalue,candidatetitle) values (8,'0', '否');

drop table jobrules;
create table jobrules(
  ruleId integer not NULL GENERATED BY DEFAULT AS IDENTITY
    (START WITH 100
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    )
  ,jobid INTEGER not null references mdajob(jobid)
  ,filterId integer
  ,colId integer not null
  ,resultoperatorid integer
  ,isdistinct INTEGER
  ,ordernum INTEGER
  ,op1Id INTEGER
  ,op2Id INTEGER
  ,place varchar(20)
  ,opconnectorid integer
  ,param1value VARCHAR (500)
  ,param1type varchar(20)
  ,param2value varchar (500)
  ,param2type varchar(20)
  ,outputtitle varchar(100)
  ,windowx INTEGER
  ,windowy INTEGER
  ,primary key (ruleId)
);

--base sql template
--select $result_fields from $table_name $inner_join $where $groupby $having $order_by
/*
create view columnoperation as
select
t1.colId
,t1.tableid
,t1.colname
,t1.coltype
,t1.colformat
,t1.colmaxlength
,t1.coldecimal
,t1.colfraction
,t1.comments
,t1.coltitle
,t2.dbtype
,t2.dbname
,t2.schemaname
,t2.tablename
,t2.tabletype
,t3.op
,t3.operationsql
,t3.operationplace
,t3.operationtitle
from columns t1 inner join tables t2
on t1.tableid=t2.tableid
left join commonoperation t3
on t1.coltype=t3.coltype and t2.dbtype=t3.dbtype;
*/


create view columnview as
select
t1.colId
,t1.tableid
,t1.colname
,t1.coltype
,t1.colformat
,t1.colmaxlength
,t1.coldecimal
,t1.colfraction
,t1.comments
,t1.coltitle
,t1.defaultInputType
,t1.defaultCodeTable
,t2.dbtype
,t2.dbname
,t2.schemaname
,t2.tablename
,t2.tabletype
,t3.virtualtype
from columns t1 inner join tables t2
on t1.tableid=t2.tableid
inner join typemapping t3
on t1.coltype=t3.coltype;


create view filterreference as
select t1.filterid,count(t2.filterid) as referencecount from fieldfilter t1 left join jobrules t2 on t1.filterid=t2.filterid group by t1.filterid;

create table grouplayer(
        layerId integer not null GENERATED BY DEFAULT AS IDENTITY
            (START WITH 1
            INCREMENT BY 1
            NO MAXVALUE
            NO CYCLE
            )
        ,filterId integer
        ,colId    integer
        ,ruleId INTEGER
        ,layerName varchar(50)
        ,operator1 varchar(20)
        ,boundary1 varchar(20)
        ,connector varchar(20)
        ,operator2 varchar(20)
        ,boundary2 varchar(20)
        ,primary key(layerId)
);


