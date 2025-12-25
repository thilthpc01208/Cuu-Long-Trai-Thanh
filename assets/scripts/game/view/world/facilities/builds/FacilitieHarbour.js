const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
        shipBoatNode: {
            type: cc.Node,
            default: null
        },

        catchBoatNode: {
            type: cc.Node,
            default: null
        },
    },

    faciliteLoad() {
        this.buildName = "harbour";
        this.setHarbourTexture();
    },

    faciliteEnable() {
        this.setCatchBoat();
        this.setShipBoat();
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

        let harbourInfo = this.logic.harbour.getHarbourInfo();
        if (harbourInfo.level < 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "harbour" });
            return;
        }

        if (harbourInfo.ship.state === 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("harbourPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, null);
        }
        else {
            let pageInfo = cc.Global.pageConfig.findPageInfo("shipPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, null);
        }
    },

    updateHarbourCallback(date) {
        this.setHarbourTexture();

        this.setShipBoat();
        this.setCatchBoat();
    },

    updateCatchBoatCallback() {
        this.setCatchBoat();
    },

    shipBoatOutCallback() {
        let shipBoatInfo = this.logic.harbour.getShipBoatInfo();
        if (shipBoatInfo.level < 0) {
            this.shipBoatNode.active = false;
            return;
        }

        this.shipBoatNode.active = true;

        let index = (Math.floor(shipBoatInfo.level / 2) + 1);
        let aniName = "ani_HC_front_" + index;
        let spin = this.shipBoatNode.getComponent("sp.Skeleton");
        spin.setAnimation(0, aniName, true);

        this.shipBoatNode.x = 450;
        this.shipBoatNode.scaleX = -1;
        let moveTo = cc.moveTo(5, cc.Vec2(1500, this.shipBoatNode.y));
        let delay = cc.delayTime(0.5);
        let func = cc.callFunc(function () {
            this.shipBoatNode.active = false;
            this.logic.harbour.setStopOprate(false);
        }.bind(this));

        this.logic.harbour.setStopOprate(true);
        let sequence = cc.sequence(moveTo, delay, func);
        this.shipBoatNode.stopAllActions();
        this.shipBoatNode.runAction(sequence);
    },

    shipBoatBackCallback(data) {
        let shipBoatInfo = this.logic.harbour.getShipBoatInfo();
        if (shipBoatInfo.level < 0) {
            this.shipBoatNode.active = false;
            return;
        }

        if (shipBoatInfo.state !== 0) {
            this.shipBoatNode.active = false;
            return;
        }

        this.shipBoatNode.active = true;
        this.shipBoatNode.scaleX = 1;
        if (!data.quick) {
            let index = (Math.floor(shipBoatInfo.level / 2) + 1);
            let aniName = "ani_HC_back_" + index;
            let spin = this.shipBoatNode.getComponent("sp.Skeleton");
            spin.setAnimation(0, aniName, true);

            this.shipBoatNode.x = 1500;
            let moveTo = cc.moveTo(5, cc.Vec2(400, this.shipBoatNode.y));
            let delay = cc.delayTime(0.5);
            let func = cc.callFunc(function () {
                this.logic.harbour.setStopOprate(false);
                this.setShipBoat();
            }.bind(this));

            this.logic.harbour.setStopOprate(true);
            let sequence = cc.sequence(moveTo, delay, func);
            this.shipBoatNode.stopAllActions();
            this.shipBoatNode.runAction(sequence);
        }
        else {
            this.setShipBoat();
        }
    },

    catchBoatOutCallback() {
        let catchBoatInfo = this.logic.outdoor.getCatchBoatInfo();
        if (catchBoatInfo.level < 0) {
            this.catchBoatNode.active = false;
            return;
        }

        this.catchBoatNode.active = true;
        this.catchBoatNode.x = 360;

        let index = (Math.floor(catchBoatInfo.level / 2) + 1);
        let aniName = "ani_HC_front_" + index;
        let spin = this.catchBoatNode.getComponent("sp.Skeleton");
        spin.setAnimation(0, aniName, true);

        this.catchBoatNode.x = 360;
        this.catchBoatNode.scaleX = -1;
        let moveTo = cc.moveTo(5, cc.Vec2(1500, this.catchBoatNode.y));
        let delay = cc.delayTime(0.5);
        let func = cc.callFunc(function () {
            this.catchBoatNode.active = false;
            this.logic.outdoor.setOutdoorState(false);
        }.bind(this));

        this.logic.outdoor.setOutdoorState(true);
        let sequence = cc.sequence(moveTo, delay, func);
        this.catchBoatNode.stopAllActions();
        this.catchBoatNode.runAction(sequence);
    },

    catchBoatBackCallback(data) {
        let catchBoatInfo = this.logic.outdoor.getCatchBoatInfo();
        if (catchBoatInfo.level < 0) {
            this.catchBoatNode.active = false;
            return;
        }

        if (catchBoatInfo.state !== 0 && catchBoatInfo.state !== 2) {
            this.catchBoatNode.active = false;
            return;
        }

        this.catchBoatNode.active = true;
        this.catchBoatNode.scaleX = 1;
        if (!data.quick) {
            let index = (Math.floor(catchBoatInfo.level / 2) + 1);
            let aniName = "ani_YC_back_" + index;
            let spin = this.catchBoatNode.getComponent("sp.Skeleton");
            spin.setAnimation(0, aniName, true);

            this.catchBoatNode.x = 1500;
            let moveTo = cc.moveTo(5, cc.Vec2(360, this.catchBoatNode.y));
            let delay = cc.delayTime(0.5);
            let func = cc.callFunc(function () {
                this.logic.outdoor.setOutdoorState(false);
                this.setCatchBoat();
            }.bind(this));

            this.logic.outdoor.setOutdoorState(true);
            let sequence = cc.sequence(moveTo, delay, func);
            this.catchBoatNode.stopAllActions();
            this.catchBoatNode.runAction(sequence);
        }
        else {
            this.setCatchBoat();
        }
    },

    setCatchBoat() {
        let catchBoatInfo = this.logic.outdoor.getCatchBoatInfo();
        if (catchBoatInfo.level < 0) {
            this.catchBoatNode.active = false;
            return;
        }

        if (catchBoatInfo.state !== 0 && catchBoatInfo.state !== 2) {
            this.catchBoatNode.active = false;
            return;
        }

        let harbourLevel = this.logic.harbour.getLevel();
        if (harbourLevel < 0) {
            this.catchBoatNode.active = false;
            return;
        }

        this.catchBoatNode.active = true;
        this.catchBoatNode.x = 370;
        this.catchBoatNode.stopAllActions();

        let aniName = "ani_YC_wait_" + catchBoatInfo.level;
        let spin = this.catchBoatNode.getComponent("sp.Skeleton");
        spin.setAnimation(0, aniName, true);
    },

    setShipBoat() {
        let shipBoatInfo = this.logic.harbour.getShipBoatInfo();
        if (shipBoatInfo.level < 0) {
            this.shipBoatNode.active = false;
            return;
        }

        if (shipBoatInfo.state !== 0) {
            this.shipBoatNode.active = false;
            return;
        }

        this.shipBoatNode.active = true;
        this.shipBoatNode.x = 370;

        this.shipBoatNode.stopAllActions();

        let index = (Math.floor(shipBoatInfo.level / 3) + 1);
        let aniName = "ani_HC_wait_" + index;
        let spin = this.shipBoatNode.getComponent("sp.Skeleton");
        spin.setAnimation(0, aniName, true);
    },

    /**
     * 设置纹理所需信息
     */
    setHarbourTexture() {
        let level = Math.floor(this.logic.harbour.getLevel() / 3);
        let path = "builds/harbour/MaTou_" + level
        cc.Global.assertCenter.replaceSpriteFrame(this.node, path);
    }
});
