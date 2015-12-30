Ext.define('mdaapp.view.overview.OverViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.overview-overview',

    requires:[
        "mdaapp.util.PromptWindow",
        "mdaapp.view.task.TaskView"
    ],

    onRefresh:function(){
        var store=this.getViewModel().getStore('jobListStore');
        store.load();
    },

    searchTask:function(){
        //console.log("search task");
        var me=this,
            taskName=this.getView().queryById("searchTaskText").getValue(),
            store=this.getViewModel().getStore('jobListStore');
        if(!(taskName===undefined)){
            var params={
                'taskname':taskName
            }
            store.getProxy().setExtraParams(params);
            store.load();
        }
    },

    onCreateNewTask:function(){
        //console.log("create new task");
        var me=this;
        var prompt=Ext.create("mdaapp.util.PromptWindow",{
            //caller:me, // point to the caller of this window, actually is FieldController
            callback:me.createNewTask,
            scope:me,
            createNew:true,
            commentLabel:'新任务描述',
            title:"建立新任务",
            titleLabel:"新任务名称"
        });
        prompt.show();
    },

    createNewTask:function(newTask,jobName,jobDescription){
        //console.log("new task name is ",jobName);
        //console.log("new task description is ",jobDescription);
        //console.log("the scope is ",this);
        var newTaskTitle= '分析任务：'+jobName,
            mainWnd=Ext.getCmp("mainWnd");
            //tabItemId=jobName+"-1",
            //tabs=mainWnd.queryById(tabItemId);;
        var newTab=mainWnd.add({
            title: newTaskTitle,
            xtype:'mdaTaskView',
            closable:true,
            //itemId:tabItemId,
            closeAction:'destroy',
            jobName:jobName,
            jobDescription:jobDescription,
            action:'new'
        });
        mainWnd.setActiveTab(newTab);

    },




    editTask:function(){
        var me=this;
        //me.getView().mask("请稍后....");
        var sel=this.getView().getSelection();
        //console.log("edit task",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data;
        var newTaskTitle= '分析任务：'+data.jobname,
            mainWnd=Ext.getCmp("mainWnd");
        //    tabItemId=data.jobname+data.jobid;
        //var    tabs=mainWnd.queryById(tabItemId);
        ////console.log("tab id is ",tabItemId," and tabs is ",tabs);
        //if(tabs!=null){
        //    mainWnd.setActiveTab(tabs);
        //    mainWnd.setActiveTab(tabItemId);
        //}else {
            var newTab = mainWnd.add({
                title: newTaskTitle,
                xtype: 'mdaTaskView',
                //itemId:tabItemId,
                closable: true,
                closeAction: 'destroy',
                jobId: data.jobid,
                jobName: data.jobname,
                jobDescription: data.description,
                action: 'edit'
            });
            //console.log("new tab is ",newTab);
            mainWnd.setActiveTab(newTab);
        //}
        ////console.log("edit task",data);
        //mdaapp.Current.getView()
        //me.getView().unmask();
    },

    deleteTask:function(){
        var me=this,
            sel=this.getView().getSelection();
        //console.log("delete task",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data;
        //console.log(data);
        var    msg="确认删除：" + data.jobname+ '?';
        Ext.MessageBox.confirm("确认",msg,function(btn,text){
            //console.log(btn);
           if(btn!='yes'){
               return;
           }
            Ext.Ajax.request({
                //url:'/DeleteTask',
                url:'MdaTaskServlet/deleteTask',
                method:'POST',
                params:{
                    jobid:data.jobid
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
        if(success){
            this.getViewModel().getStore('jobListStore').reload();
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

    runTask:function(){
        var me=this,
            sel=this.getView().getSelection();
        //console.log("delete task",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data;
        //console.log(data);
        var    msg="确认立即运行任务：" + data.jobname+ '?';
        Ext.MessageBox.confirm("确认",msg,function(btn,text){
            //console.log(btn);
            if(btn!='yes'){
                return;
            }
            Ext.Ajax.request({
                url:'MdaTaskServlet/runTask',
                method:'POST',
                params:{
                    jobid:data.jobid
                },
                success:function(response){
                    //console.log("the response is ",response);
                    var resp=Ext.JSON.decode(response.responseText,true);
                    var success=!resp.hasError;//response.get("hasError");r
                    ////console.log(success);
                    if(success){
                        me.getViewModel().getStore('jobListStore').reload();
                        Ext.MessageBox.alert("运行任务","任务启动成功")
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
        },this);
    },

    duplicateTask:function(){
        var me=this,
            sel=this.getView().getSelection();
        //console.log("delete task",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data;
        var prompt=Ext.create("mdaapp.util.PromptWindow",{
            //caller:me, // point to the caller of this window, actually is FieldController
            callback:function(newTask,jobName,jobDescription){
                Ext.Ajax.request({
                    url:'MdaTaskServlet/duplicateTask',
                    method:'POST',
                    params:{
                        jobid:data.jobid,
                        jobName:jobName,
                        jobDescription:jobDescription
                    },
/*                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },*/
                    success:function(response){
                        //console.log("the response is ",response);
                        var resp=Ext.JSON.decode(response.responseText,true);
                        var success=!resp.hasError;//response.get("hasError");r
                        ////console.log(success);
                        if(success || resp.hasError=='false'){
                            me.getViewModel().getStore('jobListStore').reload();
                            //Ext.MessageBox.alert("运行任务","任务启动成功")
                            var mainWnd=Ext.getCmp("mainWnd");

                            var newTab = mainWnd.add({
                                title: jobName,
                                xtype: 'mdaTaskView',
                                //itemId:tabItemId,
                                closable: true,
                                closeAction: 'destroy',
                                jobId: resp['newJobId'],
                                jobName: jobName,
                                jobDescription: jobDescription,
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
            commentLabel:'新任务描述',
            title:"复制到新任务",
            titleLabel:"新任务名称"
        });
        prompt.show();
    },

    resetTask:function(){
        var me=this,
            sel=this.getView().getSelection();
        //console.log("delete task",sel);
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var data=sel[0].data;
        //console.log(data);
        var    msg="重置任务会结束当前正在运行的任务，并删除输出数据， 是否继续？";
        Ext.MessageBox.confirm("确认",msg,function(btn,text){
            //console.log(btn);
            if(btn!='yes'){
                return;
            }
            Ext.Ajax.request({
                url:'MdaTaskServlet/resetTask',
                method:'POST',
                params:{
                    jobid:data.jobid
                },
                success:function(response){
                    //console.log("the response is ",response);
                    var resp=Ext.JSON.decode(response.responseText,true);
                    var success=!resp.hasError;//response.get("hasError");r
                    ////console.log(success);
                    if(success){
                        me.getViewModel().getStore('jobListStore').reload();
                        Ext.MessageBox.alert("任务重置","任务重置成功")
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
                        msg:"提交操作请求错误，请联系管理员",
                        icon:Ext.MessageBox.WARNING,
                        buttons:Ext.MessageBox.OK
                    });
                }
            })
        },this);
    }





});
