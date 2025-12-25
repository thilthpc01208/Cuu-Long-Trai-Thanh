const Logic = require('../../../logic/logic');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.gameSky = cc.find("Canvas/GameSky");
        this.logic = Logic.getInstance();
        this.buildName = "";

        this.faciliteLoad();
    },

    onEnable() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.RegisterImportantNode, { name: this.buildName, node: this });

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

        if (!this.gameSky || !this.logic) {
            this.gameSky = cc.find("Canvas/GameSky");
            this.logic = Logic.getInstance();
        }

        this.faciliteEnable();
    },

    onDisable() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.RegisterImportantNode, { name: this.buildName, node: null });

        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

        this.faciliteDisable();
    },

    faciliteLoad() {

    },

    faciliteEnable() {

    },

    faciliteDisable() {

    },

    touchStart(event) {

    },

    touchMove(event) {

    },

    touchEnd(event) {

    },

    touchCancel(event) {

    },
});
