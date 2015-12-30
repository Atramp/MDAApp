
Ext.define("mdaapp.view.task.tabletree.TableTree",{
    extend: "Ext.tree.Panel",
 
    requires: [
        "mdaapp.view.task.tabletree.TableTreeController",
        "mdaapp.view.task.tabletree.TableTreeModel"
    ],
    
    controller: "task-tabletree-tabletree",
    viewModel: {
        type: "task-tabletree-tabletree"
    },


    xtype : 'table-fields',
    reserveScrollbar: true,

    bind:{
        store:'{tableTreeStore}'
    },

    title: '',
    taskWindow:null,
    useArrows: true,
    rootVisible: false,
    multiSelect: true,
    singleExpand: false,
    enableDragDrop: true,
    viewConfig: {
        plugins: {
            ddGroup: 'grid-to-form',
            ptype: 'gridviewdragdrop',
            enableDrop: false
        }
    },
    width:400,
    layout:{
        type:'fit'
    },

    columns: [/*{
        xtype: 'treecolumn', //this is so we know which column will show the tree
        text: '数据表名/字段名',
        flex: 1,
        sortable: true,
        dataIndex: 'names'
    },*/ {
        //xtype: 'treecolumn2', //this is so we know which column will show the tree
        xtype:'treecolumn',
        text: '字段名称',
        //flex: 2,
        sortable: false,
        dataIndex: 'coltitle',
        //width: 100
        flex:1,
        renderer:function(val,metadata,record){
            if(record.get("colId")<0){
                var comment=record.get('comments');
                if(comment==null || comment==''){
                    return(val);
                }else{
                    return(comment);
                }
            }
            var data = record.data;
            if(val==null || val==""){
                return(data.names);
            }else{
                return(val);
            }
        }
    }, /*{
        //xtype: 'treecolumn3', //this is so we know which column will show the tree
        text: '描述',
        //flex: 2,
        sortable: true,
        dataIndex: 'comments',
        width: 100
    },*/ {
        //xtype: 'treecolumn3', //this is so we know which column will show the tree
        text: 'colId',
        sortable: true,
        dataIndex: 'colId',
        hidden: true,
        width: 0
    }, {
        //xtype: 'treecolumn3', //this is so we know which column will show the tree
        text: 'tableid',
        sortable: true,
        dataIndex: 'tableid',
        width: 0,
        hidden: true
    }],

    onBoxReady:function(){
        var me=this;
        this.getViewModel().get("tableTreeStore").load();
    }

});
