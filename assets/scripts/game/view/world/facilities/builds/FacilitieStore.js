const buildConfig = require("../../../../../config/alone/BuildsConfig");

const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "store";
    },

    faciliteEnable() {
        this.setStoreTexture();
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
        if (dis >= 10) {this.canSelect = false;}
    },

    touchEnd(event) {
        if (!this.canSelect) { return; }

        let pageInfo = cc.Global.pageConfig.findPageInfo("storePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    updateStoreCallback() {
        this.setStoreTexture();
    },

    /**
     * 设置纹理所需信息
     */
    setStoreTexture() {
        /*
        let level = this.logic.store.getLevel();
        level = Math.floor(level / 3);
        let path = ""
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
        */
    }
});
