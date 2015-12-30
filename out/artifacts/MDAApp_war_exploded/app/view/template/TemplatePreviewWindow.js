
Ext.define("mdaapp.view.template.TemplatePreviewWindow",{
    extend: "Ext.panel.Panel",
 
    requires: [
        "mdaapp.view.template.TemplatePreviewWindowController",
        "mdaapp.view.template.TemplatePreviewWindowModel"
    ],
    
    controller: "template-templatepreviewwindow",
    viewModel: {
        type: "template-templatepreviewwindow"
    },
    taskWindow:null,

    field:null,
    filterRecord:null,
    action:null,
    filterId:null,

    xtype:'template-preview',

    tbar:[
        //{
        //    xtype:'button',
        //    text:'重置',
        //    toolTip:'重置为缺省值',
        //    listeners:{
        //        click:'onReset'
        //    }
        //},
        '->',
        {
            xtype:'button',
            text:'保存',
            listeners:{
                click:'onSave'
            }
        },
        {
            xtype:'button',
            text:'另存为',
            listeners:{
                click:'onSaveAs'
            }
        },
        {
            xtype:'button',
            text:'取消',
            listeners:{
                click:'onCancel'
            }
        }
    ],

    onBoxReady:function(){
        if(this.action=='edit'){
            this.getViewModel().set("filterId",this.filterId);
        }
        this.callParent();
    },


    setTaskWindow:function(obj){
        this.taskWindow=obj;
    },

    getTaskWindow:function(){
        return(this.taskWindow);
    },

    addField:function(field){
        var me=this,
            box=me.getBox(true,false);
        ////console.log("the box is ",box);
        this.add(field);
        this.field=field;
        field.setX(box.x+50);
        field.setY(box.y+100);
    },
    redrawConnector:function(){

    },

    getField:function(){
        return(this.field);
    }
});
