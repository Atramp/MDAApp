
Ext.define("mdaapp.view.login.Login",{
    extend: "Ext.window.Window",
 
    requires: [
        "mdaapp.view.login.LoginController",
        "mdaapp.view.login.LoginModel"
    ],

    action:null,
    controller: "login-login",
    viewModel: {
        type: "login-login"
    },

    xtype: 'login-view',


    layout:{
        type:'fit'
    },

    callbackscope:null,
    callbackfn:null,

    height:200,
    width:400,
    bodyPadding: 10,
    title: '系统登录',
    closable: false,
    autoShow: true,
    items: {
        xtype: 'form',
        reference: 'form',
        items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: '用户名',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: '密码',
            allowBlank: false
        }/*, {
            xtype: 'displayfield',
            hideEmptyLabel: false,
            value: 'Enter any non-blank password'
        }*/],
        buttons: [{
            text: '登录',
            //formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }
});
