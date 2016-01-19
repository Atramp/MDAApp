Ext.define("mdaapp.view.template.TemplatePropertyWindow", {
    extend: "Ext.panel.Panel",

    requires: [
        "mdaapp.view.template.TemplatePropertyWindowController",
        "mdaapp.view.template.TemplatePropertyWindowModel",
        "mdaapp.util.CandidateInput"
    ],
    taskWindow: null,
    controller: "template-templatepropertywindow",
    viewModel: {
        type: "template-templatepropertywindow"
    },

    xtype: 'template-property',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    sortableColumns: false,
    nameColumnWidth: 165,
    templateRecord: null,


    //listeners: {
    //    beforeedit: 'onBeforeEdit',
    //    beforerender:'onBeforeRender',
    //    propertychange:'onPropertyChange'
    //},


    onBoxReady: function () {
        var me = this,
            model = this.getViewModel(),
            place;
        me.callParent();

        /*        var placeStore=model.getStore('placeStore');
         me.sourceConfig['place'].editor.setStore(placeStore);

         var store = model.getStore('resultStore');
         //store.addDataByPlace();
         me.sourceConfig['resultoperatorid'].editor.setStore(store);

         store = model.getStore('connectionStore');
         //store.addDataByPlace();
         me.sourceConfig['opconnectorid'].editor.setStore(store);

         var op1store = model.getStore('operator1Store');
         //console.log("opop1 store",op1store)
         //store.setPlace(place);
         //store.addDataByPlace();
         me.sourceConfig['op1Id'].editor.setStore(op1store);
         me.sourceConfig['op1candidate'].editor.setStore(op1store);

         var op2store = model.getStore('operator2Store');
         //store.setPlace(place);
         //store.addDataByPlace();
         me.sourceConfig['op2Id'].editor.setStore(op2store);
         me.sourceConfig['op2candidate'].editor.setStore(op2store);

         var store=model.getStore("inputTypeStore");
         me.sourceConfig['param1style'].editor.setStore(store);
         me.sourceConfig['param2style'].editor.setStore(store);
         //me.setSource(this.whereSource, this.sourceConfig);

         //store=model.getStore("candidate1Store");
         //var fieldStore=me.taskWindow.queryById("previewContainer").getViewModel().getStore("candidate1Store");
         //fieldStore.each(function(rec){
         //    store.add(rec);
         //})*/


    },

    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    defaults: {
                        listeners: {
                            change: 'onChange'
                        }
                    },
                    xtype: 'form',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    border: false,
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: '模板分类',
                            editable: false,
                            name: 'place',
                            itemId: 'place',
                            /*
                             border:1,
                             style: {
                             //borderColor: 'red',
                             borderStyle: 'solid'
                             },
                             */
                            bind: {
                                value: '{place}'
                            },//hidden: function () {return(!me.place=='result')}
                            renderer: function (val) {
                                if (val == 'result') {
                                    return ('输出维度');
                                } else if (val == 'where') {
                                    return ('条件维度');
                                } else if (val == 'groupby') {
                                    return ('分组和分档');
                                } else if (val == 'orderby') {
                                    return ('排序');
                                } else {
                                    return (val);
                                }
                            }
                        },

                        {
                            xtype: 'textfield',
                            fieldLabel: '模板名称',
                            emptyText: '请输入模板名称',
                            name: 'optitle',
                            itemId: 'optitle',
                            bind: {
                                value: '{optitle}'
                            },
                            allowBlank:false
                            //listeners:{
                            //    change:'onOpTitleChange'
                            //}
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '模板描述',
                            emptyText: '请输入SQL模板描述',
                            name: 'description',
                            itemId: 'description',
                            bind: {
                                value: '{description}'
                            }
                            //listeners:{
                            //    change:'onChange'
                            //}

                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'SQL 模板',
                            emptyText: '请输入SQL模板',
                            name: 'opsql',
                            itemId: 'opsql',
                            hidden:true,
                            bind: {
                                //value: '{opsql}'
                            }
                            //hidden: function () {return(!me.place=='result')}
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '计算结果过滤模板',
                            emptyText: '请输入过滤模板',
                            name: 'extraSql',
                            itemId: 'extraSql',
                            bind: {
                                hidden: '{!typeResult}',
                                value: '{extraSql}'
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: '用户输入参数个数',
                            store:{
                                type:'array',
                                fields:['value','text'],
                                data:[
                                    [0,'无参数'],
                                    [1,'1个参数'],
                                    [2,'2个参数']
                                ]
                            },
                            displayField: 'text',
                            name: 'paramcount',
                            itemId: 'paramcount',
                            valueField: 'value',
                            querymode: 'local',
                            bind: {
                                hidden: '{!typeWhere}',
                                value: '{paramcount}'
                            }
                        },



                        //{
                        //    xtype: 'textfield',
                        //    fieldLabel: '输出显示标题',
                        //    emptyText: '请输入显示标题',
                        //    name: 'outputtitle',
                        //    itemId: 'outputtitle',
                        //    bind: {
                        //        hidden: '{!typeResult}',
                        //        value: '{outputtitle}'
                        //    }
                        //},
                        // follow part will be used when define where field template
                        {
                            xtype: 'combobox',
                            fieldLabel: '显示操作符1',

                            displayField: 'text',
                            name: 'showoperator1',
                            itemId: 'showoperator1',
                            valueField: 'value',
                            querymode: 'local',
                            bind: {
                                store: '{booleanStore}',
                                hidden: '{!typeWhere}',
                                value: '{showoperator1}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '操作符1标签',
                            emptyText: '请输入操作符标签',
                            name: 'op1label',
                            itemId: 'op1label',
                            bind: {
                                hidden: '{!typeWhere}',
                                value: '{op1label}'
                            }
                        },
                        {
                            xtype: 'tagfield',
                            fieldLabel: '操作符1候选值',
                            displayField: 'operationtitle',
                            valueField: 'operationid',
                            queryMode: 'local',
                            name: 'op1candidate',
                            itemId: 'op1candidate',
                            emptyText: '设置操作符1的可选取值，如果不进行设置则默认为所有操作',
                            bind: {
                                store: '{operator1Store}',
                                hidden: '{!typeWhere}',
                                value: '{op1candidate}'
                            },
                            renderer: function (val) {
                                if (val === undefined || val == null || val == "") {
                                    return ("全部操作");
                                } else {
                                    return (val);
                                }
                            }

                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '参数1左侧标签',
                            emptyText: '可定义参数1左侧的提示信息，如为空则不显示',
                            name: 'param1leftlabel',
                            itemId: 'param1leftlabel',
                            bind: {
                                value: '{param1leftlabel}',
                                hidden: '{!typeWhere}'
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: '参数1输入类型',
                            displayField: 'text',
                            valueField: 'value',
                            querymode: 'local',
                            name: 'param1style',
                            itemId: 'param1style',
                            bind: {
                                store: '{inputTypeStore}',
                                hidden: '{!typeWhere}',
                                value: '{param1style}'
                            }
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            name: 'param1candidate',
                            itemId: 'param1candidate',
                            hidden: true,
                            border:false,
                            items: [
                                {
                                    xtype: 'displayfield',
                                    //flex:1,
                                    fieldLabel: '定义参数1选择值',
                                    //emptyText:'请单击按钮定义值',
                                    value: '',
                                    border:false,
                                    //editable:false,
                                    hideTrigger: true
                                }, {
                                    xtype: 'button',
                                    flex: 1,
                                    margin: '0 0 5 0',
                                    text: '单击按钮定义参数1选择值',
                                    listeners: {
                                        click: 'onBtnCandidate1'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '参数1右侧标签',
                            emptyText: '可定义参数1右侧的提示信息，如为空则不显示',
                            name: 'param1rightlabel',
                            itemId: 'param1rightlabel',
                            bind: {
                                value: '{param1rightlabel}',
                                hidden: '{!typeWhere}'
                            }
                        },



                        {
                            xtype: 'textfield',
                            fieldLabel: '参数1检查条件',
                            name: 'param1checkrule',
                            itemId: 'param1checkrule',
                            bind: {
                                value: '{param1checkrule}',
                                hidden: '{!typeWhere}'
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: '显示关系操作符',

                            displayField: 'text',
                            name: 'showConnector',
                            itemId: 'showConnector',
                            valueField: 'value',
                            querymode: 'local',
                            bind: {
                                store: '{booleanStore}',
                                hidden: '{!typeWhere}',
                                value: '{showConnector}'
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: '显示操作符2',
                            name: 'showoperator2',
                            itemId: 'showoperator2',
                            displayField: 'text',
                            valueField: 'value',
                            querymode: 'local',
                            name: 'showoperator2',
                            itemId: 'showoperator2',
                            bind: {
                                store: '{booleanStore}',
                                hidden: '{!typeWhere}',
                                value: '{showoperator2}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '操作符2标签',
                            emptyText: '请输入操作符标签',
                            name: 'op2label',
                            itemId: 'op2label',
                            bind: {
                                hidden: '{!typeWhere}',
                                value: '{op2label}'
                            }
                        },

                        {
                            xtype: 'tagfield',
                            fieldLabel: '操作符2候选值',
                            displayField: 'operationtitle',
                            valueField: 'operationid',
                            queryMode: 'local',
                            name: 'op2candidate',
                            emptyText: '设置操作符2的可选取值，如果不进行设置则默认为所有操作',
                            itemId: 'op2candidate',
                            bind: {
                                store: '{operator2Store}',
                                hidden: '{!typeWhere}',
                                value: '{op2candidate}'
                            },
                            renderer: function (val) {
                                if (val === undefined || val == null || val == "") {
                                    return ("全部操作");
                                } else {
                                    return (val);
                                }
                            }

                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '参数2左侧标签',
                            emptyText: '可定义参数2左侧的提示信息，如为空则不显示',
                            name: 'param2leftlabel',
                            itemId: 'param2leftlabel',
                            bind: {
                                value: '{param2leftlabel}',
                                hidden: '{!typeWhere}'
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: '参数2输入类型',
                            displayField: 'text',
                            valueField: 'value',
                            querymode: 'local',
                            name: 'param2style',
                            itemId: 'param2style',
                            //hidden: function () {return(!me.place=='where')}
                            bind: {
                                store: '{inputTypeStore}',
                                hidden: '{!typeWhere}',
                                value: '{param2style}'
                            }
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            margin: '0 0 5 0',
                            name:'param2candidate',
                            itemId:'param2candidate',
                            hidden: true,
                            border:false,
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '参数2选择值',
                                    //emptyText: '单击按钮定义值',
                                    border:false,
                                    value: ''
                                    //store:'candidate2Store',
                                    //displayFiled:'candidatetitle',
                                    //valueField:'candidatevalue',
                                    //editable:false,
                                    //hideTrigger:true

                                }, {
                                    xtype: 'button',
                                    margin: '0 0 5 0',
                                    flex: 1,
                                    text: '点击定义参数2选择值',
                                    listeners: {
                                        click: 'onBtnCandidate2'
                                    }
                                    //listeners:{
                                    //    click:{
                                    //        scope:me,
                                    //        fn:'onParam1CandidateClick'
                                    //    }
                                    //}
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '参数2右侧标签',
                            emptyText: '可定义参数2右侧的提示信息，如为空则不显示',
                            name: 'param2rightlabel',
                            itemId: 'param2rightlabel',
                            bind: {
                                hidden: '{!typeWhere}',
                                value: '{param2rightlabel}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '参数2检查条件',
                            name: 'param2checkrule',
                            itemId: 'param2checkrule',

                            bind: {
                                hidden: '{!typeWhere}',
                                value: '{param2checkrule}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '参数1-2关系条件',
                            name: 'paramscheckrule',
                            itemId: 'paramscheckrule',
                            bind: {
                                hidden: '{!typeWhere}',
                                value: '{paramscheckrule}'
                            }
                        }
                    ]


                }
            ]
        });
        this.callParent();
    },

    setPlace: function (place) {
        var me = this;
        me.place = place;
        if (place == "where") {
            // me.setSource(this.whereSource,this.sourceConfig);
        } else if (place == "result") {
            //me.setSource(this.resultSource,this.sourceConfig);
        }
        me.doLayout();
    },

    setTaskWindow: function (obj) {
        this.taskWindow = obj;
    },

    getTaskWindow: function () {
        return (this.taskWindow);
    },

    //setSourceValue: function (name, value) {
    //    var me = this,
    //        source = me.getSource();
    //    source[name] = value;
    //},
    //
    //getSourceValue: function (name, value) {
    //    var me = this,
    //        source = me.getSource();
    //    return (source[name]);
    //},

    setRecord: function (record) {
        this.templateRecord = record;
        this.getController().parseRecord(record);
    }

    //getProperty: function (propertyName) {
    //    var me = this;
    //    return (this.getStore().getProperty(propertyName).data[me.valueField]);
    //}


});







