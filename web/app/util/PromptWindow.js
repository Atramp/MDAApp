
Ext.define("mdaapp.util.PromptWindow",{
    extend: "Ext.window.Window",
 
    callback:null, // point to the caller of this window, actually is FieldController
    createNew:true,
    title:'',
    titleLabel:'',
    titleText:'',
    commentLabel:'',
    comment:'',
    closable:false,
    scope:null,
    caller:null,
    closeAction:'destroy',
    width:400,
    height:300,
    layout:{
        type:'vbox',
        pack: 'start',
        align: 'stretch'
    },
    simpleDrag:true,
    draggable:true,
    items:[
        {
            // here is the beginner paramter input or select field
            xtype:'textfield',
            fieldLabel:'请输入名称',
            labelAlign:'top',
            //flex:1,
            allowBlank:false,
            itemId:'titleInputBox'
        },
        {
            // here is the beginner paramter input or select field
            flex:1,
            xtype:'textareafield',
            grow:true,
            fieldLabel:'请输入备注',
            labelAlign:'top',
            itemId:'commentInputBox'
        }
    ],

    buttons: [
        {
            text: '确认',
            itemId:'btok'
        },
        {
            text: '取消',
            itemId:'btcancel'
        }
    ],

    listeners:{
        close:function(){
            Ext.getCmp('mainWnd').unmask();
        }
    },

    onBoxReady:function(){
        Ext.getCmp('mainWnd').mask();
        var me=this;
        this.queryById('titleInputBox').setFieldLabel(this.titleLabel);
        this.queryById('commentInputBox').setFieldLabel(this.commentLabel);
        var cancelbt=this.queryById('btcancel');
        cancelbt.addListener({
            click:{
                scope:me,
                fn:'onCancel'
            }
        });
        var okbt=this.queryById('btok');
        okbt.addListener({
            click:{
                scope:me,
                fn:'onOK'
            }
        });
        this.queryById('titleInputBox').setValue(this.titleText),
        this.queryById('commentInputBox').setValue(this.comment);

    },

    onCancel:function(){
        //console.log("onCancel");
        //Ext.getCmp('mainWnd').unmask();
        this.close();
    },

    onOK:function(){
        //console.log("onOK");
        var titleText=this.queryById('titleInputBox').getValue(),
            commentText=this.queryById('commentInputBox').getValue();
        if(titleText==null || titleText==""){
            //Ext.MessageBox.alert("","请输入标题");
            Ext.MessageBox.show({
                title: "错误",
                msg: "请输入标题",
                icon: Ext.MessageBox.WARNING,
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        //console.log('title Text:',titleText,'comment text:',commentText);
        if(this.callback && this.scope){
            var newFunc=Ext.bind(this.callback,this.scope);
            newFunc(this.createNew,titleText,commentText);
        }
        this.close();
    }
});
