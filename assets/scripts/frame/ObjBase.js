module.exports = cc.Class({
    extends: cc.Component,
    properties: {

    },

    statics: {
        ObjNumber: 0
    },

    onLoad() {
        this.gameSky = cc.find("Canvas/GameSky");
        this.objLoad();
        this.GameOver = false;
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.GameOver, this.killSelf, this);
        this.objEnable();
    },

    onDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.GameOver, this);

        this.objDisable();
        this.saveObj();
    },

    objLoad() {

    },

    objEnable() {

    },

    objDisable() {

    },

    updateFun() {

    },

    saveObj() {
        if (this.GameOver) { return; }
        cc.Global.objCreator.saveObj(this.node, this.node.objInfo);
    },

    killSelf() {
        this.GameOver = true;
        this.node.removeFromParent();
    },
});
