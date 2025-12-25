const articsConfig = require("../../../config/alone/ArticsConfig");
const buildsConfig = require("../../../config/alone/BuildsConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        infoStr: {
            type: cc.Label,
            default: null
        },

        sureBtnNode: {
            type: cc.Node,
            default: null
        },

        okBtnNode: {
            type: cc.Node,
            default: null
        },

        noBtnNode: {
            type: cc.Node,
            default: null
        },
    },

    pageLoad() {
        this.uiContent = cc.find("Canvas/GameUI").children;
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { info: "", type: "lord", callBack: null, extra: null }
        }

        this.initPage();
    },

    pageDisable() {

    },

    okBtn(event, data) {
        if (this.extraMsg.type === "lord") {
            this.typeLord();
        }

        if (this.extraMsg.type === "cash") {
            this.typeCash(event);
        }

        if (this.extraMsg.type === "gem") {
            this.typeGem(event);
        }

        if (this.extraMsg.type === "material") {
            this.typeMaterial(event);
        }

        if (this.extraMsg.type === "goods") {
            this.typeGoods();
        }

        if (this.extraMsg.type === "harbour") {
            this.typeHarbour();
        }

        if (this.extraMsg.type === "store") {
            this.typeStore();
        }

        if (this.extraMsg.type === "canteen") {
            this.typeCanteen();
        }

        if (this.extraMsg.type === "ship") {
            this.typeShip();
        }

        if (this.extraMsg.type === "charge") {

        }

        if (this.extraMsg.type === "skipWeb") {
            this.typeSkipTo(event);
        }

        if (this.extraMsg.type === "route") {
            this.typeRoute(event);
        }

        this.close();
    },

    noBtn(event, data) {
        this.close();
    },

    closeEmpt(event, data) {
        this.close(event, data);
    },

    initPage() {
        let info = "";
        if (this.extraMsg.type === "lord") {
            info = cc.Global.wordsConfig.alertTip["lord"];
            info = info.replace("@", this.extraMsg.level + 1)
        }

        if (this.extraMsg.type === "route") {
            info = "需要#级的公路!";
            info = info.replace("#", this.extraMsg.level);
        }

        if (this.extraMsg.type === "cash") {
            let cash = 500 + 100 * this.logic.lord.getLevel();
            info = cc.Global.wordsConfig.alertTip["cash"];
            info = info.replace("#", cash);
        }

        if (this.extraMsg.type === "gem") {
            let gem = 5;
            info = cc.Global.wordsConfig.alertTip["gem"];
            info = info.replace("#", gem);
        }

        if (this.extraMsg.type === "material") {
            info = cc.Global.wordsConfig.alertTip["material"];
            info = info.replace("#", 5);
        }

        if (this.extraMsg.type === "goods") {
            let goodsId = "";
            for (const key in this.extraMsg.extra) {
                let item = {}; item[key] = this.extraMsg.extra[key];
                if (!this.logic.store.canUseItems(item)) {
                    goodsId = key;
                    break;
                }
            }

            let name = articsConfig.entityHash[goodsId].name;
            info = cc.Global.wordsConfig.alertTip["goods"];
            info = info.replace("#", name)
        }

        if (this.extraMsg.type === "harbour") {
            info = cc.Global.wordsConfig.alertTip["harbour"];
        }

        if (this.extraMsg.type === "store") {
            info = cc.Global.wordsConfig.alertTip["store"];
        }

        if (this.extraMsg.type === "canteen") {
            info = cc.Global.wordsConfig.alertTip["canteen"];
            info = info.replace("@",this.extraMsg.level + 1);
        }

        if (this.extraMsg.type === "ship") {
            info = cc.Global.wordsConfig.alertTip["ship"];
        }

        if (this.extraMsg.type === "skipWeb") {
            let gem = 5;
            info = "喜欢我们的游戏,请给个好评吧!\n奖励您5个钻石.";
            info = info.replace("#", gem);
        }

        if (this.extraMsg.type === "charge") {
            this.sureBtnNode.active = true;
            this.okBtnNode.active = false;
            this.noBtnNode.active = false;
        }
        else {
            this.sureBtnNode.active = false;
            this.okBtnNode.active = true;
            this.noBtnNode.active = true;
        }

        this.infoStr.string = info;
    },

    typeGoods() {
        let goodsId = "";
        for (const key in this.extraMsg.extra) {
            let item = {}; item[key] = this.extraMsg.extra[key];
            if (!this.logic.store.canUseItems(item)) {
                goodsId = key;
                break;
            }
        }

        let info = goodsId.split("-");
        if (info[0] === "land") {this.clearUi();}
        if (info[0] === "orchard") {this.clearUi();}
        if (info[0] === "paddy") {this.clearUi();}

        if (info[0] === "aquatic") {
            let index = this.logic.aquatic.getEmptField();
            let fieldInfo = this.logic.aquatic.getFieldInfo(index);

            this.clearUi();

            if (fieldInfo.state >= 0) {
                let pageInfo = cc.Global.pageConfig.findPageInfo("aquaticPage");
                let data = { index: index, fish: goodsId };
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
                if (livestockInfo[index].product !== goodsId) { continue; }

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

            this.clearUi();
            cc.Global.assertCenter.openPage(pageInfo, true, null, sendInfo);
        }

        if (buildsConfig.factorys[info[0]]) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("factoryPage");
            let foodType = articsConfig.entityHash[goodsId].goodsType;

            if (articsConfig.entityHash[goodsId].unlock > this.logic[foodType].getLevel()) {
                cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                    content: cc.Global.wordsConfig.tips["notBuildAndSkip"],
                    type: "fly"
                });
                return;
            }

            this.clearUi();

            cc.Global.assertCenter.openPage(pageInfo, true, null, {
                foodType: foodType,
                foodIndex: this.logic[foodType].getFoodIndex(goodsId)
            });
        }

        if (info[0] === "pick" ||
            info[0] === "hunt" ||
            info[0] === "catch") {
            this.clearUi();

            let pageInfo = cc.Global.pageConfig.findPageInfo("outdoorPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "outdoor" });
        }

        if (info[0] === "mineral") {
            this.clearUi();

            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: "可通过完成订单等任务获得!",
                type: "fly"
            });
        }
    },

    typeLord() {
        this.clearUi();
        let pageInfo = cc.Global.pageConfig.findPageInfo("lordPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    typeHarbour() {
        this.clearUi();

        let harbour = this.logic.harbour.getHarbourInfo();
        if (harbour.level < 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "harbour" });
            return;
        }

        if (harbour.ship.state === 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("harbourPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, null);
        }
        else {
            let pageInfo = cc.Global.pageConfig.findPageInfo("shipPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, null);
        }
    },

    typeMaterial(event) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",45);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",45);
            logic.store.storeItems({ "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 }, 1, startPos);
        });
    },

    typeCash(event) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let logic = this.logic;

        let cash = 500 + 100 * logic.lord.getLevel();
        cc.Global.sdk.postEvent2("ads_start_position",44);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",44);
            logic.lord.addRes({ cash: cash }, 1, startPos);
        });
    },

    typeGem(event) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",43);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",43);
            logic.lord.addRes({ gem: 5 }, 1, startPos);
        });
    },

    typeStore() {
        this.clearUi();

        if ((this.logic.store.getLevel() + 1) >= buildsConfig.store.length) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: cc.Global.wordsConfig.tips["storeMaxLevel"],
                type: "fly"
            });
        }
        else {
            let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, {
                type: "store",
                callback: null
            });
        }
    },

    typeShip() {
        this.close();
        this.extraMsg.callBack();
    },

    typeRoute() {
        this.clearUi();
        let pageInfo = cc.Global.pageConfig.findPageInfo("buildPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { index: 1 });
    },

    typeCanteen() {
        this.clearUi();

        let level = this.logic.canteen.getLevel();
        if (level < 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "canteen" });
        }
        else {
            let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, {
                type: "canteen",
                callback: null
            });
        }
    },

    typeSkipTo(event) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let logic = this.logic;
        logic.lord.addRes({ gem: 5 }, 1, startPos);

        cc.Global.sdk.postReview("https://www.taptap.com/app/236157/review");
    },

    clearUi() {
        for (let index = this.uiContent.length - 1; index >= 0; index--) {
            let pageBase = this.uiContent[index].getComponent("PageBase");
            if (pageBase) {
                pageBase.close();
            }
        }
    },
});
