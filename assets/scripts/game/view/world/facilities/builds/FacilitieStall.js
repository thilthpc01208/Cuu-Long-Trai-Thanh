const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
        role: {
            type: sp.Skeleton,
            default: null
        }
    },

    faciliteLoad() {
        this.buildName = "stall";

        this.setRole();
        this.setStallTexture();

        this.coinSpin = this.node.getChildByName("coinSpin");
        this.coinSpin.active = false;
    },

    faciliteEnable() {
        this.schedule(this.updateCustom.bind(this), 0.5);
        this.schedule(this.updateTime.bind(this), 1);
    },

    faciliteDisable() {
        this.unschedule(this.updateCustom.bind(this), 0.5);
        this.unschedule(this.updateTime.bind(this), 1);
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

        let stallLevel = this.logic.stall.getLevel();
        if (stallLevel < 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "stall" });
            return;
        }

        let pageInfo = cc.Global.pageConfig.findPageInfo("stallPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    updateStallCallback(level) {
        this.setStallTexture();
        this.setRole();
    },

    updateCustom() {
        this.logic.stall.updateCustom();
    },

    updateTime() {
        let profit = this.logic.stall.getProfit();
        if (profit >= 100) {
            this.coinSpin.active = true;
        }
        else {
            this.coinSpin.active = false;
        }
    },

    setRole() {
        let level = this.logic.stall.getLevel();
        if (level < 0) {
            //this.role.node.active = false;
        }
        else {
            //this.role.node.active = true;
        }
    },

    /**
     * 设置纹理所需信息
     */
    setStallTexture() {
        let level = this.logic.stall.getLevel();
        let path = "builds/stall/XiaoMaiBu_" + level;
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
    }
});
