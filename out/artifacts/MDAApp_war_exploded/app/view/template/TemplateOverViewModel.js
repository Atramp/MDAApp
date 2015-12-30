Ext.define('mdaapp.view.template.TemplateOverViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.template-templateoverview',
    requires:[
        "mdaapp.model.FieldFilterTemplate"
    ],
    data: {
        name: 'mdaapp'
    },

    stores: {
        fieldFilter: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/getAll'
            },
            model: "mdaapp.model.FieldFilterTemplate"
        }
    }


});
