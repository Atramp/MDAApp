Ext.define('mdaapp.view.field.groupby.GroupByFieldController', {
    extend: 'mdaapp.view.field.FieldController',
    alias: 'controller.field-groupby-groupbyfield',


    loadPredefinedFilter: function (filterId) {
        var me = this,
            model = me.getViewModel(),
            store=model.getStore('fieldFilter');

        store.load(function (records, operation, success) {
            for (var i = 0, len = records.length; i < len; i++) {
                ////console.log(records[i].get('filterId'));
                if (records[i].get('filterId') == filterId) {
                    //console.error("sssssssssssssssssssssssssssssssssss",model);
                        model.set("filterRecord", records[i]);
                        me.getView().queryById("layerSelector").setValue(filterId);
                        me.parseFilter(records[i]);
                    break;
                }
            }
            ////console.log("value set");
        });
    },

    predefinedFilterBeforeLoad:function(store, operation, eOpts ){
        var proxy = store.getProxy();
        //console.error("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",model);
        proxy.setExtraParams({});
        proxy.setExtraParam("place", "groupby");
        proxy.setExtraParam("colId", this.getViewModel().get('colId'));
        //proxy.setExtraParam("colId", this.getViewModel().get('ruleId'));
        return(true);
    },

    onGroupSelected:function(combo, record, eOpts){
        this.parseFilter(record);
    },

    parseFilter:function(rec){
        var me=this,
            view=me.getView(),
            model=me.getViewModel(),
            filterId=rec.get('filterId'),
            store=model.getStore('layerStore'),
            ruleId=model.get("ruleId"),
            ofId=model.get("originalFilterId");
        model.set('filterRecord',rec);
        model.set('optitle',rec.get('optitle'));
        model.set('description',rec.get('description'));
        model.set('resultoperatorid',rec.get('resultoperatorid'));


        var val=rec.get("op1Id"),
            radio1=view.queryById("radio1"),
            radio2=view.queryById("radio2"),
            radio3=view.queryById("radio3");

        model.set("op1Id",val);
        if(val==0){
            radio1.setValue(true);
            radio2.setValue(false);
            radio3.setValue(false);
        }else if(val==1){
            radio1.setValue(false);
            radio2.setValue(true);
            radio3.setValue(false);
        }else{
            radio1.setValue(false);
            radio2.setValue(false);
            radio3.setValue(true);
        }




        if(ruleId>0){
            if(filterId==ofId){
                store.getProxy().setExtraParam('filterId',filterId);
                store.getProxy().setExtraParam('ruleId',ruleId);
                store.load(); //here we do nothing because the user didn't change the rule related filter
            }else{
                store.getProxy().setExtraParam('filterId',filterId);
                store.getProxy().setExtraParam('ruleId',0);
                store.load(function(records, operation, success){
                    // user change the rule related filter , so we clear to layerid and filterid of the layer
                    //date, thus when save, the new filter will be
                    for (var i = 0, len = records.length; i < len; i++) {
                        records[i].set('filterId',0);
                        records[i].set('layerId',0);
                    }
                });
            }
            var result=rec.get("resultoperatorid");
            if(result==1){
                model.set("showLayerInput",true);
            }else{
                model.set("showLayerInput",false);
            }

        }else{
            if(filterId<=0){
                model.set("showLayerInput",false);
                store.removeAll(); //?
            }else if(filterId==3){
                model.set("showLayerInput",false);
                store.removeAll();
            }else if(filterId==4){
                model.set("showLayerInput",true);
                store.removeAll();
            }
            else{
                var result=rec.get('resultoperatorid');
                if(result==0){
                    model.set("showLayerInput",false);
                    store.removeAll();
                }else{
                    model.set("showLayerInput",true);
                    store.getProxy().setExtraParam('filterId',filterId);
                    store.getProxy().setExtraParam('ruleId',0);
                    store.load();
                }
            }
        }
    },

    saveFilter: function (newFilter, titleText, commentText) {
        // we overwrite this method in case we need to save the layer information
        //console.log("from group by field test of scope ", this);
        var me = this;
        //console.log('title Text:', titleText, 'comment text:', commentText);
        var model = me.getViewModel();
        //var jstr='{"colId":'+model.get('colId')+",";
        //jstr=jstr+'{"place":"'+model.get('place')+'",'
        //var jstr = '{"place":"' + model.get('place') + '",';
        var jstr = '{';
        jstr = jstr + me.getViewModel().toJSONString() + ',';
        jstr = jstr + '"newfilter":' + newFilter + ",";
        jstr = jstr + '"optitle":"' + titleText + '",';
        jstr = jstr + '"description":"' + commentText + '"}';
        console.log(jstr);
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
        var me = this,
            resp = Ext.JSON.decode(response.responseText, true),
            success = resp.hasError;//response.get("hasError");r
        //console.log(success);
        if (success == 'false') {
            var newId = resp.newFilterId,
                model=me.getViewModel();
            me.getView().filterId = newId;
            model.getStore('fieldFilter').reload(function(){
                model.set("filterId", newId);
            });
            //model.set("filterId", newId);
            
            //me.loadPredefinedFilter(newId);
            me.getView().taskWindow.reloadPredefinedFilter();
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

    parseRuleFilterRecord:function(rec){
        var me=this,
            model=me.getViewModel(),
            view=me.getView();
        //console.log("the rulefilters",rec);
        //view.taskWindow.setDistinct(record.get("isdistinct"));
        model.set("ruleId",rec.get("ruleId"));

        //console.log(model.get("ruleId"));
        //me.parseFilter(rec);
        var filterId=rec.get("filterId");
        model.set("originalFilterId",rec.get("filterId"));
        model.set("filterId",rec.get("filterId"));
        if(filterId>=0){
            model.getStore("fieldFilter").load(function(){
                try {
                    view.queryById("layerSelector").setValue(filterId);
                }catch(err){}
            });

        }
        me.parseFilter(rec);
    },

    setParamCount:function(newValue){

    }
});
