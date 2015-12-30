Ext.define('mdaapp.model.MdaJob', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'jobid', type: 'int'},
        {name: 'jobname', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'creatorname', type: 'string'},
        {name: 'createtime', type: 'string'},
        {name: 'currentstatus', type: 'string'},
        {name: 'previousfinished', type: 'string'},
        {name: 'sqlstatement', type: 'string'},
        {name: 'resultlink', type: 'string'},
        {name: 'usersql', type: 'string'},
        {name: 'statusdescription', type: 'string'},
        {name:'outputfilename',type:'string'}

    ]
});
