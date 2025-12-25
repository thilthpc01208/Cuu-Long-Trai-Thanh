const Logic = require("../../logic/logic");

cc.Class({
    extends: cc.Component,

    onLoad() {
        this.logic = Logic.getInstance();
        this.buildMap = {};
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.RegisterImportantNode, this.registerImportantNode, this);
        this.logic.sceneRoot = this;
        this.logic.setGameState(true);
    },

    onDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.RegisterImportantNode, this);
        this.logic.sceneRoot = null;
        this.logic.setGameState(false);
    },

    registerImportantNode(data) {
        this.buildMap[data.name] = data.node;
        this[data.name] = data.node;
    }
});
