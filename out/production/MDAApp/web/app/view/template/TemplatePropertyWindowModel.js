Ext.define('mdaapp.view.template.TemplatePropertyWindowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.template-templatepropertywindow',
    requires: [
        "mdaapp.store.OperationStore",
        "mdaapp.model.FilterCandidate"
    ],

    data: {
        name: 'mdaapp',
        place: null,
        colName: "",
        coltitle: '',
        connectorcandidate: '',
        description: '',
        op1candidate: '',
        paramcount:0,
        op1Id: '',
        op1label: '',
        op2candidate: '',
        op2Id: '',
        op2label: '',
        opconnectorid: '',
        opsql: '',
        optitle: '',
        outputtitle: '',
        param1checkrule: '',
        param1leftlabel: '',
        param1rightlabel: '',
        param1style: '',
        param1value: '',
        showConnector:true,
        param2checkrule: '',
        param2leftlabel: '',
        param2rightlabel: '',
        param2style: '',
        param2value: '',
        paramscheckrule: '',
        resultoperatorid: '',
        showoperator1: '',
        showoperator2: '',
        tableName: '',
        typeResult: true,
        typeWhere: false,
        typeGroupBy:false,
        typeOrderBy:false
    },
    stores: {
        placeStore: {
            type: 'array',
            fields: ['value', 'text'],
            data: [
                ['where', "条件选择"],
                ["result", "输出维度"],
                ["groupby", "分组和分档"],
                ["orderby", "排序"]
            ]
        },
        booleanStore:{
          type:'array',
            fields: ['value', 'text'],
            data: [
                [true, "是"],
                [false, "否"]
            ]
        },
        inputTypeStore: {
            type: 'array',
            fields: ['value', 'text'],
            data: [
                ['dateselector', "日期类型"],
                ["monthselector", "年月类型（YYYYMM）"],
                ["timeselector", "时间类型"],
                ["comboselector", "单选类型"],
                ['multiselector', "多选类型"],
                ["datetimeselector", "时间戳类型"],
                ["textinput", "文字或数字输入类型"]
            ]

        },

        operator1Store: {
            autoLoad: false,
            name: 'operator1Store',
            type: 'opStore',
            place: 'where'
        },
        operator2Store: {
            autoLoad: false,
            name: 'operator2Store',
            type: 'opStore',
            place: 'where'
        },
        candidate1Store: {
            type: 'array',
            name: 'candidate1Store',
            model: "mdaapp.model.FilterCandidate",
            data: []
        },
        candidate2Store: {
            type: 'array',
            name: 'candidate2Store',
            model: "mdaapp.model.FilterCandidate",
            data: []
        },
        connectionStore: {
            autoLoad: false,
            name: 'connectionStore',
            place: 'connector',
            type: 'opStore'
        },
        resultStore: {
            type: 'opStore',
            place: 'result'
        }
    }

    /*    formulas: {
     isResult: function (get) {
     return ;
     },

     x2: function (get) {
     return get('x') * 2;
     }
     }*/


});
