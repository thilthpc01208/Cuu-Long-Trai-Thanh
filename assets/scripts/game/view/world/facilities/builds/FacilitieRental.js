const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
        rentalsNode: {
            type: [cc.Node],
            default: [],
        }
    },

    faciliteLoad() {
        this.buildName = "rental";
        this.rentals = this.rentalsNode;

        this.coinSpins = [];
        for (let index = 0, len = this.rentals.length; index < len; index++) {
            let coinSpin = this.rentals[index].getChildByName("coinSpin");
            coinSpin.active = false;
            this.coinSpins.push(coinSpin);
        }
    },

    faciliteEnable() {
        this.schedule(this.updateTime.bind(this), 1);
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
        let endPos = event.getLocation();
        this.clickRental(endPos);
    },

    updateTime() {
        for (let index = 0, len = this.rentals.length; index < len; index++) {
            let profit = this.logic.rental.getProfit({ index: index });
            if (profit >= 100) {
                this.coinSpins[index].active = true;
            }
            else {
                this.coinSpins[index].active = false;
            }
        }
    },

    clickRental(endPos) {
        for (let index = 0, len = this.rentals.length; index < len; index++) {
            let rental = this.rentals[index];
            let rect = rental.getBoundingBoxToWorld();
            if (!rect.contains(endPos)) { continue; }

            if (this.logic.rental.getProfit({ index: index }) > 0) {
                let pageInfo = cc.Global.pageConfig.findPageInfo("roomProfitPage");
                cc.Global.assertCenter.openPage(pageInfo, true, null, {
                    build: "rental",
                    type: "single",
                    index: index
                });
            }
            return;
        }
    }
});
