const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Paddy(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Paddy(userInfo, logic) {
    this.name = "paddy";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Paddy.prototype;

handler.init = function () {
    this.updatePaddy(1);
};

handler.update = function (dt) {
    this.updatePaddy(dt);
};

/**
 * 开垦新土地
 * @param data
 */
handler.updatePaddyField = function (data) {
    let index = data.index;
    let field = this.userInfo.paddy[index];

    if (field.state !== -1) { return false; }

    let paddyConfig = buildConfig.paddy;
    let needCash = paddyConfig[index].price;
    let needLevel = paddyConfig[index].unlock;
    if (this.userInfo.lord.cash < needCash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    if (this.userInfo.lord.level < needLevel) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return false;
    }

    this.logic.lord.useRes({ cash: needCash });
    field.state = 0;
    userData.flag(this.userInfo.paddy);

    this.logic.sendMsgToScene("paddy", {
        event: "updatePaddyCallback",
        data: field
    });

    this.logic.task.plusMainTask();
    
    cc.Global.sdk.postEvent2("water_field_count", field.index + 1);

    return field;
};

/**
 * 种庄稼
 * @param data
 */
handler.loadPaddy = function (data) {
    let index = data.index;
    let seed = data.seed;

    let paddy = this.userInfo.paddy;
    if (paddy[index].state !== 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fieldOccupy"]);
        return null;
    }

    let seedConfig = articsConfig.entityHash[seed];
    let currentTime = this.logic.getSysTime();
    let life = seedConfig.harvest_cycle * 1000;
    let field = paddy[index];
    field.state = 1;
    field.plant = seed;

    field.useTool = false;
    field.num = 1;

    if (cc.Global.casualStory.getData("GameGuideState")) {
        life = 3000;
    }

    field.endTime = currentTime + life;
    userData.flag(this.userInfo.paddy);

    this.logic.sendMsgToScene("paddy", {
        event: "loadPaddyCallback",
        data: field
    });

    this.logic.task.plusBrunchTask({ code: "BT_PaddyOnePlantCount", num: 1, goods: seed });
    this.logic.task.plusDayTask({ code: "DT_OrchardPlantCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_PaddyPlantCount", num: 1 });
};

/**
 * 收庄稼
 * @param data
 */
handler.collectPaddy = function (data) {
    let index = data.index;

    let paddy = this.userInfo.paddy;
    if (paddy[index].state !== 2) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntDraw"]);
        return null;
    }

    let toolScale = this.logic.lord.getFieldTool({ type: this.name + "Tools" });
    let field = paddy[index];
    let items = {}; items[field.plant] = field.num;
    let canDepot = this.logic.store.canStore(items, 1 * toolScale);
    if (canDepot) {
        this.logic.store.storeItems(items, 1 * toolScale, data.startPos);

        field.state = 0;
        field.plant = "";
        field.endTime = 0;
        field.num = 0;
        userData.flag(this.userInfo.paddy);

        this.logic.sendMsgToScene("paddy", {
            event: "collectPaddyCallBack",
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
 * 快速成长
 * @param data
 */
handler.quickGrow = function (data) {
    let index = data.index;

    let paddy = this.userInfo.paddy;
    if (paddy[index].state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"]);
        return null;
    }

    let field = paddy[index];
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

    this.logic.sendMsgToScene("paddy", {
        event: "updatePaddyCallBack",
        data: field
    });
};

/**
 * 缓慢成长
 * @param {*} dt 
 */
handler.updatePaddy = function (dt) {
    let currentTime = this.logic.getSysTime();

    let paddy = this.userInfo.paddy;
    for (let index = 0, len = paddy.length; index < len; index++) {
        let field = paddy[index];

        if (field.state !== 1) {
            continue;
        }

        if (currentTime >= field.endTime) {
            field.state = 2;// -1:未开垦 0:开垦 1:未成熟 2:成熟
            userData.flag(this.userInfo.paddy);

            this.logic.sendMsgToScene("paddy", {
                event: "updatePaddyCallBack",
                data: field
            });
        }
    }
};

/**
 * 获取升级所需
 * @param {*} index 
 */
handler.getUpdateInfo = function (index) {
    let levelLimit = buildConfig.paddy[index].unlock;
    let priceNeed = buildConfig.paddy[index].price;
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

    let len = this.userInfo.paddy.length;
    for (let index = 0; index < len; index++) {
        let field = this.userInfo.paddy[index];
        if (field.state === -1) {
            continue;
        }
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
    return this.userInfo.paddy[index];
};

/**
 * 获取土地信息
 */
handler.getFieldsInfo = function () {
    return this.userInfo.paddy;
};