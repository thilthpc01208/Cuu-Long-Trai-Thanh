const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Land(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Land(userInfo, logic) {
    this.name = "land";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Land.prototype;

handler.init = function () {
    this.updatePlant(1);
};

handler.update = function (dt) {
    this.updatePlant(dt);
};

/**
 * 开垦新土地
 * @param data
 */
handler.updateLand = function (data) {
    let index = data.index;
    let field = this.userInfo.land[index];

    if (field.state !== -1) {return null;}

    let landConfig = buildConfig.land;
    let needCash = landConfig.price[index];
    let needLevel = landConfig.unlock[index];
    if (this.userInfo.lord.cash < needCash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return null;
    }

    if (this.userInfo.lord.level < needLevel) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return null;
    }

    this.logic.lord.useRes({ cash: needCash });
    field.state = 0;
    userData.flag(this.userInfo.land);

    this.logic.sendMsgToScene("land", {
        event: "updateLandCallback",
        data: field
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("field_count", field.index + 1);

    return field;
};

/**
 * 种庄稼
 * @param data
 */
handler.loadPlant = function (data) {
    let index = data.index;
    let seed = data.seed;

    let land = this.userInfo.land;
    if (land[index].state !== 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fieldOccupy"]);
        return null;
    }

    let seedConfig = articsConfig.entityHash[seed];
    let currentTime = this.logic.getSysTime();
    let life = seedConfig.harvest_cycle * 1000;
    let field = land[index];
    field.state = 1;
    field.plant = seed;

    field.useTool = false;
    field.num = 1;

    if (cc.Global.casualStory.getData("GameGuideState")) {
        life = 3000;
    }

    field.endTime = currentTime + life;
    userData.flag(this.userInfo.land);

    this.logic.sendMsgToScene("land", {
        event: "loadPlantCallback",
        data: field
    });

    this.logic.task.plusBrunchTask({ code: "BT_LandOnePlantCount", num: 1, goods: seed });
    this.logic.task.plusDayTask({ code: "DT_LandPlantCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_LandPlantCount", num: 1 });
};

/**
 * 收庄稼
 * @param data
 */
handler.collectPlant = function (data) {
    let index = data.index;

    let land = this.userInfo.land;
    if (land[index].state !== 2) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntDraw"]);
        return null;
    }

    let toolScale = this.logic.lord.getFieldTool({ type: this.name + "Tools" });
    let field = land[index];
    let items = {}; items[field.plant] = field.num;
    let canDepot = this.logic.store.canStore(items, 1 * toolScale);
    if (canDepot) {
        this.logic.store.storeItems(items, 1 * toolScale, data.startPos);

        field.state = 0;
        field.plant = "";
        field.endTime = 0;
        field.num = 0;
        userData.flag(this.userInfo.land);

        this.logic.sendMsgToScene("land", {
            event: "collectPlantCallBack",
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

    let land = this.userInfo.land;
    if (land[index].state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"]);
        return null;
    }

    let field = land[index];
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

    this.logic.sendMsgToScene("land", {
        event: "updatePlantCallBack",
        data: field
    });
};

/**
 * 缓慢成长
 * @param {*} dt 
 */
handler.updatePlant = function (dt) {
    let currentTime = this.logic.getSysTime();
    let land = this.userInfo.land;

    for (let index = 0, len = land.length; index < len; index++) {
        let field = land[index];
        if (field.state !== 1) { continue; }
        if (currentTime >= field.endTime) {
            field.state = 2;// -1:未开垦 0:开垦 1:未成熟 2:成熟
            userData.flag(this.userInfo.land);

            this.logic.sendMsgToScene("land", {
                event: "updatePlantCallBack",
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
    let levelLimit = buildConfig.land.unlock[index];
    let priceNeed = buildConfig.land.price[index];
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

    let len = this.userInfo.land.length;
    for (let index = 0; index < len; index++) {
        let field = this.userInfo.land[index];
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
    return this.userInfo.land[index];
};

/**
 * 获取土地信息
 */
handler.getFieldsInfo = function () {
    return this.userInfo.land;
};