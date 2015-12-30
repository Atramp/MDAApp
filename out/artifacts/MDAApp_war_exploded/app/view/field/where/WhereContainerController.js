Ext.define('mdaapp.view.field.where.WhereContainerController', {
    extend: 'mdaapp.view.field.ContainerController',
    alias: 'controller.field-where-wherecontainer',

    requires: [
        "mdaapp.view.field.where.WhereField"
    ],
    andClick: function () {
        this.makeConnection("AND");
    },
    orClick: function () {
        this.makeConnection("OR");
    },
    notClick: function () {
        this.makeNotConnection();
    },

    deleteClick: function () {
        this.callParent();
    },


    predefinedFilterSelected: function (box, record) {

    },


    predefinedFilterBeforeLoad: function (store, operation, eOpts) {
        var me = this;
        var tableList = this.getView().getTaskWindow().getTableList();
        var param = {
            "tablelist": tableList,
            "place": "where",
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
            combobox = view.queryById('whereSearch');
        var record = combobox.getSelection();
        //console.log(record);
        if (!record) {
            return;
        }
        var colId = record.get("colId"),
            filterId = record.get("filterId"),
            colRec=mdaapp.Current.getColumnCacheStore().getColumnById(colId);
        var field = Ext.create("mdaapp.view.field.where.WhereField", {
            place: "where",
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
            combo = me.getView().queryById("whereSearch"),
            store = me.getViewModel().getStore("predefinedFilterStore");
        delete combo.lastQuery;
        store.removeAll(false);
        store.load();
    }

});
