/**
 * Created by YS186019 on 2015/11/26.
 */
Ext.define('mdaapp.model.GroupLayerModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'layerId', type: 'int', defaultValue: 0},
        {name: 'filterId', type: 'int', defaultValue: 0},
        {name: 'colId', type: 'int', defaultValue: 0},
        {name: 'ruleId', type: 'int', defaultValue: 0},
        {name: 'layerName', type: 'string', defaultValue: ''},
        {name: 'operator1', type: 'string', defaultValue: '>='},
        {name: 'boundary1', type: 'string', defaultValue: ''},
        {name: 'connector', type: 'string', defaultValue: 'AND'},
        {name: 'operator2', type: 'string', defaultValue: '<'},
        {name: 'boundary2', type: 'string', defaultValue: ''}
    ],


    toJson: function () {
        var me = this,
            jstr = '{',
            recFields = me.getFields();
        for (var i = 0, len = recFields.length; i < len; i++) {
            var name = recFields[i].getName(),
                type = recFields[i].getType(),
                value = me.get(name);
            ////console.log("name:",name," type: ",type," value: ",value);
            if (type == 'bool') {
                if (value === undefined || value == null) {
                    jstr = jstr + '"' + name + '":false,';
                } else if (value) {
                    jstr = jstr + '"' + name + '":true,';
                } else {
                    jstr = jstr + '"' + name + '":false,';
                }
            } else if (type == 'int') {
                if (value != null) {
                    jstr = jstr + '"' + name + '":' + value + ',';
                } else {
                    jstr = jstr + '"' + name + '":0,';
                }
            } else {
                if (value != null) {
                    jstr = jstr + '"' + name + '":"' + value + '",';
                } else {
                    jstr = jstr + '"' + name + '":"",';
                }
            }
        }
        jstr = jstr.substr(0, jstr.length - 1) + '}';
        return (jstr);
    }

});