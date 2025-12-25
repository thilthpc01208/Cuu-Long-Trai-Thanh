const articsConfig = require("../../../config/alone/ArticsConfig");
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {

    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { callback: null };
        }

        this.initShipAward();
    },

    pageDisable() {

    },

    receiveBtn(event, data) {
        let adv = data == 1 ? true : false;
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);

        if (adv === true) {
            let result = this.logic.harbour.isCanCollect({ adv: true });
            if (!result) { return; }
            
            cc.Global.sdk.postEvent2("ads_start_position",29);
            let callback = this.extraMsg.callback;
            let logic = this.logic;
            cc.Global.sdk.videoExc(function (code) {
                if (code != 1) { return; }
                cc.Global.sdk.postEvent2("ads_finish_position",29);

                logic.harbour.getShipAward({ startPos: startPos, adv: adv });
                callback();
                this.close();
            }.bind(this));
        }
        else {
            this.logic.harbour.getShipAward({ startPos: startPos, adv: adv });
            this.extraMsg.callback();
            this.close();
        }
    },

    initShipAward() {
        let shipAward = this.logic.harbour.getHarbourInfo().award;
            
        let gem = this.node.getChildByName("gem").getChildByName("num").getComponent(cc.Label);
        gem.string = shipAward.gem;

        let cash = this.node.getChildByName("cash").getChildByName("num").getComponent(cc.Label);
        cash.string = shipAward.cash;

        let materialList = this.node.getChildByName("material").children;
        let materiaKeys = Object.keys(shipAward.material);
        if (materiaKeys.length <= 0) { return; }

        let len = materialList.length;
        for (let index = 0; index < len; index++) {
            let item = materialList[index];
            let key = materiaKeys[index];

            item.getChildByName("num").getComponent(cc.Label).string = shipAward.material[key];
            let path = "artics/" + articsConfig.entityHash[key].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite).
                    spriteFrame = spriteFrame;
            });
        }

        let collectNode = this.node.getChildByName("collect");
        collectNode.getChildByName("adverRecive").active = true;
    }
});
