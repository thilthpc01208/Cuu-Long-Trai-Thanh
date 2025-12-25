cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.scrollInfoLabel = this.node.getChildByName("adver").getChildByName("mask")
            .getChildByName("info").getComponent(cc.Label);

        this.scrollDataArray = [];
        this.flyDataArray = [];
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.InnerTips, this.receiveTip.bind(this), this);
        this.node.getChildByName("adver").active = false;

        this.schedule(this.createScrollTip, 0.5);
        this.schedule(this.createFlyTip, 0.5);
    },

    onDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.InnerTips, this);

        this.unschedule(this.createScrollTip);
        this.unschedule(this.createFlyTip);
    },

    update(dt) {
        if (this.scrollInfoLabel.string == "") { return; }
        this.scrollInfoLabel.node.x -= 100 * dt;
        if (this.scrollInfoLabel.node.x <= (- 250 - this.scrollInfoLabel.node.width)) {
            this.node.getChildByName("adver").active = false;
            this.scrollInfoLabel.node.x = 250;
            this.scrollInfoLabel.string = "";
        }
    },

    receiveTip(data) {
        if (data.type == "scroll") {
            let len = this.scrollDataArray.length;
            for (let index = 0; index < len; index++) {
                let element = this.scrollDataArray[index];
                if (element == data.content) {
                    return;
                }
            }
            this.scrollDataArray.push(data.content);
        }

        if (data.type == "fly") {
            let len = this.flyDataArray.length;
            for (let index = 0; index < len; index++) {
                let element = this.flyDataArray[index];
                if (element == data.content) {
                    return;
                }
            }
            this.flyDataArray.push(data.content);
        }
    },

    createFlyTip() {
        if (this.flyDataArray.length <= 0) {
            return;
        }

        let data = this.flyDataArray.shift();
        cc.Global.assertCenter.readLocalPrefab("items/TipItem", function (err, prefab) {
            let tip = cc.instantiate(prefab);

            let moveTo = cc.moveTo(2, cc.v2(0, 300));
            let callFunc = cc.callFunc(function () {
                this.removeFromParent();
            }.bind(tip));
            let sequence = cc.sequence(moveTo, callFunc);

            tip.getComponent(cc.Label).string = data;
            tip.parent = this.node;
            tip.stopAllActions();
            tip.runAction(sequence);
        }.bind(this));
    },

    createScrollTip() {
        if (this.scrollDataArray.length <= 0) {
            this.scrollDataArray = [];
            return;
        }

        let data = "     " + this.scrollDataArray.shift();
        this.scrollInfoLabel.string += data;
        this.node.getChildByName("adver").active = true;
    }

    /*
    用法
    cc.Global.listenCenter.fire( cc.Global.eventConfig.InnerTips, {
        content: "货物不足!",
        type: "scroll"
    } );
    */
});
