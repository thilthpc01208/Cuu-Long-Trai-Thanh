const normalConfig = require("../../../config/alone/NormConfig");
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        timeStr: {
            type: cc.Label,
            default: null
        },

        gemStr: {
            type: cc.Label,
            default: null
        }
    },

    pageEnable() {
        this.schedule(this.updateTime, 1);
        this.initPanel();
    },

    pageDisable() {
        this.unschedule(this.updateTime);
    },

    gemBackBtn(event, data) {        
        this.logic.harbour.shipQuickBack();
        this.close();
    },

    advBackBtn(event, data) {
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",7);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",7);
            logic.harbour.shipQuickBack();
            this.close();
        }.bind(this));
    },

    initPanel() {
        let shipInfo = this.logic.harbour.getHarbourInfo().ship;
        let currentTime = this.logic.getSysTime();

        let time = (shipInfo.endTime - currentTime) / 1000;
        if (time < 0) {
            time = 0
        }

        time = Math.ceil(time);
        this.timeStr.string = cc.Global.mathUtil.secondFormart(time);

        let gem = Math.ceil(time / normalConfig.oneGemCutSecond);
        this.gemStr.string = gem;
    },

    updateTime() {
        let shipInfo = this.logic.harbour.getHarbourInfo().ship;
        let currentTime = this.logic.getSysTime();

        let time = (shipInfo.endTime - currentTime) / 1000;
        time = Math.ceil(time);
        this.timeStr.string = cc.Global.mathUtil.secondFormart(time);

        let gem = Math.ceil(time / normalConfig.oneGemCutSecond);
        this.gemStr.string = gem;

        if (time <= 0) {
            this.close();
        }
    }
});
