/**
 * Created by YS186019 on 2015/11/1.
 */
Ext.define("mdaapp.store.OperationStore", {
    extend: 'Ext.data.ArrayStore',

    requires: [
        'mdaapp.model.CommonOperation'
    ],
    alias: 'store.opStore',

    autoDestroy: true,

    place: "",
    includeNoOperation: true,
    candidateList: "",

    model: 'mdaapp.model.CommonOperation',
    data: [],


 /*   addCachedData: function (includeNoOperation, place, candidateList) {
        var me = this,
            cache = mdaapp.Current.getCommonOperationCacheStore();
        if (includeNoOperation == null) {
            includeNoOperation = this.includeNoOperation;
        }
        if (place == null || place == "") {
            place = this.place;
        }
        if (candidateList == null || candidateList == "") {
            candidateList = this.candidateList;
        }
        me.removeAll(true);
        cache.each(function (record) {
            ////console.log("the record is ",record);
            var opid = record.get("operationid");
            ////console.log("the operationid is ",opid);

            if (opid == 0 && includeNoOperation) {
                if (opid == 0) {
                    ////console.log("accept");
                    me.add(record)
                    return;
                }
            }
            if (candidateList && candidateList != "") {
                var strs = candidateList.split(','),
                    len = strs.length;
                for (var i = 0; i < len; i++) {
                    if (strs[i] == opid) {
                        ////console.log("accept");
                        me.add(record);
                        return;
                    }
                }
            }
            if (!(place === undefined || place == null || place == 'any' || place == "")) {
                if (record.get('operationplace') == place) {
                    ////console.log("accept");
                    me.add(record);
                    return;
                }
            }
            ////console.log("reject");
            return;
        });

    },*/

    addDataByCandidateList: function (includeNoOperation, candidateList,removeAll) {
        var me = this,
            cache = mdaapp.Current.getCommonOperationCacheStore();
        if (includeNoOperation == null) {
            includeNoOperation = this.includeNoOperation;
        }

        if(removeAll===undefined || removeAll==null || removeAll){
            me.removeAll(false);
        }

        var strs=null,
            len=0;
        if (candidateList && candidateList != "") {
            strs = candidateList.split(','),
            len = strs.length;
        }
        cache.each(function (record) {
            ////console.log("the record is ",record);
            var opid = record.get("operationid");
            ////console.log("the operationid is ",opid);
            if (opid == 0 && includeNoOperation) {
                if (opid == 0) {
                    ////console.log("accept");
                    me.add(record);
                    return;
                }
            }
            for (var i = 0; i < len; i++) {
                if (strs[i] == opid) {
                    me.add(record);
                    return;
                }
            }
        });

    },


    addDataByType: function (includeNoOperation, place, dbtype, virtualType,removeAll) {
        var me = this,
            cache = mdaapp.Current.getCommonOperationCacheStore();
        ////console.log(cache);
        if (includeNoOperation == null) {
            includeNoOperation = this.includeNoOperation;
        }
        if (place == null || place == "") {
            place = this.place;
        }
        if(removeAll===undefined || removeAll==null || removeAll){
            me.removeAll(false);
        }
        cache.each(function (record) {
            ////console.log("the record is ",record);
            var opid = record.get("operationid"),
                recPlace = record.get("operationplace"),
                recPlace = record.get("operationplace"),
                recDBType = record.get("dbtype"),
                recVirtualType = record.get("virtualtype")
            ////console.log("the operationid is ",opid);

            if (opid == 0 && includeNoOperation) {
                if (opid == 0) {
                    ////console.log("accept");
                    me.add(record)
                    return;
                }
            }
            if (recPlace == place && recDBType == dbtype && recVirtualType == virtualType) {
                me.add(record);
            }
        });
    },

    addDataByPlace: function (includeNoOperation, place, removeAll) {
        var me = this,
            cache = mdaapp.Current.getCommonOperationCacheStore();
        ////console.log(cache);
        if (includeNoOperation == null) {
            includeNoOperation = this.includeNoOperation;
        }
        if (place == null || place == "") {
            place = this.place;
        }
        if(removeAll===undefined || removeAll==null || removeAll){
            me.removeAll(false);
        }

        cache.each(function (record) {
            ////console.log("the record is ",record);
            var opid = record.get("operationid"),
                recPlace = record.get("operationplace"),
                recPlace = record.get("operationplace"),
                recDBType = record.get("dbtype"),
                recVirtualType = record.get("virtualtype")
            ////console.log("the operationid is ",opid);

            if (opid == 0 && includeNoOperation) {
                if (opid == 0) {
                    ////console.log("accept");
                    me.add(record)
                    return;
                }
            }
            if (recPlace == place) {
                me.add(record);
            }
        });
    },

    setPlace:function(place){
        this.place=place;
    }


});