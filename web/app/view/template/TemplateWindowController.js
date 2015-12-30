Ext.define('mdaapp.view.template.TemplateWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.template-templatewindow',
    requires: [
        "mdaapp.view.field.result.ResultField",
        "mdaapp.view.field.where.WhereField",
        "mdaapp.view.field.groupby.GroupByField",
        "mdaapp.view.field.orderby.OrderByField"
    ],

    onClose: function () {

    },


    createField: function (place, colId, filterId, action) {
        var taskWnd = this.getView(),
            colRecord = mdaapp.Current.getColumnCacheStore().getColumnById(colId),
            tableName=colRecord.get('tablename'),
            colname=colRecord.get('colname'),
            coltitle=colRecord.get('coltitle'),
            dbtype=colRecord.get('dbtype');
        var field,
            container = this.getView().queryById("previewContainer"),
            propertyContainer = this.getView().queryById("propertyContainer");
        if(action===undefined || action==null ) {
            action = this.getView().action;
        }
        var closable=false;
        if(action=='new'){
            closable=true;
        }
        if (place == "where") {
            field = new Ext.create("mdaapp.view.field.where.WhereField", {
                place: "where",
                colId: colId,
                columnRecord: colRecord,
                taskWindow: container,
                enableOrder: false,
                //hiddenLoadFilter:true,
                defineTemplate:true,
                action:action,
                showSave: false,
                filterId: filterId,
                showHelp: false,
                closable:closable
            });
            //field.setOrderNumber(maxorder, true);
        } else if (place == 'groupby') {
            field = new Ext.create("mdaapp.view.field.groupby.GroupByField", {
                place: "groupby",
                colId: colId,
                columnRecord: colRecord,
                taskWindow: container,
                enableOrder: false,
                //hiddenLoadFilter:true,
                defineTemplate:true,
                action:action,
                showSave: false,
                filterId: filterId,
                showHelp: false,
                closable:closable
            });
        } else if (place == "orderby") {
            field = new Ext.create("mdaapp.view.field.orderby.OrderByField", {
                place: "orderby",
                colId: colId,
                columnRecord: colRecord,
                taskWindow: container,
                enableOrder: false,
                //hiddenLoadFilter:true,
                defineTemplate:true,
                action:action,
                showSave: false,
                filterId: filterId,
                showHelp: false,
                closable:closable
            });
        } else {
            field = new Ext.create("mdaapp.view.field.result.ResultField", {
                place: "result",
                colId: colId,
                columnRecord: colRecord,
                taskWindow: container,
                enableOrder: false,
                //hiddenLoadFilter:true,
                defineTemplate:true,
                action:action,
                showSave: false,
                filterId: filterId,
                showHelp: false,
                closable:closable
            });
            //field.setOrderNumber(maxorder, true);
        }
        container.addField(field);
        propertyContainer.setPlace(place);
    }

});
