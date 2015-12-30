Ext.define('mdaapp.view.helptable.HelpTableController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.helptable-helptable',

    requires:[
        'mdaapp.util.ColumnEditor'
    ],

    tableTreeLoaded:function(store, records, successful, operation, node, eOpts ){
        var model=this.getViewModel(),
            view=this.getView(),
            tableList='',
            tableName='';
        node.cascadeBy(function(record){
            var name=record.get("tableid");
            if(name===undefined){
                return(true);
            }
            if(tableName!=name){
                tableName=name;
                tableList=tableList+name+',';
            }
        });
        //tableList=tableList.substr(0,tableList.length-1);
        //view.taskWindow.setTableList(tableList);
        //console.log("the table list is ", view.taskWindow.getTableList());
    },

    onImport:function(){
        var me=this,
            view=me.getView(),
            dbName=view.queryById("dbnameInput").getValue(),
            tableName=view.queryById("tableNameInput").getValue();
        console.log("dbname: " , dbName , " table Name ", tableName);
        if(tableName==null || tableName==""){
            Ext.MessageBox.show({
                title: "错误",
                msg: "请输入数据表名",
                icon: Ext.MessageBox.WARNING,
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        if(dbName==null || dbName==""){
            Ext.MessageBox.show({
                title: "错误",
                msg: "请输入数据库名",
                icon: Ext.MessageBox.WARNING,
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        Ext.Ajax.request({
            url: 'helptable/import',
            method: 'POST',
            params:{
                'databasename':dbName,
                'tablename':tableName
            },
            success: function (response) {
                me.processHelpTableResponse(response, true);
            },
            failure: function (response) {
                me.processHelpTableResponse(response, true)
            }
        });

    },

    processHelpTableResponse: function (response) {
        ////console.log(this);
        var me = this,
            view = me.getView(),
            model = me.getViewModel();
        ////console.log(response);
        var resp = Ext.JSON.decode(response.responseText, true);
        var success = resp.hasError;//response.get("hasError");r
        ////console.log(success);
        if (success==false || success == 'false' ) {
            model.getStore("tableTreeStore").load();
        } else {
            var msg = resp.error;
            Ext.MessageBox.show({
                title: "错误",
                msg: msg,
                icon: Ext.MessageBox.WARNING
            });

        }
    },

    onSave:function(){

    },

    onDelete:function(){

    },

    editColumn:function(grid, rowIndex, colIndex, actionItem, event, record, row) {
        var colId=record.get("colId"),
            inputType=record.get("defaultInputType"),
            tableId=record.get("tableid"),
            editTable=false,
            colTitle;
        if(colId<0){
            editTable=true;
            colTitle=record.get('comments');
            if(colTitle==null || colTitle==''){
                colTitle=record.get('names');
            }
        }else{
            editTable=false;
            colTitle=record.get('coltitle');
        }

        var inputWnd=Ext.create("mdaapp.util.ColumnEditor",{
            'colId':colId,
            'inputType':inputType,
            'editTable':editTable,
            'tableId':tableId,
            'colTitle':colTitle
        });
        //inputWnd.show();
    },

    deleteColumn:function(grid, rowIndex, colIndex, actionItem, event, record, row) {
        var me=this;
        var colId=record.get("colId"),
            tableId=record.get("tableid"),
            msg;
        if(colId<=0){
            msg="请确认删除整个表 " +record.get("names") + "和全部相关字段？";
        }else{
            msg="请确认删除字段 " +record.get("coltitle") +"?";
        }
        Ext.MessageBox.confirm("删除字段",msg,function(btn,text){
            if(btn!='yes'){
                return;
            }
            Ext.Ajax.request({
                url: 'helptable/delete',
                method: 'POST',
                params:{
                    'tableId':tableId,
                    'colId':colId
                },
                success: function (response) {
                    me.processHelpTableResponse(response, true);
                },
                failure: function (response) {
                    me.processHelpTableResponse(response, true)
                }
            });
        });
    }
    
});
