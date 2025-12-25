const articsConfig = require("../../../../config/alone/ArticsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const buildsConfig = require('../../../../config/alone/BuildsConfig');
const taskConfig = require("../../../../config/alone/TaskConfig");

const Logic = require("../../../logic/logic");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.gameSky = cc.find("Canvas/GameSky");
        this.logic = Logic.getInstance();

        this.isFristInit = true;
        let map = {};
        for (let index = 0; index < taskConfig.brunchTask.length; index++) {
            map[taskConfig.brunchTask[index].code] = 1;
        }
    },

    onEnable() {
        if (!this.isFristInit) { return; }

        this.initPage();
        this.isFristInit = false;
    },

    normalGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.logic.task.getBrunchTaskAward({ adv: false, startPos: startPos });

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    advGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let msg = { adv: true, startPos: startPos };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",31);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",31);

            logic.task.getBrunchTaskAward(msg);
        }.bind(this));
    },

    normalReplace(event, data) {
        this.logic.task.replaceBrunchTask({ adv: false });
    },

    advReplace(event, data) {
        cc.Global.sdk.postEvent2("ads_start_position",12);

        let logic = this.logic;
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",12);

            logic.task.replaceBrunchTask({ adv: true });
            this.initPage();
        }.bind(this));
    },

    initPage() {
        let brunchTask = this.logic.task.getBrunchTaskInfo();
        if (brunchTask.current > brunchTask.target) {
            brunchTask.current = brunchTask.target;
        }

        this.node.getChildByName("rate_value").getComponent(cc.Label).string = brunchTask.current + "/" + brunchTask.target;
        this.node.getChildByName("info").getComponent(cc.Label).string = brunchTask.descript;

        let replace = this.node.getChildByName("replace");
        let done = this.node.getChildByName("done");

        replace.active = false;
        done.active = false;

        let path = "icon/task/brunchTask/" + brunchTask.code;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            this.node.getChildByName("back").getChildByName("icon").getComponent(cc.Sprite)
                .spriteFrame = spriteFrame;
        }.bind(this));

        if (!brunchTask.done) {
            replace.active = true;
            replace.getChildByName("normal").getChildByName("num").getComponent(cc.Label).string = normalConfig.replaceBrunchTaskGem;
        }

        if (brunchTask.done && !brunchTask.draw) {
            done.active = true;
        }

        let award = brunchTask.award;
        let awardMap = { cash: award.cash, gem: award.gem };
        for (const key in award.material) {
            awardMap[key] = award.material[key];
        }
        let awardArr = Object.keys(awardMap);

        let list = this.node.getChildByName("award").children;
        let len = list.length;
        for (let index = 0; index < len; index++) {
            let item = list[index];
            let key = awardArr[index];

            item.getChildByName("info").getComponent(cc.Label).string = "x" + awardMap[key];

            let path = "";
            if (key === "cash" || key === "gem") {
                path = "artics/" + key;
            }
            else {
                path = "artics/" + articsConfig.entityHash[key].id;
            }
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite)
                    .spriteFrame = spriteFrame;
            });
        }
    },

    skipBtn(event, data) {
        let brunchTask = this.logic.task.getBrunchTaskInfo();
        switch (brunchTask.code) {
            //无法跳转
            case 'BT_LandOnePlantCount':
                {
                }
                break;
            case 'BT_OrchardOnePlantCount':
                {
                }
                break;
            case 'BT_PaddyOnePlantCount':
                {
                }
                break;

            case 'BT_LivestockOneAniCount':
                {
                    let livestockInfo = buildsConfig.livestock;
                    let fieldInfo = null;
                    let pageInfo = null;
                    let sendInfo = null;

                    for (let index = 0; index < livestockInfo.length; index++) {
                        if (livestockInfo[index].product !== brunchTask.goods) {
                            continue;
                        }

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
                }
                break;
            case 'BT_AquaticOneAniCount':
                {
                    let index = this.logic.aquatic.getEmptField();
                    let fieldInfo = this.logic.aquatic.getFieldInfo(index);
                    if (fieldInfo.state >= 0) {
                        let pageInfo = cc.Global.pageConfig.findPageInfo("aquaticPage");
                        let data = { index: index, fish: brunchTask.goods };
                        cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                    }
                    else {
                        let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                        let data = { type: "aquatic", index: index };
                        cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                    }
                }
                break;
            case 'BT_FactoryOneFoodCount':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("factoryPage");
                    let foodType = articsConfig.entityHash[brunchTask.goods].goodsType;

                    if (articsConfig.entityHash[brunchTask.goods].unlock > this.logic[foodType].getLevel()) {
                        cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                            content: cc.Global.wordsConfig.tips["notBuildAndSkip"],
                            type: "fly"
                        });
                        return;
                    }

                    cc.Global.assertCenter.openPage(pageInfo, true, null, {
                        foodType: foodType,
                        foodIndex: this.logic[foodType].getFoodIndex(brunchTask.goods)
                    });
                }
                break;

            //顾客数量型(无法跳转)
            case 'BT_StallCustomerCount':
                {
                }
                break;
            case 'BT_CanteenCustomerCount':
                {
                }
                break;
            case 'BT_HotelCustomerCount':
                {
                }
                break;
            case 'BT_FactoryCustomerCount':
                {
                }
                break;
            case 'BT_FactoryGetProfitCount':
                {
                }
                break;
            case 'BT_RentGetProfitCount':
                {
                }
                break;
            //外出型
            case 'BT_HuntCount':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("outdoorPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "outdoor" });
                }
                break;
            case 'BT_PickCount':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("outdoorPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "outdoor" });
                }
                break;
            case 'BT_CatchCount':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("outdoorPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "outdoor" });
                }
                break;
            //运输数量型
            case 'BT_DepotDeliverCount':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("depotPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, null);
                }
                break;
            case 'BT_HarbourDeliverCount':
                {
                    let harbourInfo = this.logic.harbour.getHarbourInfo();
                    if (harbourInfo.ship.state === 0) {
                        let pageInfo = cc.Global.pageConfig.findPageInfo("harbourPage");
                        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
                    }
                    else {
                        let pageInfo = cc.Global.pageConfig.findPageInfo("signPage");
                        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
                    }
                }
                break;
            default:
                break;
        }

        this.node.parent.getComponent("TaskPage").close();
    }
});
