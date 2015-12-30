Ext.define('mdaapp.view.task.tabletree.TableTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.task-tabletree-tabletree',

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
        tableList=tableList.substr(0,tableList.length-1);
        view.taskWindow.setTableList(tableList);
        //console.log("the table list is ", view.taskWindow.getTableList());
    }


});
