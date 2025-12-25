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
        this.buildName = "depot";

        this.setRole();
        this.setDepotTexture();

        //this.rightSpin = this.node.getChildByName("rightSpin");
        this.coinSpin = this.node.getChildByName("coinSpin");
        this.coinSpin.active = false;
    },

    faciliteEnable() {
        this.scheduleOnce(function () { this.setTruckState(); }.bind(this), 2);
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
        if (dis >= 10) { this.canSelect = false; }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; }

        let pageInfo = cc.Global.pageConfig.findPageInfo("depotPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    updateDepotCallback(level) {
        this.setDepotTexture();
    },

    updateTruckCallback(level) {
        this.setTruckState();
    },

    setTruckState() {
        if (!this.truckSpine) { return; }

        let truckInfo = this.logic.depot.getTruck();
        if (truckInfo.state === 0 || truckInfo.state === 2) {
            this.truckSpine.node.x = 580;
        }
        if (truckInfo.state === 1) { this.truckSpine.node.x = -1200; }

        this.truckSpine.node.stopAllActions();

        let name = "Che_#_wait".replace("#", truckInfo.level + 1);
        this.truckSpine.setAnimation(0, name, true);
    },

    truckLeaveCallback() {
        if (!this.truckSpine) { return; }

        let truckInfo = this.logic.depot.getTruck();
        this.truckSpine.node.x = 580;
        let moveTo = cc.moveTo(5, cc.Vec2(1200, this.truckSpine.node.y));
        let delay = cc.delayTime(0.5);
        let func = cc.callFunc(function () {
            this.truckSpine.node.x = -1200;
            let name = "Che_#_wait".replace("#", truckInfo.level + 1);
            this.truckSpine.setAnimation(0, name, true);
            this.logic.depot.setStopOprate(false);
        }.bind(this));

        this.logic.depot.setStopOprate(true);
        let name = "Che_#_walk".replace("#", truckInfo.level + 1);
        this.truckSpine.setAnimation(0, name, true);
        let sequence = cc.sequence(moveTo, delay, func);

        this.truckSpine.node.stopAllActions();
        this.truckSpine.node.runAction(sequence);

        //this.role.node.active = false;
    },

    truckBackCallback(data) {
        if (!this.truckSpine) { return; }

        let truckInfo = this.logic.depot.getTruck();
        if (!data.quick) {
            this.truckSpine.node.x = -1200;
            let moveTo = cc.moveTo(5, cc.Vec2(580, this.truckSpine.node.y));
            let delay = cc.delayTime(0.5);
            let func = cc.callFunc(function () {
                this.truckSpine.node.x = 580;
                let name = "Che_#_wait".replace("#", truckInfo.level + 1);
                this.truckSpine.setAnimation(0, name, true);
                this.logic.depot.setStopOprate(false);
                //this.role.node.active = true;
            }.bind(this));

            this.logic.depot.setStopOprate(true);
            let name = "Che_#_walk".replace("#", truckInfo.level + 1);
            this.truckSpine.setAnimation(0, name, true);
            let sequence = cc.sequence(moveTo, delay, func);

            this.truckSpine.node.stopAllActions();
            this.truckSpine.node.runAction(sequence);
        }
        else {
            //this.role.node.active = true;
            this.setTruckState();
        }
    },

    setRole() {
        let level = this.logic.depot.getLevel();
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
    setDepotTexture() {
        let level = this.logic.depot.getLevel();
        let path = "builds/depot/CangKu_" + (level + 1);
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
    },

    updateTime() {
        if (this.logic.depot.getTruck().state === 2) {
            this.coinSpin.active = true;
        }
        else {
            this.coinSpin.active = false;
        }

        if (this.logic.depot.hasCanDeliverOrder()) {
            //this.rightSpin.active = true;
        }
        else {
            //this.rightSpin.active = false;
        }
    }
});
