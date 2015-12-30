Ext.define("mdaapp.view.field.orderby.OrderByField", {
    extend: "mdaapp.view.field.Field",

    requires: [
        "mdaapp.view.field.orderby.OrderByFieldController",
        "mdaapp.view.field.orderby.OrderByFieldModel"
    ],

    controller: "field-orderby-orderbyfield",
    viewModel: {
        type: "field-orderby-orderbyfield"
    },
    border:true,

    onBoxReady: function () {
        var me = this,
            model = me.getViewModel();
        model.set('op1Id', 0); //set the initial value
        model.set("ruleId", this.ruleId);
        this.add(
            {
                items: [
                    {
                        xtype: 'form',
                        itemId: 'choiceForm',
                        items: [{
                            xtype: 'radiogroup',
                            fieldLabel: '排序方式',
                            //cls: 'x-check-group-alt',
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

                    }]
            });
        this.callParent();
        if (this.ruleFilterRecord != null) {
            this.getController().parseRuleFilterRecord(this.ruleFilterRecord);
            //parseRuleFilterRecord
        } else if (this.filterId > 0) {
            //this.getController().loadPredefinedFilter(this.filterId);
        }
/*
        var store = this.getViewModel().getStore("getColInfo");
        if (store.isLoading()) {
            setTimeout(function () {
                me.continueExecute(store);
            }, 100);
        } else {
            me.continueExecute(store);
        }
*/
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
                                      //parseRuleFilterRecord
            } else if (this.filterId > 0) {
                //this.getController().loadPredefinedFilter(this.filterId);
            }
        }
    }


});
