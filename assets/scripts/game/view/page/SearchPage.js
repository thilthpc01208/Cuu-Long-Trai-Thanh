const articsConfig = require("../../../config/alone/ArticsConfig");
const buildsConfig = require("../../../config/alone/BuildsConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        goodsSprite: {
            type: cc.Sprite,
            default: null
        },

        timeStr: {
            type: cc.Label,
            default: null
        },

        storeStr: {
            type: cc.Label,
            default: null
        },

        desStr: {
            type: cc.Label,
            default: null
        },

        fromStr: {
            type: cc.Label,
            default: null
        }
    },

    pageLoad() {
        this.uiContent = cc.find("Canvas/GameUI");
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { goodsId: "plant-xiaomai", pos: { x: 0, y: 0 }, closeHandle: null, fromType: "" };
        }

        this.goodsId = this.extraMsg.goodsId;
        this.initPanel(this.goodsId);

        let pos = this.extraMsg.pos;
        let back = this.node.getChildByName("back");
        back.x = pos.x;
        back.y = pos.y;

        this.closeHandle = this.extraMsg.closeHandle;
        this.fromType = this.extraMsg.fromType;
    },

    searchBtn(event, data) {
        let info = this.goodsId.split("-");

        if (info[0] === "land") {
            this.closeHandle();
            this.clearUi();
        }

        if (info[0] === "orchard") {
            this.closeHandle();
            this.clearUi();
        }

        if (info[0] === "paddy") {
            this.closeHandle();
            this.clearUi();
        }

        if (info[0] === "aquatic") {
            let index = this.logic.aquatic.getEmptField();
            let fieldInfo = this.logic.aquatic.getFieldInfo(index);

            this.closeHandle();
            this.clearUi();

            if (fieldInfo.state >= 0) {
                let pageInfo = cc.Global.pageConfig.findPageInfo("aquaticPage");
                let data = { index: index, fish: this.goodsId };
                cc.Global.assertCenter.openPage(pageInfo, true, null, data);
            }
            else {
                let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                let data = { type: "aquatic", index: index };
                cc.Global.assertCenter.openPage(pageInfo, true, null, data);
            }        
        }

        if (info[0] === "livestock") {
            let livestockInfo = buildsConfig.livestock;
            let fieldInfo = null;
            let pageInfo = null;
            let sendInfo = null;

            for (let index = 0; index < livestockInfo.length; index++) {
                if (livestockInfo[index].product !== this.goodsId) {continue;}

                fieldInfo = this.logic.livestock.getFieldInfo(index);
                if (fieldInfo.state < 0) {
                    pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                    sendInfo = { type: "livestock", index: index };
                }
                else {
                    pageInfo = cc.Global.pageConfig.findPageInfo("livestockPage");
                    sendInfo = { type: "livestock", index: index };
                }
                break;
            }

            cc.Global.assertCenter.openPage(pageInfo, true, null, sendInfo);
            this.closeHandle();
        }

        if (info[0] === "pick" ||
            info[0] === "hunt" ||
            info[0] === "catch") {
            this.closeHandle();
            this.clearUi();

            let pageInfo = cc.Global.pageConfig.findPageInfo("outdoorPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "outdoor" });
        }

        if (info[0] === "mineral") {
            this.closeHandle();
            this.clearUi();

            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: "可通过完成订单等任务获得!",
                type: "fly"
            });
        }

        if (buildsConfig.factorys[info[0]]) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("factoryPage");
            let foodType = articsConfig.entityHash[this.goodsId].goodsType;

            if (articsConfig.entityHash[this.goodsId].unlock > this.logic[foodType].getLevel()) {
                cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                    content: cc.Global.wordsConfig.tips["notBuildAndSkip"],
                    type: "fly"
                });
                return;
            }

            this.closeHandle();
            this.clearUi();

            cc.Global.assertCenter.openPage(pageInfo, true, null, {
                foodType: foodType,
                foodIndex: this.logic[foodType].getFoodIndex(this.goodsId)
            });
        }

        this.close();
    },

    initPanel(goodsId) {
        let goodsInfo = articsConfig.entityHash[goodsId];

        let alias = goodsInfo.id;
        let path = "artics/" + alias;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            this.goodsSprite.spriteFrame = spriteFrame;
        }.bind(this));

        if (goodsInfo.harvest_cycle) {
            let time = cc.Global.mathUtil.secondFormart(goodsInfo.harvest_cycle);
            this.timeStr.string = time;
        }
        else {
            this.timeStr.string = cc.Global.wordsConfig.extra["noTime"];
        }

        this.desStr.string = goodsInfo.name;
        this.fromStr.string = "";
        this.storeStr.string = this.logic.store.getItemNum(goodsId);
    },

    clearUi() {
        for (let index = this.uiContent.length - 1; index >= 0; index--) {
            let pageBase = this.uiContent[index].getComponent("PageBase");
            if (pageBase) {
                pageBase.close();
            }
        }
    }
});
