
Ext.define("mdaapp.view.field.where.WhereField",{
    extend: "mdaapp.view.field.Field",
 
    requires: [
        "mdaapp.view.field.where.WhereFieldController",
        "mdaapp.view.field.where.WhereFieldModel",
        "mdaapp.util.MonthPicker"
    ],
    enableOrder: false,
    hiddenLoadFilter:false,
    defineTemplate:false,
    action:'new',
    border:true,
    controller: "field-where-wherefield",
    viewModel: {
        type: "field-where-wherefield"
    },

    //html: "Hello, World!!"
    onBoxReady:function(){
        this.callParent();
        var me=this;
        var ctrler=me.getController();
        me.getViewModel().set("ruleId",this.ruleId);
        this.add(
            {
                xtype: 'combobox',
                fieldLabel: '过滤条件',
                labelWidth:65,
                labelSeparator:'',
                width:'100%',
                displayField: 'optitle',
                editable:false,
                itemId:'filterSelector',
                valueField: 'filterId',
                //hidden:this.hiddenLoadFilter,
                bind:{
                    store: '{fieldFilter}',
                    //hidden:'{hideOperationSelector}'
                    value: '{filterId}'
                },
                listeners:{
                    select : 'filterSelected'
                },
                minChars: 0,
                queryMode: 'remote'
            },
            {
                layout:{
                    type:'hbox',
                    align:'middle',
                    pack:'start'
                },
                bind:{
                    hidden:'{!showParam1}'
                },
                items:[
                    {
                        xtype: 'displayfield',
                        width:70,
                        maxWidth:70,
                        border:false,
                        bind: {
                            value: '{op1label}'
                        },
                        renderer:function(val){
                            if(val===undefined || val==null || val==''){
                                return(me.getViewModel().get('coltitle'));
                            }else{
                                return(val);
                            }
                        }
                    }, //op1label
                    {
                        xtype: 'combobox',
                        itemId:'operator1Selector',
                        displayField: 'operationtitle',
                        //reference: 'operator1Selector',
                        editable:false,
                        valueField: 'operationid',
                        //emptyText:'',
                        //publishes:'value',
                        width:100,
                        bind:{
                            hidden:'{!showoperator1}',
                            store: '{operator1Store}',
                            value:'{op1Id}'
                        },
                        listeners:{
                            select : 'operator1Selected'
                        },
                        minChars: 0,
                        //queryMode: 'remote'
                        queryMode:'local'
//                        queryMode:'local',
/*                        store:{
                            type:'mdaapp.store.OperationStore'
                        }*/

                    },  //operator1 selector
                    {
                        xtype: 'displayfield',
                        //minWidth:5,
                        maxWidth:50,
                        border:false,
                        bind: {
                            value: '{param1leftlabel}',
                            hidden:'{!param1leftlabel}'
                        }
                    },  //param1value left label
                    {
                    // here is the paramter input or select field
                        xtype:'textfield',
                        flex:1,
                        emptyText:'参数1',
                        itemId:'textInput1',
                        //width:70,
                        //value:'param1value',
                        bind:{
                            value:'{param1value}',
                            hidden:'{!showTextInput1}'
                        }
                    },{
                        xtype:'datefield',
                        itemId:'dateSelector1',
                        flex:1,
                        format: 'Y-m-d',
                        //editable:false,
                        bind:{
                            //value:'{param1value}',
                            value:'{param1Date}',
                            hidden:'{!showDateInput1}'
                        }
                    },{
                        xtype:'monthfield',
                        itemId:'monthSelector1',
                        //reference:'monthSelector1',
                        //publishes:'value',
                        flex:1,
                        format: 'Y-m',
                        bind:{
                            value:'{param1Month}',
                            //value:'{param1value}',
                            hidden:'{!showMonthInput1}'
                        }
                    },{
                        xtype:'timefield',
                        itemId:'timeSelector1',
                        //editable:false,
                        flex:1,
                        minValue: '0:00',
                        maxValue: '23:59',
                        format:'H:i:s',
                        increment: 1,
                        bind:{
                            value:'{param1Time}',
                            //value:'{param1value}',
                            hidden:'{!showTimeInput1}'
                        }
                    },{
                        xtype:'combobox',
                        itemId:'comboSelector1',
                        flex:1,
                        displayField: 'candidatetitle',
                        editable:false,
                        //publishes:'value',
                        valueField: 'candidatevalue',
                        //reference:'comboSelector1',
                        bind:{
                            value:'{param1value}',
                            hidden:'{!showComboInput1}',
                            store:'{candidate1Store}'
                        },
                        minChars: 0,
                        //queryMode: 'remote'
                        queryMode: 'local'
                    },{
                        xtype: 'tagfield',
                        itemId:'tagSelector1',
                        //editable:false,
                        flex:1,
                        bind:{
                            hidden:'{!showTagInput1}',
                            store:'{candidate1Store}',
                            value:'{param1value}'
                        },
                        fieldLabel: '',
                        labelWidht:0,
                        displayField: 'candidatetitle',
                        valueField: 'candidatevalue',
                        filterPickList: true,
                        //queryMode: 'remote'
                        queryMode: 'local'
                    },
                    //parameter1 input area end
                    {
                        xtype: 'displayfield',
                        width:50,
                        border:false,
                        bind: {
                            value: '{param1rightlabel}',
                            hidden:'{!param1rightlabel}'
                        }
                    }  //param1value right label
                ]
            },  //param1value input area
            {
                xtype: 'combobox',
                fieldLabel: '条件关系',
                labelWidth:65,
                labelSeparator:'',
                width:'100%',
                displayField: 'operationtitle',
                itemId:'connectionSelector',
                editable:false,

                //emptyText:'',
                //reference: 'connectionSelector',
                valueField: 'operationid',
                //publishes:'value',
                bind:{
                    store: '{connectionStore}',//                        hidden:'{hideOperationSelector}'
                    value: '{opconnectorid}',
                    //hidden:'{!showParam2}'
                    hidden:'{!showConnector}'
                },
                minChars: 0,
                queryMode: 'local'

            },  //two operator connector
            {
                layout:{
                    type:'hbox',
                    align:'middle',
                    pack:'start'
                },
                bind:{
                    hidden:'{!showParam2}'
                },
                items:[
                    {
                        xtype: 'displayfield',
                        width:70,
                        maxWidth:70,
                        border:false,
                        bind: {
                            value: '{op2label}'
                        },
                        renderer:function(val){
                            if(val===undefined || val==null || val==''){
                                return(me.getViewModel().get('coltitle'));
                            }else{
                                return(val);
                            }
                        }
                    },   //op2label
                    {
                        xtype: 'combobox',
                        displayField: 'operationtitle',
                        //reference: 'operator2Selector',
                        valueField: 'operationid',
                        //publishes:'value',
                        //emptyText:'',
                        itemId:'operator2Selector',
                        editable:false,
                        width:100,
                        bind:{
                            store: '{operator2Store}',
                            hidden:'{!showoperator2}',
                            value:'{op2Id}'
                        },
                        listeners:{
                            select : 'operator2Selected'
                        },
                        minChars: 0,
                        //queryMode: 'remote'
                        queryMode:'local'
                    },  //operator 2 selector
                    {
                        xtype: 'displayfield',
                        //width:50,
                        //minWidth:5,
                        maxWidth:50,
                        border:false,
                        bind: {
                            value: '{param2leftlabel}',
                            hidden: '{!param2leftlabel}'
                        }
                    },  //param2value left label
                    {
                        // here is the beginner paramter input or select field
                        xtype:'textfield',
                        flex:1,
                        itemId:'textInput2',
                        emptyText:'参数2',
                        bind:{
                            value:'{param2value}',
                            hidden:'{!showTextInput2}'
                        }
                    },{
                        xtype:'datefield',
                        itemId:'dateSelector2',
                        flex:1,
                        format: 'Y-m-d',
                        //editable:false,
                        bind:{
                            value:'{param2Date}',
                            hidden:'{!showDateInput2}'
                        }
                    },{
                        xtype:'monthfield',
                        flex:1,
                        itemId:'monthSelector2',
                        //editable:false,
                        format: 'Y-m',
                        bind:{
                            value:'{param2Month}',
                            hidden:'{!showMonthInput2}'
                        }
                    },{
                        xtype:'timefield',
                        flex:1,
                        itemId:'timeSelector2',
                        minValue: '0:00',
                        maxValue: '23:59',
                        //editable:false,
                        format:'H:i:s',
                        increment: 1,
                        bind:{
                            value:'{param2Time}',
                            hidden:'{!showTimeInput2}'
                        }
                    },{
                        xtype:'combobox',
                        flex:1,
                        itemId:'comboSelector2',
                        displayField: 'candidatetitle',
                        valueField:'candidatevalue',
                        editable:false,
                        //reference:'comboSelector2',
                        minChars: 0,
                        queryMode: 'local',
                        bind:{
                            value:'{param2value}',
                            hidden:'{!showComboInput2}',
                            store:'{candidate2Store}'
                        }
                    },{
                        xtype: 'tagfield',
                        itemId:'tagSelector2',
                        //editable:false,
                        flex:1,
                        bind:{
                            hidden:'{!showTagInput2}',
                            store:'{candidate2Store}',
                            value:'{param2value}'
                        },
                        fieldLabel: '',
                        labelWidht:0,
                        displayField: 'candidatetitle',
                        valueField: 'candidatevalue',
                        filterPickList: true,
                        queryMode: 'local'
                    },
                    //here is the parameter 2 input section
                    {
                        xtype: 'displayfield',
                        width:50,
                        border:false,
                        bind: {
                            value: '{param2rightlabel}',
                            hidden:'{!param2rightlabel}'
                        }
                    }
                ]
            }   //param2value input section
        );
        me.getViewModel().set("filerId",this.filterId);
        //var sel=me.queryById('filterSelector');
        if(me.defineTemplate){
            if(me.action=='new'){
                me.filterId=0;
                me.getViewModel().set('filterId',0);
            }else{
                //we cannot change to other filter while edit template
                me.queryById('filterSelector').setDisabled(true);
            }
        }
        if(this.ruleFilterRecord!=null){
            this.getController().parseRuleFilterRecord(this.ruleFilterRecord);
        } else if (this.filterId >= 0) {
            this.getController().loadPredefinedFilter(this.filterId);
        }

        //if(this.defineTemplate){
        //    if(me.action=='new') {
        //        //sel.setQueryMode('local');
        //        var templateStore=me.getViewModel().getStore('templateFilterStore');
        //        sel.setStore(templateStore);
        //        templateStore.load(function(records){
        //            //console.log(" templateFilterStire load call back");
        //            sel.setValue(1);
        //            for(var i=0,len=records.length;i<len;i++){
        //                var record=records[i];
        //                //console.log("record",record);
        //                if(record.get("filterId")==1){
        //                    me.getController().parseFilterRecord(record);
        //                    break;
        //                }
        //            }
        //        });
        //    }else{
        //        sel.setDisabled(true);
        //        sel.setStore(me.getViewModel().getStore('fieldFilter'));
        //        this.getController().loadPredefinedFilter(this.filterId);
        //    }
        //}else{
        //    sel.setStore(me.getViewModel().getStore('fieldFilter'));
        //    if(this.ruleFilterRecord!=null){
        //        this.getController().parseRuleFilterRecord(this.ruleFilterRecord);
        //    }else if(this.filterId>0){
        //        this.getController().loadPredefinedFilter(this.filterId);
        //    }
        //}



/*        var store=this.getViewModel().getStore("getColInfo");
        if(store.isLoading()){
            setTimeout(function(){
                me.continueExecute(store);
            },100);
        }else{
            me.continueExecute(store);
        }*/


    },


    continueExecute:function(store){
        var me=this;
        if(store.isLoading()){
            setTimeout(function(){
                me.continueExecute(store);
            },100);
        }else{
            if(this.ruleFilterRecord!=null){
                this.getController().parseRuleFilterRecord(this.ruleFilterRecord);
            }else if(this.filterId>0){
                this.getController().loadPredefinedFilter(this.filterId);
            }
        }
    },

    reloadPredefinedFilter:function(newId){
        var me=this,
            ctrl=me.getController(),
            model=me.getViewModel();
        me.filterId=newId;
        if(me.defineTemplate) {
            me.queryById('filterSelector').setDisabled(true);
            me.action = 'edit';
        }
        model.set("filterId",newId);
        ctrl.loadPredefinedFilter(newId);
    }

});
