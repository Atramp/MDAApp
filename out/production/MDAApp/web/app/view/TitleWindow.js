
Ext.define("mdaapp.view.TitleWindow",{
    extend: "Ext.window.Window",

    /*   requires: [
        "mdaapp.view.TitleWindowController",
        "mdaapp.view.TitleWindowModel"
    ],
    
    controller: "titlewindow",
    viewModel: {
        type: "titlewindow"
    },*/
    //plugins: 'viewport',
    xtype:'title-window',
    html: "欢迎使用",
    closable: false,
    autoShow: true,
    layout:{
        type:'fit'
    },
    border:true,

    height:200,
    width:400,
    layout:{
        type:'fit'
    }
});
