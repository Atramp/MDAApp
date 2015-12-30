
Ext.define("mdaapp.view.field.orderby.OrderByContainer",{
    extend: "mdaapp.view.field.Container",
    alias: "orderby-container",
    xtype: 'orderby-container',
    requires: [
        "mdaapp.view.field.orderby.OrderByContainerController",
        "mdaapp.view.field.orderby.OrderByContainerModel"
    ],
    
    controller: "field-orderby-orderbycontainer",
    viewModel: {
        type: "field-orderby-orderbycontainer"
    },

    ExtraTools:[
        '->'
        ]
});
