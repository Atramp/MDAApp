/**
 * Created by YS186019 on 2015/11/16.
 */

Ext.define("mdaapp.util.DimensionType", {
    extend: "Ext.window.Window",

    callback: null, // point to the caller of this window, actually is FieldController
    closable: false,
    scope: null,
    caller: null,
    closeAction: 'destroy',
    width: 400,

    autoShow:true,
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this;
        Ext.apply(this,
            {
                items: [
                    {
                        xtype: 'form',
                        itemId: 'choiceForm',
                        items: [
                            {
                                xtype: 'radiogroup',
                                items: [
                                    {boxLabel: '输出维度', name: 'dtype', inputValue: 'result', checked: true},
                                    {boxLabel: '条件维度', name: 'dtype', inputValue: 'where'},
                                    {boxLabel: '分组和分档', name: 'dtype', inputValue: 'groupby'}
                                    //{boxLabel: '排序', name: 'dtype', inputValue: 'orderby'}
                                ]
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
                        listeners:{
                            click:{
                                scope:me,
                                fn:'onCancel'
                            }
                        }
                    }
                ]
            }
        );
        this.callParent();
    },

    onCancel: function () {
        //console.log("onCancel");
        this.close();
    },


    onOK: function () {
        var place = this.queryById('choiceForm').getValues().dtype;
        //console.log("onOK ", place);
        if(this.callback && this.scope){
            var newFunc=Ext.bind(this.callback,this.scope);
            newFunc(place);
        }
        this.close();
    }
})
;
