Ext.define('mdaapp.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login-login',

    onLoginClick: function(){

        var me=this,
            view=me.getView();
        //var relogin=this.getView().reLogin;
        var action=view.action;
        // now the required action privilidge against the server


        if(action==null){
            action='relogin'
        };
        if(action=='relogin') {
            // Remove Login Window
            view.destroy();
            // if we need to create a new main-view, it depends if we already destroy it,
            // see application reLogin function for reference
            Ext.widget('main-view');
        }else if(action=='helptable'){
            view.destroy();
            if(view.callbackscope && view.callbackfn){
                var newFunc=Ext.bind(view.callbackfn,view.callbackscope);
                newFunc();
            }
            //Ext.widget('main-view');
        }else{

        }
    }

});
