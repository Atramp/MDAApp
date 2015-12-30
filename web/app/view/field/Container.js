Ext.define("mdaapp.view.field.Container", {
    extend: "Ext.panel.Panel",
    //extend: "Ext.container.Container",

    requires: [
        "mdaapp.view.field.ContainerController",
        "mdaapp.view.field.ContainerModel"
    ],

    taskWindow:null,

    controller: "field-container",

    viewModel: {
        type: "field-container"
    },

    tbar: {
        border: true,
        itemId: 'topbar',
        items: [
            // ExtraTools will be defined in the child class, the same as toolbar format
            // the onboxReady will add these children to tool bar
            ' ',
            ' ',
            {
                xtype: 'button',
                text: '清除',
                toolTip: '清除当前数据',
                handler: 'onClear'
            },
            ' ',
            ' ',
            {
                xtype: 'button',
                text: '另存为',
                toolTip: '将任务另存为新任务',
                handler: 'onSaveAs'
            },
            {
                xtype: 'button',
                text: '保存',
                toolTip: '保存当前数据',
                handler: 'onSave'
            },
            {
                xtype: 'button',
                text: '取消',
                toolTip: '关闭当前页面不保存数据',
                handler: 'onCancel'
            }
        ]
    },
    items: [
        {
            layout: 'absolute',
            listeners: {
                element: 'element',
                click: 'connectorSelected',
                mouseMove: 'connectorChoice'
            },
            itemId: 'drawer',
            xtype: 'draw',
            //scrollable: 'vertical',
            scrollable: 'both',
            border: true
        }
    ],

    getDrawComponent: function () {
        return (this.queryById("drawer"));
    },

    onBoxReady: function () {
        var toolbar = this.queryById('topbar');
        ////console.log(toolbar );
        if(this.ExtraTools) {
            for (var len = this.ExtraTools.length, i = len - 1; i >= 0; i--) {
                toolbar.insert(0, this.ExtraTools[i]);
            }
        }
        this.callParent();
    },

    toJSONString: function () {
        return (this.getViewModel().toJSONString());
    },

    getMaxOrderNumber: function () {
        return (this.getViewModel().get("maxOrder"));
    },

    setMaxOrderNumber: function (val) {
        return (this.getViewModel().set("maxOrder",val));
    },

    addField: function (field) {
        //console.log("controller", this.getController());
        this.getController().addField(field);
    },

    setTaskWindow:function(obj){
        this.taskWindow=obj;
    },

    getTaskWindow:function(){
        return(this.taskWindow);
    },

    reloadPredefinedFilter:function(){
        //should rewrite by child class
        this.getController().reloadPredefinedFilter();
    },

    clearAllIds:function(){
        this.getController().clearAllIds();
    }
    ,
    addConnector:function(connector){
        this.getController().addConnector(connector);
    },

    reformatAllConnectors: function (){
        this.getController().reformatAllConnectors();
    }
});
