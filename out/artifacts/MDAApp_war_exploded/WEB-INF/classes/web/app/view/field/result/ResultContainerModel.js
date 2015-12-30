Ext.define('mdaapp.view.field.result.ResultContainerModel', {
    extend: 'mdaapp.view.field.ContainerModel',
    alias: 'viewmodel.field-result-resultcontainer',

    requires: [
        "mdaapp.model.FieldFilter"
    ],


    data: {
        name: 'mdaapp',
        distinctValue:false
    },
    stores: {
        predefinedFilterStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/getPredefinedFilter'
            },
            model: 'mdaapp.model.FieldFilter',
            listeners: {
                beforeLoad: 'predefinedFilterBeforeLoad'
            }
        }
    },

    toJSONString:function(){
        var jstr='"isdistinct":'+this.data.distinctValue +',';
        jstr=jstr+this.callParent();
        return(jstr);
    }
});
