Ext.define('mdaapp.view.field.FieldModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.field-field',
    requires: [
        "mdaapp.model.Field"
    ],

    data: {
        // following property is used by field class itself
        name: 'mdaapp',
        selected: false,
        warning: false,
        defaultHeaderColor: 0,
        defaultBorderColor: 0,
        relationConnector: null,
        filterRecord:null,
        //querycolId : -1,
        orderNumber: 0,
        enableOrder: true,
        showSave: true,
        showHelp: true,

        showFilterArea:true,
        showOrderByArea:true,
        defaultCodeTable:null,
        defaultInputType:'textinput',
        //following field is a copy for mdaapp.model.Field
        //filterId: -1,

        colId: -1,
        tableid: -1,
        colname: '',
        coltype: '',
        colformat: '',
        colmaxlength: -1,
        coldecimal: -1,
        colfraction: -1,
        comments: '',
        coltitle: '',
        dbtype: '',
        dbname: '',
        schemaname: '',
        tablename: '',
        tabletype: '',
        virtualtype: '',

        // following part is a copy of "mdaapp.model.FieldFilter"
        filterId: '',
        //colId: '', included in previous section
        opsql: '',
        extraSql: '',
        place: '',
        optitle: '',
        description: '',
        showdescription: true,
        creator: '',
        createtime: '',
        op1label: '',
        op1candidate: '',
        showoperator1: true,
        param1leftlabel: '',
        param1style: '',
        param1rightlabel: '',
        opconnectorid: 0,
//opconnectiontitle: '',
        connectorcandidate: '',
        paramcount: 0,
        op2label: '',
        op2candidate: '',
        showoperator2: true,
        param2leftlabel: '',
        param2style: '',
        param2rightlabel: '',
        param1checkrule: '',
        param2checkrule: '',
        paramscheckrule: '',
        resultoperatorid: 0,
        op1Id: 0,
        op2Id: 0,
//connectorid: '',
        showConnector: true,
        param1value: '',
        param2value: '',
        outputtitle: '',

        //add the needed field when we parse the jobrules
        ruleId: 0
    },


    viewModel: this,

    stores: {
        placeStore: {
            type: 'array',
            model: 'mdaapp.model.FieldFilter',
            fields: ['filterId', 'optitle'],
            data: []
        },

        getColInfo: {
            model: "mdaapp.model.Field",
            proxy: {
                type: 'ajax',
                url: 'getcolumninfo/getbycolId'
            },
            autoLoad: false,
            listeners: {
                beforeload: 'getColInfoBeforeLoad',
                load: 'getColInfoLoad'
            }
        }
    },

    toJSONString: function () {
        //var rec=this.getData();
        ////console.log(rec);
        // this is a parcial jsone string, so don't forget to add {} when needed

        var jsonStr ='"filterId":'+ this.get('filterId')+',';
        jsonStr = jsonStr + '"colId":' + this.get("colId") + ',';
        jsonStr = jsonStr + '"place":"' + this.data.place + '",'
        jsonStr = jsonStr + '"ruleId":' + this.get("ruleId") + ',';
        jsonStr = jsonStr + '"componentid":"' + this.getView().getId() + '",';
        jsonStr = jsonStr + '"ordernum":' + this.data.orderNumber + ",";
        jsonStr = jsonStr + '"resultoperatorid":' + this.get("resultoperatorid") + ',';
        jsonStr = jsonStr + '"paramcount":' + this.get("paramcount") + ',';
        jsonStr = jsonStr + '"op1Id":' + this.get("op1Id") + ',';
        jsonStr = jsonStr + '"param1value":"' + this.get("param1value") + '",';
        jsonStr = jsonStr + '"opconnectorid":' + this.get("opconnectorid") + ',';
        jsonStr = jsonStr + '"op2Id":' + this.get("op2Id") + ',';
        jsonStr = jsonStr + '"param2value":"' + this.get("param2value") + '",';
        jsonStr = jsonStr + '"operationsql":"' + this.get("operationsql") + '",';
        var box = this.getView().getBox(false, true);
        jsonStr = jsonStr + '"windowx":' + box.left + ",";
        jsonStr = jsonStr + '"windowy":' + box.top + "";
        ////console.log(jsonStr);
        return (jsonStr);
    },

    parseJSONString: function (jstr) {

    },

    validateWhere: function () {

    },

    validateResult: function () {

    },

    validateOrder: function () {

    },

    validateOperation: function () {

    }

});
