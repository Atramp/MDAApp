Ext.define('mdaapp.model.FieldFilter', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'filterId', type: 'int'},
        {name: 'colId', type: 'int'},
        {name: 'opsql', type: 'string'},
        {name: 'extraSql', type: 'string'},
        {name: 'place', type: 'string'},
        {name: 'optitle', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'showdescription', type: 'boolean'},
        {name: 'creator', type: 'string'},
        {name: 'createtime', type: 'string'},
        {name: 'op1label', type: 'string'},
        {name: 'op1candidate', type: 'string'},
        {name: 'showoperator1', type: 'boolean'},
        {name: 'param1leftlabel', type: 'string'},
        {name: 'param1style', type: 'string'},
        {name: 'param1rightlabel', type: 'string'},
        {name: 'opconnectorid', type: 'int'},
        //{name: 'opconnectiontitle', type: 'string'},
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
        {name:'showConnector',type:'boolean'},
        {name: 'param1value', type: 'string'},
        {name: 'param2value', type: 'string'},
        {name: 'outputtitle', type: 'string'}
    ],

    getType:function(){
        return('filter');
    }


});
