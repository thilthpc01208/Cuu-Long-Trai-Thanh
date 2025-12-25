const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
        desks:{
            type: cc.Node,
            default: null
        },
        chairs: {
            type: [cc.Node],
            default: []
        },
        dishs: {
            type: [cc.Node],
            default: []
        },
        role: {
            type: sp.Skeleton,
            default: null
        }
    },

    faciliteLoad() {
        this.buildName = "canteen";
        this.setRole();
        this.setStallTexture();

        this.customs = {};
        this.coinSpin = this.node.getChildByName("coinSpin");
        this.coinSpin.active = false;
    },

    faciliteEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.DinerArrive, this.dinnerArrive.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.DinerEat, this.dinnerEat.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.DinerLeave, this.dinnerLeave.bind(this), this);

        this.schedule(this.updateCustom.bind(this), 0.5);
        this.schedule(this.updateTime.bind(this), 1);

        this.setDeskTexture();
    },

    faciliteDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.DinerArrive, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.DinerEat, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.DinerLeave, this);

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
        if (dis >= 10) { this.canSelect = false; }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; }

        let canteenLevel = this.logic.canteen.getLevel();
        if (canteenLevel < 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "canteen" });
            return;
        }

        let pageInfo = cc.Global.pageConfig.findPageInfo("canteenPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    updateCanteenCallback(level) {
        this.setStallTexture();
        this.setRole();
    },

    updateDeskCallBack(level) {
        this.setDeskTexture();
    },

    dinnerArrive(data) {
        let seatIndex = data.seatIndex;
        let roleIndex = data.roleIndex;

        let spinName = (seatIndex == 0 || seatIndex == 2) ? "eat_wait_z" : "eat_wait_b";
        if (!this.customs[roleIndex]) { this.customs[roleIndex] = []; }
        if (this.customs[roleIndex].length <= 0) {
            let url = "chara/chara_" + roleIndex;
            cc.Global.assertCenter.readLocalPrefab(url, function (err, perfab) {
                let custom = cc.instantiate(perfab);
                custom.parent = this.chairs[seatIndex];
                this.chairs[seatIndex].dinner = custom;
                custom.getComponent("sp.Skeleton").setAnimation(0, spinName, true);
            }.bind(this));
        }
        else {
            let custom = this.customs[roleIndex].pop();
            custom.parent = this.chairs[seatIndex];
            this.chairs[seatIndex].dinner = custom;
            custom.getComponent("sp.Skeleton").setAnimation(0, spinName, true);
        }
    },

    dinnerEat(data) {
        let seatIndex = data.seatIndex;
        let roleIndex = data.roleIndex;

        let spinName = (seatIndex == 0 || seatIndex == 2) ? "eat_z" : "eat_b";
        let custom = this.chairs[seatIndex].dinner;
        custom.getComponent("sp.Skeleton").setAnimation(0, spinName, true);
    },

    dinnerLeave(data) {
        let seatIndex = data.seatIndex;
        let roleIndex = data.roleIndex;

        this.chairs[seatIndex].dinner.parent = null;
        this.customs[roleIndex].push(this.chairs[seatIndex].dinner);
        this.chairs[seatIndex].dinner = null;
    },

    updateCustom() {
        //this.logic.canteen.updateCustom();
    },

    updateTime() {
        let profit = this.logic.canteen.getProfit();
        if (profit >= 100) {
            this.coinSpin.active = true;
        }
        else {
            this.coinSpin.active = false;
        }
    },

    setRole() {
        let level = this.logic.canteen.getLevel();
        if (level < 0) {
            //this.role.node.active = false;
            this.desks.active = false;
        }
        else {
            //this.role.node.active = true;
            this.desks.active = true;
        }
    },

    /**
     * 设置纹理所需信息
     */
    setStallTexture() {
        let level = this.logic.canteen.getLevel();
        if (level >= 0) {
            let name = this.buildName + "_block";
            let block = this.node.parent.getChildByName(name);
            block.active = false;
        }
    },

    /**
     * 设置纹理所需信息
    */
    setDeskTexture() {
        let level = this.logic.canteen.getDeskLevel();
        let deskPath = "builds/desks/ZhuoZi_" + level;
        let chairPath = "builds/desks/YiZi_" + level;

        let arr = this.desks.children;
        for (let index = 0, len = arr.length; index < len; index++) {
            let single = arr[index].children;
            let num = single.length;
            for (let flag = 0; flag < num; flag++) {
                if (flag == 0 || flag == 2) {
                    cc.Global.assertCenter.replaceSpriteFrame(single[flag], chairPath);
                }

                if (flag == 1) {
                    cc.Global.assertCenter.replaceSpriteFrame(single[flag], deskPath);
                }
            }
        }
    }
});
