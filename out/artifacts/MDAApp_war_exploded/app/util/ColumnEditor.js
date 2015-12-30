/**
 * Created by YS186019 on 2015/11/13.
 */

Ext.define('mdaapp.util.ColumnEditor', {


    extend: "Ext.window.Window",

    requires:[
        "Ext.data.Store",
        "mdaapp.model.FilterCandidate"

          //mdaapp. model. FilterCandidate
    ],
    //extend: "Ext.grid.Panel",
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    closeable: 'true',
    closeAction:'destroy',
    //height: 500,
    width: 500,
    title: '维护字段基本属性',

    autoShow: true,
    draggable:true,
    simpleDrag:true,

    colId:0,
    inputType:null,
    editTable:false,
    tableId:0,
    colTitle:'',

    initComponent: function () {
        var me = this;
        Ext.getCmp('help-table-wnd').mask()
        me.candidateStore=Ext.create("Ext.data.Store", {
            proxy:{
                type:'ajax',
                url:"helptable/listcandidate"
            },
            model:"mdaapp.model.FilterCandidate",
            autoLoad:false
        });

        Ext.apply(this, {
            items: [
                {
                    xtype:'textfield',
                    fieldLabel:'字段名称/描述',
                    labelWidth:100,
                    itemId:'nameEditor'
                },
                {
                    xtype: 'combobox',
                    store: {
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
                    fieldLabel:'缺省输入类型',
                    itemId:'typeEditor',
                    labelWidth:100,
                    editable: false,
                    hideTrigger: false,
                    displayField: 'text',
                    valueField: 'value',
                    queryMode: 'local',
                    listeners:{
                        change:{
                            scope:me,
                            fn:'onTypeChange'
                        }
                    }
                },
                {
                    flex: 1,
                    xtype: 'gridpanel',
                    itemId: 'candidate-grid',
                    store:me.candidateStore,
                    hidden:true,
                    height:200,
                    tbar: [

                        '定义单选和多选值',
                        '->',
                        {
                            xtype: 'button',
                            text: '添加',
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: 'addRec'
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: '删除',
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: 'delRec'
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: '编辑',
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: 'editRec'
                                }
                            }
                        }

                    ],
                    plugins: {
                        ptype: 'rowediting',
                        pluginId: 'candidate-Editor',
                        clicksToEdit: 2,
                        saveBtnText:'确定',
                        cancelBtnText:'取消'
                    },

                    selType: 'rowmodel',
                    columns: [
                        {
                            header: '参数值',
                            width: 150,
                            dataIndex: 'candidatevalue',
                            editor:  'textfield'
                        },
                        {
                            header: '显示字符',
                            //width: 200,
                            flex: 1,
                            dataIndex: 'candidatetitle',
                            editor: 'textfield'
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: '确认',
                    itemId: 'btok',
                    listeners: {
                        click: {
                            scope: me,
                            fn: 'onOK'
                        }
                    }
                },
                {
                    text: '取消',
                    itemId: 'btcancel',
                    //handler:me.onCancel
                    listeners: {
                        click: {
                            scope: me,
                            fn: 'onCancel'
                        }
                    }
                }
            ],
            listeners: {
                close: {
                    fn: function () {
                        me.store=null;
                        Ext.getCmp('help-table-wnd').unmask();
                    }
                }
            }
        });
        this.callParent();
    },
    //renderTo: Ext.getBody(),


    onBoxReady: function () {
        var me=this;
        me.queryById('nameEditor').setValue(me.colTitle);
        me.queryById('typeEditor').setValue(me.inputType);
        if(me.editTable){
            me.queryById('typeEditor').setDisabled(true);
        }
    },


    onCancel: function () {
        this.close();
    },

    onOK: function () {
        var me=this,
            jstr='{"colId":' + me.colId + ',';
        jstr=jstr+'"tableid":' +me.tableId +',';
        jstr=jstr + '"coltitle":"' +me.queryById('nameEditor').getValue() + '",';
        var inputType=me.queryById('typeEditor').getValue();
        jstr=jstr + '"defaultInputType":"' + inputType + '"';
        if(inputType=='multiselector' || inputType=='comboselector') {
            //jstr = jstr + ',"candidates":['
            //for (var i = 0, len = me.candidateStore.getCount(); i < len; i++) {
            //    var rec = me.candidateStore.getAt(i);
            //    jstr = jstr + rec.toJson() + ','
            //}
            var updatedRec=me.candidateStore.getUpdatedRecords();
            if(updatedRec!=null){
                jstr = jstr + ',"editCandidates":['
                for (var i = 0, len = updatedRec.length; i < len; i++) {
                    jstr = jstr + updatedRec[i].toJson() + ','
                }
                if(Ext.String.endsWith(jstr,',')){
                    jstr = jstr.substr(0, jstr.length - 1);
                }
                jstr=jstr+']'

            }
            var removedRec=me.candidateStore.getRemovedRecords();
            if(removedRec!=null){
                jstr = jstr + ',"removeCandidates":['
                for (var i = 0, len = removedRec.length; i < len; i++) {
                    jstr = jstr + removedRec[i].toJson() + ','
                }
                if(Ext.String.endsWith(jstr,',')){
                    jstr = jstr.substr(0, jstr.length - 1);
                }
                jstr=jstr+']'
            }
            var newRec=me.candidateStore.getNewRecords();
            if(newRec!=null){
                jstr = jstr + ',"addCandidates":['
                for (var i = 0, len = newRec.length; i < len; i++) {
                    jstr = jstr + newRec[i].toJson() + ','
                }
                if(Ext.String.endsWith(jstr,',')){
                    jstr = jstr.substr(0, jstr.length - 1);
                }
                jstr=jstr+']'
            }
        }
        jstr=jstr+'}';
        console.log("save column info ", jstr);
        Ext.Ajax.request({
            url: 'helptable/updatecolumn',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            jsonData: jstr,
            success: function (response) {
                me.processSaveResponse(response);
            },
            failure: function (response) {
                me.processSaveResponse(response)
            }
        });
        this.close();
    },

    processSaveResponse: function (response) {
        //console.log(response);
        var me = this,
            resp = Ext.JSON.decode(response.responseText, true);
        var success = resp.hasError;//response.get("hasError");r
        if (success==false || success == 'false' ) {
            me.candidateStore.reload();
        } else {
            var msg = resp.error;
            Ext.MessageBox.show({
                title: "错误",
                msg: msg,
                icon: Ext.MessageBox.WARNING
            });
        }
    },


    addRec: function () {
        //console.log('addRec');
        var me = this,
            grid = me.queryById('candidate-grid');
        var rec = Ext.create("mdaapp.model.FilterCandidate", {
            candidateId:0,
            candidatetitle: '',
            candidatevalue: '',
            place: ''
        });
        me.candidateStore.insert(0,rec);
        grid.getPlugin('candidate-Editor').startEdit(rec);
    },

    delRec: function () {
        var me=this,
            grid=me.queryById('candidate-grid'),
            store=grid.getStore();
        var sel=grid.getSelection();
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        //for(var i= 0,len=sel.length;i<len;i++){
        me.candidateStore.remove(sel);

    },

    editRec:function(){
        var me = this,
            grid = me.queryById('candidate-grid');
            //store = grid.getStore();
        var sel=grid.getSelection();
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var rec=sel[0]; //edit first selected record only
        grid.getPlugin('candidate-Editor').startEdit(rec);
    },

    onTypeChange:function(obj, newValue, oldValue, eOpts){
        var me=this,
            grid=me.queryById("candidate-grid");
        if(newValue=='comboselector' || newValue=='multiselector'){
            grid.setVisible(true);
            me.candidateStore.getProxy().setExtraParams(null);
            me.candidateStore.getProxy().setExtraParams({
                'filterId':1,
                'colId':me.colId
            });
            me.candidateStore.load();
        }else{
            grid.setVisible(false);
        }
    }
})
;