Ext.define('mdaapp.view.task.SQLPreviewerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.task-sqlpreviewer',
    requires:[
        'mdaapp.model.MdaJob'
    ],
    data: {
        name: 'mdaapp'
    },
    stores:{
        SQLStore:{
            proxy:{
                type:'ajax',
                url:'SQLOperator/Preview'
            },
            model:"mdaapp.model.MdaJob",
            autoLoad:false,
            listeners:{
                load:'onLoad'
            }
        }

    }

});
