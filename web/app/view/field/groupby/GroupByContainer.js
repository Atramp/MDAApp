
Ext.define("mdaapp.view.field.groupby.GroupByContainer",{
    extend: "mdaapp.view.field.Container",

    requires: [
        "mdaapp.view.field.groupby.GroupByContainerController",
        "mdaapp.view.field.groupby.GroupByContainerModel"
    ],
    
    controller: "field-groupby-groupbycontainer",
    viewModel: {
        type: "field-groupby-groupbycontainer"
    },

    xtype:'groupby-container',

    ExtraTools:[
        {
            xtype: 'combobox',
            itemId: 'group-by-search',
            displayField: 'optitle',
            //reference: 'havingSelector1',
            valueField: 'filterId',
            fieldLabel: '预定义分档',
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
        '->'
    ]

});
