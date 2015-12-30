Ext.define("mdaapp.view.field.result.ResultField", {
    extend: "mdaapp.view.field.Field",

    requires: [
        "mdaapp.view.field.result.ResultFieldController",
        "mdaapp.view.field.result.ResultFieldModel"
    ],

    controller: "field-result-resultfield",
    viewModel: {
        type: "field-result-resultfield"
    },
    border:2,
    default: {
        //border: false
    },
    ruleFilterRecord: null,
    hiddenLoadFilter: false,
    defineTemplate: false,
    action: 'new',

    onBoxReady: function () {
        var me = this;
        this.callParent();
        var ctrler = me.getController();
        me.getViewModel().set("ruleId", this.ruleId);
        this.add(
            {
                // here is the title of result field
                xtype: 'textfield',
                fieldLabel: '输出标题',
                labelWidth: 90,
                emptyText: '输出标题名',
                itemId: 'titleInput',
                bind: {
                    value: '{outputtitle}'
                }
            },
            {
                xtype: 'combobox',
                itemId: 'resultSelector',
                fieldLabel: '结果计算',
                labelWidth: 90,
                editable: false,
                labelSeparator: '',
                width: '100%',
                displayField: 'operationtitle',
                valueField: 'operationid',
                //publishes:'value',
                bind: {
                    value: '{resultoperatorid}',
                    store: '{resultStore}'//                        hidden:'{hideOperationSelector}'
                },
                listeners: {
                    select: 'resultSelected'
                },
                minChars: 0,
                //queryMode: 'remote'
                emptyText: '',

                queryMode: 'local'
            },
            {
                xtype: 'combobox',
                fieldLabel: '计算结果过滤',
                labelWidth: 90,
                labelSeparator: '',
                editable: false,
                width: '100%',
                displayField: 'optitle',
                hidden: this.hiddenLoadFilter,
                //reference: 'filterSelector',
                valueField: 'filterId',
                //publishes:'value',
                itemId: 'filterSelector',
                bind: {
                    store: '{fieldFilter}',
                    value: '{filterId}'//                        hidden:'{hideOperationSelector}'
                    //hidden:'{!showResultSelector}'
                },
                listeners: {
                    select: 'filterSelected'
                },
                minChars: 0,
                queryMode: 'remote'
            },

            {
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'start'
                },
                bind: {
                    hidden: '{!showResultFilter1}'
                },
                items: [
                    {
                        xtype: 'combobox',
                        itemId: 'havingSelector1',
                        displayField: 'operationtitle',
                        reference: 'havingSelector1',
                        valueField: 'operationid',
                        fieldLabel: '结果过滤条件',
                        editable: false,
                        labelWidth: 90,
                        publishes: 'value',
                        flex: 1,
                        bind: {
                            hidden: '{!showResultFilter1}',
                            store: '{havingStore1}',
                            value: '{op1Id}'
                        },
                        listeners: {
                            select: 'havingSelected1'
                        },
                        minChars: 0,
                        queryMode: 'local'
                    },
                    {
                        // here is the paramter input or select field
                        xtype: 'textfield',
                        flex: 1,
                        emptyText: '比较值1',
                        itemId: 'textInput1',
                        //width:90,
                        //value:'param1value',
                        bind: {
                            value: '{param1value}'
                            //hidden:'{!showTextInput1}'
                        }
                    }
                ]
            },  //param1value input area
            {
                xtype: 'combobox',
                itemId: 'connectionSelector',
                displayField: 'operationtitle',
                reference: 'connectionSelector',
                valueField: 'operationid',
                fieldLabel: '增加过滤条件',
                editable: false,
                labelWidth: 90,
                publishes: 'value',
                flex: 1,
                bind: {
                    hidden: '{!showConnector}',
                    store: '{connectionStore}',
                    value: '{opconnectorid}'
                },
                listeners: {
                    select: 'connectionSelected'
                },
                minChars: 0,
                queryMode: 'local'
            },
            {
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'start'
                },
                bind: {
                    hidden: '{!showResultFilter2}'
                },
                items: [
                    {
                        xtype: 'combobox',
                        itemId: 'havingSelector2',
                        displayField: 'operationtitle',
                        reference: 'havingSelector2',
                        valueField: 'operationid',
                        fieldLabel: '结果过滤条件',
                        editable: false,
                        labelWidth: 90,
                        publishes: 'value',
                        flex: 1,
                        bind: {
                            hidden: '{!showResultFilter2}',
                            store: '{havingStore2}',
                            value: '{op2Id}'
                        },
                        /*                        listeners:{
                         select : 'havingSelected2'
                         },*/
                        minChars: 0,
                        //queryMode: 'remote'
                        queryMode: 'local'
                    },
                    {
                        // here is the paramter input or select field
                        xtype: 'textfield',
                        flex: 1,
                        emptyText: '比较值2',
                        itemId: 'textInput2',
                        //width:90,
                        //value:'param1value',
                        bind: {
                            value: '{param2value}'
                        }
                    }
                ]
            }   //param2value input section
        );
        //this.getViewModel().getStore('resultStore')

        //var sel = me.queryById('filterSelector');
        //if (this.defineTemplate) {
        //    if (me.action == 'new') {
        //        //sel.setQueryMode('local');
        //        //var tmpStore=me.getViewModel().getStore('templateFilterStore');
        //        //sel.setStore(tmpStore);
        //        //tmpStore.load(function(){
        //        sel.setValue(0);
        //        //});
        //    } else {
        //        sel.setDisabled(true);
        //        //sel.setStore(me.getViewModel().getStore('fieldFilter'));
        //    }
        //} else {
        //    //sel.setStore(me.getViewModel().getStore('fieldFilter'));
        //}


        var viewModel = this.getViewModel(),
            place = viewModel.get("place"),
            dbtype = viewModel.get("dbtype"),
            virtualType = viewModel.get("virtualtype");

        if(this.defineTemplate){
            if(me.action=='new'){
                me.filterId=0;
                viewModel.set('filterId',0);
            }else{
                //we cannot change to other filter while edit template
                me.queryById('filterSelector').setDisabled(true);
            }
        }


        viewModel.getStore('resultStore').addDataByType(true, place, dbtype, virtualType);

        viewModel.getStore('havingStore1').addDataByType(true, "having", dbtype, "NUMBER");
        viewModel.getStore('havingStore2').addDataByType(true, "having", dbtype, "NUMBER");
        viewModel.getStore('connectionStore').addDataByPlace(true, "connector");
        if (this.ruleFilterRecord != null) {
            this.getController().parseRuleFilterRecord(this.ruleFilterRecord);
        } else if (this.filterId >= 0) {
            this.getController().loadPredefinedFilter(this.filterId);
        }
        //here we wait the field to load column information then continue execution
        /*        var store=this.getViewModel().getStore("getColInfo");
         if(store.isLoading()){
         setTimeout(function(){
         me.continueExecute(store);
         },100);
         }else{
         me.continueExecute(store);
         }*/
    },

    continueExecute: function (store) {
        var me = this;
        if (store.isLoading()) {
            setTimeout(function () {
                me.continueExecute(store);
            }, 100);
        } else {
            if (this.ruleFilterRecord != null) {
                this.getController().parseRuleFilterRecord(this.ruleFilterRecord);
            } else if (this.filterId > 0) {
                this.getController().loadPredefinedFilter(this.filterId);
            }
        }
    },


    parseTemplate: function () {

    },

    resetToOriginal: function () {

    },

    reloadPredefinedFilter: function (newId) {
        var me = this,
            ctrl = me.getController(),
            model = me.getViewModel();
        //console.log(me);
        me.filterId = newId;
        if(me.defineTemplate) {
            me.queryById('filterSelector').setDisabled(true);
            me.closable=false;
            me.action = 'edit';
        }
        model.set("filterId", newId);
        ctrl.loadPredefinedFilter(newId);
    }



    //
});
