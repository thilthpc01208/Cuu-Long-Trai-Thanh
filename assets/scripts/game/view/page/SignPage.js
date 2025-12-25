const normalConfig = require("../../../config/alone/NormConfig");
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        awardsContent: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.list = this.awardsContent.children;
    },

    pageEnable() {
        this.initPage();
    },

    normalGetBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = {
            index: event.target.parent.parent.dayIndex,
            adv: false,
            startPos: startPos
        };
        this.logic.sign.getAward(temp);
        this.initPage();
    },

    advGetBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = {
            index: event.target.parent.parent.dayIndex,
            adv: true,
            startPos: startPos
        };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",36);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",36);

            logic.sign.getAward(temp);
            this.initPage();
        }.bind(this));
    },

    initPage() {
        let state = this.logic.sign.getSignState();
        let awards = normalConfig.sign;

        let len = this.list.length;
        for (let index = 0; index < len; index++) {
            let item = this.list[index];
            item.dayIndex = index;
            this.setItemValue(awards, item, index);
            this.setItemState(state, item, index);
        }
    },

    setItemState(state, item, index) {
        if (state[index] === -1) {
            item.getChildByName("light").active = false;
            item.getChildByName("dark").active = true;

            item.getChildByName("dark").getChildByName("right").active = false;
            item.getChildByName("dark").getChildByName("info").active = true;
        }

        if (state[index] === 0) {
            item.getChildByName("light").active = true;
            item.getChildByName("dark").active = false;
        }

        if (state[index] === 1) {
            item.getChildByName("light").active = false;
            item.getChildByName("dark").active = true;

            item.getChildByName("dark").getChildByName("right").active = true;
            item.getChildByName("dark").getChildByName("info").active = false;
        }
    },

    setItemValue(awards, item, index) {
        let gemNum = "x" + awards[index].gem;
        item.getChildByName("gemNum").getComponent(cc.Label).string = gemNum;

        if (index !== 6) {
            return;
        }

        let material = awards[index].material;
        let key = Object.keys(material)[0];
        let materialNum = "x" + material[key];
        item.getChildByName("materialNum").getComponent(cc.Label).string = materialNum;
    }
});
