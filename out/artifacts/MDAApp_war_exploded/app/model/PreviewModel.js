/**
 * Created by YS186019 on 2015/11/2.
 */
Ext.define('mdaapp.model.PreviewModel', {
    extend: 'Ext.data.Model',
    
    fields:[
        'columnCount','totalResult',
        'title1','title2','title3','title4','title5','title6','title7','title8','title9','title10',
        'title11','title12','title13','title14','title15','title16','title17','title18','title19','title20',
        'title21','title22','title23','title24','title25','title26','title27','title28','title29','title30',
        'title31','title32','title33','title34','title35','title36','title37','title38','title39','title40',
        'title41','title42','title43','title44','title45','title46','title47','title48','title49','title50',
        'columnData'
    ]
    //hasMany:{model:'mdaapp.model.PreviewColumns',name:'columnData'}

});


/*
Ext.define("mdaapp.model.PreviewColumns",{
    extend: 'Ext.data.Model',
    fields: [
        'col1','col2','col3','col4','col5','col6','col7','col8','col9','col10',
        'col11','col12','col13','col14','col15','col16','col17','col18','col19','col20',
        'col21','col22','col23','col24','col25','col26','col27','col28','col29','col30',
        'col31','col32','col33','col34','col35','col36','col37','col38','col39','col40',
        'col41','col42','col43','col44','col45','col46','col47','col48','col49','col50'
    ],
    belongsTo: 'mdaapp.model.ResultPreviewModel'

});
*/
