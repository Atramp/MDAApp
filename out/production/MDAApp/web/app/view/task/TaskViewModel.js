Ext.define('mdaapp.view.task.TaskViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.task-taskview',

    requires: [
        'mdaapp.model.MdaJob',
        "mdaapp.model.JobRule",
        'mdaapp.model.RuleFilter'
    ],

    data: {
        name: 'mdaapp',
        jobId: -1,
        jobName: '',
        jobDescription: ''
    },


    constructor: function (arguments) {
        this.callParent(arguments);
    },

    stores: {
        jobStore: {
            itemId: 'loadJobStore',
            model: 'mdaapp.model.MdaJob',
            proxy: {
                type: 'ajax',
                url: 'getjobinfo'
            },
            autoLoad: false//,
            /*            listeners:{
             beforeload:'getJobInfoBeforeLoad',
             load:'getJobinfoLoad'
             }*/

        },

        ruleStore: {
            itemId: 'ruleStore',
            model: 'mdaapp.model.RuleFilter',
            proxy: {
                type: 'ajax',
                url: 'getrulelist'
            },
            autoLoad: false,
            listeners: {
                //beforeload:'getRuleInfoBeforeLoad',
                load: 'parseRecords'
            }
        }

    },


    toJSONString: function () {
        ////console.log(Ext.JSON.encode(view.getStore("whereStore").getData()));
        var view = this.getView();
        var jsonStr = '{ "jobid":' + this.data.jobId + ',';
        jsonStr = jsonStr + '"jobname":"' + this.data.jobName + '",'
        jsonStr = jsonStr + '"description":"' + this.data.jobDescription + '",'
        var container = view.queryById("resultContainer");
        jsonStr = jsonStr + '"result":{' + container.toJSONString() + '},';
        container = view.queryById("whereContainer");
        jsonStr = jsonStr + '"where":{' + container.toJSONString() + '},';
        container = view.queryById("groupbyContainer");
        jsonStr = jsonStr + '"groupby":{' + container.toJSONString() + '},';
        container = view.queryById("orderbyContainer");
        jsonStr = jsonStr + '"orderby":{' + container.toJSONString() + '}';
        jsonStr = jsonStr + "}";
        // we can add user refined SQL here
        return (jsonStr);
    },

    parseJSONString: function (jsonstr) {

    }


});
