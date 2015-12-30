Ext.define('mdaapp.view.field.where.WhereFieldController', {
    extend: 'mdaapp.view.field.FieldController',
    alias: 'controller.field-where-wherefield',

    filterSelected: function (box, record) {
        var me=this,
            view=me.getView();

        //console.log('filter Selected', record.data);

        this.parseFilterRecord(record);
        if(view.defineTemplate){
            var propertyWnd=view.taskWindow.taskWindow.queryById('propertyContainer');
            ////console.log("property windows is ",propertyWnd);
            var filterId=record.get('filterId');
            if(filterId==1){
                record.set("param1style",me.getViewModel().get('defaultInputType'));
                record.set("param2style",me.getViewModel().get('defaultInputType'));
            }
            propertyWnd.getController().parseRecord(record);
        }

    },

    parseFilterRecord: function (record) {
        //console.log("begin to parse the filter record");
        var me=this,
            view=me.getView(),
            viewModel = this.getViewModel(),
            paramcount = record.get('paramcount');
        this.clearAll();
        viewModel.set('filterRecord', record);
        var filterId=record.get("filterId"),
            op1label = record.get("op1label"),
            op2label = record.get("op2label"),
            param1leftlabel = record.get("param1leftlabel"),
            param2leftlabel = record.get("param2leftlabel"),
            param1rightlabel = record.get("param1rightlabel"),
            param2rightlabel = record.get("param2rightlabel"),
            op1Candidate=record.get("op1candidate"),
            op2Candidate=record.get("op2candidate");
        viewModel.set("op1label",record.get("op1label"));
        viewModel.set("op2label",record.get("op2label"));
        viewModel.set("param1leftlabel",record.get("param1leftlabel"));
        viewModel.set("param2leftlabel",record.get("param2leftlabel"));
        viewModel.set("param1rightlabel",record.get("param1rightlabel"));
        viewModel.set("param2rightlabel",record.get("param2rightlabel"));
        viewModel.set("op1Candidate",record.get("op1candidate"));
        viewModel.set("op2Candidate",record.get("op2candidate"));
        viewModel.set("showoperator1",record.get("showoperator1"));
        viewModel.set("showoperator2",record.get("showoperator2"));
        viewModel.set("showConnector",record.get("showConnector"));
        viewModel.set("description",record.get("description"));
        //alert(viewModel.get('defaultInputType'));
        viewModel.set('filterId', filterId);
        ////console.log("set filter id to ",viewModel.get('filterId'));
        //viewModel.set("paramcount", paramcount);
        me.setParamCount(paramcount);

        //if (op1label === undefined || op1label == null || op1label == '') {
        //    op1label=viewModel.get("coltitle");
        //    //record.set("op1label", viewModel.get("coltitle"));
        //    viewModel.set("op1lable",op1label)
        //}
        //if (op2label === undefined || op2label == null || op2label == '') {
        //    //record.set("op2label", viewModel.get("coltitle"));
        //    op2label=viewModel.get("op2label");
        //    viewModel.set("op2label",op2label);
        //}
        //if (param1leftlabel === undefined || param1leftlabel == null || param1leftlabel == '') {
        //    record.set("param1leftlabel", '');
        //}
        //if (param2leftlabel === undefined || param2leftlabel == null || param2leftlabel == '') {
        //    record.set("param2leftlabel", '');
        //}
        //if (paramcount == 0) {
        //    //viewModel.set("showParam1", false || this.getView().defineTemplate);
        //    //viewModel.set("showParam2", false || this.getView().defineTemplate);
        //    viewModel.set("showParam1", false );
        //    viewModel.set("showParam2", false );
        //} else if (paramcount == 1) {
        //    //viewModel.set("op1label", record.get("op1label"));
        //    viewModel.set("showParam1", true);
        //    viewModel.set("showParam2", false );
        //    //viewModel.set("showParam2", false || this.getView().defineTemplate);
        //    //viewModel.set('showConnector',false)
        //} else {
        //    viewModel.set("showParam1", true);
        //    viewModel.set("showParam2", true);
        //}
        var param1style = record.get("param1style"),
            param2style = record.get("param2style"),
            param1value=record.get("param1value"),
            param2value=record.get("param2value"),
            op1Id=record.get("op1Id"),
            op2Id=record.get("op2Id"),
            connId=record.get("opconnectorid"),
            dbtype = viewModel.get("dbtype"),
            virtualType = viewModel.get("virtualtype");
        viewModel.set("param1value",param1value);
        viewModel.set("param2value",param2value);
        if(filterId==1){
            param1style=viewModel.get('defaultInputType');
            param2style=viewModel.get('defaultInputType');
            viewModel.set("showParam1", true);
            viewModel.getStore('operator1Store').addDataByType(true, "where", dbtype, virtualType);
            viewModel.getStore('operator2Store').addDataByType(true, "where", dbtype, virtualType);
        } else {
            if (op1Candidate == null || op1Candidate == "") {
                viewModel.getStore('operator1Store').addDataByType(true, "where", dbtype, virtualType);
            } else {
                viewModel.getStore('operator1Store').addDataByCandidateList(true, op1Candidate);
            }
            if (op2Candidate == null || op2Candidate == "") {
                viewModel.getStore('operator2Store').addDataByType(true, "where", dbtype, virtualType);
            } else {
                viewModel.getStore('operator2Store').addDataByCandidateList(true, op2Candidate);
            }
        }
        viewModel.set("param1style",param1style);
        viewModel.set("param2style",param2style);
        viewModel.getStore('connectionStore').addDataByPlace(true,"connector");
        viewModel.set("op1Id",op1Id);
        viewModel.set("op2Id",op2Id);
        viewModel.set("opconnectorid",connId);
        view.queryById("operator1Selector").setValue(op1Id);
        view.queryById("operator2Selector").setValue(op2Id);
        view.queryById("connectionSelector").setValue(connId);

/*        if(connId>0){
            viewModel.getStore('connectionStore').load();
        }*/
        //console.log("record.param1style:", param1style, "param2style :", param2style);
        if (viewModel.get("showParam1")) {
            if (param1style == 'comboselector') {
                viewModel.set("showComboInput1", true);
                //if(param1value!=null && param1value!=""){
                viewModel.getStore('candidate1Store').load(function(){
                    try{
                        view.queryById("comboSelector1").setValue(param1value);
                    }catch(err){}
                });
                //}
            } else if (param1style == 'dateselector') {
                viewModel.set("showDateInput1", true);
                if(param1value && param1value!=''){
                    viewModel.set("param1Date", this.parseDate(param1value));
                 }else{
                    viewModel.set("param1Date", "");
                }

            } else if (param1style == 'timeselector') {
                viewModel.set("showTimeInput1", true);
                if(param1value && param1value!='') {
                    viewModel.set("param1Time", this.parseDate(param1value));
                }else{
                    viewModel.set("param1Time", "");
                }
            } else if (param1style == 'monthselector') {
                viewModel.set("showMonthInput1", true);
                var tempDate = new Date();
                if(param1value!=null && param1value!="") {
                    tempDate.setYear(param1value / 100);
                    tempDate.setMonth(param1value % 100-1);
                    viewModel.set("param1Month", tempDate);
                }else{
                    viewModel.set("param1Month", "");
                }

            } else if (param1style == 'datetimeselector') {
                viewModel.set("showDateInput1", true);
                viewModel.set("showTimeInput1", true);
                if(param1value!=null && param1value!="") {
                    viewModel.set("param1Date", this.parseDate(param1value));
                    viewModel.set("param1Time", this.parseDate(param1value));
                }else{
                    viewModel.set("param1Date", "");
                    viewModel.set("param1Time", "");
                }

            } else if (param1style == 'multiselector') {
                viewModel.set("showTagInput1", true);
                //if(param1value!=null && param1value!=""){
                    viewModel.getStore('candidate1Store').load(function(){
                        try {
                            view.queryById("tagSelector1").setValue(param1value);
                        }catch(err){}
                    }); //load the data manually
                //}
            } else {
                viewModel.set("showTextInput1", true);
            }
        }
        if (viewModel.get("showParam2")) {
            if (param2style == 'comboselector') {
                viewModel.set("showComboInput2", true);
                //if(param2value!=null && param2value!=""){
                    viewModel.getStore('candidate2Store').load(function(){
                        try{
                            view.queryById("comboSelector2").setValue(param2value);
                        }catch(err){}
                    });
                //}
            } else if (param2style == 'dateselector') {
                viewModel.set("showDateInput2", true);
                if(param2value!=null && param2value!="") {
                    viewModel.set("param2Date", this.parseDate(param2value));
                }else{
                    viewModel.set("param2Date", "");
                }
            } else if (param2style == 'timeselector') {
                viewModel.set("showTimeInput2", true);
                if(param2value!=null && param2value!="") {
                    viewModel.set("param2Time", this.parseDate(param2value));
                }else{
                    viewModel.set("param2Time", "");
                }
            } else if (param2style == 'monthselector') {
                viewModel.set("showMonthInput2", true);
                var tempDate = new Date();
                if(param2value!=null && param2value!="") {
                    tempDate.setYear(param2value / 100);
                    tempDate.setMonth(param2value % 100 - 1);
                    viewModel.set("param2Month", tempDate);
                }else{
                    viewModel.set("param2Month", "");
                }
            } else if (param2style == 'datetimeselector') {
                viewModel.set("showDateInput2", true);
                viewModel.set("showTimeInput2", true);
                if(param2value!=null && param2value!="") {
                    viewModel.set("param2Time", this.parseDate(param2value));
                    viewModel.set("param2Date", this.parseDate(param2value));
                }else{
                    viewModel.set("param2Time", this.parseDate(param2value));
                    viewModel.set("param2Date", this.parseDate(param2value));
                }
            } else if (param2style == 'multiselector') {
                viewModel.set("showTagInput2", true);
                //if(param2value!=null && param2value!=""){
                    viewModel.getStore('candidate2Store').load(function(){
                        try {
                            view.queryById("tagSelector2").setValue(param2value);
                        }catch(err){}
                    });
               //}
            } else {
                viewModel.set("showTextInput2", true);
            }
        }
        //viewModel.getStore('operator1Store').load();
        //viewModel.getStore('operator2Store').load();
        //viewModel.getStore('candidate1Store').load();
        //viewModel.getStore('candidate2Store').load();
        //viewModel.getStore('connectionStore').load();
    },

    parseDate:function(str){
        var tempDate=new Date();
        try {
            tempDate.setTime(Ext.Date.parse(str));
        }catch(err){
            //console.log(err);
        }
        return(tempDate);
    },

/*    onOperatorBeforeLoad: function (store, operation, eOpts) {
        //console.log(" the store is ", store.name);
        store.getProxy().setExtraParams(null);
        var model = this.getViewModel();
        var filterRecord = model.get("filterRecord");
        //console.log(filterRecord);
        var filterId = filterRecord.get("filterId");
        //console.log("filter id", filterId);
        if (filterId == 0) {
            return (false);   // if no special operation ,we will not need to load
        }
        var candidate, action;
        if (filterId == 1) {
            action = "use_common";
        } else {
            action = "use_candidate";
        }
        if (store.name == "operator1Store") {
            candidate = model.get("filterRecord").get("op1candidate");
        } else {
            candidate = model.get("filterRecord").get("op2candidate");
        }
        var params = {
            'dbtype': model.get("dbtype"),
            'coltype': model.get('coltype'),
            'place': model.get("place"),
            'colId': model.get("colId"),
            'candidate': candidate,
            'action': action
        };
        store.getProxy().setExtraParams(params);
        //load the special operation claimed in op1candidate
        return (true);
    },*/

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
       // //console.log(param);
        store.getProxy().setExtraParams(param);
        return (true);
    },

    clearAll: function () {
        //var date=new Date();
        //date.setTime(Date.parse('2015-10-23 09:13:14'));
        ////console.log("clear test date ",date.toLocaleString());
        //console.log("controller clear all");
        var view = this.getView(),
            viewModel = this.getViewModel();
        viewModel.set("showTextInput1", false);
        viewModel.set("showDateInput1", false);
        viewModel.set("showTimeInput1", false);
        viewModel.set("showMonthInput1", false);
        viewModel.set("showComboInput1", false);
        viewModel.set("showTagInput1", false);
        viewModel.set("showTextInput2", false);
        viewModel.set("showDateInput2", false);
        viewModel.set("showTimeInput2", false);
        viewModel.set("showMonthInput2", false);
        viewModel.set("showComboInput2", false);
        viewModel.set("showTagInput2", false);
        viewModel.set("showDescription", false);
        viewModel.set("description", '');
        viewModel.set("creator", '');
        viewModel.set("createTime", '');

        //delete view.queryById("operator1Selector").lastQuery; // this will force the combox load data from server next time
        //delete view.queryById("operator2Selector").lastQuery; // this will force the combox load data from server next time
        //viewModel.getStore("operator1Store").removeAll(false);
        //viewModel.getStore("operator2Store").removeAll(false);
        viewModel.set("filterRecord", null);
        viewModel.set("filterId", 0);
        viewModel.set("operation1Record", null);
        viewModel.set("operation1Record", null);
        viewModel.set("operation2Record", null);
        viewModel.set("op1Id", '');
        viewModel.set("op2Id", '');
        viewModel.set("opconnectorid", 0);
        viewModel.set("param1value", "");
        viewModel.set("param2value", "");
        viewModel.set("param1Date", new Date());
        viewModel.set("param2Date", new Date());
        viewModel.set("param1Time", new Date());
        viewModel.set("param2Time", new Date());
        viewModel.set("param1Month",new Date());
        viewModel.set("param2Month", new Date());
        view.queryById('textInput1').reset();
        view.queryById("operator1Selector").reset();
        //view.queryById("operator1Selector")
        view.queryById("dateSelector1").reset();
        view.queryById("timeSelector1").reset();
        view.queryById("monthSelector1").reset();
        view.queryById("comboSelector1").reset();
        view.queryById("tagSelector1").reset();
        view.queryById('textInput2').reset();
        view.queryById("operator2Selector").reset();
        view.queryById("dateSelector2").reset();
        view.queryById("timeSelector2").reset();
        view.queryById("monthSelector2").reset();
        view.queryById("comboSelector2").reset();
        view.queryById("tagSelector2").reset();
    },

    onConnectionBeforeLoad: function (store, operation, eOpts) {
        var model = this.getViewModel();
        var param = {
            'coltype': 'any',
            'place': 'connector',
            'dbtype': model.get("dbtype"),
            'noop': 'false'
        }
        store.getProxy().setExtraParams(param);
        return (true);
    },


    onSelectorCandidateBeforeLoad: function (store, operation, eOpts) {
        //console.log("candidate before load,the store is ", store.name);
        store.getProxy().setExtraParams(null);
        var model = this.getViewModel();
        //var filterRecord = model.get("filterRecord"),
        var filterId = model.get("filterId"),
            colId=model.get('colId'),
            place=model.get('place');

        ////console.log("filter id", filterId);
        var paramid;
        if (filterId == 0 ){
            return (false);   // if no special operation ,we will not need to load
        }else if(filterId == 1){
            // if filter Id is 1 then we will use the common code table from filter candidate
            paramid=0;
        }else {
            // user defined filter, we use the user defined candidate
            if (store.name == "candidate1Store") {
                //candidate=model.get("filterRecord").get("op1candidate");
                paramid = 1;
            } else {
                //candidate=model.get("filterRecord").get("op2candidate");
                paramid = 2;
            }
        }
        var params = {
            'filterId': filterId,
            'place': place,
            'paramid': paramid,
            'colId':colId
        };
        store.getProxy().setExtraParams(params);
        //load the special operation claimed in op1candidate
        return (true);
    },

    operator1Selected: function (combo, record, eOpts) {
        var model=this.getViewModel(),
            oid=record.get("operationid");

        this.getViewModel().set("operation1Record", record);
        this.getViewModel().set("op1Id", record.get("operationid"));
        //if(oid==0){
        //    model.set("op2Id",0);
        //    model.set("param2value","");
        //    model.set("opconnectorid", 0);
        //    //this.getViewModel().set("showParam2",false);
        //}else{
        //    if(model.get("filterId")==1) {
        //        this.getViewModel().set("showParam2", true);
        //    }
        //    //if(model.get("filterId")==1){
        //    //    model.set("showTextInput2",true);
        //    //}
        //}
        //console.log("operation1Record ", this.getViewModel().get("operation1Record"));
        //console.log("op1Id ", this.getViewModel().get("op1Id"));
    },

    operator2Selected: function (combo, record, eOpts) {
        //console.log("operator2 selected param1value is ", this.getViewModel().get("param1value"));
        this.getViewModel().set("operation2Record", record);
        this.getViewModel().set("op2Id", record.get("operationid"));
        //console.log("operation2Record ", this.getViewModel().get("operation2Record"));
        //console.log("op2Id ", this.getViewModel().get("op2Id"));
    },


    loadPredefinedFilter: function (filterId) {
        var me = this,
            model = this.getViewModel(),
            selector= me.getView().queryById("filterSelector");;
        model.getStore('fieldFilter').load(function (records, operation, success) {
            for (var i = 0, len = records.length; i < len; i++) {
                ////console.log(records[i].get('filterId'));
                if (records[i].get('filterId') == filterId) {
                    model.set("filterRecord", records[i]);
                    me.parseFilterRecord(records[i]);
                    selector.setValue(filterId);
                    break;
                }
            }
            //console.log("value set");
        });
    },

    //loadPredefinedFilter: function (filterId) {
    //    var me = this,
    //        model = this.getViewModel();
    //    //me.clearAll();
    //    var selector= me.getView().queryById("filterSelector");
    //    //delete selector.lastQuery;
    //    model.getStore('fieldFilter').load(function (records, operation, success) {
    //        //console.log("load call back");
    //        for (var i = 0, len = records.length; i < len; i++) {
    //            ////console.log(records[i].get('filterId'));
    //            if (records[i].get('filterId') == filterId) {
    //                //model.set("filterRecord", records[i]);
    //                selector.setValue(filterId);
    //                me.parseFilterRecord(records[i]);
    //                //break;
    //            }
    //        }
    //        //console.log("value set");
    //    });
    //},




    parseRuleFilterRecord:function(record){
        var me=this,
            model=me.getViewModel(),
            view=me.getView();
        ////console.log("the rulefilters",record);
        //view.taskWindow.setDistinct(record.get("isdistinct"));
        model.set("ruleId",record.get("ruleId"));
        //console.log(model.get("ruleId"));
        var filterId=record.get("filterId");
        if(filterId>=0){
            model.getStore("fieldFilter").load();
            view.queryById("filterSelector").setValue(filterId);
        }
        this.parseFilterRecord(record);
    },

    setParamCount:function(paramcount){
        var me=this,
            viewModel=me.getViewModel();
        viewModel.set('paramcount',paramcount)
        if (paramcount == 0) {
            viewModel.set("showParam1", false );
            viewModel.set("showParam2", false );
            viewModel.set("showConnector", false );
        } else if (paramcount == 1) {
            viewModel.set("showParam1", true);
            viewModel.set("showParam2", false );
        } else {
            viewModel.set("showParam1", true);
            viewModel.set("showParam2", true);
        }
    }


});
