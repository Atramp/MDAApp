/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('mdaapp.Application', {
    extend: 'Ext.app.Application',

    name: 'mdaapp',
    appProperty: 'Current',
    operationStore: null,

    //MyApp.Current
    requires: [
        'mdaapp.view.Main',
        'mdaapp.view.login.Login',
        'mdaapp.view.helptable.HelpTable'
    ],

    routes: {
        //'helptable': 'onHelpTable',
        'helptable': 'showMainPage',
        'home': 'showMainPage'

    },

    defaultToken: 'home',

    stores: [
        // TODO: add global / shared stores here
        'CommonOperationCache',
        'ColumnCache'
    ],

    views: [
        'mdaapp.view.Main',
        'mdaapp.view.login.Login',
        'mdaapp.view.TestView',
        'mdaapp.view.TitleWindow'
    ],

    mainView: null,
    userName: null,
    titleWnd: null,
    launch: function () {
        // TODO - Launch the application

        var me = this;
        Ext.Ajax.on('requestcomplete', function (conn, response, options) {
            if (response && response.getResponseHeader && response.getResponseHeader('_needlogin')) {
                //console.log("...........please logon...............");
                if (response.getResponseHeader('_timeout')) {
                    Ext.Msg.alert('提示', '会话超时，请重新登录!', function () {
                        //window.location = 'http://192.168.1.10:8081/lin/login';

                    });
                }
                me.reLogin();
            }
        });
    },

    showMainPage: function () {
        var me = this;

        var htWnd = Ext.getCmp('help-table-wnd');
        if (htWnd) {
            htWnd.destroy();
        }
        
        this.titleWnd = new Ext.widget("title-window");
        //this.titleWnd=Ext.widget("title-window");
        //this.titleWnd=Ext.create("mdaapp.view.TitleWindow");
        //this.titleWnd.show();
        this.titleWnd.mask("请稍后");
        var stores = new Array();

        //Ext.widget(loggedIn ? 'app-main' : 'login');
        //Ext.widget("login-view");
        var store = this.getCommonOperationCacheStore();
        //console.log(store);
        store.load();
        stores[stores.length] = store;
        var colStore = this.getColumnCacheStore();
        colStore.load();
        stores[stores.length] = colStore;
        //wait for all stores load finish
        this.continueExecute(stores);
        //Ext.widget('test-view');

    },


    continueExecute: function (stores) {
        var me = this,
            isLoading = false;
        for (var i = 0, len = stores.length; i < len; i++) {
            if (stores[i].isLoading()) {
                isLoading = true;
                break;
            }
        }
        if (isLoading) {
            setTimeout(function () {
                me.continueExecute(stores);
            }, 100);
        } else {
            this.titleWnd.unmask();
            this.titleWnd.destroy();
            //Ext.widget("test-view");
            //Ext.widget('main-view');
            var mainWnd = Ext.create("mdaapp.view.Main");
            mainWnd.show();
        }
    },


    reLogin: function () {
        /*        if(this.mainView){
         this.mainView.destroy();
         }*/
        Ext.getCmp('mdaAppMainWindow').destroy();
        //console.log("hhhhhhheeeeeeeeeee");
        var login = Ext.create("mdaapp.view.login.Login", {
            action: 'relogin'
        });
    },

    /*    getOperationStore:function(){
     if(!this.operationStore){
     this.operationStore=this.getCommonOperationCacheStore();
     this.operationStore.load();
     }
     return(this.operationStore);
     }*/

    onHelpTable: function () {
        var me = this;
        var login = Ext.create("mdaapp.view.login.Login", {
            action: 'helptable',
            callbackscope: me,
            callbackfn: me.onShowHelpTable
        });

    },

    onShowHelpTable: function () {
        var mainWnd = Ext.getCmp('mdaAppMainWindow');
        if (mainWnd) {
            mainWnd.destroy();
        }
        //var ht = Ext.create("mdaapp.view.helptable.HelpTable");
        mainWnd = Ext.create("mdaapp.view.Main");
    }

});