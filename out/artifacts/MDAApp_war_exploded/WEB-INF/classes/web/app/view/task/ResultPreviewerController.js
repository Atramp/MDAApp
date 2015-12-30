Ext.define('mdaapp.view.task.ResultPreviewerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.task-resultpreviewer',
    onSave: function () {
        this.getView().taskWindow.onSave();
    },
    onSaveAs: function () {
        this.getView().taskWindow.onSaveAs();
    },

    onCancel:function(){
        this.getView().taskWindow.close();
    },

    onRefresh:function(){
        var me=this,
            view=me.getView(),
            model=me.getViewModel(),
            store=model.getStore('resultPreviewStore');
        var jobId=view.taskWindow.jobId;
        if(jobId<=0){
            Ext.MessageBox("注意","请先保存任务");
            return;
        }
        store.getProxy().setExtraParam("jobid",jobId);
        store.getProxy().setExtraParam("sqlchoice",model.get('sqlChoice'));
        store.getProxy().setExtraParam("samplecount",model.get('sampleCount'));
        view.mask("请稍后");
        store.load();
    },

    onLoad:function(store, records, successful, eOpts){
        //console.log("successful",successful);
        //console.log("eOpts response",eOpts._response.responseText);
        var resp=Ext.JSON.decode(eOpts._response.responseText);
        //console.log("response object",resp);
        if(resp && resp.hasError ){
            var msg=resp.error;
            Ext.MessageBox.show({
                title:"错误",
                msg:msg,
                icon:Ext.MessageBox.WARNING,
                buttons:Ext.MessageBox.OK
            });
            //console.log("rrrrrrrrrrrrrrrrrrrr");
        }

        var me=this,
            view=me.getView(),
            model=me.getViewModel();
        //view.removeAll(true);
        model.getStore('gridViewStore').removeAll(false);
        for(var i=0;i<50;i++){
            view.columns[i].setVisible(false);
            view.columns[i].setText("");
        }
        if(records.length==0){
            //empty result set
            for(var i=0;i<8;i++){
                view.columns[i].setVisible(true);
            }
            view.unmask();
            return;
        }
        var data=records[0].data;
        //console.log("the title data is ",data);
        model.getStore('gridViewStore').add(data.columnData);
        for(var i=0;i<50;i++){
            view.columns[i].setVisible(false);
        }
        var colCount=data.columnCount;
        if(colCount>50){
            colCount=50;
        }
        for(var i=0;i<colCount;i++){
            var col=view.columns[i];
            col.setVisible(true);
            col.setText(data['title'+(i+1)]);
        }
        view.unmask();
    },

    onRunTask:function(){
        var me=this,
            view=me.getView();
        ////console.log("delete task",sel);
        var    msg="确认立即运行任务?";
        Ext.MessageBox.confirm("确认",msg,function(btn,text){
            //console.log(btn);
            if(btn!='yes'){
                return;
            }
            var jobId=view.taskWindow.jobId;
            if(jobId<=0){
                Ext.MessageBox("注意","请先保存任务");
                return;
            }
/*            store.getProxy().setExtraParam("jobid",jobId);
            store.getProxy().setExtraParam("sqlchoice",model.get('sqlChoice'));
            store.getProxy().setExtraParam("samplecount",model.get('sampleCount'));
            view.mask("请稍后");
            store.load();*/


            Ext.Ajax.request({
                //url:'TaskOperator/runTask',
                url:'MdaTaskServlet/runTask',
                method:'POST',
                params:{
                    jobid:jobId
                },
                success:function(response){
                    //console.log("the response is ",response);
                    var resp=Ext.JSON.decode(response.responseText,true);
                    var success=!resp.hasError;//response.get("hasError");r
                    ////console.log(success);
                    if(success){
                        //me.getViewModel().getStore('jobListStore').reload();
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
    }

});
