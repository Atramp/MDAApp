Ext.define('mdaapp.view.helptable.HelpTableModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.helptable-helptable',
    requires:[
        "mdaapp.model.TableColumnTree"
    ],

    data: {
        name: 'mdaapp'
    },

    stores: {

        tableTreeStore:new Ext.data.TreeStore({
            //type:'tree',
            //root: {
            //    expanded: false,
            //    text: ".",
            //    visible:false
            //},
            //model:'mdaapp.model.TableColumnTree',
            fields: [
                {name: 'colId', type: 'int'},
                {name: 'tableid', type: 'int'},
                {name: 'dbtype', type: 'string'},
                {name: 'dbname', type: 'string'},
                {name: 'schemaname', type: 'string'},
                {name: 'tablename', type: 'string'},
                {name: 'colname', type: 'string'},
                {name: 'coltype', type: 'string'},
                {name: 'colformat', type: 'string'},
                {name: 'colmaxlength', type: 'int'},
                {name: 'colcomment', type: 'string'},
                {name: 'coltitle', type: 'string'},
                {name: 'coldecimal', type: 'int'},
                {name: 'colfraction', type: 'int'},
                {name: 'leaf', type: 'boolean'},
                {name: 'virtualtype', type: 'string'},
                {name: 'names', type: 'string'},
                {name: 'defaultInputType', type: 'string'}
            ],
            proxy: {
                type: 'ajax',
                url: 'navigatefields'
            },
            folderSort: true,
            autoLoad: false,
            listeners: {
                load: 'tableTreeLoaded'
            }

        })
    }



});
