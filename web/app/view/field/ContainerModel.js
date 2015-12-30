Ext.define('mdaapp.view.field.ContainerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.field-container',
    data: {
        name: 'mdaapp',
        fieldMap: null,
        fieldRelationMap: null,
        maxOrder: 0
    },

    constructor: function (arguments) {
        this.callParent(arguments);
        //MixedCollection
        this.set("fieldMap", Ext.create("Ext.util.MixedCollection"));
        this.set("fieldRelationMap", Ext.create("Ext.util.MixedCollection"));
    },

    // this function will only return a partial JSON string for field and field relation
    toJSONString: function () {
        var temp = this.get("fieldMap");
        var jsonStr = '"field":[';
        for (var i = 0, len = temp.getCount(); i < len; i++) {
            var view = temp.getAt(i);
            jsonStr = jsonStr + '{'+view.toJSONString()+'}';
            if (i < len - 1) {
                jsonStr = jsonStr + ',';
            }
        }
        jsonStr = jsonStr + '],"fieldRelation":[';
        temp = this.get("fieldRelationMap");
        for (var i = 0, len = temp.getCount(); i < len; i++) {
            var view = temp.getAt(i);
            jsonStr = jsonStr + '{'+ view.toJSONString()+'}';
            if (i < len - 1) {
                jsonStr = jsonStr + ',';
            }
        }
        jsonStr = jsonStr + ']';
        //console.log(jsonStr);
        return (jsonStr);
    },

    parseJSONString: function (jsonstr) {

    }


});
