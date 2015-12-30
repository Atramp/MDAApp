Ext.define('mdaapp.view.field.groupby.GroupByFieldModel', {
    extend: 'mdaapp.view.field.FieldModel',
    alias: 'viewmodel.field-groupby-groupbyfield',
    requires:[
        "mdaapp.model.FieldFilter",
        "mdaapp.model.GroupLayerModel"
    ],

    data: {
        name: 'mdaapp',
        showLayerInput:false,
        filterRecord:null,
        originalFilterId:null
    },

    stores:{
        fieldFilter: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/getPredefinedFilter'
            },
            model: "mdaapp.model.FieldFilter",
            listeners: {
                beforeload: 'predefinedFilterBeforeLoad'
                //load: 'predefinedFilterLoad'
                //beforeload: 'onFilterBeforeLoad'
            }
        },
        //groupLayerStore:{
        //    autoLoad: false,
        //    proxy: {
        //        type: 'ajax',
        //        url: '/FieldFilterServlet/getPredefinedFilter'
        //    },
        //    model: "mdaapp.model.FieldFilter",
        //    listeners: {
        //        //beforeload: 'predefinedFilterBeforeLoad',
        //        //load: 'predefinedFilterLoad'
        //        //beforeload: 'onFilterBeforeLoad'
        //    }
        //},
        templateFilterStore:{
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/defineFilterTemplate',
                extraParams:{
                    place:'groupby'
                }
            },
            model: "mdaapp.model.FieldFilter",
            listeners:{
                //load:
            }
        },
        layerStore:{
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'FieldFilterServlet/getLayerData'
            },
            model: "mdaapp.model.GroupLayerModel",
            listeners: {
                //beforeload: 'predefinedFilterBeforeLoad',
                //load: 'predefinedFilterLoad'
                //beforeload: 'onFilterBeforeLoad'
            }
        }
    },

    toJSONString: function () {
        //var rec=this.getData();
        ////console.log(rec);
        // this is a parcial jsone string, so don't forget to add {} when needed
        var me=this,
            view=me.getView(),
            jsonStr=me.callParent() +',';
        jsonStr=jsonStr+'"layerInfo":[';
        var store=me.getStore("layerStore"),
            rec=store.getData(),
            len=store.getCount();
        for(var i= 0;i<len;i++){
            jsonStr=jsonStr+store.getAt(i).toJson()+',';
        }
        if(len>0){
            jsonStr=jsonStr.substr(0,jsonStr.length-1);
        }
        jsonStr=jsonStr+']';
        return(jsonStr);
    }

});
