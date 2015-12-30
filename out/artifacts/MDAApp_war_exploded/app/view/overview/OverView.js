Ext.define("mdaapp.view.overview.OverView", {
    extend: "Ext.grid.Panel",

    requires: [
        'mdaapp.view.overview.OverViewController',
        'mdaapp.view.overview.OverViewModel',
        'Ext.grid.column.Action'
    ],

    controller: "overview-overview",

    viewModel: {
        type: "overview-overview"
    },

    xtype: 'mdaJobList',

    bind: {
        store: '{jobListStore}'
    },
    //stateful: true,
    //collapsible: true,
    multiSelect: false,
    //stateId: 'stateGrid',
    tbar: [
        /*        {
         xtype: 'button',
         text: '创建新分析',
         listeners:{
         click:'createNewTask'
         }
         },*/
        {
            xtype: 'textfield',
            itemId: 'searchTaskText',
            fieldLabel: '分析任务名称',
            labelWidth: 100,
            width: 250
        },
        {
            xtype: 'button',
            text: '搜索',
            itemId: 'btSearchTask',
            listeners: {
                click: 'searchTask'
            }
        },
        ' ',
        ' ',
        {
            xtype: 'button',
            text: '创建新任务',
            listeners: {
                click: 'onCreateNewTask'
            }
        },
        {
            xtype: 'button',
            text: '复制到新任务',
            listeners: {
                click: 'duplicateTask'
            }
        },
        {
            xtype: 'button',
            text: '修改选定任务',
            listeners: {
                click: 'editTask'
            }
        },
        {
            xtype: 'button',
            text: '删除选定任务',
            listeners: {
                click: 'deleteTask'
            }
        },
        ' ',
        ' ',
        /*        {
         xtype: 'button',
         text: '预览SQL',
         listeners: {
         click: 'SQLPreview'
         }
         },
         {
         xtype: 'button',
         text: '预览结果',
         listeners: {
         click: 'resultPreview'
         }
         },*/
        {
            xtype: 'button',
            text: '立即运行',
            listeners: {
                click: 'runTask'
            }
        },
        {
            xtype: 'button',
            text: '重置任务',
            listeners: {
                click: 'resetTask'
            }
        },
        '->',
        {
            xtype: 'button',
            text: '刷新状态',
            listeners: {
                click: 'onRefresh'
            }
        }
    ],
    title: 'Array Grid',
    viewConfig: {
        enableTextSelection: true
    },

    columns: [
        {
            text: 'jobid',
            //flex     : 1,
            sortable: false,
            dataIndex: 'jobid',
            hidden: true
        },
        {
            text: '任务名称',
            //flex     : 1,
            sortable: true,
            dataIndex: 'jobname',
            width: 200

        },
        {
            text: '任务描述',
            flex: 1,
            sortable: true,
            dataIndex: 'description',
            width: 300

        },
        {
            text: '创建人',
            width: 95,
            sortable: true,
            //formatter: 'usMoney',
            dataIndex: 'creatorname'
        },
        {
            text: '创建时间',
            width: 200,
            sortable: true,
            //formatter: 'usMoney',
            dataIndex: 'createtime'
        },
        {
            text: '状态',
            width: 40,
            sortable: true,
            renderer: function (val) {
                //console.log("the current status is ", val);
                if (val == "W") {
                    return ('<span><img src="resources/pause.png" height="20" width="20" /></span>');
                } else if (val == "R") {
                    return ('<span><img src="resources/running.png" height="20" width="20" /></span>');
                } else if (val == "E") {
                    return ('<span><img src="resources/fail.png" height="20" width="20" /></span>');
                } else if (val == "S") {
                    return ('<span><img src="resources/success.png" height="20" width="20" /></span>');
                } else {
                    return ('<span>&nbsp;</span>');
                }
            },
            dataIndex: 'currentstatus'
        },
        {
            text: '完成时间',
            width: 200,
            sortable: true,
            //formatter: 'date("m/d/Y")',
            dataIndex: 'previousfinished'
        },
        {
            text: '下载结果',
            width: 100,
            sortable: true,
            //formatter: 'usMoney',
            dataIndex: 'statusdescription',
            renderer: function (val, metadata, record) {
                //console.log("the datattatatat", record);
                var data = record.data;
                //console.log("the data is ", data);
                if (data.currentstatus == "S") {
                    return ('<span><A href="' + data.outputfilename + '">下载</A></span>')
                } else
                    return ('<span>&nbsp;</span>');
                }

        },
        {
            text: '运行状态',
            width: 200,
            flex: 2,
            sortable: true,
            dataIndex: 'statusdescription',
            renderer:function(val,metadata,record){
                //console.log("the datattatatat", record);
                var data = record.data;
                //console.log("the data is ", data);
                if (data.currentstatus == "S") {
                    return (val);
                } else if (data.currentstatus == "E") {
                    metadata.tdAttr='data-qtip="' + val + '"';
                    //metadata.attr='toolTip="' + val + '"';
                    return ('<span><A href="#">显示错误信息</A></span>');
                    //return ('<span><A href="#" title="'+val+'">显示错误信息</A></span>');
                } {
                    return ('<span>&nbsp;</span>');
                }

            }

        }/*,
         {
         text: '操作',
         width: 100,
         sortable: false
         /!*            renderer: function (val) {
         var out = Ext.util.Format.number(val, '0.00%');
         if (val > 0) {
         return '<span style="color:' + "#73b51e" + ';">' + out + '</span>';
         } else if (val < 0) {
         return '<span style="color:' + "#cf4c35" + ';">' + out + '</span>';
         }
         return out;
         },
         dataIndex: 'pctChange'*!/
         }*/
    ],

    onBoxReady: function () {
        this.getViewModel().getStore("jobListStore").load();
    },

    refresh: function () {
        this.getViewModel().getStore('jobListStore').reload();
    }
});
