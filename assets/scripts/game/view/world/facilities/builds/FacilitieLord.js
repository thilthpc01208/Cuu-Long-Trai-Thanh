const buildConfig = require("../../../../../config/alone/BuildsConfig");
const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "lord";
    },

    faciliteEnable() {
        this.setLordTexture();
    },

    touchStart(event) {
        this.startPos = event.getLocation();
        this.canSelect = true;
    },

    touchMove(event) {
        let movePos = event.getLocation();
        let dis = (movePos.subSelf(this.startPos)).mag()
        if (dis >= 10) { this.canSelect = false; }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; }

        let level = this.logic.lord.getLevel();
        if (level >= (buildConfig.lord.length - 1)) {return;}

        let pageInfo = cc.Global.pageConfig.findPageInfo("lordPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    updateLordCallback() {
        this.setLordTexture();
    },

    /**
     * 设置纹理所需信息
     */
    setLordTexture() {
        /*
        let level = this.logic.lord.getLevel();
        level = Math.floor(level / 3);

        let path = "builds/lord/ui_Fang_" + level;
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
        */
    }
});
