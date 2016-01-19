
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
    html: "<span style='margin-left:20px ;'>欢迎使用</span>",
    closable: false,
    autoShow: true,
    border:true,
    height:200,
    width:400,
    layout:{
        type:'fit'
    }
});
