const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "route";
        this.setRouteTexture();
    },

    touchStart(event) {
        this.startPos = event.getLocation();
        this.canSelect = true;
    },

    touchMove(event) {
        let movePos = event.getLocation();
        let dis = (movePos.subSelf(this.startPos)).mag()
        if (dis >= 10) {
            this.canSelect = false;
        }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; }
    },

    updateRouteCallBack(level) {
        this.setRouteTexture();
    },

    /**
     * 设置纹理所需信息
     */
    setRouteTexture() {
        let level = Math.floor(this.logic.lord.getRoute() / 4);
        let path = "builds/route/Zhulu_" + level;
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
    }
});
