const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new OutDoor(userInfo, logic);
}

/**
 * 户外活动
 * @constructor
 */
function OutDoor(userInfo, logic) {
    this.name = "outdoor";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = OutDoor.prototype;

handler.init = function (data) {
    //冒险未归导致的操作状态改变
    this.setOutdoorState(false);
};

handler.update = function (dt) {
    this.updateWorker();
};

/**
 * 请求冒险
 */
handler.requestOutdoor = function (data) {
    let index = data.index;

    if (!this.canOutdoor(this.userInfo.outdoor)) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["beBusy"]);
        return;
    }

    let activeInfo = this.userInfo.outdoor[index];
    if (activeInfo.state !== 0) {
        /**
         * 0: 未出发
         * 1: 已出发
         * 2: 回来但未取东西
         */
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntDepart"]);
        return;
    }

    let activeConfig = buildConfig.outdoor[activeInfo.type];
    if (activeConfig.unlock > this.userInfo.lord.level) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: activeConfig.unlock });
        return;
    }

    if (this.outdoorState) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["notReady"]);
        return;
    }

    let needTime = buildConfig.outdoor[activeInfo.type].transport_time;
    activeInfo.endTime = this.logic.getSysTime() + needTime * 1000;
    activeInfo.state = 1;
    userData.flag(this.userInfo.outdoor);

    if (index === 0) {
        createRoleOut("hunt", "outdoor", "goout", "rightNow");
        this.logic.task.plusBrunchTask({ code: "BT_HuntCount", num: 1, goods: null });
        this.logic.task.plusDayTask({ code: "DT_HuntCount", num: 1, goods: null });
        this.logic.achive.plusAchive({ code: "AT_OutdoorHuntCount", num: 1 });
    }

    if (index === 1) {
        createRoleOut("pick", "outdoor", "goout", "rightNow");
        this.logic.task.plusBrunchTask({ code: "BT_PickCount", num: 1, goods: null });
        this.logic.task.plusDayTask({ code: "DT_PickCount", num: 1, goods: null });
        this.logic.achive.plusAchive({ code: "AT_OutdoorPickCount", num: 1 });
    }

    if (index === 2) {
        createRoleOut("catch", "outdoor", "goout", "rightNow");
        this.logic.task.plusBrunchTask({ code: "BT_CatchCount", num: 1, goods: null });
        this.logic.task.plusDayTask({ code: "DT_CatchCount", num: 1, goods: null });
        this.logic.achive.plusAchive({ code: "AT_OutdoorCatchCount", num: 1 });
    }

    // 捕鱼
    if (index === 2) {
        this.logic.sendMsgToScene("harbour", {
            event: "catchBoatOutCallback",
            data: null
        });
    }

    cc.Global.listenCenter.fire(cc.Global.eventConfig.OutDoorModify, null);
};

/**
 * 快速冒险
 */
handler.quickOutdoor = function (data) {
    let index = data.index;
    if (!index && index != 0) {
        return;
    }

    let activeInfo = this.userInfo.outdoor[index];
    if (activeInfo.state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"]);
        return;
    }
    this.setOutdoorState(false);

    if (!data.adv) {
        let remain = Math.ceil((activeInfo.endTime - this.logic.getSysTime()) / 1000);
        let needGem = Math.ceil(remain / normalConfig.oneGemCutSecond);
        if (this.userInfo.lord.gem < needGem) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
            return;
        }
        this.logic.lord.useRes({ gem: needGem });
    }

    activeInfo.endTime = 0;
    activeInfo.state = 2;
    activeInfo.take = createTakeGoods(activeInfo);
    userData.flag(this.userInfo.outdoor);

    let action = "";
    if (index === 0) { action = "hunt"; }
    if (index === 1) { action = "pick"; }
    if (index === 2) { action = "catch"; }
    createRoleBack(action, "outdoor", "goback", true, "rightNow", this);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.OutDoorModify, null);
};

/**
 * 是否可收取
 */
handler.isCanOutdoorCollect = function (data) {
    let index = data.index;

    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let activeInfo = this.userInfo.outdoor[index];
    let result = this.logic.store.canStore(activeInfo.take, scale);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }

    return result;
};

/**
 * 冒险收货
 */
handler.getOutdoorGoods = function (data) {
    let index = data.index;

    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let activeInfo = this.userInfo.outdoor[index];
    if (activeInfo.state !== 2) {
        return;
    }

    if (this.outdoorState) {
        this.setOutdoorState(false);

        let action = "";
        if (index === 0) { action = "hunt"; }
        if (index === 1) { action = "pick"; }
        if (index === 2) { action = "catch"; }
        createRoleBack(action, "outdoor", "goback", true, "rightNow", this);
    }

    let result = this.logic.store.canStore(activeInfo.take, scale);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
        return;
    }
    this.logic.store.storeItems(activeInfo.take, scale, data.startPos);

    activeInfo.endTime = 0;
    activeInfo.state = 0;
    activeInfo.take = {};
    userData.flag(this.userInfo.outdoor);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.OutDoorModify, null);
};

/**
 * 更新外出
 * @param {*} data 
 */
handler.updateWorker = function (data) {
    let currentTime = this.logic.getSysTime();

    let outdoor = this.userInfo.outdoor;
    let len = outdoor.length;
    for (let index = 0; index < len; index++) {
        let active = outdoor[index];
        if (active.state !== 1) {
            continue;
        }

        if (active.endTime <= currentTime) {
            active.take = createTakeGoods(active);
            active.state = 2;
            active.endTime = 0;
            userData.flag(this.userInfo.outdoor);

            let action = "";
            if (index === 0) { action = "pick"; }
            if (index === 1) { action = "hunt"; }
            if (index === 2) { action = "catch"; }
            createRoleBack(action, "outdoor", "goback", false, "rightNow", this);
        }
    }
};

/**
 * 获取渔船信息
 */
handler.getCatchBoatInfo = function () {
    let catchBoatInfo = {
        level: this.userInfo.outdoor[2].catch.indexOf(1),
        state: this.userInfo.outdoor[2].state,
    };
    return catchBoatInfo;
};

/**
 * 获取外出信息
 */
handler.getOutdoorInfo = function () {
    return this.userInfo.outdoor;
};

/**
 * 检查活动是否已经开放
 */
handler.activeIsOpen = function (info) {
    let needLevel = buildConfig.outdoor[info.type].unlock;
    if (this.userInfo.lord.level >= needLevel) {
        return true;
    }
    else {
        return false;
    }
};

/**
 * 可带回物品类型
 * @param {*} type 
 */
handler.getTakeGoods = function (type) {
    return Object.keys(articsConfig[type]);
};

/**
 * 获取冒险时间
 * @param {*} type 
 */
handler.getOutdoorTime = function (date) {
    let active = this.userInfo.outdoor[date.index];
    return buildConfig.outdoor[active.type].transport_time;
};

/**
 * 设置外出状态
 * @param {*} state 
 */
handler.setOutdoorState = function (state) {
    this.outdoorState = state;
};

handler.getOutdoorState = function () {
    return this.outdoorState;
};

/**
 * 可否冒险
 */
handler.canOutdoor = function () {
    let outdoor = this.userInfo.outdoor;
    let len = outdoor.length;
    for (let index = 0; index < len; index++) {
        const element = outdoor[index];
        if (element.state != 0) {
            return false;
        }
    }
    return true;
};

handler.buyCatch = function (data) {
    let index = data.index;

    let catchs = buildConfig.catch;
    if (index >= catchs.length) { return; }

    let unlock = catchs[index].harbour;
    let price = catchs[index].price;

    if (unlock > this.logic.harbour.getLevel()) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "harbour",
            level: unlock
        });
        return;
    }

    if (price > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "cash"
        });
        return;
    }

    this.logic.lord.useRes({ cash: price });

    let current = this.getCatchLevel();
    this.userInfo.outdoor[2].catch[current] = 0;
    this.userInfo.outdoor[2].catch[index] = 1;

    userData.flag(this.userInfo.outdoor);

    this.logic.sendMsgToScene("harbour", {
        event: "updateCatchBoatCallback",
        data: null
    });

    return true;
};

handler.useCatch = function (index) {
    let current = this.getCatchLevel();
    this.userInfo.outdoor[2].catch[current] = 0;
    this.userInfo.outdoor[2].catch[index] = 1;

    userData.flag(this.userInfo.outdoor);

    this.logic.sendMsgToScene("harbour", {
        event: "updateCatchBoatCallback",
        data: null
    });

    return true;
};

handler.getCatchLevel = function () {
    return this.userInfo.outdoor[2].catch.indexOf(1)
};

handler.getCatchState = function (index) {
    return this.userInfo.outdoor[2].catch[index];
};

/**
 * 可否显示
 */
handler.showAdvener = function () {
    let outdoor = this.userInfo.outdoor;
    let len = outdoor.length;
    for (let index = 0; index < len; index++) {
        const element = outdoor[index];
        if (element.state == 1) {
            return false;
        }
    }
    return true;
};

/**
 * 是否有东西领取
 */
handler.hasGoodsToDraw = function () {
    let outdoor = this.userInfo.outdoor;
    let len = outdoor.length;
    for (let index = 0; index < len; index++) {
        const element = outdoor[index];
        if (element.state == 2) {
            return true;
        }
    }
    return false;
};

/**
 * 产生带回物品
 */
function createTakeGoods(activeInfo) {
    let activeType = activeInfo.type;

    let goodsNum = buildConfig.outdoor[activeType].product_num;
    let goodsArray = Object.keys(articsConfig[activeType]);
    let goodsKind = goodsArray.length;

    let selectGoods = {};
    for (let index = 0; index < goodsNum; index++) {
        let goodsIndex = Math.floor(Math.random() * 1000) % goodsKind;
        let key = goodsArray[goodsIndex];
        if (!selectGoods.hasOwnProperty(key)) { selectGoods[key] = 0; }
        selectGoods[key]++;
    }

    return selectGoods;
}

// 角色回来
function createRoleBack(action, type, state, quick, extra, self) {
    cc.Global.listenCenter.fire(cc.Global.eventConfig.CreateRole, { type: type, state: state, quick: quick, action: action, extra: extra });
    if (action === "catch") {
        self.logic.sendMsgToScene("harbour", {
            event: "catchBoatBackCallback",
            data: { quick: quick }
        });
    }
}

// 角色离开
function createRoleOut(action, type, state, extra) {
    cc.Global.listenCenter.fire(cc.Global.eventConfig.CreateRole, { type: type, state: state, action: action, extra: extra });
}