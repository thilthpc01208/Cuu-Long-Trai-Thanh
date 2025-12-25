const Logic = require('../../logic/logic');

const buildConfig = require("../../../config/alone/BuildsConfig");
const articsConfig = require("../../../config/alone/ArticsConfig");
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        feedDetailPanel: {
            type: cc.Node,
            default: null
        },

        speedDetailPanel: {
            type: cc.Node,
            default: null
        },

        drawDetailPanel: {
            type: cc.Node,
            default: null
        },

        animalPanel: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.animalItems = this.animalPanel.children;
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { index: 0 };
        }

        this.initAnimalPanel();
        this.initCurrentPanel();

        this.schedule(this.updateTime, 1);
    },

    pageDisable() {
        this.unschedule(this.updateTime);
    },

    unLockBtn(event, data) {
        let fieldInfo = this.logic.livestock.getFieldsInfo()[this.extraMsg.index];
        if (fieldInfo.state !== 0) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: cc.Global.wordsConfig.tips["buildUsed"],
                type: "fly"
            });
            return;
        }

        this.logic.livestock.unlockPlace({ index: this.extraMsg.index });
        this.initAnimalPanel();
        this.initFeedPanel();
    },

    feedBtn(event, data) {
        this.logic.livestock.loadFowl({ index: this.extraMsg.index });
        this.initCurrentPanel();
    },

    speedGemBtn(event, data) {
        this.logic.livestock.quickGrow({ index: this.extraMsg.index, adv: false });
        this.initCurrentPanel();
    },

    speedAdvBtn(event, data) {
        let msg = { index: this.extraMsg.index, adv: true };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",4);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",4);

            logic.livestock.quickGrow(msg);
            this.initCurrentPanel();
        }.bind(this));
    },

    normalDrawBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.logic.livestock.collectFowl({ index: this.extraMsg.index, startPos: startPos, adv: false });
        this.initCurrentPanel();
    },

    doubleDrawBtn(event, data) {
        let result = this.logic.livestock.isCanCollect({ index: this.extraMsg.index, adv: true });
        if (!result) {return;}

        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let msg = { index: this.extraMsg.index, startPos: startPos, adv: true };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",16);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",16);

            logic.livestock.collectFowl(msg);
            this.initCurrentPanel();
        }.bind(this));
    },

    initAnimalPanel() {
        let fieldInfo = this.logic.livestock.getFieldsInfo()[this.extraMsg.index];
        let extendPrice = buildConfig.livestock[this.extraMsg.index].extend_price;

        let len = this.animalItems.length;
        for (let index = 0; index < len; index++) {
            let lock = this.animalItems[index].getChildByName("lock");
            if (index < fieldInfo.grid) {
                lock.active = false;

                let animalSprite = this.animalItems[index].getChildByName("icon").getComponent(cc.Sprite);
                let path = "animal/" + articsConfig.entityHash[fieldInfo.animal].id;
                cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                    animalSprite.spriteFrame = spriteFrame;
                }.bind(this));
            }
            else {
                lock.getChildByName("gem").getComponent(cc.Label).string = extendPrice[index];
                lock.active = true;
            }
        }
    },

    initCurrentPanel() {
        this.feedDetailPanel.active = false;
        this.speedDetailPanel.active = false;
        this.drawDetailPanel.active = false;

        let fieldInfo = this.logic.livestock.getFieldsInfo()[this.extraMsg.index];
        if (fieldInfo.state === 0) {
            this.feedDetailPanel.active = true;
            this.initFeedPanel();
        }

        if (fieldInfo.state === 1) {
            this.speedDetailPanel.active = true;
            this.initSpeedPanel();
        }

        if (fieldInfo.state === 2) {
            this.drawDetailPanel.active = true;
            this.initDrawPanel();
        }
    },

    initFeedPanel() {
        let fieldInfo = this.logic.livestock.getFieldsInfo()[this.extraMsg.index];

        let outIcon = this.feedDetailPanel.getChildByName("out")
            .getChildByName("icon").getComponent(cc.Sprite);
        let outNum = this.feedDetailPanel.getChildByName("out")
            .getChildByName("info").getComponent(cc.Label);
        let animalPath = "artics/" + articsConfig.entityHash[fieldInfo.animal].id;
        cc.Global.assertCenter.readLocalSpriteFrame(animalPath, function (err, spriteFrame) {
            outIcon.spriteFrame = spriteFrame;
        }.bind(this));
        outNum.string = "x" + fieldInfo.grid;

        let feedTime = this.feedDetailPanel.getChildByName("feedBtn")
            .getChildByName("time").getComponent(cc.Label);
        feedTime.string = cc.Global.mathUtil.secondFormart(
            articsConfig.entityHash[fieldInfo.animal].harvest_cycle);
    },

    initSpeedPanel() {
        let fieldInfo = this.logic.livestock.getFieldsInfo()[this.extraMsg.index];

        let outIcon = this.speedDetailPanel.getChildByName("out")
            .getChildByName("icon").getComponent(cc.Sprite);
        let outNum = this.speedDetailPanel.getChildByName("out")
            .getChildByName("info").getComponent(cc.Label);
        let outTime = this.speedDetailPanel.getChildByName("out")
            .getChildByName("time").getComponent(cc.Label);
        let path = "artics/" + articsConfig.entityHash[fieldInfo.animal].id;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            outIcon.spriteFrame = spriteFrame;
        }.bind(this));
        outNum.string = "x" + fieldInfo.grid;
        let remain = Math.ceil((fieldInfo.endTime - this.logic.getSysTime()) / 1000);
        outTime.string = cc.Global.mathUtil.secondFormart(remain);

        let gemNum = this.speedDetailPanel.getChildByName("speedGem")
            .getChildByName("num").getComponent(cc.Label);
        gemNum.string = Math.ceil(remain / normalConfig.oneGemCutSecond);
    },

    initDrawPanel() {
        let fieldInfo = this.logic.livestock.getFieldsInfo()[this.extraMsg.index];

        let outIcon = this.drawDetailPanel.getChildByName("out")
            .getChildByName("icon").getComponent(cc.Sprite);
        let outNum = this.drawDetailPanel.getChildByName("out")
            .getChildByName("info").getComponent(cc.Label);

        let path = "animal/" + articsConfig.entityHash[fieldInfo.animal].id;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            outIcon.spriteFrame = spriteFrame;
        }.bind(this));
        outNum.string = "x" + fieldInfo.grid;

        let collectNode = this.drawDetailPanel.getChildByName("collect")
        let useTool = fieldInfo.useTool;
        collectNode.getChildByName("advDraw").active = !useTool;
    },

    updateTime() {
        let fieldInfo = this.logic.livestock.getFieldsInfo()[this.extraMsg.index];
        if (fieldInfo.state !== 1) { return; }

        let outTime = this.speedDetailPanel.getChildByName("out")
            .getChildByName("time").getComponent(cc.Label);
        let remain = Math.ceil((fieldInfo.endTime - this.logic.getSysTime()) / 1000);
        outTime.string = cc.Global.mathUtil.secondFormart(remain);

        let gemNum = this.speedDetailPanel.getChildByName("speedGem")
            .getChildByName("num").getComponent(cc.Label);
        gemNum.string = Math.ceil(remain / normalConfig.oneGemCutSecond);
    }
});
