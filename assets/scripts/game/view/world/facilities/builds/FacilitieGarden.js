const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "garden";
        this.setGardenTexture();
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

    updateGardenCallBack(level) {
        this.setGardenTexture();
    },

    /**
     * 设置纹理所需信息
     */
    setGardenTexture() {
        let level = this.logic.lord.getGardenLevel();
        let path = "builds/garden/ui_Huatan_" + level;
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
    }
});
