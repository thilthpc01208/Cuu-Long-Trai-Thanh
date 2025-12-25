const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const taskConfig = require("../../../../config/alone/TaskConfig");
const Logic = require('../../../logic/logic');

cc.Class({
    extends: cc.Component,

    properties: {
        infoNode: {
            type: cc.Node,
            default: null
        },

        awardNode: {
            type: cc.Node,
            default: null
        },
    },

    onLoad() {
        this.gameSky = cc.find("Canvas/GameSky");
        this.logic = Logic.getInstance();

        this.isFristInit = true;
    },

    onEnable() {
        if (!this.isFristInit) { return; }

        this.initPage();
        this.isFristInit = false;
    },

    normalGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.logic.task.getMainTaskAward({ adv: false, startPos: startPos });
    },

    advGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position", 32);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position", 32);

            logic.task.getMainTaskAward({ adv: true, startPos: startPos });
        }.bind(this));
    },

    initPage() {
        let mainTask = this.logic.task.getMainTaskInfo();
        this.infoNode.getComponent(cc.Label).string = mainTask.descript;

        let award = mainTask.award;
        let awardMap = { cash: award.cash, gem: award.gem };
        for (const key in award.material) {
            awardMap[key] = award.material[key];
        }
        let awardArr = Object.keys(awardMap);

        let list = this.awardNode.children;
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

        if (mainTask.done && !mainTask.draw) {
            this.node.getChildByName("done").active = true;
            this.node.getChildByName("skip").active = false;
        }
        else {
            this.node.getChildByName("done").active = false;
            this.node.getChildByName("skip").active = true;
        }

        this.setIcon(taskConfig.mainTask[mainTask.index]);
        if ((mainTask.index >= taskConfig.mainTask.length - 1) && mainTask.done && mainTask.draw) {
            this.node.getChildByName("end").active = true;
        }
        else {
            this.node.getChildByName("end").active = false;
        }
    },

    setIcon(taskInfo) {
        let path = "icon/task/mainTask/" + taskInfo.build;
        switch (taskInfo.build) {
            case 'land':
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case 'lord':
                {
                    path = "icon/lord/" + Math.floor((taskInfo.target) / 3);
                }
                break;
            case 'factory':
                {
                    path = "icon/factory/" + Math.floor(((taskInfo.target + 1) / 3));
                }
                break;
            case 'livestock':
                {
                    path = "icon/livestock/" + taskInfo.target + "/0";
                }
                break;
            case 'orchard':
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case 'harbour':
                {
                    path = "icon/harbour/" + Math.floor(((taskInfo.target + 1) / 2));
                }
                break;
            case 'aquatic':
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case 'paddy':
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case 'hotel':
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case "route":
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case "store":
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case "floor":
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            case "canteen":
                {
                    path = "icon/task/mainTask/" + taskInfo.build;
                }
                break;
            default:
                break;
        }

        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            this.node.getChildByName("back").getChildByName("icon").getComponent(cc.Sprite)
                .spriteFrame = spriteFrame;
        }.bind(this));
    },

    skipBtn(event, data) {
        let mainTask = this.logic.task.getMainTaskInfo();
        let taskInfo = taskConfig.mainTask[mainTask.index];

        switch (taskInfo.build) {
            case 'land':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                    let data = { type: "land", index: this.logic.land.getFieldNum() };
                    cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                }
                break;
            case 'lord':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("lordPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, null);
                }
                break;
            case 'factory':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
                    let data = { type: Object.keys(buildConfig.factorys)[taskInfo.target] };
                    cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                }
                break;
            case 'livestock':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "livestock", index: taskInfo.target });
                }
                break;
            case 'orchard':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                    let data = { type: "orchard", index: this.logic.orchard.getFieldNum() };
                    cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                }
                break;
            case 'route':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("buildPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, { index: 1 });
                }
                break;
            case 'harbour':
                {
                    let harbourInfo = this.logic.harbour.getHarbourInfo();
                    if (harbourInfo.level < 0) {
                        let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
                        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "harbour" });
                        return;
                    }
                    else {
                        let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
                        cc.Global.assertCenter.openPage(pageInfo, true, null, {
                            type: "harbour",
                            callback: null
                        });
                    }
                }
                break;
            case 'aquatic':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                    let data = { type: "aquatic", index: taskInfo.target };
                    cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                }
                break;
            case 'paddy':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                    let data = { type: "paddy", index: this.logic.paddy.getFieldNum() };
                    cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                }
                break;
            case 'store':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, {
                        type: "store",
                        callback: null
                    });
                }
                break;
            case 'canteen':
                {
                    let canteenLevel = this.logic.canteen.getLevel();
                    if (canteenLevel < 0) {
                        let pageInfo = cc.Global.pageConfig.findPageInfo("createBuildPage");
                        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "canteen" });
                        return;
                    }

                    let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, {
                        type: "canteen",
                        callback: null
                    });
                }
                break;
            case 'hotel':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("buildPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, { index: 1 });
                }
                break;
            case 'floor':
                {
                    let pageInfo = cc.Global.pageConfig.findPageInfo("buildPage");
                    cc.Global.assertCenter.openPage(pageInfo, true, null, { index: 0 });
                }
                break;
            default:
                break;
        }
    }
});
