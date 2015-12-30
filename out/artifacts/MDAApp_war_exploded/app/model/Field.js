Ext.define('mdaapp.model.Field', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'colId', type: 'int'},
        {name: 'tableid', type: 'int'},
        {name: 'colname', type: 'string'},
        {name: 'coltype', type: 'string'},
        {name: 'colformat', type: 'string'},
        {name: 'colmaxlength', type: 'int'},
        {name: 'coldecimal', type: 'int'},
        {name: 'colfraction', type: 'int'},
        {name: 'comments', type: 'string'},
        {name: 'coltitle', type: 'string'},
        {name: 'dbtype', type: 'string'},
        {name: 'dbname', type: 'string'},
        {name: 'schemaname', type: 'string'},
        {name: 'tablename', type: 'string'},
        {name: 'tabletype', type: 'string'},
        {name: 'virtualtype', type: 'string'},
        {name: 'defaultInputType', type: 'string'},
        {name: 'defaultCodeTable', type: 'string'}
    ]
});


//create view columnview as
//select
//t1.colId
//    ,t1.tableid
//    ,t1.colname
//    ,t1.coltype
//    ,t1.colformat
//    ,t1.colmaxlength
//    ,t1.coldecimal
//    ,t1.colfraction
//    ,t1.comments
//    ,t1.coltitle
//    ,t1.defaultInputType
//    ,t1.defaultCodeTable
//    ,t2.dbtype
//    ,t2.dbname
//    ,t2.schemaname
//    ,t2.tablename
//    ,t2.tabletype
//    ,t3.virtualtype
//from columns t1 inner join tables t2
//on t1.tableid=t2.tableid
//inner join typemapping t3
//on t1.coltype=t3.coltype