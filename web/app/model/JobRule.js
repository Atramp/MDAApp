Ext.define('mdaapp.model.JobRule', {
    extend: 'Ext.data.Model',
    
    fields: [
        {name:"ruleId",type:'int'},
        {name:"jobid",type:'int'},
        {name:"filterId",type:'int'},
        {name:"colId",type:'int'},
        {name:"resultoperatorid",type:'int'},
        {name:"isdistinct",type:'int'},
        {name:"ordernum",type:'int'},
        {name:"op1Id",type:'int'},
        {name:"op2Id",type:'int'},
        {name:"place",type:'string'},
        {name:"opconnectorid",type:'int'},
        {name:"param1value",type:'string'},
        {name:"param1type",type:'string'},
        {name:"param2value",type:'string'},
        {name:"param2type",type:'string'},
        {name:"outputtitle",type:'string'},
        {name:"windowx",type:'int'},
        {name:"windowy",type:'int'}

    ]
});
