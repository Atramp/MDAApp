Ext.define('mdaapp.model.FieldFilterTemplate', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'filterId', type: 'int'},
        {name: 'colId', type: 'int'},
        {name: 'opsql', type: 'string'},
        {name: 'extraSql', type: 'string'},
        {name: 'place', type: 'string'},
        {name: 'optitle', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'showdescription', type: 'int'},
        {name: 'creator', type: 'string'},
        {name: 'createtime', type: 'string'},
        {name: 'op1label', type: 'string'},
        {name: 'op1candidate', type: 'string'},
        {name: 'showoperator1', type: 'boolean'},
        {name: 'param1leftlabel', type: 'string'},
        {name: 'param1style', type: 'string'},
        {name: 'param1rightlabel', type: 'string'},
        {name: 'opconnectorid', type: 'int'},
        {name: 'connectorcandidate', type: 'string'},
        {name: 'paramcount', type: 'int'},
        {name: 'op2label', type: 'string'},
        {name: 'op2candidate', type: 'string'},
        {name: 'showoperator2', type: 'boolean'},
        {name: 'param2leftlabel', type: 'string'},
        {name: 'param2style', type: 'string'},
        {name: 'param2rightlabel', type: 'string'},
        {name: 'param1checkrule', type: 'string'},
        {name: 'param2checkrule', type: 'string'},
        {name: 'paramscheckrule', type: 'string'},
        {name: 'resultoperatorid', type: 'int'},
        {name: 'op1Id', type: 'int'},
        {name: 'op2Id', type: 'int'},
        //{name: 'connectorid', type: 'int'},
        {name: 'param1value', type: 'string'},
        {name: 'param2value', type: 'string'},
        {name: 'outputtitle', type: 'string'},
        {name: 'tableName', type: 'string'},
        {name: 'colName', type: 'string'},
        {name: 'coltitle', type: 'string'},
        {name: 'tableid', type: 'int'},
        {name: 'dbtype', type: 'string'},
        {name: 'dbname', type: 'string'},
        {name: 'schemaname', type: 'string'},
        {name: 'coltype', type: 'string'},
        {name: 'colformat', type: 'string'},
        {name: 'colmaxlength', type: 'int'},
        {name: 'comments', type: 'string'},
        {name: 'coldecimal', type: 'int'},
        {name: 'colfraction', type: 'int'},
        {name: 'creatorname', type: 'string'},
        {name: 'tabletype', type: 'string'},
        {name: 'virtualtype', type: 'string'},
        {name: 'referenceCount', type: 'int'}

    ],

    getType:function(){
        return('template');
    }
});
