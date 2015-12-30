
Ext.define("mdaapp.view.TestView",{
    extend: "Ext.panel.Panel",
    plugins: 'viewport',
    requires: [
        "mdaapp.view.TestViewController",
        "mdaapp.view.TestViewModel",
        "mdaapp.store.OperationStore"
    ],
    
    controller: "testview",
    viewModel: {
        type: "testview"
    },

    xtype:'test-view',

    items:[{
        xtype:'form',
        items:[{
            xtype:'combobox',
            itemId:'op1',
            bind:{
                store:'{opStore}'
            },
            queryMode:'local',
            valueField:'operationid',
            displayField:'operationtitle'
        },
            {
                xtype:'button',
                itemId:'xbutton',
                text:'tttt',
                listeners:{
                    click:'onClick'
                }

            }]
    }]

/*    onBoxReady:function(){
        //this.queryById('xbutton').addListener('click',this.onClick,this);
    },*/



});
