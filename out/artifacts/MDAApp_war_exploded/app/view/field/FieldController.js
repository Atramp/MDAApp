Ext.define('mdaapp.view.field.FieldController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.field-field',

    requires: [
        "mdaapp.util.PromptWindow"
    ],

    titleClick: function () {
        this.setSelected(!this.getSelected());
    },


    getSelected: function () {
        return (this.getViewModel().get('selected'));
    },

    setSelected: function (flag) {
        //console.log("the set selected flag", flag);
        var viewModel = this.getViewModel();
        var header = this.getView().getHeader();
        if (flag) {
            header.setStyle("backgroundColor", 'green');
            viewModel.set("selected", true);
        } else {
            header.setStyle("backgroundColor", viewModel.get('defaultHeaderColor'));
            viewModel.set("selected", false);
        }
    },

    showWarning: function (flag) {
        var viewModel = this.getViewModel();
        var header = this.getView().getHeader();
        if (flag) {
            header.setStyle("backgroundColor", "yellow");
            viewModel.set("warning", true);
        } else {
            header.setStyle("backgroundColor", viewModel.get('defaultHeaderColor'));
            viewModel.set("warning", false);
        }
    },

    onClose: function () {
        //alert(closed);
        var taskWnd = this.getView().taskWindow;
        taskWnd.getController().deleteField(this.getView());
    },

    onFieldMove: function () {
        var taskWnd = this.getView().taskWindow;
        taskWnd.getController().redrawConnector(this.getView());
    },

    onFieldResize: function () {
        var taskWnd = this.getView().taskWindow;
        taskWnd.getController().redrawConnector(this.getView());
    },

    getColInfoBeforeLoad: function (store, operation, eOpts) {
        var model = this.getViewModel();
        //console.log("before load ", model.get("colId"));
        if (model.get("colId") == -99) {
            return (false);
        }
        store.getProxy().setExtraParams({'colId': model.get("colId"), "place": model.get("place")});
        return (true);
    },


    parseColInfo: function (record) {

        var me = this,
            viewModel = this.getViewModel();
        //        store.each(function(record) {
        viewModel.set("colname", record.get("colname"));
        ////console.log(viewModel.get("colname"));
        viewModel.set("colId", record.get("colId"));
        viewModel.set("tableid", record.get("tableid"));
        viewModel.set("colname", record.get("colname"));
        viewModel.set("coltype", record.get("coltype"));
        viewModel.set("colformat", record.get("colformat"));
        viewModel.set("colmaxlength", record.get("colmaxlength"));
        viewModel.set("coldecimal", record.get("coldecimal"));
        viewModel.set("colfraction", record.get("colfraction"));
        viewModel.set("defaultCodeTable",record.get('defaultCodeTable'));
        viewModel.set("defaultInputType",record.get('defaultInputType'));
        var colcomments = record.get("comments");
        //console.log("comment is ", colcomments);
        if (colcomments) {
            viewModel.set("comments", record.get("colcomments"));
        } else {
            viewModel.set("comments", '');
        }
        //viewModel.set("comments",record.get("comments"));
        viewModel.set("coltitle", record.get("coltitle"));
        viewModel.set("dbtype", record.get("dbtype"));
        viewModel.set("dbname", record.get("dbname"));
        viewModel.set("schemaname", record.get("schemaname"));
        viewModel.set("tablename", record.get("tablename"));
        viewModel.set("tabletype", record.get("tabletype"));
        viewModel.set("virtualtype",record.get("virtualtype"));
    },


    /*
     getColInfoLoad:function( store, records, successful, eOpts){

     if(!successful){
     ////console.log("store load fail");
     return;
     }
     ////console.log('hhhhhhhhhh',records);
     var record=records[0];//.data;
     //console.log('hhhhhhhhhh',record);

     var viewModel=this.getViewModel();
     //        store.each(function(record) {
     viewModel.set("colname", record.get("colname"));
     ////console.log(viewModel.get("colname"));
     viewModel.set("colId",record.get("colId"));
     viewModel.set("tableid",record.get("tableid"));
     viewModel.set("colname",record.get("colname"));
     viewModel.set("coltype",record.get("coltype"));
     viewModel.set("colformat",record.get("colformat"));
     viewModel.set("colmaxlength",record.get("colmaxlength"));
     viewModel.set("coldecimal",record.get("coldecimal"));
     viewModel.set("colfraction",record.get("colfraction"));
     var colcomments=record.get("comments");
     //console.log("comment is ",colcomments);
     if(colcomments) {
     viewModel.set("comments", record.get("colcomments"));
     }else{
     viewModel.set("comments",'');
     }
     //viewModel.set("comments",record.get("comments"));
     viewModel.set("coltitle",record.get("coltitle"));
     viewModel.set("dbtype",record.get("dbtype"));
     viewModel.set("dbname",record.get("dbname"));
     viewModel.set("schemaname",record.get("schemaname"));
     viewModel.set("tablename",record.get("tablename"));
     viewModel.set("tabletype",record.get("tabletype"));
     //      });
     },
     */


/*    parseColInfo: function (records, operation, success) {
        //console.log("load callback");
        var viewModel = this.getViewModel();

        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            viewModel.set("colname", record.get("colname"));
            ////console.log(viewModel.get("colname"));
            viewModel.set("colId", record.get("colId"));
            viewModel.set("tableid", record.get("tableid"));
            viewModel.set("colname", record.get("colname"));
            viewModel.set("coltype", record.get("coltype"));
            viewModel.set("colformat", record.get("colformat"));
            viewModel.set("colmaxlength", record.get("colmaxlength"));
            viewModel.set("coldecimal", record.get("coldecimal"));
            viewModel.set("colfraction", record.get("colfraction"));
            viewModel.set("comments", record.get("comments"));
            viewModel.set("coltitle", record.get("coltitle"));
            viewModel.set("dbtype", record.get("dbtype"));
            viewModel.set("dbname", record.get("dbname"));
            viewModel.set("schemaname", record.get("schemaname"));
            viewModel.set("tablename", record.get("tablename"));
            viewModel.set("tabletype", record.get("tabletype"));
        }
        ;
    },*/


    increaseOrder: function (me, e, owner, eOpts) {
        //console.log("increase order");
        var oldValue = owner.getOrderNumber(),
            newValue = oldValue + 1;
        var view = this.getView(),
            maxNumber = view.taskWindow.getMaxOrderNumber();
        if (newValue > maxNumber) {
            newValue = maxNumber;
        } else if (newValue > 50) {
            newValue = 50;
        }
        this.getView().taskWindow.getController().onOrderChange(oldValue, newValue);
    },

    decreaseOrder: function (me, e, owner, eOpts) {
        //console.log("decrease order");
        var oldValue = owner.getOrderNumber(),
            newValue = oldValue - 1;
        var view = this.getView(),
            maxNumber = view.taskWindow.getMaxOrderNumber();
        if (newValue < 1) {
            newValue = 1;
        }
        this.getView().taskWindow.getController().onOrderChange(oldValue, newValue);
    },


    onSaveFilter: function () {
        var me = this,
            model=me.getViewModel(),
            filterName = model.get('optitle'),
            description = model.get('description');
        //me.getView().mask();
        //console.log(filterName);
        //console.log(description);
        var newFilter,
            filterId=me.getViewModel().get('filterId');
        if(filterId<100){
            newFilter=true;

        }else{
            newFilter=false;
        }

        var promptWnd = Ext.create("mdaapp.util.PromptWindow", {
            //caller:me, // point to the caller of this window, actually is FieldController
            callback: me.saveFilter,
            createNew: newFilter,
            commentLabel: '分析维度描述',
            title: "保存分析维度",
            titleLabel: "分析维度名称",
            titleText: filterName,
            comment: description,
            scope: me
        });
        promptWnd.show()
    },

    onFilterSaveAs: function () {
        var me = this;
        /*        var promptWnd=new Ext.create("mdaapp.view.field.SaveFilterPrompt",{
         fieldWnd:me,
         newFilter:true,
         filterName:'',
         description:''
         });*/
        //me.getView().mask();
        var promptWnd = Ext.create("mdaapp.util.PromptWindow", {
            //caller:me, // point to the caller of this window, actually is FieldController
            callback: me.saveFilter,
            createNew: true,
            commentLabel: '分析维度描述',
            title: "分析维度另存为",
            titleLabel: "分析维度名称",
            scope: me
        });
        promptWnd.show();
    },


    saveFilter: function (newFilter, titleText, commentText) {
        // you should not be here, actually a child class should overwrite this method to do
        // some field specific save
        //console.log("test of scope ", this);
        var me = this;
        /*        if(scope){
         me=scope;
         }*/
        //console.log('title Text:', titleText, 'comment text:', commentText);
        var model = me.getViewModel();
        //var jstr='{"colId":'+model.get('colId')+",";
        //jstr=jstr+'{"place":"'+model.get('place')+'",'
        var jstr = '{"place":"' + model.get('place') + '",';
        jstr = jstr + me.getViewModel().toJSONString() + ',';
        jstr = jstr + '"newfilter":' + newFilter + ",";
        jstr = jstr + '"optitle":"' + titleText + '",';
        jstr = jstr + '"description":"' + commentText + '"}';
        //console.log(jstr);
        Ext.Ajax.request({
            url: 'FieldFilterServlet/SaveFilter',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            jsonData: jstr,
            success: function (response) {
                me.processSaveResponse(response);
            },
            failure: function (response) {
                me.processSaveResponse(response)
            }
        })

    },

    processSaveResponse: function (response) {
        //console.log(response);
        var me=this;
        var resp = Ext.JSON.decode(response.responseText, true);
        var success = resp.hasError;//response.get("hasError");r
        //console.log(success);
        if (success == 'false') {
            var newId = resp.newFilterId;
            this.getView().filterId = newId;
            this.getViewModel().set("filterId", newId);
            //this.loadPredefinedFilter(newId);
            this.getView().taskWindow.reloadPredefinedFilter();
            me.getView().reloadPredefinedFilter(newId);
            Ext.MessageBox.alert("状态", "预定义维度保存成功");
        } else {
            var msg = resp.error;
            Ext.MessageBox.show({
                title: "错误",
                msg: msg,
                icon: Ext.MessageBox.WARNING,
                buttons:Ext.MessageBox.OK
            });

        }

    },

    loadPredefinedRule: function (ruleId) {

    }

});
