const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Orchard(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Orchard(userInfo, logic) {
    this.name = "orchard";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Orchard.prototype;

handler.init = function () {
    this.updateFruit();
};

handler.update = function (dt) {
    this.updateFruit();
};

/**
 * 开垦新果园
 * @param data
 */
handler.updateOrchard = function (data) {
    let index = data.index;

    let orchardConfig = buildConfig.orchard[index];
    let field = this.userInfo.orchard[index];
    if (field.state !== -1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["repeatBuild"] );
        return null;
    }

    if (orchardConfig.unlock > this.userInfo.lord.level) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: orchardConfig.unlock});
        return null;
    }

    let needCash = orchardConfig.price;
    if (needCash > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return null;
    }

    this.logic.lord.useRes({ cash: needCash });
    field.state = 0;
    userData.flag(this.userInfo.orchard);

    this.logic.sendMsgToScene("orchard", {
        event: "updateOrchardCallback",
        data: field
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("tree_count", field.index + 1);

    return field;
};

/**
 * 种水果
 * @param data
 */
handler.loadFruiter = function (data) {
    let index = data.index;
    let seed = data.seed;

    let field = this.userInfo.orchard[index];
    if (field.state !== 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fieldOccupy"] );
        return null;
    }

    let seedConfig = articsConfig.entityHash[seed];
    let currentTime = this.logic.getSysTime();
    let life = seedConfig.harvest_cycle * 1000;
    field.state = 1;
    field.plant = seed;

    field.useTool = false;
    field.num = 1;

    field.endTime = currentTime + life;
    userData.flag(this.userInfo.orchard);

    this.logic.sendMsgToScene("orchard", {
        event: "loadFruitCallback",
        data: field
    });

    this.logic.task.plusBrunchTask({ code: "BT_OrchardOnePlantCount", num: 1, goods: seed });
    this.logic.task.plusDayTask({ code: "DT_PaddyPlantCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_OrchardPlantCount", num: 1 });
};

/**
 * 快速成长
 * @param data
 */
handler.quickGrow = function (data) {
    let index = data.index;

    let orchard = this.userInfo.orchard;
    if (orchard[index].state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"] );
        return null;
    }

    let field = orchard[index];
    let currentTime = this.logic.getSysTime();
    let remain = Math.ceil((field.endTime - currentTime) / 1000);
    let needGem = Math.ceil(remain / normalConfig.oneGemCutSecond);
    if (needGem > this.userInfo.lord.gem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return null;
    }

    this.logic.lord.useRes({ gem: needGem });
    field.state = 2;
    field.endTime = 1;

    this.logic.sendMsgToScene("orchard", {
        event: "updateFruitCallBack",
        data: field
    });
};

/**
 * 收水果
 * @param data
 */
handler.collectFruiter = function (data) {
    let index = data.index;

    let field = this.userInfo.orchard[index];
    if (field.state !== 2 || field.num <= 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntDraw"] );
        return null;
    }

    let toolScale = this.logic.lord.getFieldTool({ type: this.name + "Tools" });
    let items = {}; items[field.plant] = field.num;
    let canDepot = this.logic.store.canStore(items,1 * toolScale);
    if (canDepot) {
        this.logic.store.storeItems(items, 1 * toolScale, data.startPos);

        field.state = 0;
        field.plant = "";
        field.endTime = 0;
        field.num = 0;
        userData.flag(this.userInfo.orchard);

        this.logic.sendMsgToScene("orchard", {
            event: "collectFruitCallback",
            data: field
        });

        return true;
    }
    else {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
        return false;
    }
};

/**
 * 缓慢生长
 */
handler.updateFruit = function () {
    let currentTime = this.logic.getSysTime();
    let orchard = this.userInfo.orchard;
    for (let index = 0, len = orchard.length; index < len; index++) {
        let field = orchard[index];

        if (field.state !== 1) { continue; }
        if (currentTime < field.endTime) { continue; }

        field.state = 2;// -1:未开垦 0:开垦 1:未成熟 2:成熟
        userData.flag(this.userInfo.orchard);

        this.logic.sendMsgToScene("orchard", {
            event: "updateFruitCallBack",
            data: field
        });
    }
};

/**
 * 获取升级所需
 * @param {*} index 
 */
 handler.getUpdateInfo = function (index) {
    let levelLimit = buildConfig.orchard[index].unlock;
    let priceNeed = buildConfig.orchard[index].price;

    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed
    };
};

/**
 * 获取土地数量
 */
handler.getFieldNum = function () {
    let totalNum = 0;

    let len = this.userInfo.orchard.length;
    for (let index = 0; index < len; index++) {
        let field = this.userInfo.orchard[index];
        if (field.state === -1) { continue; }
        totalNum++;
    }

    return totalNum;
};

/**
 * 获取单块信息
 * @param {} index 
 * @returns 
 */
handler.getFieldInfo = function (index) {
    return this.userInfo.orchard[index];
};

/**
 * 获取土地信息
 */
handler.getFieldsInfo = function () {
    return this.userInfo.orchard;
};