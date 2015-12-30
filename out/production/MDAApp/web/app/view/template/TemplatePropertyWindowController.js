Ext.define('mdaapp.view.template.TemplatePropertyWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.template-templatepropertywindow',

    requires:[
        "mdaapp.util.CandidateInput"
    ],

    onBtnCandidate1:function(){
        //console.log("candidate1");
        var me=this,
            view=me.getView();
        // here we use the cnadidate field from field preview window, for convenience
        var store = view.taskWindow.queryById('previewContainer').getField().getViewModel().getStore('candidate1Store');
        var wnd = Ext.create("mdaapp.util.CandidateInput", {
            store: store
        });
        wnd.show();
    },

    onBtnCandidate2:function(){
        //console.log("candidate2");
        var me=this,
            view=me.getView();
        // here we use the cnadidate field from field preview window, for convenience
        var store = view.taskWindow.queryById('previewContainer').getField().getViewModel().getStore('candidate2Store');
        var wnd = Ext.create("mdaapp.util.CandidateInput", {
            store: store
        });
        wnd.show();
    },
    /*    onBeforeEdit: function (editor, context, eOpts) {
     ////console.log("before edit");
     //console.log("before the editor is ", editor);
     //console.log("the context is", context);
     //console.log("thee eopts is", eOpts);
     ////console.log("get source",this.getView().getSource());
     var me = this,
     grid = me.getView(),
     colname = context.record.id;
     if (colname == 'param1candidate') {
     // here we use the cnadidate field from field preview window, for convenience
     var store = grid.taskWindow.queryById('previewContainer').getField().getViewModel().getStore('candidate1Store');
     var wnd = Ext.create("mdaapp.util.CandidateInput", {
     store: store
     });
     wnd.show();
     return (false);
     }
     if (colname == 'param2candidate') {
     // here we use the cnadidate field from field preview window, for convenience
     var store = grid.taskWindow.queryById('previewContainer').getField().getViewModel().getStore('candidate2Store');
     var wnd = Ext.create("mdaapp.util.CandidateInput", {
     store: store
     });
     wnd.show();
     return (false);
     }

     var enableEdit = grid.sourceConfig[colname].enableEdit;


     //console.log("the colname is", context.record.id);

     //console.log("the config is ", grid.sourceConfig);
     //console.log("enable edit is ", enableEdit);
     return (enableEdit);

     },*/

    onChange: function (obj, newValue, oldValue, eOpts) {
        ////console.log(obj);
        var me = this,
            view = me.getView(),
            model = me.getViewModel(),
            name = obj.getName();
        var field = view.taskWindow.queryById('previewContainer').field;
        if (field == null) {
            return;
        }
        var fieldModel = field.getViewModel();
        fieldModel.set(name, newValue);
        if (name == "showoperator1") {
            var combo = field.queryById("operator1Selector");
            if (combo) {
                combo.setValue(0);
            }
        } else if (name == "showoperator2") {
            var combo = field.queryById("operator2Selector");
            if (combo) {
                combo.setValue(0);
            }
        } else if (name == "showoperator2") {
            var combo = field.queryById("operator2Selector");
            if (combo) {
                combo.setValue(0);
            }
        } else if (name == "op1candidate") {
            //console.log(newValue, "is array ", Ext.isArray(newValue));
            var newVal = "";
            if (newValue == null) {
                return;
            }
            for (var i = 0, len = newValue.length; i < len; i++) {
                newVal = newVal + newValue[i] + ','
            }
            newVal = newVal.substr(0, newVal.length - 1);
            //console.log("new Val", newVal);
            fieldModel.set(name, newVal);
            var store = fieldModel.getStore("operator1Store");
            store.addDataByCandidateList(true, newVal);
        } else if (name == "op2candidate") {
            //console.log(newValue, "is array ", Ext.isArray(newValue));
            var newVal = "";
            if (newValue == null) {
                return;
            }
            for (var i = 0, len = newValue.length; i < len; i++) {
                newVal = newVal + newValue[i] + ','
            }
            newVal = newVal.substr(0, newVal.length - 1);
            //console.log("new Val", newVal);
            fieldModel.set(name, newVal);
            var store = fieldModel.getStore("operator2Store");
            store.addDataByCandidateList(true, newVal);
        } else if (name == "param1style") {
            var btn=view.queryById('param1candidate');
            btn.setVisible(false);
            fieldModel.set('param1value',"");
            fieldModel.set("showTextInput1", false);
            fieldModel.set("showDateInput1", false);
            fieldModel.set("showTimeInput1", false);
            fieldModel.set("showMonthInput1", false);
            fieldModel.set("showComboInput1", false);
            fieldModel.set("showTagInput1", false);
            if (newValue == 'dateselector') {
                fieldModel.set("showDateInput1", true);
            } else if (newValue == 'timeselector') {
                fieldModel.set("showTimeInput1", true);
            } else if (newValue == 'comboselector') {
                fieldModel.set("showComboInput1", true);
                btn.setVisible(true);
            } else if (newValue == 'multiselector') {
                fieldModel.set("showTagInput1", true);
                btn.setVisible(true);
            } else if (newValue == 'datetimeselector') {
                fieldModel.set("showDateInput1", true);
                fieldModel.set("showTimeInput1", true);
            } else if (newValue == 'monthselector') {
                fieldModel.set("showMonthInput1", true);
            } else {
                fieldModel.set("showTextInput1", true);

            }
        } else if (name == "param2style") {
            var btn=view.queryById('param2candidate');
            btn.setVisible(false);
            fieldModel.set('param2value',"");
            fieldModel.set("showTextInput2", false);
            fieldModel.set("showDateInput2", false);
            fieldModel.set("showTimeInput2", false);
            fieldModel.set("showMonthInput2", false);
            fieldModel.set("showComboInput2", false);
            fieldModel.set("showTagInput2", false);
            if (newValue == 'dateselector') {
                fieldModel.set("showDateInput2", true);
            }else if (newValue == 'timeselector') {
                fieldModel.set("showTimeInput2", true);
            }  else if (newValue == 'comboselector') {
                fieldModel.set("showComboInput2", true);
                btn.setVisible(true);
            } else if (newValue == 'multiselector') {
                fieldModel.set("showTagInput2", true);
                btn.setVisible(true);
            } else if (newValue == 'datetimeselector') {
                fieldModel.set("showDateInput2", true);
                fieldModel.set("showTimeInput2", true);
            } else if (newValue == 'monthselector') {
                fieldModel.set("showMonthInput2", true);
            } else {
                fieldModel.set("showTextInput2", true);
            }
        }else if(name == "paramcount"){
            field.getController().setParamCount(newValue);
        }
    },


    parseRecord: function (record,fromFieldWnd) {
        //console.log("TemplatePropertyWindowController.parseRecord ", record);
        var me = this,
            view = me.getView(),
            model = me.getViewModel(),
        //source = grid.getSource(),
            data = record.data,
            dbtype = "",
            virtualType = "",
            place="";
        if (record == null) {
            return;
        } else {
            if(record.getType()=="template") {
                place = record.get("place");
                dbtype = record.get("dbtype");
                virtualType = record.get("virtualtype");
                model.set("dbtype",dbtype);
                model.set("virtualType",virtualType);
            }else{
                place = record.get("place");
                //dbtype = record.get("dbtype");
                //virtualType = record.get("virtualtype");
                dbtype=model.get("dbtype");
                virtualType=model.get("virtualType");
            }
        }


        var placeStore = model.getStore('placeStore');
        //grid.sourceConfig['place'].editor.setStore(placeStore);

        var store = model.getStore('resultStore');
        //includeNoOperation, place, dbtype, virtualType,
        store.addDataByType(true, 'result', dbtype, virtualType);
        //grid.sourceConfig['resultoperatorid'].editor.setStore(store);
        //console.log(" result store", store);
        store = model.getStore('connectionStore');
        store.addDataByPlace();
        if (place == 'result') {
            model.set('typeResult', true);
            model.set('typeWhere', false);
            model.set("typeGroupBy",false);
            model.set("typeOrderBy",false);
            var op1store = model.getStore('operator1Store');
            //store.setPlace(place);
            //console.log("operator1 store", op1store);
            //op1store.addDataByType(true, 'having', dbtype, virtualType);
            op1store.addDataByType(true, 'having', dbtype, virtualType);
            //console.log(" rrr operator1 store", op1store.data);
            //grid.sourceConfig['op1Id'].editor.setStore(store);

            var op2store = model.getStore('operator2Store');
            //store.setPlace(place);
            op2store.addDataByType(true, 'having', dbtype, virtualType);
            //console.log(" rrr operator2 store", op2store.data);
            //grid.setSource(grid.resultSource, grid.sourceConfig);
            //grid.sourceConfig['op2Id'].editor.setStore(store);
        } else if(place=='where') {
            model.set('typeResult', false);
            model.set('typeWhere', true);
            model.set("typeGroupBy",false);
            model.set("typeOrderBy",false);

            store = model.getStore('operator1Store');
            //store.setPlace(place);
            store.addDataByType(true, place, dbtype, virtualType);
            //console.log(" operator1 store", store.data);
            //grid.sourceConfig['op1Id'].editor.setStore(store);

            store = model.getStore('operator2Store');
            //store.setPlace(place);
            store.addDataByType(true, place, dbtype, virtualType);
            //console.log(" operator2 store", store.data);
            //grid.setSource(grid.whereSource, grid.sourceConfig);
        } else if(place=='groupby') {
            model.set('typeResult', false);
            model.set('typeWhere', false);
            model.set("typeGroupBy", true);
            model.set("typeOrderBy", false);
        } else if(place=='orderby') {
            model.set('typeResult', false);
            model.set('typeWhere', false);
            model.set("typeGroupBy", false);
            model.set("typeOrderBy", true);
        }



            ////console.log('--------------------begin to dump operator1Store------------------');
        // store = model.getStore('operator1Store');
        // store.each(function(rec){
        // //console.log(rec);
        // });
        // //console.log('--------------------begin to dump operator2Store------------------');
        // store = model.getStore('operator2Store');
        // store.each(function(rec){
        // //console.log(rec);
        // });
        model.set("place", data["place"]);
        if(data.filterId>100){
            model.set("description", data["description"]);
            model.set("optitle", data["optitle"]);
        }else{
            model.set("description", "");
            model.set("optitle", "");
        }
        model.set("connectorcandidate", data["connectorcandidate"]);

        model.set("op1candidate", data["op1candidate"]);
        model.set("op1Id", data["op1Id"]);
        model.set("op1label", data["op1label"]);
        model.set("op2candidate", data["op2candidate"]);
        model.set("op2Id", data["op2Id"]);
        model.set("op2label", data["op2label"]);
        model.set("opconnectorid", data["opconnectorid"]);
        model.set("opsql", data["opsql"]);

        model.set("outputtitle", data["outputtitle"]);
        model.set("param1checkrule", data["param1checkrule"]);
        model.set("param1leftlabel", data["param1leftlabel"]);
        model.set("param1rightlabel", data["param1rightlabel"]);
        model.set("param1style", data["param1style"]);
        model.set("param1value", data["param1value"]);
        model.set("param2checkrule", data["param2checkrule"]);
        model.set("param2leftlabel", data["param2leftlabel"]);
        model.set("param2rightlabel", data["param2rightlabel"]);
        model.set("param2style", data["param2style"]);
        model.set("param2value", data["param2value"]);
        model.set("paramscheckrule", data["paramscheckrule"]);
        model.set("resultoperatorid", data["resultoperatorid"]);
        model.set("showoperator1", data["showoperator1"]);
        model.set("showoperator2", data["showoperator2"]);
        model.set("showConnector", data["showConnector"]);
        model.set("paramcount", data["paramcount"]);
        try {
            //if this function is called from field window, then these three value does not exits;
            if(!fromFieldWnd) {
                model.set("tableName", data["tableName"]);
                model.set("colName", data["colName"]);
                model.set("coltitle", data["coltitle"]);
            }
        }catch(err){
            //console.log(err);
        }
        //here we add the candidate from

        var nameList=[//"place",
                //"colName",
                //"coltitle",
                //"connectorcandidate",
                "description",
                "op1candidate",
                "op1Id",
                "op1label",
                "op2candidate",
                "op2Id",
                "op2label",
                "opconnectorid",
                "opsql",
                "optitle",
                "outputtitle",
                "param1checkrule",
                "param1leftlabel",
                "param1rightlabel",
                "param1style",
                "param1value",
                "param2checkrule",
                "param2leftlabel",
                "param2rightlabel",
                "param2style",
                "param2value",
                "paramscheckrule",
                "resultoperatorid",
                "showoperator1",
                "showoperator2",
                "showConnector",
                "paramcount"
                //"tableName",
            ],
            len=nameList.length;
        for(var i= 0;i<len;i++){
            var name=nameList[i];
            //console.log(name);
            var obj=view.queryById(name);
            if(obj){
                //console.log("set value",name);
                obj.setValue(data[name]);
            }
        }

        //try{
        //    //view.queryById("place").setValue( data["place"]);
        //    //view.queryById("colName").setValue( data["colName"]);
        //    //view.queryById("coltitle").setValue( data["coltitle"]);
        //    //view.queryById("connectorcandidate").setValue( data["connectorcandidate"]);
        //    view.queryById("description").setValue( data["description"]);
        //    view.queryById("op1candidate").setValue( data["op1candidate"]);
        //    view.queryById("op1Id").setValue( data["op1Id"]);
        //    view.queryById("op1label").setValue( data["op1label"]);
        //    view.queryById("op2candidate").setValue( data["op2candidate"]);
        //    view.queryById("op2Id").setValue( data["op2Id"]);
        //    view.queryById("op2label").setValue( data["op2label"]);
        //    view.queryById("opconnectorid").setValue( data["opconnectorid"]);
        //    view.queryById("opsql").setValue( data["opsql"]);
        //    view.queryById("optitle").setValue( data["optitle"]);
        //    //console.log(11111111111111);
        //    view.queryById("outputtitle").setValue( data["outputtitle"]);
        //    view.queryById("param1checkrule").setValue( data["param1checkrule"]);
        //    view.queryById("param1leftlabel").setValue( data["param1leftlabel"]);
        //    view.queryById("param1rightlabel").setValue( data["param1rightlabel"]);
        //    view.queryById("param1style").setValue( data["param1style"]);
        //    view.queryById("param1value").setValue( data["param1value"]);
        //    view.queryById("param2checkrule").setValue( data["param2checkrule"]);
        //    view.queryById("param2leftlabel").setValue( data["param2leftlabel"]);
        //    view.queryById("param2rightlabel").setValue( data["param2rightlabel"]);
        //    view.queryById("param2style").setValue( data["param2style"]);
        //    //console.log(22222222222222);
        //    view.queryById("param2value").setValue( data["param2value"]);
        //    view.queryById("paramscheckrule").setValue( data["paramscheckrule"]);
        //    view.queryById("resultoperatorid").setValue( data["resultoperatorid"]);
        //    view.queryById("showoperator1").setValue( data["showoperator1"]);
        //    view.queryById("showoperator2").setValue( data["showoperator2"]);
        //    view.queryById("showConnector").setValue( data["showConnector"]);
        //    view.queryById("paramcount").setValue( data["paramcount"]);
        //    view.queryById("tableName").setValue( data["tableName"]);
        //
        //}catch(err){
        //    //console.log(err);
        //}

    }



});
