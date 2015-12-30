Ext.define('mdaapp.view.field.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.field-container',

    onCancel:function(){
        this.getView().taskWindow.close();
    },

    deleteField: function (field) {
        //console.log("begin to delete field", field);
        var map, component;
        map = this.getViewModel().get("fieldMap");
        component = this.getView().queryById('drawer');
        map.removeAtKey(field.getId());
        var conn = field.getRelationConnector();
        if (conn) {
            //console.log('the related connector', conn);
            this.deleteConnection(conn);
            var surface = component.getSurface();
            surface.renderFrame();        //field.destroy();
        }
        this.deleteOrder(field.getOrderNumber());
    },

    deleteConnection: function (connector) {
        if (connector == null) {
            return;
        }
        var relationMap, component;
        relationMap = this.getViewModel().get("fieldRelationMap");
        component = this.getView().queryById('drawer');
        //console.log("delete this connector", connector);
        //var where = this.getView().queryById('drawer'),
        var surface = component.getSurface();
        var sprites = connector.getSprites();
        for (var i = 0; i < sprites.length; i++) {
            //console.log("remove sprite ", sprites[i])
            surface.remove(sprites[i], true);
        }
        var childConn = connector.getRelationConnector();
        //var map=this.getViewModel().get("fieldRelationMap");
        relationMap.removeAtKey(connector.getId());
        connector.destroy();
        this.deleteConnection(childConn);
    },

    deleteClick: function () {
        //console.log("delete field relation function");
        var map, relationMap, component, surface;
        map = this.getViewModel().get("fieldMap");
        relationMap = this.getViewModel().get("fieldRelationMap");
        component = this.getView().queryById('drawer');
        surface = component.getSurface();
        //var map=this.getViewModel().get("fieldRelationMap");
        for (var i = 0; i < relationMap.length; i++) {
            var connector = relationMap.getAt(i);
            if (connector == null || (!connector.isSelected())) {
                continue;
            }
            ////console.log("delete this connector",connector);
            this.deleteConnection(connector);
        }
        surface.renderFrame();
    },

    makeNotConnection: function () {
        var map, relationMap, component;
        map = this.getViewModel().get("fieldMap");
        relationMap = this.getViewModel().get("fieldRelationMap");
        component = this.getView().queryById('drawer');
        //var map=this.getViewModel().get("fieldMap");
        var fieldList = new Array();
        for (var i = 0, len = map.length; i < len; i++) {
            var view = map.getAt(i);
            ////console.log("view selected",view.getViewModel().get("id"),view.getViewModel().get("colname"), view.getViewModel().get("selected"));
            if (!view.isSelected()) {
                continue;
            }
            if (!this.testConnectionConditionCallBack(view)) {
                return;
            }
            /*            if (view.getRelationConnector() != null) {
             Ext.Msg.alert('错误', '此字段已经在其他条件中使用，不能多次创建条件组合');
             return;
             }*/
            view.setSelected(false);
            fieldList[fieldList.length] = view;
        }
        //for any exists connection ,we can not add a Not before it
        if (fieldList.length >= 1) {
            //var where = this.getView().queryById('drawer'),
            var surface = component.getSurface();
            for (var idx = 0; idx < fieldList.length; idx++) {
                var connector = Ext.create("mdaapp.view.connector.Connector");
                connector.addChild(fieldList[idx]);
                fieldList[idx].setRelationConnector(connector);
                connector.setRelationShip("NOT");
                //connector.setParentBox(component.getBox(false, false));
                connector.setParentWnd(component);
                connector.formatConnector();
                var sprites = connector.getSprites();
                ////console.log(sprites);
                for (var i = 0; i < sprites.length; i++) {
                    surface.add(sprites[i])
                }
                relationMap.add(connector.getId(), connector);
            }
            surface.renderFrame();
            // add this connector to the map for keep
            ////console.log(connector.getId());
        }
    },

    testFieldConditionCallBack: function (field) {
        return (true);
    },

    testConnectionConditionCallBack: function (conn) {
        if (conn.getRelationConnector() != null) {
            Ext.Msg.alert('错误', '此关联关系已经在其他条件中使用，不能多次创建条件组合');
            return (false);
        }
        return (true);
    },

    makeConnection: function (relation) {
        var map, relationMap, component;
        map = this.getViewModel().get("fieldMap");
        relationMap = this.getViewModel().get("fieldRelationMap");
        component = this.getView().queryById('drawer');
        //var map=this.getViewModel().get("fieldMap");
        var fieldList = new Array(), index = 0;
        for (var i = 0, len = map.length; i < len; i++) {
            var field = map.getAt(i);
            ////console.log("view selected",view.getViewModel().get("id"),view.getViewModel().get("colname"), view.getViewModel().get("selected"));
            if (!field.isSelected()) {
                continue;
            }
            if (!this.testFieldConditionCallBack(field)) {
                field.setSelected(false);
                continue;
            }
            var conn = field.getRelationConnector();
            if (conn != null) {
                conn.setSelected(true);
                field.setSelected(false);
            } else {
                field.setSelected(false);
                fieldList[fieldList.length] = field;
            }
        }
        //map=this.getViewModel().get("fieldRelationMap");
        for (var i = 0, len = relationMap.length; i < len; i++) {
            var oConn = relationMap.getAt(i);
            ////console.log("view selected",view.getViewModel().get("id"),view.getViewModel().get("colname"), view.getViewModel().get("selected"));
            if (!oConn.isSelected()) {
                continue;
            }
            if (!this.testConnectionConditionCallBack(oConn)) {
                oConn.setSelected(false);
                return;
            }
            oConn.setSelected(false);
            fieldList[fieldList.length] = oConn;
        }
        if (fieldList.length > 1) {
            var connector = Ext.create("mdaapp.view.connector.Connector");
            for (var i = 0, len = fieldList.length; i < len; i++) {
                connector.addChild(fieldList[i]);
                fieldList[i].setRelationConnector(connector);
            }
            connector.setRelationShip(relation);
            //var where = this.getView().queryById('drawer');
            //connector.setParentBox(component.getBox(false, false));
            connector.setParentWnd(component);
            connector.formatConnector();
            var sprites = connector.getSprites();
            ////console.log(sprites);
            for (var i = 0; i < sprites.length; i++) {
                component.getSurface().add(sprites[i])
            }
            ;
            component.getSurface().renderFrame();
            // add this connector to the map for keep
            ////console.log(connector.getId());
            relationMap.add(connector.getId(), connector);
        }
    },


    onClear: function (obj, e, eOpts) {
        //console.log("clear all field");
        var map = this.getViewModel().get("fieldMap");
        while (map.getCount() > 0) {
            var field = map.getAt(0);
            field.close();
        }
        //e.stopEvent();
        this.getViewModel().set("maxOrder", 0);
        //console.log("total ", this.getViewModel().get("fieldMap").getCount(), " element left and total ", this.getViewModel().get("fieldRelationMap").getCount(), " connector left");
    },


    redrawConnector: function (field) {
        var connector = field.getRelationConnector();
        //var location = field.place;
        var component, surface;
        component = this.getView().queryById('drawer');

        surface = component.getSurface();
        if (connector != null) {
            //var where = this.getView().queryById('drawer'),
            //var surface=component.getSurface();
            var conn = connector;
            while (conn != null) {
                var sprites = conn.getSprites();
                for (var i = 0, len = sprites.length; i < len; i++) {
                    ////console.log("sprite:" ,sprites[i]);
                    surface.remove(sprites[i]);
                }
                conn = conn.getRelationConnector();
            }
            connector.reformatConnector();
            conn = connector;
            while (conn != null) {
                surface.add(conn.getSprites());
                conn = conn.getRelationConnector();
            }
            surface.renderFrame();
        }
    },

    currentConnector: null,

    connectorChoice: function (event) {
        var where = this.getView().queryById('drawer'),
            surface = where.getSurface();
        var hitResult = surface.hitTestEvent(event);

        if (this.currentConnector) {
            if (this.currentConnector.isSelected()) {

            } else {
                this.currentConnector.restoreDefault()
            }
            this.currentConnector = null;
            surface.renderFrame();
        }

        if (hitResult && hitResult.sprite) {
            var sprite = hitResult.sprite;
            var connector = sprite.getConnector();
            this.currentConnector = connector;
            connector.setActive();
            surface.renderFrame();
        }
        //

    },


    connectorSelected: function (event) {
        var where = this.getView().queryById('drawer'),
            surface = where.getSurface();
        var hitResult = surface.hitTestEvent(event);

        if (hitResult && hitResult.sprite) {
            var sprite = hitResult.sprite;
            var connector = sprite.getConnector();
            //console.log("select ", connector);
            if (connector.isSelected()) {
                connector.setSelected(false);
            } else {
                connector.setSelected(true);
            }
            surface.renderFrame();
        }
    },

    onOrderChange: function (oldValue, newValue) {
        var model = this.getViewModel(),
            map = model.get("fieldMap"),
            maxOrder = model.get("maxOrder");

        //console.log("max order new and old ", maxOrder, newValue, oldValue);
        if (newValue > maxOrder) {
            newValue = maxOrder;
        }
        //console.log("max order new and old ", maxOrder, newValue, oldValue);
        if (oldValue > newValue) {
            for (var i = 0, len = map.getCount(); i < len; i++) {
                var field = map.getAt(i);
                var origOrder = field.getOrderNumber();
                if (origOrder < newValue || origOrder > oldValue) {
                    continue;
                } else if (origOrder == oldValue) {
                    field.setOrderNumber(newValue, true);
                } else {
                    field.setOrderNumber(field.getOrderNumber() + 1, true);
                }
            }
        } else if (oldValue <= newValue) {
            for (var i = 0, len = map.getCount(); i < len; i++) {
                var field = map.getAt(i);
                var origOrder = field.getOrderNumber();
                if (origOrder < oldValue || origOrder > newValue) {
                    continue;
                } else if (origOrder == oldValue) {
                    //console.log("set here max, new ,and old ", maxOrder, newValue, oldValue);
                    field.setOrderNumber(newValue, true);
                } else {
                    field.setOrderNumber(field.getOrderNumber() - 1, true);
                }
            }
        }

    },

    deleteOrder: function (order) {
        var model = this.getViewModel(),
            map = model.get("fieldMap"),
            maxOrder = model.get("maxOrder");
        model.set("maxOrder", maxOrder - 1);
        for (var i = 0, len = map.getCount(); i < len; i++) {
            var field = map.getAt(i);
            var origOrder = field.getOrderNumber();
            if (origOrder < order) {
                continue;
            } else if (origOrder > order) {
                field.setOrderNumber(origOrder - 1, true);
            } else {
                //field.setOrderNumber(field.getOrderNumber() + 1, true);
            }
        }
    },
    //addField
    addField: function (field) {
        var maxorder = this.getViewModel().get("maxOrder") + 1;
        this.getViewModel().set("maxOrder", maxorder);
        field.setOrderNumber(maxorder, true);
        this.getView().getDrawComponent().add(field);
        this.getViewModel().get("fieldMap").add(field.getId(), field);
    },

    onSave: function () {
        this.getView().taskWindow.onSave();
    },
    onSaveAs: function () {
        this.getView().taskWindow.onSaveAs();
    },


    clearAllIds: function () {
        var me = this,
            model = me.getViewModel();
        var temp = model.get("fieldMap");
        for (var i = 0, len = temp.getCount(); i < len; i++) {
            var field = temp.getAt(i);
            field.setRuleId(-1);
        }
        temp = model.get("fieldRelationMap");
        for (var i = 0, len = temp.getCount(); i < len; i++) {
            var connector = temp.getAt(i);
            connector.setRuleId(-1);
        }
    },

    getComponentByRuleId: function (ruleId) {
        //fieldMap: null,
        //fieldRelationMap: null,
        var me = this,
            model = me.getViewModel(),
            view = me.getView(),
            fieldMap = model.get("fieldMap"),
            relationMap = model.get("fieldRelationMap");
        for (var i = 0, len = fieldMap.getCount(); i < len; i++) {
            var field = fieldMap.getAt(i);
            ////console.log(field.getRuleId());
            if (field.getRuleId() == ruleId) {
                return (field);
            }
        }
        for (var i = 0, len = relationMap.getCount(); i < len; i++) {
            var connector = relationMap.getAt(i);
            if (connector.getRuleId() == ruleId) {
                return (connector);
            }
        }
        return (null);
    },

    addConnector: function (connector) {
        this.getViewModel().get("fieldRelationMap").add(connector.getId(), connector);
    },

    reformatAllConnectors: function () {
        //console.log("container.reformat");
        var me = this,
            model = this.getViewModel(),
            view = this.getView(),
            surface = view.queryById("drawer").getSurface(),
            relationMap = model.get("fieldRelationMap");
        if (relationMap === undefined || relationMap == null || relationMap.getCount() == 0) {
            return;
        }
        // first loop, mapping all rule id to component id, and add the child to connector
        for (var i = 0, len = relationMap.getCount(); i < len; i++) {
            var connector = relationMap.getAt(i),
                childList = connector.childList,
                child = childList.split(',');
            for (var j = 0, l = child.length; j < l; j++) {
                var field = me.getComponentByRuleId(child[j]);
                connector.addChild(field);
                //console.log("the field is",field);
                field.setRelationConnector(connector);
            }
        }
        //second loop. reformat all connectors
        for (var i = 0, len = relationMap.getCount(); i < len; i++) {
            var connector = relationMap.getAt(i);
            connector.reformatConnector();
            var sprites = connector.getSprites();
            ////console.log(sprites);
            for (var j = 0; j < sprites.length; j++) {
                surface.add(sprites[j])
                //console.log("the sprite is ",sprites[j]);
            }
        }
        surface.renderFrame();
        //console.log("container.reformat end");
    }
});
