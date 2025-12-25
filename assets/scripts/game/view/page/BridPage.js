const articsConfig = require("../../../config/alone/ArticsConfig");
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {

    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { callback: null };
        }

        this.initBridAward();
    },

    pageDisable() {

    },

    receiveBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let bridAward = JSON.parse(JSON.stringify(normalConfig.bridAward));
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",46);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",46);
            logic.lord.addRes({ gem: bridAward.gem }, 1,startPos);
            delete bridAward["gem"];
            logic.store.storeItems(bridAward, 1, startPos);
        });

        this.close();
    },

    initBridAward() {
        let toolsList = this.node.getChildByName("layout").children;

        let bridAward = normalConfig.bridAward;
        let toolsKey = Object.keys(bridAward);

        let len = toolsList.length;
        for (let index = 0; index < len; index++) {
            let item = toolsList[index];
            let key = toolsKey[index];

            item.getChildByName("num").getComponent(cc.Label).string = "x" + bridAward[key];
            let path = "";
            if (key === "gem") {
                path = "artics/gem";
            }
            else {
                path = "artics/" + articsConfig.entityHash[key].id;
            }

            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite).
                    spriteFrame = spriteFrame;
            });
        }
    }
});
