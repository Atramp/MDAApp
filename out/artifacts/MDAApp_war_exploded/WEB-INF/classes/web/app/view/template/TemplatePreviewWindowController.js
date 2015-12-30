Ext.define('mdaapp.view.template.TemplatePreviewWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.template-templatepreviewwindow',

    requires: [
        "mdaapp.model.FieldFilter",
        "mdaapp.util.PromptWindow"
    ],

    redrawConnector: function () {
        // this function is called by field when the field is added to this window,
        // so we use an emmpty function to make it works
    },

    deleteField: function () {
        this.getView().field = null;
    },

    onSave: function () {
        var me = this,
            view = me.getView(),
            model=me.getViewModel(),
            field = view.field,
            propertyWindow = view.taskWindow.queryById("propertyContainer"),
            newOpTitle = propertyWindow.queryById("optitle").getValue(),
            newDescription = propertyWindow.queryById("description").getValue();
        //console.log(newOpTitle, "----", newDescription);
        if (newOpTitle == null || newOpTitle == '') {
            var prompt = Ext.create("mdaapp.util.PromptWindow", {
                //caller:me, // point to the caller of this window, actually is FieldController
                scope: me,
                createNew: false,
                commentLabel: '模板描述',
                title: "模板保存",
                titleLabel: "模板名称",
                titleText: newOpTitle,
                comment: newDescription,
                callback: function (newTemplate, opTitle, description) {
                    propertyWindow.queryById("optitle").setValue(opTitle);
                    propertyWindow.queryById("description").setValue(description);
                    model.set("optitle", opTitle);
                    model.set("description", description);
                    jstr = me.createFieldJsonStr(field, true);
                    console.log(jstr);
                    Ext.Ajax.request({
                        url: 'FieldFilterServlet/SaveFilterTemplate',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        jsonData: jstr,
                        success: function (response) {
                            me.processSaveResponse(response, true);
                        },
                        failure: function (response) {
                            me.processSaveResponse(response, true)
                        }
                    });
                }

            });
            prompt.show();
        } else {
            var jstr = me.createFieldJsonStr(field);
            console.log(jstr);
            Ext.Ajax.request({
                url: 'FieldFilterServlet/SaveFilterTemplate',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                jsonData: jstr,
                success: function (response) {
                    me.processSaveResponse(response);
                },
                failure: function (response) {
                    me.processSaveResponse(response)
                }
            });
        }
    },

    processSaveResponse: function (response) {
        ////console.log(this);
        var me = this,
            view = me.getView(),
            model = me.getViewModel();
        ////console.log(response);
        var resp = Ext.JSON.decode(response.responseText, true);
        var success = resp.hasError;//response.get("hasError");r
        ////console.log(success);
        if (success == 'false') {
            var oldId = view.filterId,
                newId = resp["newFilterId"];
            //alert(newId);

            //console.log("old filter ID is ", oldId, " new filter id is ", newId)
            if (oldId != newId) {
                view.filterId = newId;
                view.action = 'edit';
                model.set("filterId", newId);
                //this.loadPredefinedFilter(newId);
                //this.getView().taskWindow.reloadPredefinedFilter();
                var opTitle = view.field.getViewModel().get("optitle"),
                    newTabTitle = "修改模板：" + opTitle,
                    mainWnd = Ext.getCmp("mainWnd"),
                    activeTab = mainWnd.getActiveTab();
                activeTab.setTitle(newTabTitle);
                Ext.getCmp("mdaAppMainWindow").queryById("templateOverViewWnd").refresh();

                view.field.reloadPredefinedFilter(newId);
                //view.field.getViewModel().set("filterId", newId);
            }
            Ext.MessageBox.alert("状态", "保存维度模板成功");
        } else {
            var msg = resp.error;
            Ext.MessageBox.show({
                title: "错误",
                msg: msg,
                icon: Ext.MessageBox.WARNING
            });

        }
    },


    createFieldJsonStr: function (field, newFilter) {
        var me = this,
            fieldModel = field.getViewModel(),
            jstr;
        if (newFilter == true) {
            jstr = '{"newFilter":true,';
        } else {
            jstr = '{';
        }
        var recModel = Ext.create("mdaapp.model.FieldFilter", {});
        var recFields = recModel.getFields();
        for (var i = 0, len = recFields.length; i < len; i++) {
            var name = recFields[i].getName(),
                type = recFields[i].getType(),
                value = fieldModel.get(name);
            ////console.log("name:",name," type: ",type," value: ",value);
            if (name == 'param1value' || name == 'param2value') {
                continue; // these tow value will be setup later
            } else if (name == 'filterId') {
                value = me.getViewModel().get("filterId");
                //console.log("the filter id is ", value);
            }
            if (type == 'bool') {
                if (value === undefined || value == null) {
                    jstr = jstr + '"' + name + '":false,';
                } else if (value) {
                    jstr = jstr + '"' + name + '":true,';
                } else {
                    jstr = jstr + '"' + name + '":false,';
                }
            } else if (type == 'int') {
                if (value != null) {
                    jstr = jstr + '"' + name + '":' + value + ',';
                } else {
                    jstr = jstr + '"' + name + '":-1,';
                }
            } else {
                if (value != null) {
                    jstr = jstr + '"' + name + '":"' + value + '",';
                } else {
                    jstr = jstr + '"' + name + '":"",';
                }
            }
        }

        var place = fieldModel.get('place');
        if (place == 'where') {
            var param1value, param2value,
                param1style = fieldModel.get("param1style"),
                param2style = fieldModel.get("param2style");
            if (param1style == 'dateselector') {
                param1value = Ext.util.Format.date(fieldModel.get("param1Date"), 'Y-m-d');
            } else if (param1style == 'timeselector') {
                param1value = Ext.util.Format.date(fieldModel.get("param1Time"), 'H:mm:s');
            } else if (param1style == 'monthselector') {
                //var monthInt = (1900 + this.data.param1Month.getYear()) * 100 + this.data.param1Month.getMonth() + 1;
                //this.data.param1value = monthInt;
                param1value = Ext.util.Format.date(fieldModel.get("param1Month"), 'Ym');
            } else if (param1style == 'datetimeselector') {
                var date = fieldModel.get("param1Date");
                var time = fieldModel.get("param1Time");
                if (time) {
                    date.setHours(time.getHours());
                    date.setMinutes(time.getMinutes());
                    date.setSeconds(time.getSeconds());
                    date.setMilliseconds(time.getMilliseconds());
                }
                //this.data.param1value = date.toLocaleString();
                param1value = Ext.util.Format.date(date, 'Y-m-d H:i:s');
            } else {
                param1value = fieldModel.get("param1value");
            }
            if (param2style == 'dateselector') {
                param2value = Ext.util.Format.date(fieldModel.get("param2Date"), 'Y-m-d');
            } else if (param2style == 'timeselector') {
                param2value = Ext.util.Format.date(fieldModel.get("param2Time"), 'H:i:s');
            } else if (param2style == 'monthselector') {
                //var monthInt = (1900 + this.data.param2Month.getYear()) * 100 + this.data.param2Month.getMonth() + 1;
                //this.data.param2value = monthInt;
                param2value = Ext.util.Format.date(fieldModel.get("param2Month"), 'Ym');
            } else if (param2style == 'datetimeselector') {
                date = fieldModel.get("param2Date");
                time = fieldModel.get("param2Time");
                if (time) {
                    date.setHours(time.getHours());
                    date.setMinutes(time.getMinutes());
                    date.setSeconds(time.getSeconds());
                    date.setMilliseconds(time.getMilliseconds());
                }
                //this.data.param2value = date.toLocaleString();
                param2value = Ext.util.Format.date(date, 'Y-m-d H:i:s');
            } else {
                param2value = fieldModel.get("param2value");
            }
            jstr = jstr + '"param1value":"' + param1value + '",';
            jstr = jstr + '"param2value":"' + param2value + '",';
            // now begin to process the candidate value
            var store = fieldModel.getStore("candidate1Store");
            jstr = jstr + '"param1candidate":[  ';
            store.clearFilter();
            store.each(function (rec) {
                ////console.log(rec.toJson());
                jstr = jstr + rec.toJson() + ',';
            });
            jstr = jstr.substr(0, jstr.length - 1) + '],';
            store = fieldModel.getStore("candidate2Store");
            jstr = jstr + '"param2candidate":[  ';
            store.clearFilter();
            store.each(function (rec) {
                ////console.log(rec.toJson());
                jstr = jstr + rec.toJson() + ',';
            });
            jstr = jstr.substr(0, jstr.length - 1) + '],'


        } else if (place == 'result') {
            jstr = jstr + '"param1value":"' + fieldModel.get("param1value") + '",';
            jstr = jstr + '"param2value":"' + fieldModel.get("param2value") + '",';
        } else if (place == 'groupby') {
            jstr = jstr + '"param1value":"' + fieldModel.get("param1value") + '",';
            jstr = jstr + '"param2value":"' + fieldModel.get("param2value") + '",';
            jstr = jstr + '"layerInfo":[';
            var layerStore = fieldModel.getStore("layerStore"),
                len = layerStore.getCount();
            for (var i = 0; i < len; i++) {
                jstr = jstr + layerStore.getAt(i).toJson() + ',';
            }
            if (len > 0) {
                jstr = jstr.substr(0, jstr.length - 1);
            }
            jstr = jstr + '],';
        } else if (place == 'orderby') {
            jstr = jstr + '"param1value":"' + fieldModel.get("param1value") + '",';
            jstr = jstr + '"param2value":"' + fieldModel.get("param2value") + '",';
        } else {
            jstr = jstr + '"param1value":"' + fieldModel.get("param1value") + '",';
            jstr = jstr + '"param2value":"' + fieldModel.get("param2value") + '",';
        }
        jstr = jstr.substr(0, jstr.length - 1) + '}';
        //console.log(jstr);
        return (jstr);
    },


    onReset: function () {

    },


    onSaveAs: function () {
        var me = this,
            view = me.getView(),
            field = view.field,
            fieldModel = field.getViewModel(),
            propertyWindow = view.taskWindow.queryById("propertyContainer"),
            jstr;

        var newOpTitle = propertyWindow.queryById("optitle").getValue();
        var newDescription = propertyWindow.queryById("description").getValue();
        //console.log(newOpTitle, "----", newDescription);
        //=me.createFieldJsonStr(field,true);
        var prompt = Ext.create("mdaapp.util.PromptWindow", {
            //caller:me, // point to the caller of this window, actually is FieldController
            scope: me,
            createNew: true,
            commentLabel: '新模板描述',
            title: "模板另存为",
            titleLabel: "新模板名称",
            titleText: newOpTitle,
            comment: newDescription,
            callback: function (newTemplate, opTitle, description) {
                propertyWindow.queryById("optitle").setValue(opTitle);
                propertyWindow.queryById("description").setValue(description);
                fieldModel.set("optitle", opTitle);
                fieldModel.set("description", description);
                jstr = me.createFieldJsonStr(field, true);
                Ext.Ajax.request({
                    url: 'FieldFilterServlet/SaveFilterTemplate',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    jsonData: jstr,
                    success: function (response) {
                        me.processSaveResponse(response, true);
                    },
                    failure: function (response) {
                        me.processSaveResponse(response, true)
                    }
                });
            }

        });
        prompt.show();
    },

    onCancel: function () {
        var me = this;
        me.getView().taskWindow.close();
    }

});
