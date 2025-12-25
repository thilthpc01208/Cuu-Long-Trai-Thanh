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
        this.buildName = "hotel";

        this.setRole();
        this.setHotelTexture();

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

        let hotelLevel = this.logic.hotel.getLevel();
        if (hotelLevel < 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("buildPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { index: 1 });
            return;
        }

        if (this.logic.hotel.getProfit() > 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("roomProfitPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { build: "hotel", type: "single", index: 0 });
        }
    },

    updateHotelCallback(level) {
        this.setRole();
        this.setHotelTexture();
    },

    updateCustom() {
        //this.logic.hotel.updateCustom();
    },

    updateTime() {
        let profit = this.logic.hotel.getProfit();
        if (profit >= 100) {
            this.coinSpin.active = true;
        }
        else {
            this.coinSpin.active = false;
        }
    },

    setRole() {
        let level = this.logic.hotel.getLevel();
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
    setHotelTexture() {
        let level = this.logic.hotel.getLevel();
        if (level >= 0) {
            let name = this.buildName + "_block";
            let block = this.node.parent.getChildByName(name);  
            block.active = false;
        }
    }
});
