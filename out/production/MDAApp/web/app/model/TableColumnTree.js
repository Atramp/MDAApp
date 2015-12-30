/**
 * Created by YS186019 on 2015/12/11.
 */
Ext.define('mdaapp.model.TableColumnTree', {
    extend: 'Ext.data.TreeModel',
    fields: [
        {name: 'colId', type: 'int'},
        {name: 'tableid', type: 'int'},
        {name: 'dbtype', type: 'string'},
        {name: 'dbname', type: 'string'},
        {name: 'schemaname', type: 'string'},
        {name: 'tablename', type: 'string'},
        {name: 'colname', type: 'string'},
        {name: 'coltype', type: 'string'},
        {name: 'colformat', type: 'string'},
        {name: 'colmaxlength', type: 'int'},
        {name: 'colcomment', type: 'string'},
        {name: 'coltitle', type: 'string'},
        {name: 'coldecimal', type: 'int'},
        {name: 'colfraction', type: 'int'},
        {name: 'leaf', type: 'boolean'},
        {name: 'virtualtype', type: 'string'},
        {name: 'names', type: 'string'},
        {name: 'defaultInputType', type: 'string'}
    ]

});