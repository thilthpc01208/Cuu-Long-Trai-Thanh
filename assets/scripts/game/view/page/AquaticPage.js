const buildConfig = require("../../../config/alone/BuildsConfig");
const articsConfig = require("../../../config/alone/ArticsConfig");
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        levelFrame: {
            type: cc.Node,
            default: null
        },

        detailFrame: {
            type: cc.Node,
            default: null
        },

        fishContent: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.fishList = this.fishContent.children;
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { index: 0, fish: "aquatic-liyu" };
        }

        this.selectFish = this.extraMsg.fish;

        this.initFishList();
        this.initCurrentPanel();

        this.schedule(this.updateTime, 1);
    },

    pageDisable() {
        this.unschedule(this.updateTime, 1);
    },

    updateBtn(event, data) {
        let fieldInfo = this.logic.aquatic.getFieldInfo(this.extraMsg.index);
        if (fieldInfo.state !== 0) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: cc.Global.wordsConfig.tips["buildUsed"],
                type: "fly"
            });
            return false;
        }

        this.logic.aquatic.unlockPlace({ index: this.extraMsg.index });
        this.initCurrentPanel();
    },

    feedBtn(event, data) {
        let fishName = event.target.fishName;
        this.logic.aquatic.loadFish({ index: this.extraMsg.index, aquatic: fishName });
        this.initCurrentPanel();
    },

    gemSpeedUp(event, data) {
        this.logic.aquatic.quickGrow({ index: this.extraMsg.index, adv: false });
        this.initCurrentPanel();
    },

    advSpeedUp(event, data) {
        let msg = { index: this.extraMsg.index, adv: true };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",5);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",5);
            logic.aquatic.quickGrow(msg);
            this.initCurrentPanel();
        }.bind(this));
    },

    normalCollect(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.logic.aquatic.collectFish({ index: this.extraMsg.index, startPos: startPos, adv: false });
        this.initCurrentPanel();
    },

    advCollect(event, data) {
        let result = this.logic.aquatic.isCanCollect({ index: this.extraMsg.index, adv: true });
        if (!result) { return; }

        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let logic = this.logic;
        let msg = { index: this.extraMsg.index, startPos: startPos, adv: true };

        cc.Global.sdk.postEvent2("ads_start_position",17);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",17);
            logic.aquatic.collectFish(msg);
            this.initCurrentPanel();
        }.bind(this));
    },

    selectBtn(event, data) {
        let fieldInfo = this.logic.aquatic.getFieldInfo(this.extraMsg.index);
        if (fieldInfo.state !== 0) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: cc.Global.wordsConfig.tips["buildUsed"],
                type: "fly"
            });
            return false;
        }

        this.selectFish = event.target.fishName;
        this.initDetailPanel();
    },

    initCurrentPanel() {
        this.initDetailPanel();
        this.initLevelPanel();
    },

    initLevelPanel() {
        let fieldInfo = this.logic.aquatic.getFieldInfo(this.extraMsg.index);
        let info = this.levelFrame.getChildByName("info").getComponent(cc.Label);
        let updateBtn = this.levelFrame.getChildByName("upBtn");

        if (fieldInfo.grid >= 4) {
            updateBtn.active = false;
            info.string = cc.Global.wordsConfig.extra["maxLevel"];
        }
        else {
            updateBtn.active = true;
            info.string = cc.Global.wordsConfig.extra["nextLevel"]; + (fieldInfo.grid + 1);

            let gemNum = updateBtn.getChildByName("num").getComponent(cc.Label);
            let needGem = buildConfig.aquatic[this.extraMsg.index].extend_price[fieldInfo.grid];
            gemNum.string = needGem;
        }
    },

    initDetailPanel() {
        let fieldInfo = this.logic.aquatic.getFieldInfo(this.extraMsg.index);

        let icon = this.detailFrame.getChildByName("icon").getComponent(cc.Sprite);
        let name = this.detailFrame.getChildByName("name").getComponent(cc.Label);
        let info = this.detailFrame.getChildByName("info").getComponent(cc.Label);
        let time = this.detailFrame.getChildByName("time").getComponent(cc.Label);
        let num = this.detailFrame.getChildByName("num").getComponent(cc.Label);

        let fishName = fieldInfo.aquatic;
        if (!fishName || fishName === "") {
            fishName = this.selectFish;
        }

        let path = "artics/" + articsConfig.entityHash[fishName].id;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            icon.spriteFrame = spriteFrame;
        }.bind(this));

        name.string = articsConfig.entityHash[fishName].name;
        info.string = articsConfig.entityHash[fishName].descript;
        num.string = fieldInfo.grid;

        let collectNode = this.detailFrame.getChildByName("collect");
        let feedBtn = this.detailFrame.getChildByName("feedBtn");
        let speedNode = this.detailFrame.getChildByName("addSpeed");
        collectNode.active = false;
        feedBtn.active = false;
        speedNode.active = false;

        if (fieldInfo.state === 0) {
            let needTime = articsConfig.entityHash[fishName].harvest_cycle;
            time.string = cc.Global.mathUtil.secondFormart(needTime);
            feedBtn.active = true;
            feedBtn.fishName = fishName;
        }

        if (fieldInfo.state === 1) {
            let remainTime = Math.ceil((fieldInfo.endTime - this.logic.getSysTime()) / 1000);
            let needGem = Math.ceil(remainTime / normalConfig.oneGemCutSecond);
            let gemNum = speedNode.getChildByName("speedGem").
                getChildByName("num").getComponent(cc.Label);
            gemNum.string = needGem;
            time.string = cc.Global.mathUtil.secondFormart(remainTime);
            speedNode.active = true;
        }

        if (fieldInfo.state === 2) {
            time.string = "00:00";
            collectNode.active = true;

            let useTool = fieldInfo.useTool;
            collectNode.getChildByName("doubleCollect").active = !useTool;
        }
    },

    initFishList() {
        let fishs = Object.keys(articsConfig.aquatic);

        let len = fishs.length;
        for (let index = 0; index < len; index++) {
            let name = fishs[index];

            let icon = this.fishList[index].getChildByName("icon").getComponent(cc.Sprite);
            let path = "artics/" + articsConfig.entityHash[name].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                icon.spriteFrame = spriteFrame;
            }.bind(this));
            icon.node.parent.fishName = name;
        }
    },

    updateTime() {
        let fieldInfo = this.logic.aquatic.getFieldInfo(this.extraMsg.index);
        if (fieldInfo.state !== 1) { return; }

        let time = this.detailFrame.getChildByName("time").getComponent(cc.Label);
        let speedNode = this.detailFrame.getChildByName("addSpeed");
        let remainTime = Math.ceil((fieldInfo.endTime - this.logic.getSysTime()) / 1000);
        let needGem = Math.ceil(remainTime / normalConfig.oneGemCutSecond);
        let gemNum = speedNode.getChildByName("speedGem").
            getChildByName("num").getComponent(cc.Label);
        gemNum.string = needGem;
        time.string = cc.Global.mathUtil.secondFormart(remainTime);
    },
});
