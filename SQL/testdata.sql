--测试数据
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (1,'job1','aaa1','2015-08-21 00:00:00','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (2,'job2','中文2','2015-08-21 00:00:01','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (3,'job3','a中文aa3','2015-08-21 00:00:02','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (4,'job4','aa中文a4','2015-08-21 00:00:03','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (5,'job5','aaa5','2015-08-21 00:00:04','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (6,'job6','aa中文a6','2015-08-21 00:00:05','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (7,'job7','aaa7','2015-08-21 00:00:06','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (8,'job8','aaa8','2015-08-21 00:00:07','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (9,'job9','aaa9','2015-08-21 00:00:08','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (10,'job10','aaa10','2015-08-21 00:00:09','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (11,'job11','aaa12','2015-08-21 00:00:10','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (12,'job12','aaa13','2015-08-21 00:00:11','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (13,'job13','aaa14','2015-08-21 00:00:12','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (14,'job14','aaa15','2015-08-21 00:00:13','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (15,'job15','aaa16','2015-08-21 00:00:14','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (16,'job16','aaa17','2015-08-21 00:00:15','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (17,'job17','aaa18','2015-08-21 00:00:16','');
insert into mdajob (jobid,jobname,creator,createtime,currentstatus) VALUES (18,'job18','aaa19','2015-08-21 00:00:17','');

drop table testtable;
create table testtable (
  id INTEGER  not null primary KEY title 'id'
  ,arpu decimal(6,2)  title 'ARPU小数6.2'
  ,arpu2 INTEGER title 'ARPU2整数'
  ,stringfield varchar(100) title 'varchar字符串'
  ,testdate DATE  title '日期'
  ,testdate2 TIMESTAMP title '时间戳'
);

comment on table testtable is '测试表';
comment on column testtable.id is '测试字段1';
comment on column testtable.arpu is '测试字段2';
comment on column testtable.arpu2 is '测试字段3';
comment on column testtable.stringfield is '测试字段4';
comment on column testtable.testdate is '测试字段5';
comment on column testtable.testdate2 is '测试字段6';

create or replace view testview as select * from testtable;

create table testtable2 (
  id INTEGER not null primary KEY title 'id2'
  ,arpu decimal(6,2)  title 'ARPU小数6.2-2'
  ,arpu2 INTEGER title 'ARPU2整数2'
  ,stringfield varchar(100) title 'varchar字符串2'
  ,testdate DATE  title '日期2'
  ,testdate2 TIMESTAMP title '时间戳2'
);

comment on table testtable2 is '测试表2';
comment on column testtable2.id is '测试字段21';
comment on column testtable2.arpu is '测试字段22';
comment on column testtable2.arpu2 is '测试字段23';
comment on column testtable2.stringfield is '测试字段24';
comment on column testtable2.testdate is '测试字段25';
comment on column testtable2.testdate2 is '测试字段26';


-- fieldfilter 测试数据

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,param1leftlabel,param1rightlabel,
    opconnectorid,paramcount,
    op2label,op2candidate,param2leftlabel,param2rightlabel,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES
(9,' $FN $OPERATOR PARAM1 ', 'where', 'ARPU值',
 'op1label','100,101,102,103,104,105','左','右元',
 '',1,
 '','','','',
 ' $PARAM1 > 0 ','','');

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,param1leftlabel,param1rightlabel,
    opconnectorid,paramcount,
    op2label,op2candidate,param2leftlabel,param2rightlabel,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES (9,' $FN $OPERATOR1 $PARAM1 and $FN $OPERATOR2 $PARAM2', 'where', 'ARPU值范围'
,'op1label','100,101','左','右'
,3,2,
'op2label','103,104','左','右',
'$PARAM1 > 0 and $PARAM1<999999','$PARAM2>0','$PARAM2>$PARAM1');

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount,
    op2label,op2candidate,showoperator2,param2leftlabel,param2rightlabel,param2style,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES (2,' (substr($FN,2,4) in ($PARAM1)) and (substr($FN,2,4) not in($PARAM2))', 'where', '选择地区范围'
,'包含1','',0,'左','地区1','multiselector'
,3,2
,'不包含','',0,'左','地区2','multiselector'
,'$PARAM1 > 0 and $PARAM1<999999','$PARAM2>0','$PARAM2>$PARAM1');

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount)
VALUES (2,' (substr($FN,2,4) in ($PARAM1))', 'where', '选择地区范围'
,'包含2','',0,'','地区','multiselector'
,3,1);



insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount,
    op2label,op2candidate,showoperator2,param2leftlabel,param2rightlabel,param2style,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES (3,' ($FN $OPERATOR1 $PARAM1 and $FN $OPERATOR2 $PARAM2)', 'where', '日期比较'
,'日期1','116,117',1,'左','右','dateselector'
,3,2
,'label121','119,120',1,'左','右','dateselector'
,'$PARAM1 >= ''2015-01-01'' and $PARAM1<''2015-12-12''','$PARAM2>''2015-01-01'' and $PARAM2<=''2015-12-31''','$PARAM2>$PARAM1');

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount)
VALUES (3,' ($FN $OPERATOR1 $PARAM1)', 'where', '月份比较'
,'月份','118,121',1,'左','右','monthselector'
,3,1
);

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount,
    op2label,op2candidate,showoperator2,param2leftlabel,param2rightlabel,param2style,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES (3,' ($FN $OPERATOR1 $PARAM1 and $FN $OPERATOR2 $PARAM2)', 'where', '时间戳比较'
,'时间戳1','116,117',1,'左','右','datetimeselector'
,3,2
,'时间戳1','119,120',1,'左','右','datetimeselector'
,'$PARAM1 >= ''2015-01-01'' and $PARAM1<''2015-12-12''','$PARAM2>''2015-01-01'' and $PARAM2<=''2015-12-31''','$PARAM2>$PARAM1');


insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount,
    op2label,op2candidate,showoperator2,param2leftlabel,param2rightlabel,param2style,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES (3,' ($FN $OPERATOR1 $PARAM1 and $FN $OPERATOR2 $PARAM2)', 'where', '月份比较2'
,'时间戳2','116,117',1,'左','右','monthselector'
,3,2
,'时间戳2','119,120',1,'左','右','monthselector'
,'$PARAM1 >= ''2015-01-01'' and $PARAM1<''2015-12-12''','$PARAM2>''2015-01-01'' and $PARAM2<=''2015-12-31''','$PARAM2>$PARAM1');

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount,
    op2label,op2candidate,showoperator2,param2leftlabel,param2rightlabel,param2style,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES (4,' ($FN $OPERATOR1 $PARAM1 and $FN $OPERATOR2 $PARAM2)', 'where', '单选'
,'label11','',1,'左','右','comboselector'
,4,2
,'labl12','',1,'左','右','comboselector'
,'$PARAM1 >= ''2015-01-01'' or $PARAM1<''2015-12-12''','$PARAM2>''2015-01-01'' and $PARAM2<=''2015-12-31''','$PARAM2>$PARAM1');

insert into fieldfilter
 ( colId,opsql,place,optitle,
    op1label,op1candidate,showoperator1,param1leftlabel,param1rightlabel,param1style,
    opconnectorid,paramcount,
    op2label,op2candidate,showoperator2,param2leftlabel,param2rightlabel,param2style,
    param1checkrule,param2checkrule,paramscheckrule)
VALUES (4,' ($FN $OPERATOR1 $PARAM1 and $FN $OPERATOR2 $PARAM2)', 'where', '多选'
,'label21','',1,'左','右','multiselector'
,3,2
,'labl22','',1,'左','右','multiselector'
,'$PARAM1 >= ''2015-01-01'' and $PARAM1<''2015-12-12''','$PARAM2>''2015-01-01'' and $PARAM2<=''2015-12-31''','$PARAM2>$PARAM1');

insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,1,'where','值1','1');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,1,'where','值2','2');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,1,'where','值3','3');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,1,'where','值4','4');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,1,'where','值5','5');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,1,'where','值6','6');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,2,'where','值7','7');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,2,'where','值8','8');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,2,'where','值9','9');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,2,'where','值10','10');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,2,'where','值11','11');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,2,'where','值12','12');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (118,2,'where','值13','13');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,1,'where','值21','21');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,1,'where','值22','22');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,1,'where','值23','23');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,1,'where','值24','24');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,1,'where','值25','25');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,1,'where','值26','26');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,2,'where','值27','27');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,2,'where','值28','28');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,2,'where','值29','29');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,2,'where','值30','30');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,2,'where','值31','31');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,2,'where','值32','32');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (119,2,'where','值33','33');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,1,'where','值51','51');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,1,'where','值52','52');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,1,'where','值53','53');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,1,'where','值54','54');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,1,'where','值55','55');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,1,'where','值56','56');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,2,'where','值57','57');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,2,'where','值58','58');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,2,'where','值59','59');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,2,'where','值510','510');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,2,'where','值511','511');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,2,'where','值512','512');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (112,2,'where','值513','513');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,1,'where','值621','621');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,1,'where','值622','622');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,1,'where','值623','623');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,1,'where','值624','624');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,1,'where','值625','625');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,1,'where','值626','626');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,2,'where','值627','627');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,2,'where','值628','628');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,2,'where','值629','629');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,2,'where','值630','630');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,2,'where','值631','631');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,2,'where','值632','632');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (113,2,'where','值633','633');

insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,1,'where','值1','1');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,1,'where','值2','2');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,1,'where','值3','3');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,1,'where','值4','4');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,1,'where','值5','5');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,1,'where','值6','6');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,2,'where','值7','7');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,2,'where','值8','8');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,2,'where','值9','9');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,2,'where','值10','10');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,2,'where','值11','11');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,2,'where','值12','12');
insert into filtercandidate (filterId,paramid,place,candidatetitle,candidatevalue) VALUES (109,2,'where','值13','13');




 select MIN(RP_STAR_SERVICE_DIMENSION_MON.statis_mon)  AS yyyyy,
 count (distinct RP_STAR_SERVICE_DIMENSION_MON.subs_id)  AS ssss,
   MIN(RP_STAR_SERVICE_DIMENSION_MON.cmcc_prov_prvd_id) ,
   count( distinct RP_STAR_SERVICE_DIMENSION_MON.stay_durt) ,
   RP_STAR_SERVICE_DIMENSION_MON.tgt_flag ,

   from RP_STAR_SERVICE_DIMENSION_MON

where  ( RP_STAR_SERVICE_DIMENSION_MON.stay_durt  > (3)  and  RP_STAR_SERVICE_DIMENSION_MON.stay_durt < (7) )
    and ( RP_STAR_SERVICE_DIMENSION_MON.tgt_flag )
    and ( ( RP_STAR_SERVICE_DIMENSION_MON.cmcc_prov_prvd_id  > (201210)  or  RP_STAR_SERVICE_DIMENSION_MON.cmcc_prov_prvd_id < (201510) )
     OR  ( ( RP_STAR_SERVICE_DIMENSION_MON.statis_mon > 3  and  RP_STAR_SERVICE_DIMENSION_MON.statis_mon < 5 )
     AND  ( RP_STAR_SERVICE_DIMENSION_MON.subs_id  in (54,55,51)  and  RP_STAR_SERVICE_DIMENSION_MON.subs_id not in (59,57) ) ) )


 having:  ( ( MIN(RP_STAR_SERVICE_DIMENSION_MON.cmcc_prov_prvd_id)  > 3  and    MIN(RP_STAR_SERVICE_DIMENSION_MON.cmcc_prov_prvd_id) != 5)
        OR  ( ( yyyyy  > (2)  and  yyyyy < (8) ) AND  ( ssss  != (5)  and  ssss > (3)) ) )
        and ( count( distinct RP_STAR_SERVICE_DIMENSION_MON.stay_durt)  > 4  )
