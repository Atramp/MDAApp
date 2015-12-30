Ext.define('mdaapp.view.overview.OverViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.overview-overview',

    requires:[
        "mdaapp.model.MdaJob"
    ],
    data: {
        name: 'mdaapp'
    },
    stores:{
        jobListStore: {
            model:"mdaapp.model.MdaJob",
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'listjobs'
            }
        }
    }

});
