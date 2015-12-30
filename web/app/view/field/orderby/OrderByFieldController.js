Ext.define('mdaapp.view.field.orderby.OrderByFieldController', {
    extend: 'mdaapp.view.field.FieldController',
    alias: 'controller.field-orderby-orderbyfield',

    parseRuleFilterRecord:function(record){
        var me=this,
            model=me.getViewModel(),
            val=record.get("op1Id"),
            view=me.getView(),
            radio1=view.queryById("radio1"),
            radio2=view.queryById("radio2"),
            radio3=view.queryById("radio3");

        model.set("op1Id",val);
        model.set("filterId",record.get("filterId"));
        model.set("ruleId",record.get("ruleId"));
        if(val==0){
            radio1.setValue(true);
            radio2.setValue(false);
            radio3.setValue(false);
        }else if(val==1){
            radio1.setValue(false);
            radio2.setValue(true);
            radio3.setValue(false);
        }else{
            radio1.setValue(false);
            radio2.setValue(false);
            radio3.setValue(true);
        }
    },

    setParamCount:function(newValue){

    }

});
