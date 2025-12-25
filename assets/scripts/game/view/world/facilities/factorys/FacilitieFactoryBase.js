const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    faciliteEnable() {
        this.schedule(this.updateTime.bind(this), 1);
        this.setFactoryTexture();
    },

    faciliteDisable() {
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
        this.clickFactory();
    },

    updateTime() {
        let profit = this.logic[this.buildName].getProfit();
        if (profit >= 100) {
            this.coinSpin.active = true;
        }
        else {
            this.coinSpin.active = false;
        }
    },

    updateFactoryCallback(level) {
        this.setFactoryTexture();
    },

    setFactoryTexture() {
        let level = this.logic[this.buildName].getLevel();
        if (level >= 0) {
            let name = this.buildName + "_block";
            let block = this.node.parent.getChildByName(name);
            block.active = false;
        }
    },

    clickFactory() {
        let level = this.logic[this.buildName].getLevel();
        let pageInfo = null;
        let data = null;

        if (level < 0) {
            pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
            data = { type: this.buildName };
        }
        else {
            pageInfo = cc.Global.pageConfig.findPageInfo("factoryPage");
            data = { foodType: this.buildName, index: 0 };
        }
        cc.Global.assertCenter.openPage(pageInfo, true, null, data);
    }
});
