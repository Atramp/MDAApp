/**
 * Created by YS186019 on 2015/11/25.
 */
Ext.define("mdaapp.store.PlaceStore",{
    extend:"Ext.data.Store",

    alias:'store.PlaceStore',

    requires:[
        "mdaapp.model.Field"
    ],

    model:"mdaapp.model.Field",
    proxy: {
        type: 'ajax',
        url: 'getcolumninfo/getall'
    },
    autoLoad:false,

    getColumnById:function(colId){
        var me=this,
            rec=null;
        me.each(function(record){
            if(record.get("colId")==colId){
                rec=record;
            }
        });
        return(rec);
    }

});