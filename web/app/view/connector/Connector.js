
Ext.define("mdaapp.view.connector.Connector", {
    extend: "Ext.Base",

    children: null,
    childrenRelation: null,
    sprites: null,
    color: null,
    //parentBox: null,
    parentWnd:null,
    virtualBox:null,
    selected:false,
    id:null,
    ruleId:-1,
    defaultLineWidth:2,
    selectedLineWidth:5,
    activeColor:'red',
    realtionConnector:null, // this properties is indicate that this connector has already include in other connector
    defaultBorderColor:null,
    defaultBorderWidth:1,
    childList:"",

    constructor: function () {

        //this.model=Ext.create("Ext.util.MixedCollection");
        this.children = new Array();
        this.sprites = new Array();
        ////console.log("constructor end");
        ////console.log("connector id is ",this.getId());
        this.id=Ext.id(this,"mdaapp-connector-");
        ////console.log("connector id is ",this.getId());
        this.callParent();
        Ext.ComponentManager.register(this);
        return (this);
    },

    getId:function(){
        return(this.id);
    },

    addChild: function (child) {
        this.children[this.children.length] = child;
        if(!child.isConnector()){
            this.defaultBorderColor=child.getEl().getStyle("borderColor");
            this.defaultBorderWidth=child.getEl().getBorderWidth('l');
            //console.log("default color and width",this.defaultBorderColor,this.defaultBorderWidth);
        }
    },

    setRelationShip: function (relation) {
        this.childrenRelation = relation;
        if (this.childrenRelation == "AND") {
            this.color = 'yellow';
        } else if (this.childrenRelation == "OR") {
            this.color = 'green';
        } else if (this.childrenRelation = 'NOT') {
            this.color = 'blue';
        }
    },

    setParentBox: function (obj) {
        this.parentBox = obj;
    },

    setParentWnd:function(obj){
        this.parentWnd=obj;
    },

    reformatConnector:function(){
       var sprite;
        while(!((sprite=this.sprites.pop())===undefined)) {
            sprite.destroy();
        }
        this.formatConnector();
        if(this.realtionConnector){
            this.realtionConnector.reformatConnector();
        }
    },



    formatConnector: function () {
        this.parentBox=this.parentWnd.getBox(false,false);
        ////console.log("children: ",this.children.length);
/*
        for (var i = 0, len = this.children.length ; i < len; i++) {
            //console.log(this.children[i]);
        }
*/
        if(this.childrenRelation=="NOT"){ // 'not' relation
            var field=this.children[0];
            this.sprites[this.sprites.length]=this.makeSurround(field);
            this.sprites[this.sprites.length]=this.makeSurroundText(field);
        }else {

            for (var i = 0, len = this.children.length - 1; i < len; i++) {
                var field = this.children[i];
                var field1 = this.children[i + 1];
                var box = field.getBox(true, false);
                if(box==null && field.isConnector()){
                    field.formatConnector();
                    box=field.getBox(true, false);
                }
                var box1 = field1.getBox(true, false);
                if(box1==null && field1.isConnector()){
                    //console.log(11111111111111111);
                    field1.formatConnector();
                    box1=field1.getBox(true, false);
                }
                //console.log("box",box,"box1",box1," parent box",this.parentBox);
                //this.parentBox=this.parentWnd.getBox(false,false);
                box.top = box.top - this.parentBox.top;
                box.left = box.left - this.parentBox.left;
                box1.top = box1.top - this.parentBox.top;
                box1.left = box1.left - this.parentBox.left;
                this.sprites[this.sprites.length] = this.makePath(box, box1);
                this.sprites[this.sprites.length] = this.makePathText(box, box1);

            }
        }
    },


    makePath: function (box,box1) {
        var startX=box.left + box.width/ 2,
            startY=box.top+box.height;
        var endX=box1.left+box1.width/ 2,
            endY=box1.top+box1.height;
        var midY=Math.max(startY,endY)+30;
        var linePath='M'+startX+' '+startY+' V'+midY+' H'+endX+' V'+endY;
        var tempConnector=this;
        var sprite=Ext.create("Ext.draw.sprite.Path",{
            type:'path',
            strokeStyle:this.color,
            lineWidht:this.defaultLineWidth,
            path:linePath,
            connector:null,
            X:startX,
            Y:startY,
            width:endX-startX,
            height:midY-startY,
            setConnector:function(obj){this.connector=obj;},
            getConnector:function(){return(this.connector);},
            isText:function(){return(false);}
        });
        sprite.setConnector(this);
        return(sprite);
    },

    makePathText: function (box,box1) {
        var startX=box.left + box.width/ 2,
            startY=box.top+box.height;
        var endX=box1.left+box1.width/ 2,
            endY=box1.top+box1.height;
        var midX=(startX+endX)/ 2-20,
            midY=Math.max(startY,endY)+28;
        var tempConnector=this;
        var sprite=Ext.create("Ext.draw.sprite.Text",{
            type: 'text',
            x: midX,
            y: midY,
            text: this.childrenRelation,
            fontSize: 16,
            //strokeStyle:this.color,
            fillStyle: this.color,
            connector:tempConnector,
            setConnector:function(obj){this.connector=obj;},
            getConnector:function(){return(this.connector);},
            isText:function(){return(true);}
        });
        sprite.setConnector(this);
        return(sprite);
    },



    getSprites: function () {
        return (this.sprites);
    },

    makeSurround: function (field) {
        //this.parentBox=this.parentWnd.getBox(false,false);
        var box=field.getBox();
        box.top=box.top-this.parentBox.top;
        box.left=box.left-this.parentBox.left;
        //console.log(box);
        var linePath='M'+(box.left-2)+' '+(box.top-2)+' V'+(box.top+box.height)+' H'+(box.left+box.width)+' V'+(box.top-2) +' Z';
        var sprite=Ext.create("Ext.draw.sprite.Path",{
            type:'path',
            strokeStyle:this.color,
            lineWidht:this.defaultLineWidth,
            path:linePath,
            connector:null,
            X:box.left-2,
            Y:box.top-2,
            width:box.width,
            height:box.height,
            setConnector:function(obj){this.connector=obj;},
            getConnector:function(){return(this.connector);},
            isText:function(){return(false);}
        });
        sprite.setConnector(this);
        field.setSurroundSprite(sprite);
        return(sprite);
    },

    makeSurroundText: function (field) {
        //this.parentBox=this.parentWnd.getBox(false,false);
        var box=field.getBox(),
            ty=box.top-this.parentBox.top-10,
            tx=box.left-this.parentBox.left+22;
        //console.log(box);
        var sprite=Ext.create("Ext.draw.sprite.Text",{
            type: 'text',
            x: tx,
            y: ty,
            text: this.childrenRelation,
            fontSize: 16,
            //strokeStyle:this.color,
            fillStyle: this.color,
            connector:null,
            setConnector:function(obj){this.connector=obj;},
            getConnector:function(){return(this.connector);},
            isText:function(){return(true);}
        });
        sprite.setConnector(this);
        return(sprite);
    },



    isConnector:function(){
        return(true);
    },

    getBox:function(){
        var sprite=this.sprites[0];
        if(sprite==null) return(null);
        var box=new Object();
        //this.parentBox=this.parentWnd.getBox(false,false);
        box.left=this.parentBox.left+sprite.X;
        box.top=this.parentBox.top+sprite.Y;
        box.width=sprite.width;
        box.height=sprite.height;
        return(box);
    },

    setActive:function(){
        ////console.log("connector set active");
        if(!this.selected){
            for(var i= 0,len=this.sprites.length;i<len;i++){
                var sprite=this.sprites[i];
                if(sprite.isText()){
                    sprite.setAttributes({
                        //strokeStyle: 'red',
                        fill:'red'
                    });
                }else{
                    sprite.setAttributes({
                        strokeStyle: 'red',
                        lineWidth:this.defaultLineWidth
                    });
                }
            }
        }
    },

    isSelected:function(){
        return(this.selected);
    },

    setSelected:function(flag){
        this.selected=flag;
        ////console.log("connector set select ",flag);
        if(!flag){
            ////console.log("restore default ");
            this.restoreDefault();
        }else{
            //console.log("set color and width ");
            for(var i= 0,len=this.sprites.length;i<len;i++){
                var sprite=this.sprites[i];
                if(sprite.isText()){
                    sprite.setAttributes({
                        //strokeStyle: 'red',
                        fill:'red'
                    });
                }else{
                    //console.log("does line width work?");
                    sprite.setAttributes({
                        strokeStyle: 'red',
                        lineWidth:this.selectedLineWidth
                    });
                }
            }
        }
    },

    restoreDefault:function(){
        //console.log("restore default");
        for(var i= 0,len=this.sprites.length;i<len;i++){
            var sprite=this.sprites[i];
            if(sprite==null){
                continue;
            }
            if(sprite.isText()){
                sprite.setAttributes({
                    fill: this.color,
                    strokeStyle:'none'
                });
            }else{
                sprite.setAttributes({
                    strokeStyle: this.color,
                    lineWidth:this.defaultLineWidth
                });
            }
        }
    },

    setRelationConnector:function(obj){
        if(this.relationConnector){
            return(false);
        }else{
            this.realtionConnector=obj;
            return(true);
        }
    },

    getRelationConnector:function(){
        return(this.realtionConnector);
    },

    destroy:function(){
        var sprite,child;
/*        for (var i = 0, len = this.children.length ; i < len; i++) {
            this.children[i].setRelationConnector(null);
        }*/
        while(!((child=this.children.pop())===undefined)){
            child.setRelationConnector(null);
/*            if(!child.isConnector()){
                this.removeSurround(child);
            }*/
        }

        while(!((sprite=this.sprites.pop())===undefined)) {
            sprite.destroy();
        }
        this.callParent();
    },

    toJSONString:function(){
        var jstr='"id":"'+this.getId()+'",';
        jstr=jstr+'"ruleId":'+this.ruleId+',';
        var tstr='"';
        for(var i= 0,len=this.children.length;i<len;i++){
            tstr=tstr+this.children[i].getId();
            if(i==len-1){
                tstr=tstr+'"';
            }else{
                tstr=tstr+',';
            }
        };
        jstr=jstr+'"children":'+tstr;
        jstr=jstr+',"relation":"'+this.childrenRelation+'"';
        return(jstr);
    },

    setRuleId: function (id) {
        this.ruleId = id;
    },

    getRuleId:function(){
        return(this.ruleId);
    }

});
