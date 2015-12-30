Ext.define('mdaapp.view.template.TemplateOverViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.template-templateoverview',

    requires:[
        "mdaapp.view.template.TemplateWindow"
    ],

    onClose:function(){

    },


    onRefresh:function(){
        var store=this.getViewModel().getStore('fieldFilter');
        store.load();
    },

    searchTemplate:function(){
        //console.log("search Template");
        var me=this,
            templateName=this.getView().queryById("searchTemplateText").getValue(),
            store=this.getViewModel().getStore('fieldFilter');
        if(templateName===undefined || templateName==null){
            store.getProxy().setExtraParams(null);
        }else{
            var params={
                'templatename':templateName
            }
            store.getProxy().setExtraParams(params);
            store.load();
        }
    },

    onCreateNewTemplate:function(){
        //console.log("create new Template");
        var me=this,
            mainWnd=Ext.getCmp("mainWnd");;
        var tabs=mainWnd.add({
            title:'新建维度模板',
            xtype:'template-window',
            closable:true,
            //itemId:tabItemId,
            filterId:-1,
            closeAction:'destroy',
            action:'new'
        });
        mainWnd.setActiveTab(tabs);
    },


    editTemplate:function(){
        var me=this;
        var sel=this.getView().getSelection();
        //console.log("edit Template",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data,
            referenceCount=data.referenceCount;
        if(referenceCount>0) {
            Ext.MessageBox.show({
                title: "错误",
                msg: "此模板已经被分析任务引用，不能修改，建议新建或复制为新模板",
                icon: Ext.MessageBox.WARNING,
                buttons: Ext.MessageBox.OK
            });
            return;
        }
        var newTemplateTitle= "修改模板："+data.optitle,
            mainWnd=Ext.getCmp("mainWnd");
        var newTab = mainWnd.add({
            title: newTemplateTitle,
            xtype: 'template-window',
            //itemId:tabItemId,
            closable: true,
            closeAction: 'destroy',
            filterId: data.filterId,
            templateRecord:sel[0],
            //jobName: data.jobname,
            //jobDescription: data.description,
            action: 'edit'
        });
        //console.log("new tab is ",newTab);
        mainWnd.setActiveTab(newTab);

    },

    deleteTemplate:function(){
        var me=this,
            sel=this.getView().getSelection();
        //console.log("delete Template",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data,
            referenceCount=data.referenceCount;
        if(referenceCount>0) {
            Ext.MessageBox.show({
                title: "错误",
                msg: "此模板已经被分析任务引用，不能删除，请先删除分析任务",
                icon: Ext.MessageBox.WARNING,
                buttons: Ext.MessageBox.OK
            });
            return;
        }
        var data=sel[0].data;
        //console.log(data);
        var    msg="确认删除维度模板：" + data.optitle + '?';
        Ext.MessageBox.confirm("确认",msg,function(btn,text){
            //console.log(btn);
            if(btn!='yes'){
                return;
            }
            Ext.Ajax.request({
                //url:'/DeleteTemplate',
                url:'FieldFilterServlet/deleteTemplate',
                method:'POST',
                params:{
                    filterId:data.filterId
                },
                success:function(response){
                    me.processSaveResponse(response);
                },
                failure:function(response){
                    me.processSaveResponse(response)
                }
            })
        },this);
    },

    processSaveResponse:function(response){
        //console.log(response);
        var resp=Ext.JSON.decode(response.responseText,true);
        var success=!resp.hasError;//response.get("hasError");r
        //console.log(success);
        if(resp.hasError=='false' || success){
            this.getViewModel().getStore('fieldFilter').reload();
        }else{
            var msg=resp.error;
            Ext.MessageBox.show({
                title:"错误",
                msg:msg,
                icon:Ext.MessageBox.WARNING,
                buttons:Ext.MessageBox.OK
            });

        }
    },

    duplicateTemplate:function(){
        var me=this,
            sel=this.getView().getSelection();
        //console.log("delete Template",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data,
            filterId=sel[0].get("filterId");
        var prompt=Ext.create("mdaapp.util.PromptWindow",{
            //caller:me, // point to the caller of this window, actually is FieldController
            callback:function(newTemplate,opTitle,description){
                Ext.Ajax.request({
                    url:'FieldFilterServlet/duplicateFilterTemplate',
                    method:'POST',
                    params:{
                        filterId:filterId,
                        optitle:opTitle,
                        description:description
                    },
                    /*                    headers: {
                     'Content-Type': 'application/json;charset=utf-8'
                     },*/
                    success:function(response){
                        //console.log("the response is ",response);
                        var resp=Ext.JSON.decode(response.responseText,true);
                        var success=!resp.hasError;//response.get("hasError");r
                        ////console.log(success);
                        if(resp.hasError=='false' || success){
                            var newFilterId=resp.newFilterId,
                                newTemplateTitle= "修改模板："+opTitle,
                                mainWnd=Ext.getCmp("mainWnd");
                            var newTab = mainWnd.add({
                                title: newTemplateTitle,
                                xtype: 'template-window',
                                closable: true,
                                closeAction: 'destroy',
                                filterId: newFilterId,
                                //templateRecord:sel[0],
                                //jobName: data.jobname,
                                //jobDescription: data.description,
                                action: 'edit'
                            });
                            //console.log("new tab is ",newTab);
                            mainWnd.setActiveTab(newTab);
                        }else{
                            var msg=resp.error;
                            Ext.MessageBox.show({
                                title:"错误",
                                msg:msg,
                                icon:Ext.MessageBox.WARNING,
                                buttons:Ext.MessageBox.OK
                            });

                        }
                    },
                    failure:function(response){
                        //me.processSaveResponse(response)
                        Ext.MessageBox.show({
                            title:"错误",
                            msg:"提交任务错误，请联系管理员",
                            icon:Ext.MessageBox.WARNING,
                            buttons:Ext.MessageBox.OK
                        });
                    }
                })
            },
            scope:me,
            createNew:true,
            commentLabel:'新模板描述',
            title:"复制到新模板",
            titleLabel:"新模板名称"
        });
        prompt.show();
    }


});
