cc.Class({
    extends: cc.Component,

    properties: {

    },

    start() {
        let  manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
    }
});
