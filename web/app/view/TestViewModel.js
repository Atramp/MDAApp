Ext.define('mdaapp.view.TestViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.testview',
    requires:[
        "mdaapp.store.OperationStore"
    ],

    data: {
        name: 'mdaapp'
    },

    stores:{
//      opStore:function(){return (new Ext.create("OperationStore"));}
        opStore:{
            type:'opStore'
        }
    }

});
