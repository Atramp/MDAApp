
Ext.define("mdaapp.view.field.result.ResultContainer",{
    extend: "mdaapp.view.field.Container",
    //alias:'result-container',
    xtype: 'result-container',
    requires: [
        "mdaapp.view.field.result.ResultContainerController",
        "mdaapp.view.field.result.ResultContainerModel"
    ],
    
    controller: "field-result-resultcontainer",
    viewModel: {
        type: "field-result-resultcontainer"
    },

    ExtraTools:[
        {
            boxLabel: '结果去重',
            xtype: 'checkbox',
            name: 'distinctcheck',
            //inputValue: '1',
            itemId: 'distinctcheck',
            style: {
                marginRight: '20px'
            },
            bind: {
                value: '{distinctValue}'
            },
            listeners:{
                change:'distinctChange'
            }
        },
        {
            xtype: 'combobox',
            itemId: 'resultSearch',
            displayField: 'optitle',
            valueField: 'filterId',
            fieldLabel: '预定义输出',
            labelWidth: 70,
            width:250,
            //flex: 1,
            bind: {
                store: '{predefinedFilterStore}'
                //value:'{op1Id}'
            },
/*            listeners: {
                select: 'predefinedSearch'
            },*/
            minChars: 0,
            queryMode: 'remote'
        },
        {
            xtype:'button',
            text:'添加',
            listeners:{
                click:'addPredefinedFilter'
            }
        },
        '->',
        {
            type: 'button',
            text: '与-and',
            listeners: {
                click: 'andClick'
            }
        },
        {
            type: 'button',
            text: '或 - or',
            listeners: {
                click: 'orClick'
            }
        },
        {
            type: 'button',
            text: '删除关联',
            listeners: {
                click: 'deleteClick'
            }
        }
    ],

    setDistinct:function(flag){
        //console.log(this);
        this.queryById("distinctcheck").setValue(flag);
    }
});
