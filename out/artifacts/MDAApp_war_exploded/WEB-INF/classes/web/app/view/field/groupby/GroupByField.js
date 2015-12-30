Ext.define("mdaapp.view.field.groupby.GroupByField", {
    extend: "mdaapp.view.field.Field",

    requires: [
        "mdaapp.view.field.groupby.GroupByFieldController",
        "mdaapp.view.field.groupby.GroupByFieldModel"
    ],

    controller: "field-groupby-groupbyfield",
    viewModel: {
        type: "field-groupby-groupbyfield"
    },
    border:true,

    useLayer: false,

    onBoxReady: function () {
        var me = this,
            model = me.getViewModel(),
            ctrl = me.getController(),
            store = model.getStore('layerStore');
        me.callParent();
        me.add(
            {
                xtype: 'combobox',
                itemId: 'layerSelector',
                displayField: 'optitle',
                fieldLabel: '是否分档',
                store:null,
                bind: {
                    //store: '{fieldFilter}',
                    value: '{filterId}'
                },
                editable: false,
                valueField: 'filterId',
                listeners: {
                    select : 'onGroupSelected'
                },
                minChars: 0,
                queryMode: 'remote'
                //queryMode:'local'
            },
            {
                xtype: 'grid',
                height: 200,
                itemId: 'layerGrid',
                bind:{
                    hidden:'{!showLayerInput}'
                },
                store: store,
                tbar: [
                    '定义分档信息',
                    '->',
                    {
                        xtype: 'button',
                        text: '添加',
                        listeners: {
                            click: {
                                scope: me,
                                fn: 'onAddLayer'
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: '插入',
                        listeners: {
                            click: {
                                scope: me,
                                fn: 'onInsertLayer'
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: '删除',
                        listeners: {
                            click: {
                                scope: me,
                                fn: 'onDeleteLayer'
                            }
                        }
                    }
                ],
                plugins: {
                    ptype: 'rowediting',
                    pluginId: 'layer-Editor',
                    clicksToEdit: 2,
                    saveBtnText: '确定',
                    cancelBtnText: '取消'
                },

                selType: 'rowmodel',
                columns: [
                    {
                        text: '档位名称',
                        menuDisabled: true,
                        flex: 1,
                        //sortable: false,
                        dataIndex: 'layerName',
                        editor: 'textfield'
                    },

                    {
                        //header: ' 下限',
                        text: '比较',
                        menuDisabled: true,
                        width: 50,
                        //sortable: false,
                        dataIndex: 'operator1',
                        editor: Ext.create("Ext.form.field.ComboBox", {
                            store: {
                                type: 'array',
                                fields: ['value', 'text'],
                                data: [
                                    ['>', '>'],
                                    ['>=', '>=']
                                ]
                            },
                            editable:false,
                            hideTrigger:true,
                            displayField: 'text',
                            valueField: 'value',
                            queryMode: 'local'
                            //value:'>='
                        })

                    },
                    {
                        //header: ' 下限',

                        text: '下限值',

                        menuDisabled: true,
                        width: 50,
                        sortable: false,
                        dataIndex: 'boundary1',
                        editor: 'textfield'

                    },
                    {
                        text: ' 关系',
                        menuDisabled: true,
                        width: 50,
                        //sortable: false,
                        dataIndex: 'connector',
                        editor: Ext.create("Ext.form.field.ComboBox", {
                            store: {
                                type: 'array',
                                fields: ['value', 'text'],
                                data: [
                                    ['AND', '并且'],
                                    ['OR', '或者']
                                ]
                            },
                            editable:false,
                            hideTrigger:true,
                            displayField: 'text',
                            valueField: 'value',
                            queryMode: 'local'
                            //value:'and'
                        }),
                        renderer:function(val){
                            if(val=='AND') return('并且');
                            if(val=='OR') return('或者');
                            return(val);
                        }
                    },
                    {
                        text: ' 比较',
                        menuDisabled: true,
                        width: 50,
                        //sortable: false,
                        dataIndex: 'operator2',
                        editor: Ext.create("Ext.form.field.ComboBox", {
                            store: {
                                type: 'array',
                                fields: ['value', 'text'],
                                data: [
                                    ['<', '<'],
                                    ['<=', '<=']
                                ]
                            },
                            editable:false,
                            hideTrigger:true,
                            displayField: 'text',
                            valueField: 'value',
                            queryMode: 'local'
                            //value:'<'
                        })
                    },
                    {
                        header: '上限值',
                        menuDisabled: true,
                        width: 50,
                        //sortable: false,
                        dataIndex: 'boundary2',
                        editor: 'textfield'
                    }
                ]
            },
            {
                xtype: 'form',
                itemId: 'choiceForm',
                items: [{
                    xtype: 'radiogroup',
                    fieldLabel: '按分档排序',
                    bind:{
                        hidden:'{!showLayerInput}'
                    },
                    itemId: 'orderGroup',
                    items: [
                        {boxLabel: '不排序', name: 'orderRadio', itemId: 'radio1', inputValue: 0, checked: true},
                        {boxLabel: '升序', name: 'orderRadio', itemId: 'radio2', inputValue: 1},
                        {boxLabel: '降序', name: 'orderRadio', itemId: 'radio3', inputValue: 2}
                    ],
                    listeners: {
                        change: function (obj, newValue, oldValue, eOpts) {
                            var value = me.queryById('choiceForm').getValues().orderRadio;
                            me.getViewModel().set('op1Id', value);
                            //console.log("the op1Id is ", me.getViewModel().get('op1Id'));
                        }
                    }
                }]
            }
        );
        //me.getController().loadPredefinedFilter(me.filterId);
        if (me.filterId <= 0) {
            model.set("filterId", 0);
           me.filterId=0;
        } else {
            model.set("filterId", me.filterId);

        }
       // me.getController().loadPredefinedFilter(me.filterId);
        var sel=me.queryById("layerSelector");
        if(me.defineTemplate){
            if(me.action=='new') {
                //sel.setQueryMode('local');
                var templateStore=me.getViewModel().getStore('templateFilterStore');
                sel.setStore(templateStore);
                templateStore.load(function(records){
                    //console.log(" templateFilterStire load call back");
                    sel.setValue(0);
                    for(var i=0,len=records.length;i<len;i++){
                        var record=records[i];
                        //console.log("record",record);
                        if(record.get("filterId")==0){
                            me.getController().parseFilter(record);
                            break;
                        }
                    }
                });
            }else{
                sel.setDisabled(true);
                sel.setStore(me.getViewModel().getStore('fieldFilter'));
                me.getController().loadPredefinedFilter(me.filterId);
            }
        }else{
            sel.setStore(me.getViewModel().getStore('fieldFilter'));
            if(me.ruleFilterRecord!=null){
                me.getController().parseRuleFilterRecord(me.ruleFilterRecord);
            }else if(me.filterId>0){
                //me.getController().loadPredefinedFilter(me.filterId);
                me.getController().loadPredefinedFilter(me.filterId);
            }
        }
        
        
        
    },

    onAddLayer: function () {
        //console.log("begin add");
        var me = this,
            rec = Ext.create('mdaapp.model.GroupLayerModel', {}),
            model = me.getViewModel(),
            store = model.getStore('layerStore');
        //store.insert(0, rec);
        store.add(rec);
        ////console.log(rec);
        ////console.log(me.queryById('layerGrid'));
        ////console.log(me.queryById('layerGrid').getPlugin('layer-Editor'));
        me.queryById('layerGrid').getPlugin('layer-Editor').startEdit(rec);


    },

    onDeleteLayer: function () {
        var me = this,
            model = me.getViewModel(),
            store = model.getStore('layerStore'),
            grid=me.queryById('layerGrid'),
            sel=grid.getSelection();
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        store.remove(sel[0]);
    },

    onInsertLayer: function () {
        var me = this,
            model = me.getViewModel(),
            store = model.getStore('layerStore'),
            grid=me.queryById('layerGrid'),
            sel=grid.getSelection();
        if(sel===undefined || sel==null || sel.length==0){
            Ext.MessageBox.alert("提示","选定一个分档后在其前面插入新分档");
            return;
        }
        var idx=store.indexOf(sel[0]),
            rec = Ext.create('mdaapp.model.GroupLayerModel', {});
        store.insert(idx, rec);
        //store.add(rec);
        ////console.log(rec);
        ////console.log(me.queryById('layerGrid'));
        ////console.log(me.queryById('layerGrid').getPlugin('layer-Editor'));
        grid.getPlugin('layer-Editor').startEdit(rec);
    },

    reloadPredefinedFilter:function(newId){
        var me=this,
            ctrl=me.getController(),
            model=me.getViewModel();
        me.filterId=newId;
        model.set("filterId",newId);
        ctrl.loadPredefinedFilter(newId);
    }
});
