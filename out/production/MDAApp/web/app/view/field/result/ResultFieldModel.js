Ext.define('mdaapp.view.field.result.ResultFieldModel', {
    extend: 'mdaapp.view.field.FieldModel',
    alias: 'viewmodel.field-result-resultfield',

    requires: [
        "mdaapp.model.CommonOperation",
        "mdaapp.model.FieldFilter",
        "mdaapp.model.RuleFilter"
    ],

    data: {
        name: 'mdaapp',
        outputtitle: '',
        filterRecord: null,
        operation1Record: null,
        operation2Record: null,
        filterId: 0,
        op1Id: 0,
        op2Id: 0,
        param1value: '',
        param2value: '',
        resultoperatorid: 0,
        opconnectorid: 0,
        showResultSelector: false,
        showConnector: false,
        showResultFilter1: false,
        showResultFilter2: false
    },


    stores: {
        fieldFilter: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/getPredefinedFilter'
            },
            model: 'mdaapp.model.FieldFilter',
            listeners: {
                beforeload: 'onFilterBeforeLoad'
            }
        },
        resultStore: {
            type: 'opStore',
            place: 'result'
        },
        havingStore1: {
            type: 'opStore',
            place: 'having',
            name: 'havingStore1'
        },
        havingStore2: {
            type: 'opStore',
            place: 'having',
            name: 'havingStore2'
        },
        connectionStore: {
            type: 'opStore',
            place: 'connector',
            name: 'connectionStore'
        },

        // following store are used to backup the original store
        resultStoreBackup: {
            type: 'opStore',
            place: 'result'
        },
        havingStore1Backup: {
            type: 'opStore',
            place: 'having',
            name: 'havingStore1'
        },
        havingStore2Backup: {
            type: 'opStore',
            place: 'having',
            name: 'havingStore2'
        },
        connectionStoreBackup: {
            type: 'opStore',
            place: 'connector',
            name: 'connectionStore'
        }
        //following store are used when define template
        //templateFilterStore:{
        //        autoLoad: false,
        //        proxy: {
        //            type: 'ajax',
        //            url: '/FieldFilterServlet/defineFilterTemplate',
        //            extraParams:{
        //                place:'result'
        //            }
        //        },
        //        model: 'mdaapp.model.FieldFilter'
        //}



        /*        resultStore: {
         autoLoad: false,
         name: 'resultFilter',
         proxy: {
         type: 'ajax',
         url: '/GetAvailableOperation'
         },
         model: 'mdaapp.model.CommonOperation',
         listeners: {
         beforeLoad: 'onOperationBeforeLoad'
         }
         },
         havingStore1: {
         autoLoad: false,
         name: 'havingStore1',
         proxy: {
         type: 'ajax',
         url: '/GetAvailableOperation'
         },
         model: 'mdaapp.model.CommonOperation',
         listeners: {
         beforeLoad: 'onHavingBeforeLoad'
         }

         },
         havingStore2: {
         autoLoad: false,
         name: 'havingStore1',
         proxy: {
         type: 'ajax',
         url: '/GetAvailableOperation'
         },
         model: 'mdaapp.model.CommonOperation',
         listeners: {
         beforeLoad: 'onHavingBeforeLoad'
         }
         },
         connectionStore: {
         autoLoad: false,
         name: 'connectionStore',
         proxy: {
         type: 'ajax',
         url: '/GetAvailableOperation'
         },
         model: 'mdaapp.model.CommonOperation',
         listeners: {
         beforeLoad: 'onConnectionBeforeLoad'
         }
         }*/

    },

    toJSONString: function () {
        var jstr = '"colId":' + this.get("colId") + ',';
        jstr = jstr + '"filterId":' + this.data.filterId + ',';
        jstr = jstr + '"place":"' + this.get("place") + '",';
        jstr = jstr + '"ruleId":' + this.get("ruleId") + ',';
        jstr = jstr + '"componentid":"' + this.getView().getId() + '",';
        jstr = jstr + '"ordernum":' + this.get("orderNumber") + ',';
        jstr = jstr + '"outputtitle":"' + this.get("outputtitle") + '",';
        jstr = jstr + '"resultoperatorid":' + this.get("resultoperatorid") + ',';
        jstr = jstr + '"op1Id":' + this.get("op1Id") + ',';
        jstr = jstr + '"param1value":"' + this.get("param1value") + '",';
        jstr = jstr + '"opconnectorid":' + this.get("opconnectorid") + ',';
        jstr = jstr + '"showoperator1":' + this.get("showResultFilter1") + ',';
        jstr = jstr + '"showoperator2":' + this.get("showResultFilter2") + ',';
        jstr = jstr + '"op2Id":' + this.get("op2Id") + ',';
        jstr = jstr + '"param2value":"' + this.get("param2value") + '",';
        var box = this.getView().getBox(false, true);
        //console.log("the box is ", box);
        jstr = jstr + '"windowx":' + box.x + ",";
        jstr = jstr + '"windowy":' + box.y + "";
        return (jstr);

    },

    parseJSONString: function (jstr) {

    }
});
