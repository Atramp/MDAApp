Ext.define('mdaapp.view.task.SQLPreviewerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.task-sqlpreviewer',

    onSave: function () {
        this.getView().taskWindow.onSave();
    },
    onSaveAs: function () {
        this.getView().taskWindow.onSaveAs();
    },

    onCancel: function () {
        this.getView().taskWindow.close();
    },
    onSaveUserDefinedSQL: function () {
        var me = this,
            view = me.getView(),
            model = me.getViewModel();
        if (view.taskWindow.jobId <= 0) {
            Ext.MessageBox.confirm("请确认", "新任务尚未保存，系统将同时保存新任务，是否继续？", function (btn, text) {
                //console.log(btn);
                if (btn != 'yes') {
                    return;
                }
                view.taskWindow.onSave(false, me.saveUserDefinedSQL, me);
            });
        } else {
            me.saveUserDefinedSQL();
        }
    },

    onLoad: function (store, records, successful, eOpts) {
        //console.log("the data is", records);
        var data = records[0];
        this.getView().queryById("createdSQL").setValue(data.get("sqlstatement"));
        this.getView().queryById("userSQL").setValue(data.get("usersql"));

    },

    onActive: function (obj, eOpts) {
        //this.onRefresh();

        var me = this,
            model = me.getViewModel();
        store = model.getStore('SQLStore');
        store.getProxy().setExtraParam("jobid", me.getView().taskWindow.jobId);
        store.load();
    },

    onRefresh: function () {
        var me = this,
            view = me.getView(),
            model = me.getViewModel();
        //view.taskWindow.onSave(true,me.saveCallBack,me);
        Ext.MessageBox.confirm("请确认", "刷新将自动保存任务，是否继续？", function (btn, text) {
            //console.log(btn);
            if (btn != 'yes') {
                return;
            }
            view.taskWindow.onSave(false, me.saveCallBack, me);
        });
    },

    saveCallBack: function () {
        var me = this;
        //console.log(me);
        var me = this,
            model = me.getViewModel(),
            store = model.getStore('SQLStore');
        store.getProxy().setExtraParam("jobid", me.getView().taskWindow.jobId);
        store.load();
    },

    saveUserDefinedSQL: function () {
        var me = this,
            view = me.getView(),
            model = me.getViewModel();
        var jstr = '{"jobid":' + view.taskWindow.jobId + ',';
        jstr = jstr + '"userSql":"' + view.queryById("userSQL").getValue() + '"}';

        Ext.Ajax.request({
            url: 'SQLOperator/saveUserSQL',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            jsonData: jstr,
            success: function (response) {
                var resp=Ext.JSON.decode(response.responseText,true);
                var success=!resp.hasError;//response.get("hasError");r
                //console.log(success);
                if(success){
                    model.getStore('SQLStore').reload();
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
            failure: function (response) {
                Ext.MessageBox.show({
                    title:"错误",
                    msg:response.responseText,
                    icon:Ext.MessageBox.WARNING,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    }


});
