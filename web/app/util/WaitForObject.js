/**
 * Created by YS186019 on 2015/11/6.
 */
Ext.define("mdaapp.util.WaitForObjects", {
    extend: "Ext.Base",

    objects: null,
    stopFlag: false,
    timeout:false,
    startTime:null,

    constructor: function () {
        this.id = Ext.id(this, "mdaapp-waiter-");
        ////console.log("connector id is ",this.getId());
        this.callParent();
        Ext.ComponentManager.register(this);
        return (this);
    },

    setWaitObject: function (objs) {
        this.objects = objs;
    },

    getWaitObjects: function () {
        return (this.objects);
    },

    wait: function (callBackFN, callBackScope){
        this.startTime=Ext.Date.now();
        this.continueWait(callBackFN, callBackScope);
    },

    continueWait: function (callBackFN, callBackScope) {
        var me=this,
            len = me.objects.length,
            flag = false;
        if (!me.stopFlag) {
            me.waitEnd(callBackFN, callBackScope);
            me.stopFlag=false;
            return;
        }
        //calculate timeout time here
        if((Ext.Date.now()-me.startTime)>timeout) {
            me.timeout=true;
            me.waitEnd(callBackFN, callBackScope);
            return;
        }
        for (var i = 0; i < len; i++ ) {
            try {
                flag = me.objects[i].isLoading();
            } catch (ignore) {

            }
            if (flag) {
                setTimeout(function () {
                    me.continueWait(callBackFN, callBackScope);
                }, 100);
                return;
            }
        }
        if (!flag ) {
            me.waitEnd(callBackFN, callBackScope);
        }
   },

    stopWaiting:function(){
        this.stopFlag=true;
    },

    waitEnd:function(callBackFN, callBackScope){
        var me=this;
        var newFunc = Ext.bind(callBackFN, callBackScope);
        newFunc(me.stopFlag,me.timeout);
    },

    setTimeout:function(timeOutMillis){
        this.timeout=timeOutMillis;
    }
});