const articsConfig = require('../../../config/alone/ArticsConfig');
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        tittle: {
            type: cc.Label,
            default: null
        }
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { goodsId: "land-xiaomai", maxNum: 1, num: 1 };
        }

        this.storeModify();
        this.initPage();
        cc.Global.listenCenter.register(cc.Global.eventConfig.StoreModify, this.storeModify.bind(this), this);
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.StoreModify, this);
    },

    addBtn(event, data) {
        let resultNum = this.extraMsg.num + 1;
        if (resultNum <= this.extraMsg.maxNum) {
            this.extraMsg.num = resultNum;
        }

        this.setCountValue();
    },

    cutBtn(event, data) {
        let resultNum = this.extraMsg.num - 1;
        if (resultNum > 0) {
            this.extraMsg.num = resultNum;
        }

        this.setCountValue();
    },

    normalSale(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let item = {};
        item[this.extraMsg.goodsId] = this.extraMsg.num;
        this.logic.store.sellItems(item, 1, startPos);

        this.close();
    },

    advSale(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let item = {};
        item[this.extraMsg.goodsId] = this.extraMsg.num;
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",20);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",20);

            logic.store.sellItems(item, normalConfig.rewardVideoScale, startPos);
            this.close();
        }.bind(this));
    },

    /**
     * 初始化页面
     */
    initPage() {
        let frame = this.node.getChildByName("frame");
        frame.getChildByName("num").getComponent(cc.Label).string = "x" + this.extraMsg.maxNum;

        let path = "artics/" + articsConfig.entityHash[this.extraMsg.goodsId].id;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function name(err, spriteFrame) {
            frame.getChildByName("icon").getComponent(cc.Sprite).spriteFrame
                = spriteFrame;
        });

        frame.getChildByName("info").getComponent(cc.Label).string = articsConfig.entityHash[this.extraMsg.goodsId].descript;
        this.tittle.string = articsConfig.entityHash[this.extraMsg.goodsId].name;
    },

    storeModify(types) {
        this.initData(this.extraMsg);
        this.setCountValue();
    },

    setCountValue() {
        this.node.getChildByName("count").getChildByName("num").getComponent(cc.Label)
            .string = this.extraMsg.num;

        this.node.getChildByName("normal").getChildByName("num").getComponent(cc.Label)
            .string = this.extraMsg.num * articsConfig.entityHash[this.extraMsg.goodsId].price;
    },

    initData(temp) {
        temp.maxNum = this.logic.store.getItemNum(temp.goodsId);
        temp.num = Math.ceil(temp.maxNum / 2);
    }
});
