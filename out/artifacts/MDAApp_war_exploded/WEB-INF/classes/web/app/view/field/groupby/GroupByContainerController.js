Ext.define('mdaapp.view.field.groupby.GroupByContainerController', {
    extend: 'mdaapp.view.field.ContainerController',
    alias: 'controller.field-groupby-groupbycontainer',

    requires:[
        "mdaapp.view.field.groupby.GroupByField"
    ],

    predefinedFilterBeforeLoad: function (store, operation, eOpts) {
        var me = this;
        var tableList = this.getView().getTaskWindow().getTableList();
        var param = {
            "tablelist": tableList,
            "place": "groupby",
            "action": "predefined"
        };
        store.getProxy().setExtraParams(param);
        return (true);
    },

    reloadPredefinedFilter:function(){
      var me=this,
          store=me.getViewModel().getStore("predefinedFilterStore");
        store.load();
    },

    addPredefinedFilter: function () {
        var me = this,
            view = this.getView(),
            combobox = view.queryById('group-by-search');
        var record = combobox.getSelection();
        //console.log(record);
        if (!record) {
            return;
        }
        var colId = record.get("colId"),
            filterId = record.get("filterId"),
            colRec=mdaapp.Current.getColumnCacheStore().getColumnById(colId);
        var field = Ext.create("mdaapp.view.field.groupby.GroupByField", {
            place: "groupby",
            colId: colId,
            columnRecord:colRec,
            taskWindow: view,
            filterId: filterId
        });
        this.addField(field);
    }
});
