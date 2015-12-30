Ext.define("mdaapp.view.helptable.HelpTable", {
    extend: "Ext.tree.Panel",

    requires: [
        "Ext.plugin.Viewport",
        "mdaapp.view.helptable.HelpTableController",
        "mdaapp.view.helptable.HelpTableModel",
        "mdaapp.view.Main"
    ],

    controller: "helptable-helptable",
    viewModel: {
        type: "helptable-helptable"
    },

    autoShow: true,
    id:'help-table-wnd',


    title: '维护数据库表结构',
    layout: {
        type: 'fit'
    },


    bind: {
        store: '{tableTreeStore}'
    },

    //selType: 'cellmodel',
    selType: 'rowmodel',

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            tbar: [
                {
                    xtype: 'textfield',
                    fieldLabel: '数据库名',
                    emptyText: '数据库名',
                    labelWidth: 80,
                    labelAlign: 'right',
                    itemId: 'dbnameInput'
                },
                ' ',
                {
                    xtype: 'textfield',
                    fieldLabel: '数据表名',
                    labelWidth: 80,
                    emptyText: '数据表名',
                    labelAlign: 'right',
                    itemId: 'tableNameInput'
                },
                {
                    xtype: 'button',
                    text: '导入',
                    listeners: {
                        click: 'onImport'
                    }
                },
                '->',
                {
                    xtype: 'button',
                    text: '刷新',
                    listeners: {
                        click: {
                            fn:function(){
                                me.getViewModel().getStore('tableTreeStore').reload();
                            }
                        }
                    }
                }
                //{
                //    xtype: 'button',
                //    text: '删除',
                //    listeners: {
                //        click: 'onDelete'
                //    }
                //},
                //{
                //    xtype: 'button',
                //    text: '主界面',
                //    listeners: {
                //        'click': {
                //            fn:function(){
                //                me.close();
                //                //var mainWnd = Ext.create("mdaapp.view.Main");
                //                //mainWnd.show();
                //                //me.getController().redirectTo('home');
                //                //mdaapp.Current.getController().redirectTo('home','helptable',true);
                //            }
                //        }
                //    }
                //}
            ],


            plugins: [
                {
                    ptype: 'viewport'
                }//,
                //{
                //    ptype: 'cellediting',
                //    pluginId: 'column-Editor',
                //    clicksToEdit: 2,
                //    saveBtnText: '确定',
                //    cancelBtnText: '取消',
                //    listeners:{
                //        'beforeedit':function( editor,context, eOpts){
                //            //console.log(context);
                //            var rec=context.record;
                //            //console.log(rec);
                //            if(rec.get('colId')<=0){
                //                return(false);
                //            }
                //        }
                //    }
                //}
            ],
            columns: [
                {
                    //xtype: 'treecolumn2', //this is so we know which column will show the tree
                    xtype: 'treecolumn',
                    text: '字段名称',
                    //flex: 2,
                    sortable: false,
                    dataIndex: 'coltitle',
                    width: 200,
                    renderer: function (val, metadata, record) {
                        var data = record.data;
                        if(record.get("colId")<0){
                            var comment=record.get('comments');
                            if(comment==null || comment==''){
                                return(val);
                            }else{
                                return(comment);
                            }
                        }
                        if (val == null || val == "") {
                            return (data.names);
                        } else {
                            return (val);
                        }
                    }
                },
                {
                    text: '描述',
                    sortable: true,
                    dataIndex: 'comments',
                    width: 200
                },
                {
                    text: '数据库类型',
                    dataIndex: 'dbtype',
                    hidden: true,
                    sortable: false
                },
                {
                    text: '数据库名称',
                    dataIndex: 'dbname',
                    hidden: false,
                    sortable: false
                },
                {
                    text: 'SCHEMA名称',
                    dataIndex: 'schemaname',
                    hidden: false,
                    sortable: false
                },
                {
                    text: '字段名',
                    dataIndex: 'names',
                    hidden: false,
                    sortable: false
                },
                {
                    text: '字段类型',
                    dataIndex: 'virtualtype',
                    hidden: false,
                    sortable: false
                },
                {
                    text: '输入方式',
                    dataIndex: 'defaultInputType',
                    hidden: false,
                    sortable: false,
                    width:150,
                    renderer: function (val) {
                        if (val == 'multiselector') {
                            return ('多选')
                        } else if (val == 'comboselector') {
                            return ("单选");
                        } else if (val == 'monthselector') {
                            return ("年月选择")
                        } else if (val == 'dateselector') {
                            return ("日期选择")
                        } else if (val == 'timeselector') {
                            return ("时间选择")
                        } else if (val == 'datetimeselector') {
                            return ("时间戳选择")
                        } else if (val == 'textinput') {
                            return ("文字或数字输入")
                        } else {
                            return (val);
                        }
                    }//,
                    //editor: Ext.create("Ext.form.field.ComboBox", {
                    //    store: {
                    //        type: 'array',
                    //        fields: ['value', 'text'],
                    //        data: [
                    //            ['dateselector', "日期类型"],
                    //            ["monthselector", "年月类型（YYYYMM）"],
                    //            ["timeselector", "时间类型"],
                    //            ["comboselector", "单选类型"],
                    //            ['multiselector', "多选类型"],
                    //            ["datetimeselector", "时间戳类型"],
                    //            ["textinput", "文字或数字输入类型"]
                    //        ]
                    //    },
                    //    editable: false,
                    //    hideTrigger: true,
                    //    displayField: 'text',
                    //    valueField: 'value',
                    //    queryMode: 'local'
                    //
                    //    //value:'>='
                    //})

                },
                {
                    xtype:'actioncolumn',
                    width:100,
                    items: [{
                        icon: 'resources/edit.png',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler:function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                            me.getController().editColumn(grid, rowIndex, colIndex, actionItem, event, record, row);
                        }
                    },{
                        icon: 'resources/fail.png',
                        tooltip: 'Delete',
                         handler:function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                             me.getController().deleteColumn(grid, rowIndex, colIndex, actionItem, event, record, row);
                        }
                    }]
                },
                //{name: 'schemaname', type: 'string'},
                //{name: 'tablename', type: 'string'},
                //{name: 'colname', type: 'string'},
                //{name: 'coltype', type: 'string'},
                //{name: 'colformat', type: 'string'},
                //{name: 'colmaxlength', type: 'int'},
                //{name: 'colcomment', type: 'string'},
                //{name: 'coltitle', type: 'string'},
                //{name: 'coldecimal', type: 'int'},
                //{name: 'colfraction', type: 'int'},
                //{name: 'leaf', type: 'boolean'},
                //{name: 'virtualtype', type: 'string'},
                //{name: 'names', type: 'string'},
                //{name: 'defaultInputType', type: 'string'} /*{
                //xtype: 'treecolumn3', //this is so we know which column will show the tree
                {
                    //xtype: 'treecolumn3', //this is so we know which column will show the tree
                    text: 'colId',
                    sortable: true,
                    dataIndex: 'colId',
                    hidden: true,
                    width: 20

                }, {
                    //xtype: 'treecolumn3', //this is so we know which column will show the tree
                    text: 'tableid',
                    sortable: true,
                    dataIndex: 'tableid',
                    width: 20,
                    hidden: true
                }]
        });

        me.callParent();

    },

    onBoxReady: function () {
        var me = this,
            model = me.getViewModel();
        model.getStore("tableTreeStore").load();
    }
});
