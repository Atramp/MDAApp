Ext.define("mdaapp.view.field.Field", {
    extend: "Ext.panel.Panel",
    requires: [
        "mdaapp.view.field.FieldController",
        "mdaapp.view.field.FieldModel"
    ],

    place: '',
    colId: -1,
    taskWindow: null,
    filterId: -1,
    ruleId: -1,
    columnRecord: null,
    loading: true,
    showSave: true,  // control if the field window show save button
    showHelp: true,
    //skipChangeEvent: true,


    controller: "field-field",
    viewModel: {
        type: "field-field"
    },

    surroundSprite: null,

    listeners: {
        close: 'onClose',
        move: 'onFieldMove',
        resize: 'onFieldResize'
    },

    defaults: {
        alwaysOnTop: true,
        border: false
    },

    //border: 1,
    draggable: true,
    simpleDrag: true,
    header: {
        bind: {
            title: '{colname}'
        },
        listeners: {
            click: 'titleClick'
        },
        items: []
    },
    tools: [{
        type: 'up',
        //tooltip: '向后调整输出顺序',
        bind: {
            hidden: '{!enableOrder}'
        },
        listeners: {
            click: 'increaseOrder'
        }
    }, {
        type: 'down',
        //tooltip: '向前调整输出顺序',
        bind: {
            hidden: '{!enableOrder}'
        },
        listeners: {
            click: 'decreaseOrder'
        }
    },
        {
            type: 'help',
            tooltip: '帮助',
            bind: {
                hidden: '{!showHelp}'
            },
            callback: function (panel, tool, event) {
                // show help here
            }
        },
        {
            type: 'save',
            tooltip: '另存为维度模板',
            listeners: {
                click: 'onFilterSaveAs'
            },
            bind: {
                hidden: '{!showSave}'
            }
        }
        //{
        //    type: 'save',
        //    tooltip: '保存',
        //    listeners: {
        //        click: 'onSaveFilter'
        //    },
        //    bind: {
        //        hidden: '{!showSave}'
        //    }
        //}
    ],

    closable: true,
    closeAction: 'destroy',

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    //margin: '5,10,5,10',
    width: 400,
    items: [
        {
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            flex: 1,
            /*
             bind:{
             hidden:'{!coltitle}'
             },
             */
            items: [{
                xtype: 'label',
                //width: '100%',
                border: false,
                style: {
                    'text-align': 'center'
                },
                bind: {
                    text: '{coltitle}'
                },
                flex: 1
            }, {
                xtype: 'displayfield',
                fieldLabel: '顺序',
                labelWidth: 30,
                name: 'basic',
                //value: 1,
                bind: {
                    value: '{orderNumber}',
                    hidden: '{!enableOrder}'
                },
                width: 100,
                minValue: 1,
                maxValue: 50
            }
            ]
        }
        /*,
         {
         xtype: 'combobox',
         itemId:'placeSelector',
         displayField: 'place',
         //reference: 'havingSelector1',
         valueField: 'filterId',
         fieldLabel:'输出方式选择',
         editable:false,
         labelWidth:90,
         publishes:'value',
         //flex:1,
         bind:{
         store: '{placeStore}',
         value:'{}'
         },
         listeners:{
         select : 'placeSelected'
         },
         minChars: 0,
         queryMode:'local'
         },
         {
         xtype: 'button',
         text: 'ttttt',
         listeners: {
         click: function () {
         alert('fuck')
         }
         }
         }*/
    ],

    onBoxReady: function () {

        var me = this,
            viewModel = this.getViewModel();
        ////console.log(this.place);
        viewModel.set("place", this.place);
        //console.log(viewModel.get("place"));
        viewModel.set("colId", this.colId);
        var header = this.getHeader();
        var color = header.getEl().getStyle("backgroundColor");
        viewModel.set('defaultHeaderColor', color);
        viewModel.set("defaultBorderColor", this.getEl().getStyle('borderColor'));
        viewModel.set("showSave", this.showSave);
        viewModel.set("enableOrder", this.enableOrder);
        viewModel.set("showHelp", this.showHelp);
        var me = this;
        //viewModel.getStore("getColInfo").load();
        if (this.columnRecord) {
            this.getController().parseColInfo(this.columnRecord);
        }
        viewModel.set('filterId', this.filterId);
        viewModel.set('ruleId', this.ruleId);
        var header = me.getHeader();
        header.setStyle("backgroundImage", "none");
        this.callParent();
        /*        viewModel.getStore("getColInfo").load(function(records, operation, success){

         me.controller.parseColInfo(records,operation,success); //the reason we use callback is because it more reliable than load event
         });*/

    },

    toJSONString: function () {
        return (this.getViewModel().toJSONString());
    }
    ,

    parseJSONString: function (jstr) {
        this.getViewModel().parseJSONString(jstr);
    }
    ,

// this function is a null implement thus when we repaint the frame, this comopnent will be skiped
    setRect: function () {
    }
    ,
    hitTestEvent: function () {
    }
    ,

    isSelected: function () {
        return (this.getViewModel().get('selected'));
    }
    ,

    setSelected: function (flag) {
        this.getController().setSelected(flag);
    }
    ,

    setRelationConnector: function (obj) {
        this.getViewModel().set("relationConnector", obj);
    }
    ,

    /*    clearRelationConnector:function(){
     this.getViewModel().set("relationConnector",null);
     },*/

    getRelationConnector: function () {
        return (this.getViewModel().get("relationConnector"));
    }
    ,

    isConnector: function () {
        return (false);
    }
    ,

    setSurroundSprite: function (sprite) {
        if (sprite) {
            this.surroundSprite = sprite;
        }
    }
    ,

    removeSurroundSprite: function () {
        if (this.surroundSprite) {
            var surface = this.surroundSprite.getSurface();
            if (sufrace) {
                surface.remove(this.surroundSprite);
                surface.renderFrame();
            }
            surroundSprite.destroy();
            this.surroundSprite = null;
        }
    }
    ,

    setOrderNumber: function (number, flag) {
        //this.skipChangeEvent = flag;
        this.getViewModel().set("orderNumber", number);
    }
    ,

    getOrderNumber: function () {
        return (this.getViewModel().get("orderNumber"));
    }
    ,

    setRuleId: function (id) {
        this.ruleId = id;
        this.getViewModel().set("ruleId", id);
    }
    ,

    getRuleId: function () {
        return (this.getViewModel().get("ruleId"));
    },

    isLoading: function () {
        return (this.isLoading);
    },

    setProperty: function (propName, propValue) {
        this.getViewModel().set(propName, propValue);
    },

    getProperty: function (propName) {
        return (this.getViewModel().get(propName));
    }
})
;
