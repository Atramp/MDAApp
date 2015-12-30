Ext.define('mdaapp.view.field.result.ResultContainerController', {
    extend: 'mdaapp.view.field.ContainerController',
    alias: 'controller.field-result-resultcontainer',

    requires: [
        "mdaapp.view.field.result.ResultField"
    ],


    testFieldConditionCallBack: function (field) {
        if (field.getViewModel().get("resultoperatorid") <= 0) {
            Ext.Msg.alert('错误', '在输出字段中，只能对计算结果创建条件组合');
            field.setSelected(false);
            return (false);
        }
        return (true);
    },


    andClick: function () {
        this.makeConnection("AND");
    },

    orClick: function () {
        this.makeConnection("OR");
    },

    predefinedFilterBeforeLoad: function (store, operation, eOpts) {
        var me = this;
        var tableList = this.getView().getTaskWindow().getTableList();
        var param = {
            "tablelist": tableList,
            "place": "result",
            "action": "predefined"
        };
        store.getProxy().setExtraParams(param);
        return (true);
    },

    predefinedFilterLoad: function (obj, records, successful, eOpts) {

    },

    addPredefinedFilter: function () {
        var me = this,
            view = this.getView(),
            combobox = view.queryById('resultSearch');
        var record = combobox.getSelection();
        //console.log(record);
        if (!record) {
            return;
        }
        var colId = record.get("colId"),
            filterId = record.get("filterId"),
            colRec=mdaapp.Current.getColumnCacheStore().getColumnById(colId);
        var field = Ext.create("mdaapp.view.field.result.ResultField", {
            place: "result",
            colId: colId,
            columnRecord:colRec,
            taskWindow: view,
            filterId: filterId
        });
        this.addField(field);
    },


    reloadPredefinedFilter: function () {
        //delete all predefine filter thus next time when user click the trigger
        // the data will be reload
        var me = this,
            combo = me.getView().queryById("resultSearch"),
            store = me.getViewModel().getStore("predefinedFilterStore");
        delete combo.lastQuery;
        store.removeAll(false);
        store.load();
    },

    distinctChange: function () {
        this.getViewModel().set(('distinctValue'), this.getView().queryById('distinctcheck').getValue());
        //console.log("distinctValue ", this.getViewModel().get('distinctValue'));
    }
});
