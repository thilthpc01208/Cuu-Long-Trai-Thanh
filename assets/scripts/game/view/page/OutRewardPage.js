const articsConfig = require("../../../config/alone/ArticsConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {

    },

    pageEnable() {
        if (!this.extraMsg) { this.extraMsg = { index: 0 }; }
        this.initOutdoorAward();
    },

    receiveBtn(event, data) {
        let adv = data == 1 ? true : false;
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);

        if (this.logic.outdoor.getOutdoorState() == true) {
            this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["gradeNotReady"]);
            return;
        }

        if (!adv) {
            this.logic.outdoor.getOutdoorGoods({
                index: this.extraMsg.index,
                startPos: startPos,
                adv: adv
            });
            this.close();
            return;
        }

        let index = this.extraMsg.index;
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",19);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",19);

            let result = logic.outdoor.isCanOutdoorCollect({ index: index, adv: true });
            if (!result) {
                return;
            }
            logic.outdoor.getOutdoorGoods({ index: index, startPos: startPos, adv: adv });
            this.close();
        }.bind(this));
    },

    initOutdoorAward() {
        let takes = this.logic.outdoor.getOutdoorInfo()[this.extraMsg.index].take;
        let toolsList = this.node.getChildByName("take").children;
        let toolsKey = Object.keys(takes);

        let len = toolsList.length;
        for (let index = 0; index < len; index++) {
            let item = toolsList[index];

            if (index >= toolsKey.length) {
                item.active = false;
                continue;
            }
            item.active = true;

            let key = toolsKey[index];
            item.getChildByName("num").getComponent(cc.Label).string = "x" + takes[key];
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
