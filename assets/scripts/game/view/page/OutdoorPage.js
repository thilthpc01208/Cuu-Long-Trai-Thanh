const buildConfig = require('../../../config/alone/BuildsConfig');
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        outdoorPanel: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.outdoorList = this.outdoorPanel.children;
        this.outdoorNext = null;
    },

    pageEnable() {
        this.schedule(this.updateTime.bind(this), 1);

        cc.Global.listenCenter.register(cc.Global.eventConfig.LordModify, this.updateLord.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.OutDoorModify, this.updateLord.bind(this), this);
    },

    pageDisable() {
        this.unschedule(this.updateTime.bind(this));

        cc.Global.listenCenter.remove(cc.Global.eventConfig.LordModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.OutDoorModify, this);
    },

    openPage() {
        this.initOutdoorPanel(true);
    },

    update() {
        if (this.isAlive && this.outdoorNext != null) {
            let outdoorResult = this.outdoorNext();
            if (!outdoorResult) { this.outdoorNext = null; }
        }
    },

    startOutdoorBtn(event, data) {
        this.logic.outdoor.requestOutdoor({ index: event.target.activeIndex });
    },

    gemQuickOutdoorBtn(event, data) {
        this.logic.outdoor.quickOutdoor({ index: event.target.activeIndex, adv: false });
    },

    advQuickOutdoorBtn(event, data) {
        let msg = { index: event.target.activeIndex, adv: true };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",8);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",8);

            logic.outdoor.quickOutdoor(msg);
        }.bind(this));
    },

    collectOutdoorBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);

        let temp = {
            type: "outdoor",
            index: event.target.activeIndex,
            startPos: startPos,
            callback: null,
        };
        let pageInfo = cc.Global.pageConfig.findPageInfo("outRewardPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, temp);
    },

    initOutdoorPanel() {
        this.outdoorPanel.scaleX = 1;
        this.outdoorPanel.scaleY = 1;
        this.outdoorPanel.opacity = 255;

        let outdoor = this.logic.outdoor.getOutdoorInfo();
        let len = this.outdoorList.length;

        let index = 0;
        let outdoorNext = function () {
            let item = this.outdoorList[index];
            let info = outdoor[index];
            this.setOutdoorItem(item, info, index);

            index++;
            if (index < len) { return true; }
            else { return false; }
        }.bind(this);

        this.outdoorNext = outdoorNext;
    },

    setOutdoorItem(item, info, activeIndex) {
        let typeIcon = item.getChildByName("type").getChildByName("icon").getComponent(cc.Sprite);
        let nameStr = item.getChildByName("name").getComponent(cc.Label);
        let takeList = item.getChildByName("take").children;

        let path = "icon/outdoor/" + info.type;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            typeIcon.spriteFrame = spriteFrame;
        });
        nameStr.string = cc.Global.wordsConfig.outdoor[buildConfig.outdoor[info.type].name];

        this.setOutdoorState(item, info, activeIndex);

        let takeGoods = this.logic.outdoor.getTakeGoods(info.type);
        let len = takeGoods.length;
        for (let index = 0; index < len; index++) {
            if (index >= takeList.length) { break; }
            let path = "artics/" + takeGoods[index];
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                takeList[index].getChildByName("icon").getComponent(cc.Sprite)
                    .spriteFrame = spriteFrame;
            });
        }

        if (takeList.length <= len) { return; }
        for (let index = len; index < takeList.length; index++) {
            takeList[index].active = false;
        }
    },

    setOutdoorState(item, info, activeIndex) {
        let startBtn = item.getChildByName("start");
        let gemQuickBtn = item.getChildByName("gemQuick");
        let advQuickBtn = item.getChildByName("advQuick");
        let collectBtn = item.getChildByName("collect");

        startBtn.activeIndex = activeIndex;
        gemQuickBtn.activeIndex = activeIndex;
        advQuickBtn.activeIndex = activeIndex;
        collectBtn.activeIndex = activeIndex;

        startBtn.active = false;
        gemQuickBtn.active = false;
        advQuickBtn.active = false;
        collectBtn.active = false;

        let isOpen = this.logic.outdoor.activeIsOpen(info);
        if (info.state === 0 && isOpen) {
            startBtn.getChildByName("time").getComponent(cc.Label).string =
                cc.Global.mathUtil.secondFormart(this.logic.outdoor.getOutdoorTime({ index: activeIndex }));
            startBtn.active = true;
        }

        if (info.state === 1 && isOpen) {
            gemQuickBtn.active = true;
            advQuickBtn.active = true;
        }

        if (info.state === 2 && isOpen) {
            collectBtn.active = true;
        }

        let levelInfo = item.getChildByName("level").getChildByName("info").getComponent(cc.Label);
        if (isOpen && levelInfo.node.parent.active === true) {
            levelInfo.node.parent.active = false;
        }
        else if (!isOpen && levelInfo.node.parent.active === false) {
            levelInfo.node.parent.active = true;
            let needLevel = buildConfig.outdoor[info.type].unlock + 1;
            levelInfo.string = cc.Global.wordsConfig.extra["unlockLevel"] + needLevel;
        }
    },

    updateTime() {
        this.updateOutdoor();
        let adverState = this.logic.outdoor.hasGoodsToDraw();
        if (adverState) {
            this.initOutdoorPanel(true);
        }
    },

    updateOutdoor() {
        let outdoor = this.logic.outdoor.getOutdoorInfo();
        let len = this.outdoorList.length;
        for (let index = 0; index < len; index++) {
            let item = this.outdoorList[index];
            let info = outdoor[index];

            let timeStr = item.getChildByName("time").getComponent(cc.Label);
            timeStr.string = "";

            let gemQuickBtn = item.getChildByName("gemQuick");
            if (info.state === 1) {
                let remain = Math.ceil((info.endTime - this.logic.getSysTime()) / 1000);
                timeStr.string = cc.Global.mathUtil.secondFormart(remain);

                let gem = Math.ceil(remain / normalConfig.oneGemCutSecond);
                gemQuickBtn.getChildByName("num").getComponent(cc.Label).string = gem;
            }
        }
    },

    updateLord() {
        let outdoor = this.logic.outdoor.getOutdoorInfo();
        let len = this.outdoorList.length;
        for (let index = 0; index < len; index++) {
            let item = this.outdoorList[index];
            let info = outdoor[index];
            this.setOutdoorState(item, info, index);
        }
    }
});
