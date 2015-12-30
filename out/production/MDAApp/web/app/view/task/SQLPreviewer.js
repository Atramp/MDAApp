Ext.define("mdaapp.view.task.SQLPreviewer", {
    extend: "Ext.panel.Panel",

    requires: [
        "mdaapp.view.task.SQLPreviewerController",
        "mdaapp.view.task.SQLPreviewerModel"
    ],

    controller: "task-sqlpreviewer",
    viewModel: {
        type: "task-sqlpreviewer"
    },
    taskWindow:null,
    xtype: 'sql-previewer',
    showSave:true,

    tbar: {
        border: true,
        itemId: 'topbar',
        items: [
            // ExtraTools will be defined in the child class, the same as toolbar format
            // the onboxReady will add these children to tool bar
            '->',
            {
                xtype: 'button',
                text: '保存用户定义SQL',
                toolTip: '将用户定义SQL保存至任务，此SQL优先级高于系统生成SQL',
                handler: 'onSaveUserDefinedSQL'
            },

            {
                xtype: 'button',
                text: '刷新',
                toolTip: '刷新页面数据',
                handler: 'onRefresh'
            },
            ' ',
            ' ',
            {
                xtype: 'button',
                text: '另存为',
                toolTip: '将任务另存为新任务',
                handler: 'onSaveAs',
                itemId:'saveAsButton'
            },
            {
                xtype: 'button',
                text: '保存',
                toolTip: '保存当前数据',
                handler: 'onSave',
                itemId:'saveButton'
            },{
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
    items: [
        {
            layout: {
                type: "vbox",
                pack: 'start',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'textarea',
                    itemId: 'createdSQL',
                    grow: true,
                    name: 'message',
                    fieldLabel: '系统生成SQL',
                    flex: 1,
                    labelAlign:'top',
                    editable:false
                    //labelWidth: 0
                },
                {
                    xtype: 'textarea',
                    itemId: 'userSQL',
                    grow: true,
                    flex: 1,
                    name: 'message',
                    labelAlign:'top',
                    fieldLabel: '用户自定义SQL'
                    //labelWidth: 0
                }
            ]
        }
    ],

    listeners:{
        activate:'onActive'
    },

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
