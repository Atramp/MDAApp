Ext.define('mdaapp.view.task.TaskViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.task-taskview',

    onClose:function(){
        Ext.getCmp('mainWnd').queryById('mdaJobList').refresh();
    },

    requires: [
        "mdaapp.util.PromptWindow",
        "mdaapp.view.field.Field",
        "mdaapp.view.field.result.ResultField",
        "mdaapp.view.field.where.WhereField",
        "mdaapp.view.field.orderby.OrderByField",
        "mdaapp.view.field.groupby.GroupByField",
        "mdaapp.view.connector.Connector"
    ],

    onSave: function (showAlert,callbackFunction,callbackScope) {
        ////console.log("save click");
        //this.getViewModel().toJSONString();
        //console.log("newtask save click");
        var me = this;
        var view = this.getView();
        if (view.action == 'new') {
            //new
            this.saveTask(true, view.jobName, view.jobDescription,showAlert,callbackFunction,callbackScope);
        } else {
            //edit
            this.saveTask(false, view.jobName, view.jobDescription,showAlert,callbackFunction,callbackScope);
        }
    },

    onSaveAs: function () {
        //console.log("newtask save as click");
        var me = this,
            view = this.getView(),
            model = this.getViewModel();
        // clear all jobid and rule ids, thus the server will create new record for each element
        model.set("jobId", -1);
        view.queryById("resultContainer").clearAllIds();
        view.queryById("whereContainer").clearAllIds();
        view.queryById("groupbyContainer").clearAllIds();
        view.queryById("orderbyContainer").clearAllIds();
        // now call the prompt window and save the task
        var prompt = Ext.create("mdaapp.util.PromptWindow", {
            //caller:me, // point to the caller of this window, actually is FieldController
            callback: me.saveTask,
            scope: me,
            createNew: true,
            commentLabel: '任务描述',
            title: "任务另存为",
            titleLabel: "任务名称"
        });
        prompt.show();
    },

    createDropTarget: function (body, place) {
        var me = this;
        return ( new Ext.dd.DropTarget(body, {
                ddGroup: 'grid-to-form',
                scope: this,
                notifyEnter: function (ddSource, e, data) {
                    //Add some flare to invite drop.
                    body.stopAnimation();
                    body.highlight();
                },
                notifyDrop: function (ddSource, e, data) {
                    // Reference the record (single selection) for readability
                    var selectedRecord = ddSource.dragData.records[0];
                    var colId = selectedRecord.get('colId');
                    me.onCreateField(place, colId, e.getX(), e.getY());
                    return true;
                }
            })
        );

    },


    //onTabChange: function (tabPanel, newCard, oldCard, eOpts) {
    createAllDD: function (tabPanel, newCard, oldCard, eOpts) {

        var taskView = this.getView(),
            result = taskView.queryById('resultContainer'),
            resultbody = result.queryById("drawer").getEl();
        ////console.log("111111111111111",tabPanel,newCard,oldCard);
        ////console.log("result", result, "resultbody", resultbody);
        if (resultbody && taskView.resultDropTarget == null) {
            ////console.log("create result dd");
            taskView.resultDropTarget = this.createDropTarget(resultbody, "result");
            result.setTaskWindow(taskView);
        }

        var where = taskView.queryById('whereContainer');
        var wherebody = where.queryById("drawer").getEl();
        ////console.log("where", where, "wherebody", wherebody);
        if (wherebody && taskView.whereDropTarget == null) {
            ////console.log("create where dd");
            taskView.whereDropTarget = this.createDropTarget(wherebody, "where");
            where.setTaskWindow(taskView);
        }
        var groupby = taskView.queryById('groupbyContainer');
        var groupbybody = groupby.queryById("drawer").getEl();
        ////console.log("group", groupby, "groupbody", groupbybody);
        if (groupbybody && taskView.groupbyDropTarget == null) {
            ////console.log("create groupby dd");
            taskView.groupbyDropTarget = this.createDropTarget(groupbybody, "groupby");
            groupby.setTaskWindow(taskView);
        }

        var orderby = taskView.queryById('orderbyContainer');
        var orderbybody = orderby.queryById("drawer").getEl();
        ////console.log("orderby", orderby, "orderbybody", orderbybody);
        if (orderbybody && taskView.orderbyDropTarget == null) {
            ////console.log("create orderby dd");
            taskView.orderbyDropTarget = this.createDropTarget(orderbybody, "orderby");
            orderby.setTaskWindow(taskView);
        }

    },

    onCreateField: function (location, colId, xPos, yPos) {
        var taskWnd = this.getView(),
            colRecord=mdaapp.Current.getColumnCacheStore().getColumnById(colId);
        var field, container, maxorder;

        if (location == "where") {
            container = this.getView().queryById("whereContainer")
            //maxorder = container.getMaxOrderNumber() + 1;
            //container.setMaxOrderNumber(maxorder)
            field = new Ext.create("mdaapp.view.field.where.WhereField", {
                place: "where",
                colId: colId,
                columnRecord:colRecord,
                taskWindow: container
            });
            //field.setOrderNumber(maxorder, true);
            container.addField(field);
        } else if (location == "result") {
            container = this.getView().queryById("resultContainer")
            //maxorder = container.getMaxOrderNumber() + 1;
            //container.setMaxOrderNumber(maxorder)
            field = new Ext.create("mdaapp.view.field.result.ResultField", {
                place: "result",
                colId: colId,
                columnRecord:colRecord,
                taskWindow: container
            });
            //field.setOrderNumber(maxorder, true);
            container.addField(field);
        } else if (location == "orderby") {
            container = this.getView().queryById("orderbyContainer")
            //maxorder = container.getMaxOrderNumber() +1;
            //container.setMaxOrderNumber(maxorder)
            field = new Ext.create("mdaapp.view.field.orderby.OrderByField", {
                place: "orderby",
                colId: colId,
                columnRecord:colRecord,
                taskWindow: container
            });
            //field.setOrderNumber(maxorder, true);
            container.addField(field);
        } else if (location == "groupby") {
            //console.log("add groupby field");
            container = this.getView().queryById("groupbyContainer")
            //maxorder = container.getMaxOrderNumber()+1 ;
            //container.setMaxOrderNumber(maxorder)
            field = new Ext.create("mdaapp.view.field.groupby.GroupByField", {
                place: "groupby",
                columnRecord:colRecord,
                colId: colId,
                taskWindow: container
            });
            //field.setOrderNumber(maxorder, true);
            container.addField(field);
        }
        field.setX(xPos);
        field.setY(yPos);
    },


    saveTask: function (newTask, jobName, jobDesc,showAlert,callbackFunction,callbackScope) {
        var me = this,
            model = me.getViewModel();
        if (newTask) {
            model.set('jobId', -1);
        }
        model.set("jobName", jobName);
        model.set("jobDescription", jobDesc);
        var jstr = model.toJSONString();
        //console.log(jstr);
        Ext.Ajax.request({
            url: 'SaveTask',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            jsonData: jstr,
            success: function (response) {
                me.processSaveResponse(response,showAlert,callbackFunction,callbackScope);
            },
            failure: function (response) {
                me.processSaveResponse(response,showAlert,callbackFunction,callbackScope)
            }
        });
    },

    processSaveResponse: function (response,showAlert,callbackFunction,callbackScope) {
        //console.log(response);
        var resp = Ext.JSON.decode(response.responseText, true),
            success = resp.hasError,
            model = this.getViewModel(),
            view=this.getView();
        //console.log(success);
        if (success == 'false') {
            model.set("jobId", resp.jobId);
            view.jobId=resp.jobId;
            model.set("jobName", resp.jobName);
            model.set("jobDescription", resp.jobDescription);
            var keyMap = resp.keyMap;
            for (var i = 0, len = keyMap.length; i < len; i++) {
                var keyId = keyMap[i];
                //console.log("the component map is", keyId);
                //console.log(keyId.componentId);
                var comp = Ext.getCmp(keyId.componentId);
                //console.log("the component is", comp);
                comp.setRuleId(keyId.ruleId);
            }
            var tab = Ext.getCmp("mainWnd").getActiveTab();
            //console.log("the active tab is ", tab)
            tab.setTitle(resp.jobName);
            this.getView().action = "edit"; // after new filter is saved,we change the action to edit current task
            if(showAlert===undefined || showAlert==null ) {
                Ext.MessageBox.alert("状态", "分析任务保存成功");
            }else if(showAlert){
                Ext.MessageBox.alert("状态", "分析任务保存成功");
            }
            if(callbackFunction!=null && callbackScope!=null){
                var newFunc=Ext.bind(callbackFunction,callbackScope);
                newFunc(response);
            }
        } else {
            var msg = resp.error;
            Ext.MessageBox.show({
                title: "错误",
                msg: msg,
                icon: Ext.MessageBox.WARNING,
                buttons:Ext.MessageBox.OK
            });

        }
    },

    loadJob: function (jobId) {
        var me = this,
            view = me.getView(),
            model = this.getViewModel();
        model.set("jobId", view.jobId);
        model.set("jobName", view.jobName);
        model.set("jobDescription", view.jobDescription);

        var store = model.getStore("ruleStore");
        store.getProxy().setExtraParam("jobid", view.jobId);
        store.load();
    },

    parseRecords: function (store, records, successful, eOpts) {
        ////console.log(records);

        var me = this,
            view = me.getView(),
            tabs = view.queryById("mainContainer"),
            resultContainer = view.queryById("resultContainer"),
            whereContainer = view.queryById("whereContainer"),
            orderbyContainer = view.queryById("orderbyContainer"),
            groupbyContainer = view.queryById("groupbyContainer");

        //I don't know why but it seems that first element add to tab will not
        //response to the mouse click or other message, so we have to add the first field
        // twice and then delete it, then every thing will be ok, this may because EXTJS has a bug
        // or some bug in my code, actually I think this is a bug in EXTJS, because if we use other way to
        // add a field , that problem does not exits
        var resultFirst=true,
            whereFirst = true,
            groupbyFirst = true,
            orderbyFirst = true;
        var fakeResult=null,
            fakeWhere = null,
            fakeOrderby = null,
            fakeGroupby = null;
        for (var i = 0, len = records.length; i < len; i++) {
            var data = records[i].data,
                colRecord=mdaapp.Current.getColumnCacheStore().getColumnById(data.colId);
            ////console.log(data);
            if (data.place == 'result') {
                tabs.setActiveTab("resultContainer");
                if(resultFirst){
                    var fakeResult = new Ext.create("mdaapp.view.field.result.ResultField", {
                        place: "result",
                        colId: data.colId,
                        taskWindow: resultContainer,
                        columnRecord:colRecord,
                        //action: 'edit',
                        ruleId: data.ruleId,
                        ruleFilterRecord: records[i]
                    });
                    //field.setRuleId(data.ruleId);
                    resultContainer.addField(fakeResult);
                    var box = resultContainer.queryById("drawer").getBox();
                    ////console.log(box);
                    ////console.log("data xy is ", data.windowx, data.windowy);
                    fakeResult.setX(box.left + data.windowx);
                    fakeResult.setY(box.top + data.windowy);
                    resultFirst=false;
                }

                var field = new Ext.create("mdaapp.view.field.result.ResultField", {
                    place: "result",
                    colId: data.colId,
                    taskWindow: resultContainer,
                    columnRecord:colRecord,
                    //action: 'edit',
                    ruleId: data.ruleId,
                    ruleFilterRecord: records[i]
                });
                //field.setRuleId(data.ruleId);
                resultContainer.addField(field);
                var box = resultContainer.queryById("drawer").getBox();
                ////console.log(box);
                ////console.log("data xy is ", data.windowx, data.windowy);
                field.setX(box.left + data.windowx);
                field.setY(box.top + data.windowy);


            } else if (data.place == 'resultConnector') {
                //we will not format connector here, after all rules(component) added to
                //the list, we will do the format again
                tabs.setActiveTab("resultContainer");
                var connector = Ext.create("mdaapp.view.connector.Connector");
                connector.setRelationShip(data.param2value);
                connector.childList = data.param1value;
                //connector.setParentBox(resultContainer.queryById("drawer").getBox(false, false));
                connector.setParentWnd(resultContainer.queryById("drawer"));
                connector.setRuleId(data.ruleId);
                resultContainer.addConnector(connector);
            } else if (data.place == 'where') {
                tabs.setActiveTab("whereContainer");
                if (whereFirst) {
                    fakeWhere = new Ext.create("mdaapp.view.field.where.WhereField", {
                        place: "where",
                        colId: data.colId,
                        taskWindow: whereContainer,
                        //action: 'edit',
                        ruleId: data.ruleId,
                        columnRecord:colRecord,
                        ruleFilterRecord: records[i]
                    });
                    whereContainer.addField(fakeWhere);
                    //whereContainer.doLayout();
                    var box = whereContainer.queryById("drawer").getBox();
                    ////console.log(box);
                    ////console.log("data xy is ", data.windowx, data.windowy);
                    fakeWhere.setX(box.x + data.windowx);
                    fakeWhere.setY(box.y + data.windowy);
                    //whereContainer.doLayout();
                    //fakefield.close();
                    whereFirst = false;
                }
                var field = new Ext.create("mdaapp.view.field.where.WhereField", {
                    place: "where",
                    colId: data.colId,
                    taskWindow: whereContainer,
                    //action: 'edit',
                    columnRecord:colRecord,
                    ruleId: data.ruleId,
                    ruleFilterRecord: records[i]
                });
                whereContainer.addField(field);
                //whereContainer.doLayout();
                var box = whereContainer.queryById("drawer").getBox();
                ////console.log(box);
                ////console.log("data xy is ", data.windowx, data.windowy);
                field.setX(box.x + data.windowx);
                field.setY(box.y + data.windowy);
            } else if (data.place == 'whereConnector') {
                tabs.setActiveTab("whereContainer");
                var connector = Ext.create("mdaapp.view.connector.Connector");
                connector.setRelationShip(data.param2value);
                connector.childList = data.param1value;
                //connector.setParentBox(whereContainer.queryById("drawer").getBox(false, false));
                connector.setParentWnd(whereContainer.queryById("drawer"));
                connector.setRuleId(data.ruleId);
                whereContainer.addConnector(connector);
            } else if (data.place == 'groupby') {
                tabs.setActiveTab("groupbyContainer");
                if (groupbyFirst) {
                    groupbyFirst = false;
                    fakeGroupby = new Ext.create("mdaapp.view.field.groupby.GroupByField", {
                        place: "groupby",
                        colId: data.colId,
                        taskWindow: groupbyContainer,
                        //action: 'edit',
                        columnRecord:colRecord,
                        ruleId: data.ruleId,
                        ruleFilterRecord: records[i]
                    });
                    groupbyContainer.addField(fakeGroupby);
                    var box = groupbyContainer.queryById("drawer").getBox();
                    ////console.log(box);
                    ////console.log("data xy is ", data.windowx, data.windowy);
                    fakeGroupby.setX(box.left + data.windowx);
                    fakeGroupby.setY(box.top + data.windowy);
                }


                var field = new Ext.create("mdaapp.view.field.groupby.GroupByField", {
                    place: "groupby",
                    colId: data.colId,
                    taskWindow: groupbyContainer,
                    //action: 'edit',
                    ruleId: data.ruleId,
                    columnRecord:colRecord,
                    ruleFilterRecord: records[i]
                });
                groupbyContainer.addField(field);
                var box = groupbyContainer.queryById("drawer").getBox();
                ////console.log(box);
                ////console.log("data xy is ", data.windowx, data.windowy);
                field.setX(box.x + data.windowx);
                field.setY(box.y + data.windowy);
            } else if (data.place == 'orderby') {
                tabs.setActiveTab("orderbyContainer");
                if (orderbyFirst) {
                    orderbyFirst = false;
                    fakeOrderby = new Ext.create("mdaapp.view.field.orderby.OrderByField", {
                        place: "orderby",
                        colId: data.colId,
                        taskWindow: orderbyContainer,
                        //action: 'edit',
                        columnRecord:colRecord,
                        ruleId: data.ruleId,
                        ruleFilterRecord: records[i]
                    });
                    orderbyContainer.addField(fakeOrderby);
                    var box = orderbyContainer.queryById("drawer").getBox();
                    ////console.log(box);
                    ////console.log("data xy is ", data.windowx, data.windowy);
                    fakeOrderby.setX(box.x + data.windowx);
                    fakeOrderby.setY(box.y + data.windowy);
                }
                var field = new Ext.create("mdaapp.view.field.orderby.OrderByField", {
                    place: "orderby",
                    colId: data.colId,
                    taskWindow: orderbyContainer,
                    //action: 'edit',
                    columnRecord:colRecord,
                    ruleId: data.ruleId,
                    ruleFilterRecord: records[i]
                });
                orderbyContainer.addField(field);
                var box = orderbyContainer.queryById("drawer").getBox();
                ////console.log(box);
                ////console.log("data xy is ", data.windowx, data.windowy);
                field.setX(box.x + data.windowx);
                field.setY(box.y + data.windowy);
            } else {

            }
        }

        // now we delete the fucking fake field
        //fakeWhere.getController().onClose();
        if(fakeResult!=null) {
            fakeResult.close();
        }

        if(fakeWhere!=null) {
            fakeWhere.close();
        }
        //fakeGroupby.getController().onClose();
        if(fakeGroupby!=null){
            fakeGroupby.close();
        }
        //fakeOrderby.getController().onClose();
        if(fakeOrderby){
            fakeOrderby.close();
        }
        // now all rules has been added to the container, we begin to reformat the connector and redraw the connection line


        tabs.setActiveTab("resultContainer");
/*        setTimeout(function(){
            me.testReformat(resultContainer,whereContainer);
        },10000);*/
        resultContainer.reformatAllConnectors();
        whereContainer.reformatAllConnectors();
        me.getView().setLoading(false);


    },

    testReformat:function(cont1,cont2){
        cont1.reformatAllConnectors();
        cont2.reformatAllConnectors();
        this.getView().unmask();
    }
});
