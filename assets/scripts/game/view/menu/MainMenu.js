const buildConfig = require("../../../config/alone/BuildsConfig");

const MenuBase = require("MenuBase");

cc.Class({
    extends: MenuBase,

    properties: {
        cashStr: {
            type: cc.Label,
            default: null
        },

        gemStr: {
            type: cc.Label,
            default: null
        },

        outDoorTip: {
            type: cc.Node,
            default: null
        },

        taskTip: {
            type: cc.Node,
            default: null
        },

        achiveTip: {
            type: cc.Node,
            default: null
        },

        rentalTip: {
            type: cc.Node,
            default: null
        },

        factoryTip: {
            type: cc.Node,
            default: null
        }
    },

    menuEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.CashModify, this.cashModify, this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.GemModify, this.gemModify, this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.DateModify, this.dateModify, this);

        this.dateModify();
        this.gemModify();
        this.cashModify();

        this.scheduleOnce(this.checkSign.bind(this), 5);
        this.schedule(this.checkTips.bind(this), 1);

        cc.Global.sdk.postEvent1("enter_game");

        console.log("jsCallInitRewardedAd 333");

        cc.Global.sdk.initAds();
    },

    menuDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.CashModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.GemModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.DateModify, this);

        this.unschedule(this.checkTips.bind(this), 1);
    },

    cashModify() {
        let cash = Math.floor(this.logic.lord.getRes().cash);
        if (cash > 1000000) {
            this.cashStr.string = cc.Global.mathUtil.formatNumber(cash, 2);
        }
        else {
            this.cashStr.string = cash;
        }
    },

    gemModify() {
        this.gemStr.string = Math.floor(this.logic.lord.getRes().gem);
        let gem = Math.floor(this.logic.lord.getRes().gem);
        if (gem > 1000000) {
            this.gemStr.string = cc.Global.mathUtil.formatNumber(gem, 2);
        }
        else {
            this.gemStr.string = gem;
        }
    },

    dateModify() {
        let date = this.logic.lord.getDate();

        /*
        let seasonArray = ["spring", "summer", "autumn", "winter"];
        let seasonInfo = cc.Global.wordsConfig.season[seasonArray[date.season]];

        let weekArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        let weekInfo = cc.Global.wordsConfig.week[weekArray[date.week]];

        this.yearStr.string = cc.Global.wordsConfig.extra["currentYear"].replace("@", date.year + 1);
        this.weekStr.string = weekInfo;
        this.dayStr.string = seasonInfo + ":" + cc.Global.wordsConfig.extra["currentDay"].replace("@", date.day);
        */
    },

    /**
     * 成就
     * @param {*} event 
     * @param {*} data 
     */
    chenjiuBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("achivePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    /**
     * 收藏
     * @param {*} event 
     * @param {*} data 
     */
    chargeBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: data });
    },

    /**
     * 任务
     * @param {*} event 
     * @param {*} data 
     */
    renwuBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("taskPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    /**
     * 建造
     * @param {*} event 
     * @param {*} data 
     */
    jianzaoBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("buildPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { index: 0 });
    },

    /**
     * 外出
     * @param {*} event 
     * @param {*} data 
     */
    waichuBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("outdoorPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "mineral" });
    },

    /**
     * 日历
     * @param {*} event 
     * @param {*} data 
     */
    signBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("signPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    /**
     * 设置
     * @param {*} event 
     * @param {*} data 
     */
    setBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("setPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    /**
     * 增加金币
     * @param {} event 
     * @param {*} data 
     */
    addCashBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });        
    },

    /**
     * 增加钻石
     * @param {} event 
     * @param {*} data 
     */
    addGemBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
    },

    /**
     * 一键收取租金
     */
    drawRentalBtn(event, data) {
        if (this.logic.rental.getProfit({}) > 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("roomProfitPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { build: "rental", type: "oneClick", index: 0 });
        }
    },

    /**
     * 一键收取租金
    */
    drawFactoryBtn(event, data) {
        let profit = 0, keys = Object.keys(buildConfig.factorys);
        for (let index = 0, len = keys.length; index < len; index++) {
            profit += this.logic[keys[index]].getProfit();
        }

        if (profit > 0) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("roomProfitPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { build: "factory", type: "oneClick", index: 0 });
        }
    },
    
    /**
     * 隐藏或显示界面
     * @param {*} event 
     * @param {*} data 
     * @returns 
     */
    hideMainBtn(event, data) {
        if (this.node.opacity == 255) { this.node.opacity = 0; return; }
        if (this.node.opacity == 0) { this.node.opacity = 255; return; }
    },

    /**
     * 自动弹签到
     * @returns 
     */
    checkSign() {
        if (!this.logic.lord.getGameGuideState()) { return; }

        let state = this.logic.sign.getSignState();
        if (state.indexOf(0) == -1) { return; }

        let pageInfo = cc.Global.pageConfig.findPageInfo("signPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    checkTips() {
        let outDoorTip = this.logic.outdoor.hasGoodsToDraw();
        let taskTip = this.logic.task.hasOneTaskDone().result;
        let achiveTip = this.logic.achive.hasGoodsToDraw();
        let rentalTip = this.logic.rental.hasCashToDraw();

        this.outDoorTip.active = outDoorTip;
        this.taskTip.active = taskTip;
        this.achiveTip.active = achiveTip;
        this.rentalTip.active = rentalTip;

        let profit = 0, keys = Object.keys(buildConfig.factorys);
        for (let index = 0, len = keys.length; index < len; index++) {
            profit += this.logic[keys[index]].getProfit();
        }
        this.factoryTip.active = profit >= 100;
    }
});
