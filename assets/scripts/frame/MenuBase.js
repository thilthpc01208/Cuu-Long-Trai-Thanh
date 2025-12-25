const Logic = require("../game/logic/logic");

cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad() {
        this.gameSky = cc.find("Canvas/GameSky");
        this.logic = Logic.getInstance();

        this.menuLoad();
    },

    onEnable() {
        if (!this.gameSky || !this.logic) {
            this.gameSky = cc.find("Canvas/GameSky");
            this.logic = Logic.getInstance();
        }

        this.menuEnable();
        cc.Global.listenCenter.fire(cc.Global.eventConfig.AddUpdateEvent, this.updateFun);
    },

    onDisable() {
        this.menuDisable();
        cc.Global.listenCenter.fire(cc.Global.eventConfig.DelUpdateEvent, this.updateFun);
    },

    menuLoad() {

    },

    menuEnable() {

    },

    menuDisable() {
    },

    updateFun() {
        
    },
});
