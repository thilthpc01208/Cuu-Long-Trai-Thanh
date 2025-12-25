const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Aquatic(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Aquatic(userInfo, logic) {
    this.name = "aquatic";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Aquatic.prototype;

handler.init = function () {

};

handler.update = function (dt) {
    this.updateFish(dt);
};

/**
 * 开辟新的鱼塘
 * @param data
 */
handler.updateAquatic = function (data) {
    let index = data.index;

    let field = this.userInfo.aquatic[index];
    if (field.state !== -1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["repeatBuild"] );
        return null;
    }

    let aquaticConfig = buildConfig.aquatic[index];
    let needLevel = aquaticConfig.unlock;
    let needCash = aquaticConfig.price;

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
    userData.flag(this.userInfo.aquatic);

    this.logic.sendMsgToScene("aquatic", {
        event: "updateAquaticCallback",
        data: field
    });

    this.logic.task.plusMainTask();
    
    cc.Global.sdk.postEvent2("pond_count", field.index + 1);

    return field;
};

/**
 * 解锁鱼塘设施
 * @param data
 */
handler.unlockPlace = function (data) {
    let index = data.index;

    let field = this.userInfo.aquatic[index];
    if (field.state === -1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["buildUsed"] );
        return null;
    }

    let aquaticConfig = buildConfig.aquatic[index];
    if (field.grid >= aquaticConfig.extend_price.length) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["unlocked"] );        
        return null;
    }

    let needGem = aquaticConfig.extend_price[field.grid];
    if (needGem > this.userInfo.lord.gem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return null;
    }

    this.logic.lord.useRes({ gem: needGem });
    field.grid++;
    userData.flag(this.userInfo.aquatic);

    this.logic.sendMsgToScene("aquatic", {
        event: "updateAquaticCallback",
        data: field
    });

    return field;
};

/**
 * 养鱼
 * @param data
 */
handler.loadFish = function (data) {
    let index = data.index;
    let aquatic = data.aquatic;

    let field = this.userInfo.aquatic[index];
    if (field.state !== 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fieldOccupy"] );
        return null;
    }

    let fishConfig = articsConfig.entityHash[aquatic];
    let currentTime = this.logic.getSysTime();
    let lifeTime = fishConfig.harvest_cycle * 1000;
    field.state = 1;
    field.aquatic = aquatic;

    field.num = field.grid * 1;
    field.useTool = false;

    field.endTime = currentTime + lifeTime;
    userData.flag(this.userInfo.aquatic);

    this.logic.sendMsgToScene("aquatic", {
        event: "loadFishCallback",
        data: field
    });

    this.logic.task.plusBrunchTask({ code: "BT_AquaticOneAniCount", num: field.num, goods: aquatic });
    this.logic.task.plusDayTask({ code: "DT_AquaticAniCount", num: field.num, goods: field.aquatic });
    this.logic.achive.plusAchive({ code: "AT_AquaticAniCount", num: field.num });
}

/**
 * 快速成长
 * @param data
 */
handler.quickGrow = function (data) {
    let index = data.index;
    let adv = data.adv;

    let field = this.userInfo.aquatic[index];
    if (field.state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"] );
        return null;
    }

    let currentTime = this.logic.getSysTime();
    let endTime = field.endTime;

    let disTime = Math.ceil((endTime - currentTime) / 1000);
    let needGem = Math.ceil(disTime / normalConfig.oneGemCutSecond);

    if (adv) {
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
    userData.flag(this.userInfo.aquatic);

    this.logic.sendMsgToScene("aquatic", {
        event: "updateFishCallback",
        data: field
    });

    cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, "aquatic");
};

/**
 * 是否可收取
 */
handler.isCanCollect = function (data) {
    let index = data.index;

    let scale = 1;
    if (data.adv) { scale = normalConfig.rewardVideoScale; }

    let field = this.userInfo.aquatic[index];
    let items = {}; items[field.aquatic] = field.num * scale;
    let result = this.logic.store.canStore(items);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }

    return result;
};

/**
 * 收鱼
 * @param data
 */
handler.collectFish = function (data) {
    let index = data.index;

    let scale = 1;
    if (data.adv) {
        scale = normalConfig.rewardVideoScale;
    }

    let field = this.userInfo.aquatic[index];
    if (field.state !== 2) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntDraw"] );
        return null;
    }

    let items = {}; items[field.aquatic] = field.num;
    let result = this.logic.store.canStore(items, scale);
    if (result) {
        this.logic.store.storeItems(items, scale, data.startPos);

        field.state = 0;
        field.endTime = 0;
        field.aquatic = "";
        userData.flag(this.userInfo.aquatic);

        this.logic.sendMsgToScene("aquatic", {
            event: "collectFishCallback",
            data: field
        });
    }
    else {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }
};

// 缓慢成长
handler.updateFish = function (dt) {
    let currentTime = this.logic.getSysTime();

    let aquatic = this.userInfo.aquatic;
    for (let index = 0, len = aquatic.length; index < len; index++) {
        let field = aquatic[index];
        if (field.state !== 1) { continue; }

        if (field.endTime <= currentTime) {
            field.state = 2;
            userData.flag(this.userInfo.aquatic);

            this.logic.sendMsgToScene("aquatic", {
                event: "updateFishCallback",
                data: field
            });

            cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, "aquatic");
        }
    }
};

/**
 * 获取升级所需
 * @param {*} index 
 */
handler.getUpdateInfo = function (index) {
    let levelLimit = buildConfig.aquatic[index].unlock;
    let priceNeed = buildConfig.aquatic[index].price;

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
 * 鱼塘信息
 */
handler.getFieldsInfo = function () {
    return this.userInfo.aquatic;
};

/**
 * 鱼塘信息
 */
handler.getFieldInfo = function (index) {
    return this.userInfo.aquatic[index];
};

/**
 * 获取鱼塘数量
 */
handler.getFieldNum = function () {
    let totalNum = 0;

    let len = this.userInfo.aquatic.length;
    for (let index = 0; index < len; index++) {
        let field = this.userInfo.aquatic[index];
        if (field.state === -1) {
            continue;
        }
        totalNum++;
    }

    return totalNum;
};

/**
 * 空闲鱼塘数量
 * @returns 
 */
handler.getEmptField = function () {
    let noOpen = [];
    let inOpen = [];
    let noUse = [];

    let len = this.userInfo.aquatic.length;
    for (let index = 0; index < len; index++) {
        let field = this.userInfo.aquatic[index];
        if (field.state === -1) {
            noOpen.push(index);
        }
        else {
            inOpen.push(index);
        }

        if (field.state === 0) {
            noUse.push(index);
        }
    }

    if (noUse.length > 0) { return noUse[0]; }
    if (inOpen.length > 0) { return inOpen[0]; }

    return 0;
};

/**
 * 获取单独的等级
 */
handler.getLevel = function (index) {
    return this.userInfo.aquatic[index].grid - 2;
};
