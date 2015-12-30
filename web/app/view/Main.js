Ext.define("mdaapp.view.Main", {
    extend: "Ext.panel.Panel",

    requires: [
        "Ext.plugin.Viewport",
        "mdaapp.view.MainController",
        "mdaapp.view.MainModel",
        "mdaapp.view.overview.OverView",
        "mdaapp.view.task.TaskView",
        "mdaapp.view.template.TemplateOverView",
        "mdaapp.view.template.TemplateWindow"

    ],
    controller: "main",
    viewModel: {
        type: "main"
    },
    plugins: 'viewport',

    xtype:'main-view',

    //alias:'widget.main-view',

    id:'mdaAppMainWindow',

    layout:{
        type:'fit'
    },
    tbar: {
        // turn off borders for classic theme.  neptune and crisp don't need this
        // because they are borderless by default
        border: false,
        //height:30,
        padding:'0 0 0 0',
        items: [
            {
                xtype: 'tbfill'
            },
            {
                xtype: 'label',
                text: '欢迎您：',
                style: {
                    align: 'bottom'
                }

            },
            {
                xtype: 'label',
                text: '用户名'
            },
            {
                xtype: 'tbspacer'
            },
            {
                xtype: 'button',
                //xtype:'label',
                //html:'<A HREF="#" >退出</A>',
                text: '退出',
                listeners: {
                    click: 'onExit'
                }

            },
            {
                xtype: 'tbspacer'
            }
        ]
    },

    items: [{
        xtype: 'tabpanel',
        id: 'mainWnd',
        items: [
            //{
            //    title: '主页面',
            //    //glyph: 72,
            //    html: '欢迎页面'
            //},
            {
                title: '分析任务浏览',
                //glyph: 117,
                xtype: 'mdaJobList',
                itemId:'mdaJobList'
            }, /*{

             title: '创建分析任务',
             //glyph: 85,
             xtype:'CreateNewTask'
             },*/ {
                title: '定义维度模板',
                //glyph: 42,
                xtype:'template-overview',
                itemId:'templateOverViewWnd'
            }//,
            //{
            //    title: '用户设置',
            //    //glyph: 42,
            //    html: '正在建设中.....'
            //}
        ]
    }],


    onBoxReady: function () {
        //me=this;
        //var tabbar=me.getTabBar();
        //if(tabbar){
        //    for(var i= 0,len=this.userPrompt.length;i<len;i++){
        //        tabbar.add(this.userPrompt[i]);
        //    }
        //}
        //console.log(mdaapp.Current);
        this.callParent();
    }


});
