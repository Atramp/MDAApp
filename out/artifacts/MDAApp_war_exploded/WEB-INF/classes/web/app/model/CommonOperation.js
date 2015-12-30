Ext.define('mdaapp.model.CommonOperation', {
    extend: 'Ext.data.Model',
    
    fields: [
        //{ name: 'operationid', type:'int'},
        { name: 'operationid',type:'int'},
        { name: 'dbtype', type:'string'},
        { name: 'coltype', type:'string'},
        { name: 'sqloperator', type:'string'},
        { name: 'sqltemplate', type:'string'},
        { name: 'operationplace', type:'string'},
        { name: 'operationtitle', type:'string'},
        { name: 'paramcount',type:'int'},
        {name:'virtualtype',type:'string'}
    ]
});
