const buildConfig = require("../../../../../config/alone/BuildsConfig");
const ActionBase = require('./ActionBase');

cc.Class({
    extends: ActionBase,

    properties: {

    },

    startAction() {
        this.state = -1;
    },

    endAction() {

    },

    doneAction() {
        let level = this.logic.stall.getLevel();
        let waitTime = buildConfig.stall[level].wait_time;
        this.state += 1;

        if (this.state == 0) {
            this.node.getComponent("sp.Skeleton").setAnimation(0, "wait_b", true)
            this.scheduleOnce(this.waitBuy.bind(this), waitTime);
        }

        if (this.state == 1) {
            this.scheduleOnce(this.waitLeave.bind(this), 1);
        }
    },

    waitBuy() {
        let goods = this.logic.stall.saleGoods();
        this.roleBase.runStep = -this.roleBase.runStep;
        this.roleBase.roleState = 1;

        let talk = this.node.getChildByName("talk");
        talk.active = true;
        if (goods.length > 0) {
            let list = cc.Global.wordsConfig.customTips.stallSucess;
            let index = Math.floor(Math.random() * 1000) % list.length;
            talk.getChildByName("info").getComponent(cc.Label).string = list[index];
        }
        else {
            let list = cc.Global.wordsConfig.customTips.stallFail;
            let index = Math.floor(Math.random() * 1000) % list.length;
            talk.getChildByName("info").getComponent(cc.Label).string = list[index];
        }

        this.scheduleOnce(function () {
            talk.active = false;
        }.bind(this), 2);
    },

    waitLeave() {
        this.roleBase.hideRole(this.node, this);
    },

    setPath(path, data) {
        return path;
    }
});
