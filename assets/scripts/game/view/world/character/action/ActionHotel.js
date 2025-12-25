const ActionBase = require('./ActionBase');

cc.Class({
    extends: ActionBase,

    properties: {

    },

    onEnable() {
        this.adverState = "goout";

        this.font = null;
        this.back = null;
    },

    onDisable() {

    },

    startAction() {

    },

    endAction() {

    },

    doneAction() {
        let blackBed = this.logic.hotel.hasBlackBed();
        if (blackBed <= 0) {
            this.adverState = "goback";
            this.runBack();
            return;
        }

        if (this.adverState == "goout") {
            this.adverState = "goback";

            this.node.scaleX = 0; this.node.scaleY = 0;
            let sleepTime = this.logic.hotel.getSleepTime();
            this.scheduleOnce(function () {
                this.runBack();
            }.bind(this), sleepTime);

            this.logic.hotel.roleEnter();
            return;
        }

        if (this.adverState == "goback") {
            this.roleBase.hideRole(this.node, this);
        }
    },

    runBack() {
        this.node.scaleX = 1; this.node.scaleY = 1;

        this.roleBase.runStep = -this.roleBase.runStep;
        this.roleBase.roleState = 1;

        let talk = this.node.getChildByName("talk");
        talk.active = true;
        if (this.hasFood) {
            let list = cc.Global.wordsConfig.customTips.lamp;
            let index = Math.floor(Math.random() * 1000) % list.length;
            talk.getChildByName("info").getComponent(cc.Label).string = list[index];
        }
        else {
            let list = cc.Global.wordsConfig.customTips.lamp;
            let index = Math.floor(Math.random() * 1000) % list.length;
            talk.getChildByName("info").getComponent(cc.Label).string = list[index];
        }

        this.scheduleOnce(function () {
            talk.active = false;
        }.bind(this), 2);
    },

    nextDot(index) {
        if (this.currentDot && this.currentDot != 0 && index == 1) {
            this.node.parent = this.font;
        }

        if (this.currentDot == 1 && index == 2) {
            this.node.parent = this.back;
        }

        this.currentDot = index;
    },

    setPath(path, data) {
        this.font = data.font;
        this.back = data.back
        return path;
    }
});
