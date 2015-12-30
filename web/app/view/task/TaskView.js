Ext.define("mdaapp.view.task.TaskView", {
    extend: "Ext.panel.Panel",

    requires: [
        "mdaapp.view.task.TaskViewController",
        "mdaapp.view.task.TaskViewModel",
        "Ext.layout.container.Border",
        "mdaapp.view.task.tabletree.TableTree",
        "mdaapp.view.field.where.WhereField",
        "mdaapp.view.field.orderby.OrderByField",
        "mdaapp.view.field.result.ResultField",
        "mdaapp.view.field.groupby.GroupByField",
        "mdaapp.view.field.Field",
        'mdaapp.view.connector.Connector',
        'Ext.draw.Container',
        'Ext.draw.plugin.SpriteEvents',
        'mdaapp.view.field.where.WhereContainer',
        'mdaapp.view.field.result.ResultContainer',
        'mdaapp.view.field.orderby.OrderByContainer',
        'mdaapp.view.field.groupby.GroupByContainer',
        'mdaapp.view.task.SQLPreviewer',
        'mdaapp.view.task.ResultPreviewer'
    ],

    controller: "task-taskview",
    viewModel: {
        type: "task-taskview"
    },
    xtype: 'mdaTaskView',

 /*   bind:{
        jobId:'{jobId}',
        jobName: '{jobName}',
        jobDescription: '{jobDescription}'

    },*/
    jobId: 0,
    jobName: '',
    jobDescription: '',
    action: '',
    tableList: null,
    whereDropTarget: null,
    resultDropTarget: null,
    groupbyDropTarget: null,
    orderbyDropTarget: null,
    //drawContainer:null,
    margin: '0 0 0 0',
    padding: '0 0 0 0',

    closeAction:'destroy',

    layout: 'border',
    //width: 1366,
    //height: 700,

    bodyBorder: false,
    //deferredRender : false,

    defaults: {
        collapsible: true,
        split: true
    },
    listeners: {
        close:'onClose'
    },
    items: [
        {
            title: '请选择字段',
            region: 'west',
            xtype: 'table-fields',
            itemId: 'fieldContainer',
            floatable: true,
            width: 400,
            minWidth: 250,
            maxWidth: 600
        },
        {
            xtype: 'tabpanel',
            itemId: "mainContainer",
            autoDestroy: false,
            //frame: true,
            collapsible: false,
            deferredRender: false,
            region: 'center',
            items: [
                {
                    title: '输出结果',
                    xtype: 'result-container',
                    layout: 'fit',
                    itemId: 'resultContainer'
                },
                {
                    title: '条件选择',
                    xtype: 'where-container',
                    layout: 'fit',
                    itemId: 'whereContainer'
                },
                {
                    title: '分组和分档',
                    xtype: 'groupby-container',
                    layout: 'fit',
                    itemId: 'groupbyContainer'
                },
                {
                    title: '排序选择',
                    xtype: 'orderby-container',
                    layout: 'fit',
                    itemId: 'orderbyContainer'
                },
                {
                    title: 'SQL预览',
                    xtype: 'sql-previewer',
                    layout: 'fit',
                    itemId: 'sqlPreviewer',
                    showSave:true
                },
                {
                    title: '结果预览',
                    xtype:'result-previewer',
                    layout: 'fit',
                    itemId: 'resultPreviewer',
                    showSave:true
                }
            ]
        }
    ],

    onBoxReady: function () {
        //call parent
        var me=this;
        this.callParent();
        me.setLoading(true);
        //creaet all drag-drop target
        this.getController().createAllDD();
        // set the taskWindow handler of all the element
        this.queryById('fieldContainer').taskWindow = this;
        this.queryById('sqlPreviewer').taskWindow = this;
        this.queryById('resultPreviewer').taskWindow = this;
        this.queryById('resultContainer').taskWindow=this;
        this.queryById('whereContainer').taskWindow=this;
        this.queryById('groupbyContainer').taskWindow=this;
        this.queryById('orderbyContainer').taskWindow=this;
        // if we need to edit a task, load it
        if (this.action == 'edit') {
            this.getController().loadJob(this.jobid)
        }else{
            this.setLoading(false);
        }

    },

    onSave: function (showAlert,callbackFunction,callbackScope) {
        this.getController().onSave(showAlert,callbackFunction,callbackScope);
    },

    onSaveAs: function () {
        this.getController().onSaveAs();
    },

    setTableList: function (tlist) {
        this.tableList = tlist;
    },

    getTableList: function () {
        return (this.tableList);
    }
});
