
Ext.define("mdaapp.view.template.TemplateOverView",{
    extend: "Ext.grid.Panel",
 
    requires: [
        "mdaapp.view.template.TemplateOverViewController",
        "mdaapp.view.template.TemplateOverViewModel"
    ],
    
    controller: "template-templateoverview",
    viewModel: {
        type: "template-templateoverview"
    },
    bind: {
        store: '{fieldFilter}'
    },
    //stateful: true,
    //collapsible: true,
    multiSelect: false,
    //stateId: 'stateGrid',
    xtype:'template-overview',

    tbar: [
        {
            xtype: 'textfield',
            itemId: 'searchTemplateText',
            fieldLabel: '维度模板名称',
            labelWidth: 100,
            width: 250
        },
        {
            xtype: 'button',
            text: '搜索',
            icon:'resources/search.png',
            itemId: 'btSearchTask',
            listeners: {
                click: 'searchTemplate'
            }
        },
        ' ',
        ' ',
        {
            xtype: 'button',
            text: '创建新维度',
            listeners: {
                click: 'onCreateNewTemplate'
            }
        },
        {
            xtype: 'button',
            text: '复制到新维度',
            listeners: {
                click: 'duplicateTemplate'
            }
        },
        {
            xtype: 'button',
            text: '修改选定维度',
            listeners: {
                click: 'editTemplate'
            }
        },
        {
            xtype: 'button',
            text: '删除选定维度',
            listeners: {
                click: 'deleteTemplate'
            }
        },
        ' ',
        ' ',
        /*        {
         xtype: 'button',
         text: '预览SQL',
         listeners: {
         click: 'SQLPreview'
         }
         },
         {
         xtype: 'button',
         text: '预览结果',
         listeners: {
         click: 'resultPreview'
         }
         },*/
        '->',
        {
            xtype: 'button',
            text: '刷新状态',
            listeners: {
                click: 'onRefresh'
            }
        }
    ],
    title: 'Array Grid',
    viewConfig: {
        enableTextSelection: true
    },

//{name: 'filterId', type: 'int'},
//{name: 'colId', type: 'int'},
//{name: 'opsql', type: 'string'},
//{name: 'place', type: 'string'},
//{name: 'optitle', type: 'string'},
//{name: 'description', type: 'string'},
//{name: 'showdescription', type: 'int'},
//{name: 'creator', type: 'string'},
//{name: 'createtime', type: 'string'},
//{name: 'op1label', type: 'string'},
//{name: 'op1candidate', type: 'string'},
//{name: 'showoperator1', type: 'boolean'},
//{name: 'param1leftlabel', type: 'string'},
//{name: 'param1style', type: 'string'},
//{name: 'param1rightlabel', type: 'string'},
//{name: 'opconnectorid', type: 'int'},

    columns: [
/*        {
            text: 'filterId',
            //flex     : 1,
            sortable: false,
            dataIndex: 'colId',
            hidden: true
        },
        {
            text: 'colId',
            //flex     : 1,
            sortable: false,
            dataIndex: 'colId',
            hidden: true
        },*/
        {
            text: '维度名称',
            //flex     : 1,
            sortable: true,
            dataIndex: 'optitle',
            width: 200

        },
        {
            text: '数据表名',
            //flex     : 1,
            sortable: true,
            dataIndex: 'tableName',
            width: 250,
            cellWrap:true

        },
        {
            text: '数据字段名',
            //flex     : 1,
            sortable: true,
            dataIndex: 'colName',
            width: 200

        },
        {
            text: '数据字段标题',
            //flex     : 1,
            sortable: true,
            dataIndex: 'coltitle',
            width: 200

        },
        {
            text: '维度分类',
            //flex     : 1,
            sortable: true,
            dataIndex: 'place',
            width: 100,
            renderer:function(val){
                if("where"==val){
                    return("条件选择");
                }else if("result"==val){
                    return("输出维度");
                }else if("groupby"==val){
                    return("分组和分档");
                }else if("orderby"==val){
                    return("排序");
                }else{
                    return(val);
                }
            }
        },
        {
            text: '引用计数',
            sortable: true,
            dataIndex: 'referenceCount',
            width:80
        },
        {
            text: '维度描述',
            flex: 1,
            sortable: true,
            dataIndex: 'description',
            cellWrap:true

        },
        {
            text: '创建人',
            width: 95,
            sortable: true,
            //formatter: 'usMoney',
            dataIndex: 'creator'
        },
        {
            text: '创建时间',
            width: 200,
            sortable: true,
            //formatter: 'usMoney',
            dataIndex: 'createtime'
        }
    ],

    onBoxReady: function () {
        this.getViewModel().getStore("fieldFilter").load();
    },

    refresh: function () {
        this.getViewModel().getStore('fieldFilter').reload();
    }

});
