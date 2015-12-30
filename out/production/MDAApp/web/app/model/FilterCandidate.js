Ext.define('mdaapp.model.FilterCandidate', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'candidateid', type: 'int'},
        {name: 'filterId', type: 'int'},
        {name: 'paramid', type: 'int'},
        {name: 'place', type: 'string'},
        {name: 'candidatetitle', type: 'string'},
        {name: 'candidatevalue', type: 'string'}
    ],


    toJson:function(){
        var me=this;
        var jstr='{',
            recFields=me.getFields();
        for(var i= 0,len=recFields.length;i<len;i++){
            var name=recFields[i].getName(),
                type=recFields[i].getType(),
                value=me.get(name);
            ////console.log("name:",name," type: ",type," value: ",value);
            if(name=='param1value' || name=='param2value'){
                continue; // these tow value will be setup later
            }
            if(type=='bool') {
                if(value===undefined || value==null){
                    jstr = jstr + '"' + name + '":false,';
                }else if ( value) {
                    jstr = jstr + '"' + name + '":true,';
                } else {
                    jstr = jstr + '"' + name + '":false,';
                }
            }else if(type=='int'){
                if(value!=null) {
                    jstr = jstr + '"' + name + '":' + value + ',';
                }else{
                    jstr = jstr + '"' + name + '":-1,';
                }
            }else{
                if(value!=null){
                    jstr = jstr + '"' + name + '":"' +value+ '",';
                }else{
                    jstr = jstr + '"' + name + '":"",';
                }
            }
        }
        if(me.dropped){
            jstr= jstr + '"action":"delete"';
        }else if(me.dirty){
            jstr= jstr + '"action":"edit"';
        }else if(me.phantom){
            jstr= jstr + '"action":"new"';
        }else {
            jstr= jstr + '"action":"unknow"';
        }
        jstr=jstr + '}';
        //jstr=jstr.substr(0,jstr.length-1) + '}';
        return(jstr);

    }
});
