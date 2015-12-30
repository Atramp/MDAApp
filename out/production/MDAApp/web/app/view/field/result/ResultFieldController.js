Ext.define('mdaapp.view.field.result.ResultFieldController', {
    extend: 'mdaapp.view.field.FieldController',
    alias: 'controller.field-result-resultfield',

    onFilterBeforeLoad: function (store, operation, eOpts) {
        ////console.log(store);
        var me=this,
            view=me.getView(),
            model = this.getViewModel();
        store.getProxy().setExtraParams(null);

        var param = {
            'place': model.get("place"),
            'colId': model.get("colId"),
            'defineTemplate':view.defineTemplate,
            'action':view.action
        };
        ////console.log(param);
        store.getProxy().setExtraParams(param);
        return (true);

    },

    filterSelected: function (combo, record, eOpts) {
        var me=this,
            view=me.getView();
        me.parseFilterRecord(record);
        if(view.defineTemplate){
            var propertyWnd=view.taskWindow.taskWindow.queryById('propertyContainer');
            ////console.log("property windows is ",propertyWnd);
            //var filterId=record.get('filterId');
            //if(filterId==2){
            //    record.set("param1style",me.getViewModel().get('defaultInputType'));
            //    record.set("param2style",me.getViewModel().get('defaultInputType'));
            //}
            propertyWnd.getController().parseRecord(record);
        }

    },

    /*    onOperationBeforeLoad: function (store, operation, eOpts) {
     ////console.log("candidate 1 before load,the store is ", store.name);
     store.getProxy().setExtraParams(null);
     var model = this.getViewModel();
     var params = {
     'place': model.get("place"),
     'dbtype': model.get("dbtype"),
     'coltype': model.get("coltype"),
     'noop': 'true'
     };
     store.getProxy().setExtraParams(params);
     //load the special operation claimed in op1candidate
     return (true);
     },*/


    resultSelected: function (combo, record, eOpts) {
        var oid = combo.getValue(),
            view=this.getView();
            model = this.getViewModel();
        ////console.log("the result operator id is ",oid);
        model.set("resultoperatorid", oid);
        if (oid > 0) {
            var filterId=model.get('filterId');
            if(filterId<=0) {
                model.set("showResultFilter1", false );
                model.set("showResultFilter2", false );
                model.set("showConnector", false );
            }else {
                model.set("showResultFilter1", true);
                //model.set("showResultFilter2", false );
                //model.set("showConnector", false );
            }
            //model.set("showResultFilter1", false || this.getView().defineTemplate);
        } else {
            //this.clearAll();
            model.set("showResultFilter1", false );
            model.set("showResultFilter2", false );
            model.set("showConnector", false );
            model.set("filterId", 0);
            //model.set("op2Id", 0);
            model.set("param1value", "");
            model.set("param2value", "");
            model.set("op1Id", 0);
            model.set("op2Id", 0);
            model.set("opconnectorid", 0);
            model.set("filterRecord", null);
            model.set("operation1Record", null);
            model.set("operation2Record", null);
            model.set("filterId", 0);
            view.queryById("filterSelector").setValue(0);
        }
        ////console.log("the result operator id is ", model.get("resultoperatorid"));
    },

    /*
     onHavingBeforeLoad: function (store, operation, eOpts) {
     var model = this.getViewModel();
     var params = {
     'place': 'having',
     'dbtype': model.get("dbtype"),
     'coltype': 'I',   // always use integer to mapping the virtual type number
     'noop': 'true'
     };
     store.getProxy().setExtraParams(params);
     //load the special operation claimed in op1candidate
     return (true);
     },
     */

    /*    onConnectionBeforeLoad: function (store, operation, eOpts) {
     var model = this.getViewModel();
     var param = {
     'coltype': 'any',
     'place': 'connector',
     'dbtype': model.get("dbtype"),
     'noop': 'true'
     }
     store.getProxy().setExtraParams(param);
     return (true);
     },*/

    connectionSelected: function (combo, record, eOpts) {
        var operID = record.get("operationid"),
            model = this.getViewModel();
        if (operID == 0) {
            //model.set("showResultFilter2", false || this.getView().defineTemplate);
            model.set("showResultFilter2", false );
        } else {
            model.set("showResultFilter2", true);
        }
        model.set("opconnectorid", operID);
    },


    havingSelected1: function (combo, record, eOpts) {
        this.getViewModel().set("showConnector", true);
    },

    clearAll: function () {
        //console.log("result field controller clear all");
        var view = this.getView(),
            viewModel = this.getViewModel(),
            op1Selector = view.queryById("havingSelector1"),
            op2Selector = view.queryById("havingSelector1"),
            connSelector = view.queryById("connectionSelector");
        //viewModel.set("showResultFilter1", false || this.getView().defineTemplate);
        //viewModel.set("showResultFilter2", false || this.getView().defineTemplate);
        //viewModel.set("showConnector", false || this.getView().defineTemplate);
        viewModel.set("showResultFilter1", false);
        viewModel.set("showResultFilter2", false);
        viewModel.set("showConnector", false);

        viewModel.set("filterId", 0);
        //viewModel.set("op2Id", 0);
        viewModel.set("param1value", "");
        viewModel.set("param2value", "");
        viewModel.set("op1Id", 0);
        viewModel.set("op2Id", 0);
        viewModel.set("opconnectorid", 0);
        viewModel.set("filterRecord", null);
        viewModel.set("operation1Record", null);
        viewModel.set("operation2Record", null);
        op1Selector.reset();
        //viewModel.getStore("havingStore1").removeAll(false);
        //delete op1Selector.lastQuery;
        op2Selector.reset();
        //delete op2Selector.lastQuery;
        connSelector.reset();
        //delete connSelector.lastQuery;
        view.queryById('textInput1').reset();
        view.queryById('textInput2').reset();
        view.queryById('titleInput').reset();
    },


    loadPredefinedFilter: function (filterId) {
        var me = this,
            model = this.getViewModel();
        //me.clearAll();
        var selector= me.getView().queryById("filterSelector");
        //delete selector.lastQuery;
        model.getStore('fieldFilter').load(function (records, operation, success) {
            //console.log("load call back");
            for (var i = 0, len = records.length; i < len; i++) {
                ////console.log(records[i].get('filterId'));
                if (records[i].get('filterId') == filterId) {
                    //model.set("filterRecord", records[i]);
                    selector.setValue(filterId);
                    me.parseFilterRecord(records[i]);
                    //break;
                }
            }
            //console.log("value set");
        });
    },


    parseFilterRecord: function (record) {
        //console.log("hhhhhhhhhh",record);

        var me = this,
            view = me.getView(),
            viewModel = this.getViewModel(),
            filterId = record.get("filterId"),
            dbtype = viewModel.get("dbtype"),
            virtualType = viewModel.get("virtualtype"),
            place = viewModel.get("place"),
            param1value = record.get("param1value"),
            param2value = record.get("param2value"),
            op1Id = record.get("op1Id"),
            op2Id = record.get("op2Id"),
            resultId = record.get("resultoperatorid"),
            connId = record.get("opconnectorid"),
            oldResultId = viewModel.get("resultoperatorid");
        viewModel.set('filterRecord', record);
        view.filterId = filterId;
        viewModel.set('filterId', filterId);
        viewModel.set("description", record.get("description"));
        //me.getView().queryById("resultSelector").setValue(resultId);
        //viewModel.set("resultoperatorid", resultId);
        viewModel.set("outputtitle", record.get("outputtitle"));
        if (filterId <= 0) {
            //if (resultId > 0) {
            //we will not change the result operator id here
            //me.getView().queryById("resultSelector").setValue(resultId);
            //viewModel.set("resultoperatorid", resultId);
            //}
            //viewModel.set("showResultFilter1", false || this.getView().defineTemplate);
            //viewModel.set("showResultFilter2", false || this.getView().defineTemplate);
            //viewModel.set("showConnector", false || this.getView().defineTemplate);
            viewModel.set("showResultFilter1", false );
            viewModel.set("showResultFilter2", false );
            viewModel.set("showConnector", false );
            viewModel.set("filterId", 0);
            //viewModel.set("op2Id", 0);
            viewModel.set("param1value", "");
            viewModel.set("param2value", "");
            viewModel.set("op1Id", 0);
            viewModel.set("op2Id", 0);
            viewModel.set("opconnectorid", 0);
            viewModel.set("filterRecord", null);
            viewModel.set("operation1Record", null);
            viewModel.set("operation2Record", null);
            viewModel.set("filterId", 0);
            //viewModel.set("outputtitle", record.get("outputtitle"));
            return;
        }
        if (filterId == 1) {
            //how come, filter id=1 is a 'where' place
            return;
        }
        if (filterId == 2) {
            //do something here
            //we will not change the result operatorhere
            viewModel.set('showResultSelector', true);
            //viewModel.set("showResultSelector", true);
            viewModel.set("showResultFilter1", true);
            //viewModel.set("showConnector", false || this.getView().defineTemplate);
            //viewModel.set("showResultFilter2", false || this.getView().defineTemplate);
            viewModel.set("showConnector", false );
            viewModel.set("showResultFilter2", false);
        } else {
            //this.clearAll();
            me.getView().queryById("resultSelector").setValue(resultId);
            viewModel.set("resultoperatorid", resultId);
            viewModel.set('showResultSelector', true);
            viewModel.set("showConnector", true);
            viewModel.set("showResultFilter1", record.get("showoperator1"));
            viewModel.set("showResultFilter2", record.get("showoperator2"));
        }
        //viewModel.set('showResultSelector', true);
        //viewModel.set("showConnector", true);
        //viewModel.set("showResultFilter1", record.get("showoperator1"));
        //viewModel.set("showResultFilter2", record.get("showoperator2"));
        var paramcount = record.get('paramcount');
        //console.log("set filter id to ", viewModel.get('filterId'));
        viewModel.set("paramcount", paramcount);
        //viewModel.set("showResultSelector", true);

        if (paramcount == 2) {
            //viewModel.set("showResultFilter1", true);
            viewModel.set("showConnector", true);
            viewModel.set("showResultFilter2", true);
        }
        viewModel.set("param1value", param1value);
        viewModel.set("param2value", param2value);
        me.getView().queryById("textInput1").setValue(param1value);
        me.getView().queryById("textInput2").setValue(param2value);
        //console.log("hhhhhhhhhhh" , record.get("outputtitle"));
        viewModel.set("outputtitle", record.get("outputtitle"));

        //if (op1Id >= 0) {
        /*            viewModel.getStore('havingStore1').load(function(){
         me.getView().queryById("havingSelector1").setValue(op1Id);
         });*/
        me.getView().queryById("havingSelector1").setValue(op1Id);
        viewModel.set("op1Id", op1Id);
        //}
        //if (op2Id >= 0) {
        //viewModel.data.op2Id=op2Id; //use = directly will not trigger the bind value change.
        /*            viewModel.getStore('havingStore2').load(function(){
         me.getView().queryById("havingSelector2").setValue(op2Id);
         });*/
        me.getView().queryById("havingSelector2").setValue(op2Id);
        viewModel.set("op2Id", op2Id);

        //}
        //viewModel.data.opconnectorid=connId;
        //if (connId >= 0) {
        //viewModel.data.opconnectorid=connId;
        /*            viewModel.getStore('connectionStore').load(function(){
         me.getView().queryById("connectionSelector").setValue(connId);
         });*/
        me.getView().queryById("connectionSelector").setValue(connId);
        viewModel.set("opconnectorid", connId);

        //}
        //viewModel.data.resultoperatorid=resultId;
        //if (resultId >= 0) {
        /*            viewModel.getStore('resultStore').load(function(){
         me.getView().queryById("resultSelector").setValue(resultId);
         });*/
        //viewModel.getStore('resultStore').addDataByType(true,place,dbtype,virtualType)
        //if (fileterId == 2) {
        //    me.getView().queryById("resultSelector").setValue(oldResultId);
        //    viewModel.set("resultoperatorid", oldResultId);
        //} else {
        //    me.getView().queryById("resultSelector").setValue(resultId);
        //    viewModel.set("resultoperatorid", resultId);
        //}
        //}

    },

    parseRuleFilterRecord: function (record) {
        var me = this,
            model = me.getViewModel(),
            view = me.getView();
        //console.log("the rulefilters", record);
        this.parseFilterRecord(record);
        view.taskWindow.setDistinct(record.get("isdistinct"));
        model.set("ruleId", record.get("ruleId"));
        //console.log(model.get("ruleId"));
        var filterId = record.get("filterId"),
            resultId=record.get("resultoperatorid");
        model.set("resultoperatorid",resultId);
        me.getView().queryById("resultSelector").setValue(resultId);
        //viewModel.set("resultoperatorid", resultId);
        if (filterId >= 0) {
            model.getStore("fieldFilter").load(function(){
                try {
                    view.queryById("filterSelector").setValue(filterId);
                }catch(err){}
            });

        }
    },

    setParamCount:function(newValue){

    }

});
