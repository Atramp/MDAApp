Ext.define("mdaapp.view.template.TemplateWindow", {
    extend: "Ext.panel.Panel",

    requires: [
        "mdaapp.view.template.TemplateWindowController",
        "mdaapp.view.template.TemplateWindowModel",
        "mdaapp.view.template.TemplatePreviewWindow",
        "mdaapp.view.template.TemplatePropertyWindow",
        "mdaapp.util.DimensionType"
    ],

    controller: "template-templatewindow",
    viewModel: {
        type: "template-templatewindow"
    },
    closeAction:'destroy',

    xtype: 'template-window',

    templateRecord:null,
    bodyBorder: false,
    action:'new',
    filterId:0,
    //deferredRender : false,

    layout: {
        type: 'border'
    },
    tableList: null,
    //layout:'border',
    defaults: {
        collapsible: true,
        split: true
    },
    listeners: {
        close: 'onClose'
    },
    items: [
        {
            title: '请选择字段',
            region: 'west',
            xtype: 'table-fields',
            itemId: 'fieldContainer',
            floatable: true,
            width: 300,
            minWidth: 250,
            maxWidth: 400,
            layout: {
                type: 'fit'
            }
        },
        {
            xtype: 'template-preview',
            title: '模板预览',
            itemId: "previewContainer",
            autoDestroy: false,
            collapsible: false,
            deferredRender: false,
            region: 'center'
        },
        {
            title: '模板属性',
            xtype: 'template-property',
            itemId: "propertyContainer",
            autoDestroy: false,
            //frame: true,
            collapsible: false,
            deferredRender: false,
            region: 'east',
            flex:1
        }
    ],

    onBoxReady: function () {
        this.callParent();
        var me = this;
        me.setLoading(true);
        //creaet drag-drop target
        var fieldWnd=this.queryById('fieldContainer'),
            propertyWnd=this.queryById('propertyContainer'),
            previewWnd=this.queryById('previewContainer'),
            previewbody = previewWnd.getEl();;
        fieldWnd.taskWindow = this;
        propertyWnd.taskWindow = this;
        previewWnd.taskWindow = this;
        previewWnd.filterId=this.filterId;
        previewWnd.getViewModel().set('filterId',this.filterId);
        propertyWnd.filterId=this.filterId;
        // create drag drop target

        // set the taskWindow handler of all the element
        if(this.action=="edit"){
            if(this.templateRecord!=null) {
                var place = this.templateRecord.get("place"),
                    cId = this.templateRecord.get("colId"),
                    fId = this.templateRecord.get("filterId");
                me.getController().createField(place, cId, fId, 'edit');
                propertyWnd.setRecord(this.templateRecord);
            }else{
                var store=me.getViewModel().getStore('filterTemplate');
                store.getProxy().setExtraParam('filterId',me.filterId);
                store.load(function(recs){
                    var rec=recs[0];
                    var place =rec.get("place"),
                        cId = rec.get("colId"),
                        fId = rec.get("filterId");
                    me.getController().createField(place, cId, fId, 'edit');
                    propertyWnd.setRecord(rec);
                });
            }
        }else{
            if (previewbody && me.previewDropTarget == null) {
                ////console.log("create preview dd");
                me.previewDropTarget = new Ext.dd.DropTarget(previewbody, {
                    ddGroup: 'grid-to-form',
                    scope: this,
                    notifyEnter: function (ddSource, e, data) {
                        //Add some flare to invite drop.
                        //console.log(previewWnd.field);
                        if(previewWnd.field==null){
                            //previewbody.stopAnimation();
                            previewbody.highlight();
                        }else{

                        }
                    },
                    notifyDrop: function (ddSource, e, data) {
                        // Reference the record (single selection) for readability
                        if(previewWnd.field!=null){
                            //console.log("return directly");
                            return;
                        }

                        var selectedRecord = ddSource.dragData.records[0];
                        var colId = selectedRecord.get('colId');
                        var wnd=Ext.create("mdaapp.util.DimensionType",{
                            title:'请选择维度类型',
                            scope:me,
                            callback:function(dimensionType){
                                me.getController().createField(dimensionType, colId, 0, 'new');
                                //create a new empty property record now;
                                var templateRec=Ext.create("mdaapp.model.FieldFilterTemplate",{
                                    filterId:0,
                                    colId:colId,
                                    place:dimensionType
                                });
                                //console.log("selected record",selectedRecord);
                                templateRec.set('tableName', selectedRecord.get('tablename'));
                                templateRec.set('colName', selectedRecord.get('names'));
                                templateRec.set('coltitle', selectedRecord.get('coltitle'));
                                templateRec.set('tableid', selectedRecord.get('tableid'));
                                templateRec.set('dbtype', selectedRecord.get('dbtype'));
                                templateRec.set('dbname', selectedRecord.get('dbname'));
                                templateRec.set('schemaname', selectedRecord.get('schemaname'));
                                templateRec.set('coltype', selectedRecord.get('coltype'));
                                templateRec.set('colformat', selectedRecord.get('colformat'));
                                templateRec.set('colmaxlength', selectedRecord.get('colmaxlength'));
                                templateRec.set('comments', selectedRecord.get('comments'));
                                templateRec.set('coldecimal', selectedRecord.get('coldecimal'));
                                templateRec.set('colfraction', selectedRecord.get('colfraction'));
                                templateRec.set('creatorname', selectedRecord.get('creatorname'));
                                templateRec.set('tabletype', selectedRecord.get('tabletype'));
                                templateRec.set('virtualtype', selectedRecord.get('virtualtype'));
                                templateRec.set('referenceCount', selectedRecord.get('referenceCount'));
                                // now create default property of the record
                                templateRec.set('op1label','');
                                templateRec.set('op1candidate','');
                                templateRec.set('showoperator1',true);
                                templateRec.set('param1leftlabel','');
                                templateRec.set('param1style','');
                                templateRec.set('param1rightlabel','');
                                templateRec.set('opconnectorid',0);
                                templateRec.set('opconnectiontitle','');
                                templateRec.set('connectorcandidate','');
                                templateRec.set('paramcount',2);
                                templateRec.set('op2label','');
                                templateRec.set('op2candidate','');
                                templateRec.set('showoperator2',true);
                                templateRec.set('param2leftlabel','');
                                templateRec.set('param2style','');
                                templateRec.set('param2rightlabel','');
                                templateRec.set('param1checkrule','');
                                templateRec.set('param2checkrule','');
                                templateRec.set('paramscheckrule','');
                                templateRec.set('resultoperatorid',0);
                                templateRec.set('op1Id',0);
                                templateRec.set('op2Id',0);
                                templateRec.set('connectorid',0);
                                templateRec.set('param1value','');
                                templateRec.set('param2value','');
                                templateRec.set('outputtitle','');
                                me.templateRecord=templateRec;
                                propertyWnd.setRecord(me.templateRecord);
                            }
                        });
                        return true;
                    }
                });
                previewWnd.setTaskWindow(me);
            }
        }
        this.setLoading(false);
    },

    setTableList: function (tlist) {
        this.tableList = tlist;
    },

    getTableList: function () {
        return (this.tableList);
    }
});
