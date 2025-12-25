const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "ground";
        this.setGroundTexture();
    },

    faciliteEnable() {

    },

    faciliteDisable() {

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

    updateGroundCallBack(level) {
        this.setGroundTexture();
    },

    /**
     * 设置纹理所需信息
     */
    setGroundTexture() {
        let level = this.logic.lord.getGroundLevel();
        let path = "builds/ground/DIMian_" + level;
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
    }
});
