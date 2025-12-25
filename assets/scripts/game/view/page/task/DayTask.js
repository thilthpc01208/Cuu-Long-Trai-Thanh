const articsConfig = require("../../../../config/alone/ArticsConfig");
const taskConfig = require("../../../../config/alone/TaskConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const Logic = require('../../../logic/logic');

cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: {
            type: cc.Node,
            default: null
        },

        bigAwardNode: {
            type: cc.Node,
            default: null
        },
    },

    onLoad() {
        this.gameSky = cc.find("Canvas/GameSky");
        this.logic = Logic.getInstance();

        this.isFristInit = true;
        this.next = null;
    },

    onEnable() {
        if (!this.isFristInit) {return;}

        this.taskList = this.contentNode.children;
        this.initPage();
        this.initBigAwardPanel();
        this.isFristInit = false;
    },

    onDisable() {

    },

    update() {
        if (this.next != null) {
            let result = this.next();
            if (!result) {
                this.next = null;
            }
        }
    },

    immatureDone(event, data) {
        let temp = { code: event.target.parent.parent.taskCode };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",33);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",33);

            logic.task.immatureDayTask(temp);
        }.bind(this));
    },

    normalTaskGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = { code: event.target.parent.parent.taskCode, adv: false, startPos: startPos };
        this.logic.task.getDayTaskAward(temp);
    },

    advTaskGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = { code: event.target.parent.parent.taskCode, adv: true, startPos: startPos };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",34);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",34);

            logic.task.getDayTaskAward(temp);
        }.bind(this));
    },

    bigAwardGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.logic.task.getBigAward({ adv: false, startPos: startPos });
        this.initBigAwardPanel();
    },

    initPage() {
        this.next = null;

        let infos = this.logic.task.getDayTaskInfo();
        let len = infos.length;

        if (infos.length < this.taskList.length) {
            let len2 = this.taskList.length;
            for (let index = infos.length; index < len2; index++) {
                this.taskList[index].active = false;
            }
        }

        let index = 0;
        let next = function () {
            let item = null;
            let info = infos[index];

            if (index <= this.taskList.length - 1) {
                item = this.taskList[index];
            }
            else {
                item = cc.instantiate(this.taskList[0]);
            }
            item.parent = this.contentNode;
            item.active = true;
            item.taskCode = info.code;
            this.setTaskItem(item, info);

            index++;
            if (index < len) {
                return true;
            }
            else {
                return false;
            }
        }.bind(this);

        this.next = next;
    },

    setTaskItem(item, info) {
        if (info.current > info.target) {
            info.current = info.target;
        }

        item.getChildByName("rate").getComponent(cc.Label).string = info.current + "/" + info.target;
        item.getChildByName("info").getComponent(cc.Label).string = info.descript;// cc.Global.wordsConfig.dailyTask[info.code];

        let immature = item.getChildByName("immature");
        immature.active = true;
        immature.getChildByName("bar").getChildByName("num").getComponent(cc.Label).string = info.award.gem;
        immature.getChildByName("done").active = false;

        if (!info.done) {
            immature.getChildByName("done").active = info.advDone;
        }

        let drawed = item.getChildByName("drawed");
        let done = item.getChildByName("done");
        drawed.active = false;
        done.active = false;

        if (info.done && !info.draw) {
            done.active = true;
            immature.active = false;

            done.getChildByName("normal").getChildByName("num").getComponent(cc.Label).string = info.award.gem;
            done.getChildByName("adv").getChildByName("num").getComponent(cc.Label).string = info.award.gem * normalConfig.rewardVideoScale;
        }

        if (info.done && info.draw) {
            immature.active = false;
            drawed.active = true;
        }

        let path = "icon/task/dailyTask/" + info.code;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            item.getChildByName("frame").getChildByName("icon").getComponent(cc.Sprite)
                .spriteFrame = spriteFrame;
        });
    },

    initBigAwardPanel() {
        let state = this.logic.task.getBigAwardInfo();

        let awardNode = this.bigAwardNode.getChildByName("award");
        let doneNode = this.bigAwardNode.getChildByName("done");
        let infoNode = this.bigAwardNode.getChildByName("info");
        if (state.dayBigAwardState && state.dayBigAwardDraw) {
            awardNode.active = false;
            doneNode.active = false;
            infoNode.active = true;
            return;
        }
        else {
            awardNode.active = true;
            doneNode.active = true;
            infoNode.active = false;
        }

        let bigAward = taskConfig.bigAward;
        let awardMap = {/* cash: bigAward.cash,*/ gem: bigAward.gem };
        for (const key in bigAward.material) {
            awardMap[key] = bigAward.material[key];
        }
        let awardArr = Object.keys(awardMap);

        let list = awardNode.children;
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
    }
});
