const normalConfig = require("../../../config/alone/NormConfig");
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        content: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.next = null;
    },

    pageEnable() {
        this.initPage();

        cc.Global.listenCenter.register(cc.Global.eventConfig.AchiveModify, this.initPage.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.ChangeLanguage, this.initPage.bind(this), this);
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.AchiveModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.ChangeLanguage, this);
    },

    update() {
        if (!this.isAlive) { return; }
        if (this.next != null) {
            let result = this.next();
            if (!result) {
                this.next = null;
            }
        }
    },

    normalGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = {
            code: event.target.parent.achiveCode,
            adv: false,
            startPos: startPos
        };
        this.logic.achive.drawAward(temp);
    },

    advGet(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = {
            code: event.target.parent.achiveCode,
            adv: true,
            startPos: startPos
        };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",30);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",30);
            logic.achive.drawAward(temp);
        });
    },

    initPage() {
        this.next = null;

        let achiveInfo = this.logic.achive.getAchiveInfo();

        this.list = this.content.children;
        let len = achiveInfo.length;

        let index = 0;
        let next = function () {
            let info = achiveInfo[index];

            if (info.code == "AT_TrainDeliverCount") {
                index++;
                return index < len ? true : false;
            }

            let item = null;
            if (index > (this.list.length - 1)) {
                item = cc.instantiate(this.list[0]);
            }
            else {
                item = this.list[index];
            }

            item.parent = this.content;
            item.achiveCode = info.code;
            this.setItem(item, info);

            index++;
            if (index < len) { return true; }
            else { return false; }
        }.bind(this);

        this.next = next;
    },

    setItem(item, info) {
        item.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = info.percent;
        item.getChildByName("progressBar").getChildByName("info").getComponent(cc.Label).
            string = Math.floor(info.percent * 100) + "%";
        item.getChildByName("info").getComponent(cc.Label).string = info.descript.replace("#", info.target);

        let award = item.getChildByName("award");
        let normal = item.getChildByName("normalGet");
        let adv = item.getChildByName("advGet");
        let drawed = item.getChildByName("drawed");

        award.active = false;
        normal.active = false;
        adv.active = false;
        drawed.active = false;

        if (info.done === false) {
            award.active = true;
            award.getChildByName("num").getComponent(cc.Label).string = info.award;
        }

        if (info.done == true &&
            info.draw == false) {
            normal.active = true;
            adv.active = true;

            normal.getChildByName("num").getComponent(cc.Label).string = info.award;
            adv.getChildByName("num").getComponent(cc.Label).string = info.award * normalConfig.rewardVideoScale;
        }

        if (info.done == true &&
            info.draw == true) {
            drawed.active = true;
        }

        let path = "icon/achive/" + info.code;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            item.getChildByName("back").getChildByName("icon").getComponent(cc.Sprite)
                .spriteFrame = spriteFrame;
        });
    }
});
