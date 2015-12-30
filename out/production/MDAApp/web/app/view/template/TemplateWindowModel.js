Ext.define('mdaapp.view.template.TemplateWindowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.template-templatewindow',
    data: {
        name: 'mdaapp'
    },

    stores: {
        filterTemplate: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/getFilterTemplate'
            },
            model: "mdaapp.model.FieldFilterTemplate"
        }
    }
});
