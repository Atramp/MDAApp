/**
 * Created by YS186019 on 2015/10/31.
 */
Ext.define('mdaapp.store.CommonOperationCache', {
    extend: 'Ext.data.Store',

    requires:[
        'mdaapp.model.CommonOperation'
    ],

    storeId:'CommonOperationCache',
    model:'mdaapp.model.CommonOperation',
    proxy: {
        type: 'ajax',
        url: 'GetOperations/getAll',
        autoLoad:false
    }

});