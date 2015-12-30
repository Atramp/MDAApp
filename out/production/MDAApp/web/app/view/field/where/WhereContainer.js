Ext.define("mdaapp.view.field.where.WhereContainer", {
    extend: "mdaapp.view.field.Container",
    xtype: 'where-container',
    requires: [
        "mdaapp.view.field.where.WhereContainerController",
        "mdaapp.view.field.where.WhereContainerModel"
    ],

    controller: "field-where-wherecontainer",
    viewModel: {
        type: "field-where-wherecontainer"
    },

    ExtraTools: [
        {
            xtype: 'combobox',
            itemId: 'whereSearch',
            displayField: 'optitle',
            //reference: 'havingSelector1',
            valueField: 'filterId',
            fieldLabel: '预定义维度',
            labelWidth: 70,
            width: 250,
            bind: {
                store: '{predefinedFilterStore}'
                //value:'{op1Id}'
            },
/*            listeners: {
                select: 'predefinedFilterSelected'
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
        //{
        //    type: 'button',
        //    text: '非-not',
        //    listeners: {
        //        click: 'notClick'
        //    }
        //},
        {
            type: 'button',
            text: '删除关联',
            listeners: {
                click: 'deleteClick'
            }
        }

    ]




});
