const articsConfig = require("../../../config/alone/ArticsConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        infoStr: {
            type: cc.Label,
            default: null
        }
    },

    pageLoad() {
        this.uiContent = cc.find("Canvas/GameUI").children;
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = {"material-niantu": 1 }
        }

        this.goodsId = Object.keys(this.extraMsg)[0];
    },

    pageDisable() {

    },

    skipBtn(event, data) {
        

        let info = this.goodsId.split("-");
        if (info[0] === "industrial") {
            let pageInfo = cc.Global.pageConfig.findPageInfo("machinePage");
            let industrialType = articsConfig.entityHash[this.goodsId].flag;

            let needLevel = Object.keys(buildsConfig.machineType).indexOf(industrialType);
            if (needLevel <= this.logic.machine.getLevel()) {
                if (this.fromType != "industrial") {
                    this.clearUi();
                }
                cc.Global.assertCenter.openPage(pageInfo, true, null, { industrialType: industrialType });
            }
            else {
                cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                    content: cc.Global.wordsConfig.tips["notBuildAndSkip"],
                    type: "fly"
                });
            }
        }

        if (info[0] === "mineral") {
            this.clearUi();

            let pageInfo = cc.Global.pageConfig.findPageInfo("outdoorPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "mineral" });
        }

        this.close();
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
