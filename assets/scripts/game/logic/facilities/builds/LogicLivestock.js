const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Livestock(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Livestock(userInfo, logic) {
    this.name = "livestock";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Livestock.prototype;

handler.init = function () {

};

handler.update = function (dt) {
    this.updateFowl(dt);
};

/**
 * 开辟新的养殖场
 * @param data
 */
handler.updateLivestock = function (data) {
    let index = data.index;

    let field = this.userInfo.livestock[index];
    if (field.state !== -1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["repeatBuild"]);
        return null;
    }

    let livestockConfig = buildConfig.livestock[index];
    let needCash = livestockConfig.price;
    let needLevel = livestockConfig.unlock;
    if (needLevel > this.userInfo.lord.level) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return null;
    }

    if (needCash > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return null;
    }

    this.logic.lord.useRes({ cash: needCash });
    field.state = 0;
    userData.flag(this.userInfo.livestock);

    this.logic.sendMsgToScene("livestock", {
        event: "updateLivestockCallback",
        data: field
    });

    this.logic.task.plusMainTask();
    
    cc.Global.sdk.postEvent2("farm_count", field.index + 1);

    return field;
};

/**
 * 解锁养殖场设施
 * @param data
 */
handler.unlockPlace = function (data) {
    let index = data.index;

    let field = this.userInfo.livestock[index];
    if (field.state === -1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["buildUsed"]);
        return null;
    }

    let livestockInfo = buildConfig.livestock[index];
    if (field.grid >= livestockInfo.extend_price.length) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["unlocked"]);
        return null;
    }

    let needGem = livestockInfo.extend_price[field.grid];
    if (needGem > this.userInfo.lord.gem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return null;
    }

    this.logic.lord.useRes({ gem: needGem });
    field.grid++;
    field.num = field.grid;
    userData.flag(this.userInfo.livestock);

    this.logic.sendMsgToScene("livestock", {
        event: "updateFowlCallback",
        data: field
    });
    
    return field;
};

/**
 * 养育
 * @param data
 */
handler.loadFowl = function (data) {
    let index = data.index;

    let field = this.userInfo.livestock[index];
    if (field.state !== 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fieldOccupy"]);
        return null;
    }

    let animalConfig = articsConfig.entityHash[field.animal];
    let currentTime = this.logic.getSysTime();
    let lifeTime = animalConfig.harvest_cycle * 1000;
    field.state = 1;

    field.num = field.grid * 1;
    field.useTool = false;

    field.endTime = currentTime + lifeTime;
    userData.flag(this.userInfo.livestock);

    this.logic.sendMsgToScene("livestock", {
        event: "loadFowlCallback",
        data: field
    });

    this.logic.task.plusBrunchTask({ code: "BT_LivestockOneAniCount", num: field.num, goods: field.animal });
    this.logic.task.plusDayTask({ code: "DT_LiveStockAniCount", num: field.num, goods: field.animal });
    this.logic.achive.plusAchive({ code: "AT_LivestockAniCount", num: field.num });
}

/**
 * 快速成长
 * @param data
 */
handler.quickGrow = function (data) {
    let index = data.index;

    let field = this.userInfo.livestock[index];
    if (field.state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"]);
        return null;
    }

    let currentTime = this.logic.getSysTime();
    let endTime = field.endTime;

    let disTime = Math.ceil((endTime - currentTime) / 1000);
    let needGem = Math.ceil(disTime / normalConfig.oneGemCutSecond);

    if (data.adv) {
        needGem = 0;
    }

    if (needGem > this.userInfo.lord.gem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return null;
    }

    this.logic.lord.useRes({ gem: needGem });
    field.state = 2;
    field.endTime = 1;
    userData.flag(this.userInfo.livestock);

    this.logic.sendMsgToScene("livestock", {
        event: "updateFowlCallback",
        data: field
    });

    cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, articsConfig.entityHash[field.animal].product);
};

/**
 * 是否可收取
 */
handler.isCanCollect = function (data) {
    let index = data.index;

    let scale = 1;
    if (data.adv) { scale = normalConfig.rewardVideoScale; }

    let field = this.userInfo.livestock[index];
    let items = {}; items[field.animal] = field.num * scale;
    let result = this.logic.store.canStore(items);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }

    return result;
};

/**
 * 收动物
 * @param data
 */
handler.collectFowl = function (data) {
    let index = data.index;

    let scale = 1;
    if (data.adv) {
        scale = normalConfig.rewardVideoScale;
    }

    let field = this.userInfo.livestock[index];
    if (field.state !== 2) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntDraw"]);
        return null;
    }

    let items = {}; items[field.animal] = field.num;
    let result = this.logic.store.canStore(items, scale);
    if (result) {
        this.logic.store.storeItems(items, scale, data.startPos);

        field.state = 0;
        field.endTime = 0;
        userData.flag(this.userInfo.livestock);

        this.logic.sendMsgToScene("livestock", {
            event: "collectFowlCallback",
            data: field
        });
    }
    else {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }
};

/**
 * 缓慢成长
 * @param {*} dt 
 */
handler.updateFowl = function (dt) {
    let currentTime = this.logic.getSysTime();

    let livestock = this.userInfo.livestock;
    let len = livestock.length;
    for (let index = 0; index < len; index++) {
        let field = livestock[index];

        if (field.state !== 1) {continue;}

        if (field.endTime <= currentTime) {
            field.state = 2;
            userData.flag(this.userInfo.livestock);
            this.logic.sendMsgToScene("livestock", {
                event: "updateFowlCallback",
                data: field
            });

            cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, articsConfig.entityHash[field.animal].product);
        }
    }
};

/**
 * 获取数量
 */
handler.getFieldNum = function () {
    let livestocks = this.userInfo.livestock;
    let totalNum = 0;
    for (let index = 0, len = livestocks.length; index < len; index++) {
        let livestock = livestocks[index];
        if (livestock.state === -1) { continue; }
        totalNum++;
    }
    return totalNum;
};

/**
 * 获取升级所需
 * @param {*} index 
 */
handler.getUpdateInfo = function (index) {
    let levelLimit = buildConfig.livestock[index].unlock;
    let priceNeed = buildConfig.livestock[index].price;

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
 * 获取养殖场信息
 */
handler.getFieldsInfo = function () {
    return this.userInfo.livestock;
};

handler.getFieldInfo = function (index) {
    return this.userInfo.livestock[index];
};

/**
 * 获取等级
 */
handler.getLevel = function (index) {
    return this.userInfo.livestock[index].grid - 2;
};