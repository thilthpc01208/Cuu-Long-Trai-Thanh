const ActionBase = require('./ActionBase');

cc.Class({
    extends: ActionBase,

    properties: {

    },

    onEnable() {
        this.font = null;
        this.back = null;

        this.dinerState = "goout";
    },

    startAction() {

    },

    endAction() {

    },

    doneAction() {
        if (this.dinerState == "goout") {
            this.dinerState = "goback";

            this.node.scaleX = 0; this.node.scaleY = 0;

            let waitTime = this.logic.canteen.getWaitTime();
            let eatTime = this.logic.canteen.getEatTime();
            let food = this.logic.canteen.dinerEat();

            if (food && food.name) {
                this.hasFood = true;
                this.scheduleOnce(function () {
                    cc.Global.listenCenter.fire(cc.Global.eventConfig.DinerEat, {
                        seatIndex: this.seatIndex,
                        roleIndex: this.roleIndex,
                        food: food.name
                    });
                }.bind(this), waitTime);

                this.scheduleOnce(function () {
                    cc.Global.listenCenter.fire(cc.Global.eventConfig.DinerLeave, {
                        seatIndex: this.seatIndex,
                        roleIndex: this.roleIndex
                    });
                    this.logic.canteen.dinerLeave(this.seatIndex);
                    this.runBack();
                }.bind(this), waitTime + eatTime);
            }

            if (!food || !food.name) {
                this.hasFood = false;
                this.scheduleOnce(function () {
                    cc.Global.listenCenter.fire(cc.Global.eventConfig.DinerLeave, {
                        seatIndex: this.seatIndex,
                        roleIndex: this.roleIndex
                    });
                    this.logic.canteen.dinerLeave(this.seatIndex);
                    this.runBack();
                }.bind(this), waitTime);
            }

            cc.Global.listenCenter.fire(cc.Global.eventConfig.DinerArrive, {
                seatIndex: this.seatIndex,
                roleIndex: this.roleIndex
            });

            return;
        }

        if (this.dinerState == "goback") {
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
            let list = cc.Global.wordsConfig.dinnerTip.eatEndOk;
            let index = Math.floor(Math.random() * 1000) % list.length;
            talk.getChildByName("info").getComponent(cc.Label).string = list[index];
        }
        else {
            let list = cc.Global.wordsConfig.dinnerTip.eatEndFail;
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
        this.seatIndex = data.seatIndex;
        this.roleIndex = data.roleIndex;
        return path;
    }
});
