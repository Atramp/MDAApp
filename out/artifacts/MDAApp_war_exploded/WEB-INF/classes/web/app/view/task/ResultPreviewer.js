Ext.define("mdaapp.view.task.ResultPreviewer", {
    extend: "Ext.grid.Panel",

    requires: [
        "mdaapp.view.task.ResultPreviewerController",
        "mdaapp.view.task.ResultPreviewerModel"
    ],

    controller: "task-resultpreviewer",
    viewModel: {
        type: "task-resultpreviewer"
    },
    xtype: 'result-previewer',
    taskWindow:null,
    showSave:true,
    //xtype:'result-previewer',
/*    viewConfig: {
        enableTextSelection: true
    },*/
    tbar: {
        border: true,
        itemId: 'topbar',
        items: [
            // ExtraTools will be defined in the child class, the same as toolbar format
            // the onboxReady will add these children to tool bar
            {
                xtype: 'combobox',
                store: {
                    type: 'array',
                    fields: ['choiceId', 'text'],
                    data: [
                        [1, '预览系统生成SQL'],
                        [2, "预览用户定义SQL"]
                    ]
                },
                bind: {
                    value: '{sqlChoice}'
                },
                fieldLabel:"预览结果选择",
                valueField: 'choiceId',
                displayField: 'text',
                queryMode: 'local'
            },
            ' ',
            {
                xtype: 'combobox',
                store: {
                    type: 'array',
                    fields: ['number', 'text'],
                    data: [
                        [10, '预览10条'],
                        [100, "预览100条"],
                        [500, "预览500条"],
                        [1000, "预览1000条"]
                    ]
                },
                bind: {
                    value: '{sampleCount}'
                },
                fieldLabel:"预览记录数",
                valueField: 'number',
                displayField: 'text',
                queryMode: 'local'
            },
            '->',
            {
                xtype: 'button',
                text: '预览',
                toolTip: '预览SQL查询结果',
                handler: 'onRefresh'
            },
            ' ',
            {
                xtype: 'button',
                text: '运行任务',
                toolTip: '立即运行任务，任务的结束后结果将保存为Excel文件',
                handler: 'onRunTask'
            },
            ' ',
            {
                xtype: 'button',
                text: '另存为',
                toolTip: '将任务另存为新任务',
                handler: 'onSaveAs',
                itemId:'saveAsButton'            },
            {
                xtype: 'button',
                text: '保存',
                toolTip: '保存当前数据',
                handler: 'onSave',
                itemId:'saveButton'

            }, {
                xtype: 'button',
                text: '取消',
                toolTip: '关闭当前页面不保存数据',
                handler: 'onCancel',
                itemId:'cancelButton'
            }
        ]
    },
    layout: {
        type: 'fit'
    },
    bind:{
        store:'{gridViewStore}'
    },

    columns: [
        {
            text: '',
            flex     : 1,
            sortable:true,
            dataIndex: 'col1',
            hidden: false
        },
        {
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col2',
            hidden:false
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col3',
            hidden:false
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col4',
            hidden:false
        },{
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col5',
            hidden:false
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col6',
            hidden:false
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col7',
            hidden:false
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col8',
            hidden:false
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col9',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col10',
            hidden:true
        },
        {
            text: '',
            flex     : 1,
            sortable:true,
            dataIndex: 'col11',
            hidden: false
        },
        {
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col12',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col13',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col14',
            hidden:true
        },{
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col15',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col16',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col17',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col18',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col19',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col20',
            hidden:true
        },
        {
            text: '',
            flex     : 1,
            sortable:true,
            dataIndex: 'col21',
            hidden: true
        },
        {
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col22',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col23',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col24',
            hidden:true
        },{
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col25',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col26',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col27',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col28',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'co29',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col30',
            hidden:true
        },
        {
            text: '',
            flex     : 1,
            sortable:true,
            dataIndex: 'col31',
            hidden: true
        },
        {
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col32',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col33',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col34',
            hidden:true
        },{
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col35',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col36',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col37',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col38',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col39',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col140',
            hidden:true
        },        {
            text: '',
            flex     : 1,
            sortable:true,
            dataIndex: 'col41',
            hidden: true
        },
        {
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col42',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col43',
            hidden:true
        },{
            text: '',
            flex     : 1,
            sortable: true,
            dataIndex: 'col44',
            hidden:true
        },{
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col45',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col46',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col47',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col48',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col49',
            hidden:true
        },
        {
            text: '',
            flex   : 1,
            sortable: true,
            dataIndex: 'col50',
            hidden:true
        }
        

    ],

    onBoxReady:function(){
        if(this.showSave){
            this.queryById('saveButton').setVisible(true);
            this.queryById('saveAsButton').setVisible(true);
            this.queryById('cancelButton').setVisible(true);
        }else{
            this.queryById('saveButton').setVisible(false);
            this.queryById('saveAsButton').setVisible(false);
            this.queryById('cancelButton').setVisible(false);
        }
    }


});
