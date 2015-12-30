Ext.define('mdaapp.view.field.where.WhereContainerModel', {
    extend: 'mdaapp.view.field.ContainerModel',
    alias: 'viewmodel.field-where-wherecontainer',

    requires:[
        "mdaapp.model.FieldFilter"
    ],

    data: {
        name: 'mdaapp'
    },

    stores: {
        predefinedFilterStore: {
            autoLoad:false,
            proxy:{
                type: 'ajax',
                url:'FieldFilterServlet/getPredefinedFilter'
            },
            model:'mdaapp.model.FieldFilter',
            listeners:{
                beforeLoad:'predefinedFilterBeforeLoad'
            }
        }
    }

});
