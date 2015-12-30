Ext.define('mdaapp.view.TestViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.testview',

    onClick:function(){
        var store=this.getViewModel().getStore('opStore');
        //console.log(store);
        store.addNecessaryData(true,"",'100,101');

    }
    
});
