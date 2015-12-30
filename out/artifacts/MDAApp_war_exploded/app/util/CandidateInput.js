/**
 * Created by YS186019 on 2015/11/13.
 */

Ext.define('mdaapp.util.CandidateInput', {


    extend: "Ext.window.Window",
    requires:[
        'mdaapp.model.FilterCandidate'
    ],
    //extend: "Ext.grid.Panel",
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    closeable: 'true',
    closeAction:'destroy',
    height: 500,
    width: 500,
    title: '维护参数选择值',
    store: null,
    backupStore:null,
    autoShow: true,
    tagField:null,


    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    flex: 1,
                    xtype: 'gridpanel',
                    itemId: 'candidate-grid',
                    tbar: [
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
                        Ext.getCmp("mainWnd").unmask();
                    }
                }
            }
        });
        this.callParent();
    },
    //renderTo: Ext.getBody(),


    onBoxReady: function () {
        var me = this;
        Ext.getCmp("mainWnd").mask();
        this.backupStore=Ext.create("Ext.data.ArrayStore",{
            model:'mdaapp.model.FilterCandidate',
            data:[]
        });
        me.queryById('candidate-grid').setStore(this.backupStore);
        if(!this.store.isLoaded()){
            //console.log("load store");
            this.store.load({
                scope: me,
                callback: function(records, operation, success) {
                    // the operation object
                    // contains all of the details of the load operation
                    me.copyData();
                   // me.backupStore.load();
                }
            });
        }else{
            me.copyData();
            //me.backupStore.load();
        }

    },

    copyData:function(){
        var me=this;
        me.backupStore.removeAll(true);
        var filters=me.store.getFilters();
        //console.log("filters:",filters);
        me.store.clearFilter(true);
        me.store.each(function(rec){
            ////console.log(rec);
            me.backupStore.add(rec);
        });
        //me.store.setFilter(filters);
        //if(me.parameterType=='multiselector'){
        //
        //}


        ////console.log("------copydata---begin to dump backup target store is ----------",this.store)
        //this.backupStore.each(function(rec){
        //    //console.log(rec)
        //});
        //
        ////console.log("-----copydata----begin to original store is ----------",this.store)
        //me.store.each(function (rec){
        //    //console.log(rec);
        //});


    },

    onCancel: function () {
        this.close();
    },

    onOK: function () {
        var me=this;
        this.store.removeAll(false);
        ////console.log("---------begin to dump backup target store is ----------",this.store)
        this.backupStore.each(function(rec){
            ////console.log(rec)
            me.store.add(rec);
        });

        ////console.log("---------begin to dump target store is ----------",this.store)
        //me.store.each(function (rec){
        //    //console.log(rec);
        //});
        //console.log('onok');
        this.close();
    },

    addRec: function () {
        //console.log('addRec');
        var me = this,
            grid = me.queryById('candidate-grid'),
            store = me.backupStore;
        var rec = Ext.create("mdaapp.model.FilterCandidate", {
            candidateId:0,
            candidatetitle: '',
            candidatevalue: '',
            place: ''
        });
        //console.log("the store is ",store,"rec" ,rec);
        //store.add(rec);
        store.insert(0,rec);
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
        store.remove(sel);
        //}

    },

    editRec:function(){
        var me = this,
            grid = me.queryById('candidate-grid'),
            store = grid.getStore();
        var sel=grid.getSelection();
        if(sel===undefined || sel==null || sel.length==0){
            return;
        }
        var rec=sel[0]; //edit first selected record only
        grid.getPlugin('candidate-Editor').startEdit(rec);
    }
})
;