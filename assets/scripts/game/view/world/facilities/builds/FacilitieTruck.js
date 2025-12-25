const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    faciliteLoad() {
        this.buildName = "truck";
    },

    faciliteEnable() {
        this.schedule(this.repot.bind(this), 1.5);
    },

    faciliteDisable() {
        this.unschedule(this.repot.bind(this), 1.5);
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

        let pageInfo = cc.Global.pageConfig.findPageInfo("depotPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    repot() {
        if (!this.depot) {
            this.depot = this.node.parent.getChildByName("depot").getComponent("FacilitieDepot");
        }
        this.depot.truckSpine = this.node.getComponent("sp.Skeleton");
    }
});
