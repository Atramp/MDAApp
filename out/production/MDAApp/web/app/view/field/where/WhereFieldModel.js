Ext.define('mdaapp.view.field.where.WhereFieldModel', {
    extend: 'mdaapp.view.field.FieldModel',
    alias: 'viewmodel.field-where-wherefield',

    requires: [
        "mdaapp.model.CommonOperation",
        "mdaapp.model.FieldFilter",
        "mdaapp.model.FilterCandidate"
        //"mdaapp.store.OperationStore"
    ],


    data: {
        name: 'mdaapp',
        // the record that we keep for selector
        filterRecord: null,
        operation1Record: null,
        operation2Record: null,

        filterId: 0,
        op1Id: 0,   // value of operator 1 such as >= or <=  or etc.
        op2Id: 0,   // value of operator 2 such as >= or <=  or etc.
        opconnectorid: 0,    // value of connector of two operators, such as and/or
        param1value: '',      // the data we should for param1value, if it is date/time/timestamp,we should use param1data and param1time to create it
        param1Date: '',  // this value is used by date input1
        param1Time: '',  // this value is used by time input1
        param1Month: '',  // this value is used by month input1
        param2value: '',     // the data we should for param2value, if it is date/time/timestamp,we should use param1data and param1time to create it
        param2Date: '',  // this value is used by date input2
        param2Time: '',  // this value is used by time input2
        param2Month: '',  // this value is used by month input2
        op1label:'',
        op2label:'',
        param1leftlabel:'',
        param1rightlabel:'',
        param2leftlabel:'',
        param2rightlabel:'',
        showoperator1:false,
        showoperator2:false,
        op1candidate:'',
        op2candidate:'',
        enableOrder: false, // overwrite the parent configuration thus we cannot re-order the file,bind in parent class

        // follow parameters will control that which input element will be displayed
        showParam1: false,
        showParam2: false,
        opconnectiontitle: null,
        showConnector:false,
        showTextInput1: false,
        showDateInput1: false,
        showTimeInput1: false,
        showMonthInput1: false,
        showComboInput1: false,
        showTagInput1: false,
        showTextInput2: false,
        showDateInput2: false,
        showTimeInput2: false,
        showMonthInput2: false,
        showComboInput2: false,
        showTagInput2: false,
        //showOperator1: true,
        description: '',
        showDescription: 0,
        creator: '',
        createTime: ''

    },


    stores: {
        fieldFilter: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/getPredefinedFilter'
            },
            model: "mdaapp.model.FieldFilter",
            listeners: {
                //beforeload: 'predefinedFilterBeforeLoad',
                //load: 'predefinedFilterLoad'
                beforeload: 'onFilterBeforeLoad'
            }
        },

        operator1Store:{
            autoLoad: false,
            name: 'operator1Store',
            type:'opStore',
            place:'where'
        },
        operator2Store:{
            autoLoad: false,
            name: 'operator2Store',
            type:'opStore',
            place:'where'
        },
/*
        operator1Store: {
            autoLoad: false,
            name: 'operator1Store',
            proxy: {
                type: 'ajax',
                url: '/GetAvailableOperation'
            },
            model: 'mdaapp.model.CommonOperation',
            listeners: {
                beforeLoad: 'onOperatorBeforeLoad'
            }
        },

        //operator1Store:new Ext.create("mdaapp.store.OperationStore",{}),

        operator2Store: {
            autoLoad: false,
            name: 'operator2Store',
            proxy: {
                type: 'ajax',
                url: '/GetAvailableOperation'
            },
            model: 'mdaapp.model.CommonOperation',
            listeners: {
                beforeLoad: 'onOperatorBeforeLoad'
            }
        },*/
        candidate1Store: {
            autoLoad: false,
            name: 'candidate1Store',
            proxy: {
                type: 'ajax',
                url: 'GetSelectorCandidate'
            },

            model: "mdaapp.model.FilterCandidate",
            listeners: {
                beforeLoad: 'onSelectorCandidateBeforeLoad'
            }
        },
        candidate2Store: {
            autoLoad: false,
            name: 'candidate2Store',
            proxy: {
                type: 'ajax',
                url: 'GetSelectorCandidate'
            },
            model: "mdaapp.model.FilterCandidate",
            listeners: {
                beforeLoad: 'onSelectorCandidateBeforeLoad'
            }
        },
        connectionStore:{
            autoLoad: false,
            name: 'connectionStore',
            place:'connector',
            type:'opStore'
        },

        //following store are used when define template
        //templateFilterStore:{
        //    autoLoad: false,
        //    proxy: {
        //        type: 'ajax',
        //        url: '/FieldFilterServlet/defineFilterTemplate',
        //        extraParams:{
        //            place:'where'
        //        }
        //    },
        //    model: "mdaapp.model.FieldFilter",
        //    listeners:{
        //        //load:
        //    }
        //},
        candidate1LocalStore: {
            autoLoad: false,
            type:'array',
            name: 'candidate2LocalStore',
            model: "mdaapp.model.FilterCandidate"
        },

        candidate2LocalStore: {
            autoLoad: false,
            type:'array',
            name: 'candidate2LocalStore',
            model: "mdaapp.model.FilterCandidate"
        }

    },


    toJSONString: function () {
        var filterId = this.get("filterId"),
            filterRecord = this.data.filterRecord;
        if (filterId <= 0 || filterRecord == null) {
            var jstr = '"colId":' + this.get("colId") + ',';
            jstr = jstr + '"componentid":"' + this.getView().getId() + '",'; // this is used when make up the relation of each field
            jstr = jstr + '"ordernumber":' + this.get("orderNumber") + ',';
            jstr = jstr + '"filterId":0,';   // if filter is 0 , we will not use this field in where
            jstr = jstr + '"ruleId":' + this.get("ruleId") + ",";
            jstr = jstr + '"place":"where",';
            var box = this.getView().getBox(false, true);
            jstr = jstr + '"windowx":' + box.left + ",";
            jstr = jstr + '"windowy":' + box.top + "";

            return (jstr);
        }
        //var param1style = filterRecord.get("param1style"),
        //    param2style = filterRecord.get("param2style");
        var param1style = this.get("param1style"),
            param2style = this.get("param2style");
        if (param1style == 'dateselector') {
            this.set("param1value", Ext.util.Format.date(this.data.param1Date, 'Y-m-d'));
        } else if (param1style == 'timeselector') {
            this.set("param1value", Ext.util.Format.date(this.data.param1Time, 'H:mm:s'));
        } else if (param1style == 'monthselector') {
            //var monthInt = (1900 + this.data.param1Month.getYear()) * 100 + this.data.param1Month.getMonth() + 1;
            //this.data.param1value = monthInt;
            this.set("param1value", Ext.util.Format.date(this.data.param1Month, 'Ym'));
        } else if (param1style == 'datetimeselector') {
            var date = this.data.param1Date;
            var time = this.data.param1Time;
            if (time) {
                date.setHours(time.getHours());
                date.setMinutes(time.getMinutes());
                date.setSeconds(time.getSeconds());
                date.setMilliseconds(time.getMilliseconds());
            }
            //this.data.param1value = date.toLocaleString();
            this.set("param1value", Ext.util.Format.date(date, 'Y-m-d H:i:s'));
        }
        if (param2style == 'dateselector') {
            //this.data.param2value = this.data.param2Date.toLocaleDateString();
            this.set("param2value", Ext.util.Format.date(this.data.param2Date, 'Y-m-d'));
        } else if (param2style == 'timeselector') {
            //this.data.param2value = this.data.param2Time.toLocaleTimeString( );
            this.set("param2value", Ext.util.Format.date(this.data.param2Time, 'H:i:s'));
        } else if (param2style == 'monthselector') {
            //var monthInt = (1900 + this.data.param2Month.getYear()) * 100 + this.data.param2Month.getMonth() + 1;
            //this.data.param2value = monthInt;
            this.set("param2value", Ext.util.Format.date(this.data.param2Month, 'Ym'));
        } else if (param2style == 'datetimeselector') {
            var date = this.data.param2Date;
            var time = this.data.param2Time;
            if (time) {
                date.setHours(time.getHours());
                date.setMinutes(time.getMinutes());
                date.setSeconds(time.getSeconds());
                date.setMilliseconds(time.getMilliseconds());
            }
            //this.data.param2value = date.toLocaleString();
            this.set("param2value", Ext.util.Format.date(date, 'Y-m-d H:i:s'));
        }



//        filterId: '',
//            //colId: '', included in previous section
//            opsql: '',
//            extraSql: '',
//            optitle: '',
//            description: '',
//            showdescription: true,
//            creator: '',
//            createtime: '',
//            op1label: '',
//            op1candidate: '',
//            showoperator1: true,
//            param1leftlabel: '',
//            param1style: '',
//            param1rightlabel: '',
//            opconnectorid: 0,
////opconnectiontitle: '',
//            connectorcandidate: '',
//            op2label: '',
//            op2candidate: '',
//            showoperator2: true,
//            param2leftlabel: '',
//            param2style: '',
//            param2rightlabel: '',
//            param1checkrule: '',
//            param2checkrule: '',
//            paramscheckrule: '',
//            resultoperatorid: 0,
////connectorid: '',
//            showConnector: true,
//            param1value: '',
//            param2value: '',
//            outputtitle: '',

        var jstr = '"colId":' + this.get("colId") + ',';
        jstr = jstr + '"componentid":"' + this.getView().getId() + '",'; // this is used when make up the relation of each field
        jstr = jstr + '"place":"' + this.get("place") + '",';
        jstr = jstr + '"ordernum":' + this.get("orderNumber") + ',';
        jstr = jstr + '"filterId":' + filterId + ',';
        jstr = jstr + '"ruleId":' + this.get("ruleId") + ',';
        jstr = jstr + '"op1Id":' + this.data.op1Id + ',';
        jstr = jstr + '"param1value":"' + this.data.param1value + '",';
        jstr = jstr + '"opconnectorid":"' + this.data.opconnectorid + '",';
        jstr = jstr + '"op2Id":' + this.data.op2Id + ',';
        jstr = jstr + '"param2value":"' + this.data.param2value + '",';
        if(filterId==1){
            jstr=jstr+ '"param1style":"' + this.get("defaultInputType") +'",'
            jstr=jstr+ '"param2style":"' + this.get("defaultInputType") +'",'
        }else{
            jstr=jstr+ '"param1style":"' + this.get("param1style") +'",'
            jstr=jstr+ '"param2style":"' + this.get("param2style") +'",'
        }
        jstr = jstr + '"paramcount":' + this.get("paramcount") + ',';
        var sql = null;
        if (filterId == 0) {
        } else if (filterId == 1) {
            var rec = this.data.operation1Record;
            if (rec) {
                sql = rec.get("sqltemplate");
            }
            sql = sql + ' $CONNECTOR ';
            rec = this.data.operation2Record;
            if (rec) {
                sql = sql + rec.get("sqltemplate");
            }
        } else {
            var rec = this.data.filterRecord;
            if (rec) {
                sql = rec.get("opsql");
            }

        }
        jstr = jstr + '"sql":"' + sql + '",';
        var box = this.getView().getBox(false, true);
        jstr = jstr + '"windowx":' + box.left + ",";
        jstr = jstr + '"windowy":' + box.top + "";
        return (jstr);
    },

    makeParam: function () {


    }

});
