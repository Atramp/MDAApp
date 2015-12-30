Ext.define('mdaapp.view.field.groupby.GroupByContainerModel', {
    extend: 'mdaapp.view.field.ContainerModel',
    alias: 'viewmodel.field-groupby-groupbycontainer',
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
