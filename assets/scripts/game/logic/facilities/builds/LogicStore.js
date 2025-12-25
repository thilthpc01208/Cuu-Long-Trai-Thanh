const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const userData = require("../../../logic/sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Store(userInfo, logic);
}

/**
 * 仓库
 * @constructor
 */
function Store(userInfo, logic) {
    this.name = "store";
    this.userInfo = userInfo;
    this.logic = logic;

    this.ignoreStock = false;
    this.init();
}

const handler = Store.prototype;

handler.init = function () {
    if (this.userInfo.store.init) { return; }
    this.userInfo.store.init = true;

    this.storeItems({
        "mineral-shitou": 30,
        "mineral-mutou": 30,
        "mineral-niantu": 30,

        "land-xiaomai": 20,
    });

    userData.flag(this.userInfo.store);
};

handler.load = function () {
    /*
    for (const key in articsConfig.entityHash) {
        if (articsConfig.entityHash[key].goodsType === "canteen") {
            continue;
        }

        let item = {}; item[key] = 100;
        this.storeItems(item);
    }

    this.logic.lord.addRes({ cash: 50000000});
    this.logic.lord.addRes({ gem: 500000 });
    */

    // this.logic.lord.addRes({ cash: 50000000});
    // this.logic.lord.addRes({ gem: 500000 });
};

/**
 * 升级仓库
 * @param data
 */
handler.updateStore = function (data) {
    let nextLevel = this.userInfo.store.level + 1;
    let storeConfig = buildConfig.store[nextLevel];

    let needCash = storeConfig.price;
    if (needCash > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    let needMaterial = storeConfig.material;
    let result = this.canUseItems(needMaterial);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "material", extra: Object.keys(needMaterial) });
        return false;
    }

    this.logic.lord.useRes({ cash: needCash });
    this.useItems(needMaterial);

    this.userInfo.store.maxNum = storeConfig.capacity;
    this.userInfo.store.level = nextLevel;
    userData.flag(this.userInfo.store);

    this.logic.sendMsgToScene("store", {
        event: "updateStoreCallback",
        data: nextLevel
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("warehouse_level", nextLevel);

    return true;
};

handler.addGrid = function () {
    this.userInfo.store.extraGrid += 5;
    userData.flag(this.userInfo.store);
};

/**
 * 请求仓库信息
 * @param data
 */
handler.getStoreInfo = function (data) {
    return this.userInfo.store;
};

/**
 * 是否可以存放
 */
handler.canStore = function (items, multiple = 1) {
    if (multiple == null || multiple == undefined || !parseInt(multiple)) {
        multiple = 1;
    }

    let num = 0;
    for (const key in items) {
        if (items[key] === null || items[key] === undefined || !parseInt(items[key])) {
            continue;
        }

        if (key === "mineral-shitou" ||
            key === "mineral-mutou" ||
            key === "mineral-niantu") {
            continue;
        }

        num += Math.ceil(items[key] * multiple);
    }

    if (num == 0) {
        return true;
    }

    let result = this.userInfo.store.totalNum + num;
    if (result > (this.userInfo.store.maxNum + this.userInfo.store.extraGrid)) {
        return false || this.ignoreStock;
    }

    return true;
};

/**
 * 这个数量能否放入
 */
handler.canStoreCount = function (count) {
    let totalNum = this.userInfo.store.totalNum;
    let capacity = this.userInfo.store.maxNum + this.userInfo.store.extraGrid;

    if (capacity >= (totalNum + count)) {
        return true;
    }

    return false || this.ignoreStock;
};

/**
 * 存入物品
 * @param data
 * @param multiple
 * @returns {boolean}
 */
handler.storeItems = function (items, multiple = 1, startPos = null) {
    if (multiple == null || multiple == undefined || !parseInt(multiple)) {
        multiple = 1;
    }

    let types = [];

    for (const key in items) {
        types.push(articsConfig.entityHash[key].goodsType);

        let storeClass = articsConfig.entityHash[key].storeClass;
        if (!storeClass) { continue; }

        let oneType = this.userInfo.store.shelves[storeClass];
        if (!oneType) { continue; }

        if (!oneType.list[key]) {
            oneType.list[key] = 0;
        }

        if (items[key] == undefined || items[key] == null || !parseInt(items[key])) {
            continue;
        }

        let addNum = Math.ceil(items[key] * multiple);
        oneType.list[key] += addNum;

        if (key === "mineral-shitou" ||
            key === "mineral-mutou" ||
            key === "mineral-niantu") {
            //初级材料不计入总量
        }
        else {
            this.userInfo.store.totalNum += addNum;
        }

        if (startPos != null && items[key] > 0) {
            let temp = { startPos: startPos, name: key, to: "store", num: addNum };
            cc.Global.listenCenter.fire(cc.Global.eventConfig.GameSky, temp);
        }
    }

    userData.flag(this.userInfo.store);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.StoreModify, types);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, "collect");
};

/**
 * 这一组可否使用
 * @param {*} params 
 */
handler.canUseItems = function (items, multiple = 1) {
    if (multiple == null || multiple == undefined || !parseInt(multiple)) {
        multiple = 1;
    }

    for (const key in items) {
        let current = this.getItemNum(key);
        let needNum = Math.floor(items[key] * multiple);
        if (needNum > current) {
            return false;
        }
    }
    return true;
};

/**
 * 使用物品
 * @param items
 * @returns {number}
 */
handler.useItems = function (items, multiple = 1) {
    if (multiple == null || multiple == undefined || !parseInt(multiple)) {
        multiple = 1
    }

    let types = [];
    for (const key in items) {
        if (items[key] === null || items[key] === undefined || !parseInt(items[key])) {
            continue;
        }
        types.push(articsConfig.entityHash[key].goodsType);

        let storeClass = articsConfig.entityHash[key].storeClass;
        let oneType = this.userInfo.store.shelves[storeClass];

        if (oneType.list[key] == null ||
            oneType.list[key] == undefined) {
            continue;
        }

        let cutNum = Math.floor(items[key] * multiple);
        oneType.list[key] -= cutNum;

        if (key === "mineral-shitou" ||
            key === "mineral-mutou" ||
            key === "mineral-niantu") {
            //初级材料不计入总量
        }
        else {
            this.userInfo.store.totalNum -= cutNum;
        }

        if (oneType.list[key] <= 0) {
            oneType.list[key] = 0;
            delete oneType.list[key];
        }
    }

    userData.flag(this.userInfo.store);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.StoreModify, types);
};

/**
 * 出售物品
 */
handler.sellItems = function (items, scale = 1, startPos = null) {
    let sellCash = 0;
    let types = [];

    for (const key in items) {
        if (items[key] == null || items[key] == undefined || !parseInt(items[key])) {
            continue;
        }

        let articsInfo = articsConfig.entityHash[key];
        types.push(articsInfo.goodsType);

        let storeClass = articsInfo.storeClass;
        let oneType = this.userInfo.store.shelves[storeClass];
        if (oneType.list[key] == null ||
            oneType.list[key] == undefined) {
            continue;
        }

        oneType.list[key] -= items[key];

        if (key === "mineral-shitou" ||
            key === "mineral-mutou" ||
            key === "mineral-niantu") {
            //初级材料不计入总量
        }
        else {
            this.userInfo.store.totalNum -= items[key];
        }

        if (oneType.list[key] == 0) {
            delete oneType.list[key];
        }

        sellCash += items[key] * articsInfo.price *
            normalConfig.revenuRadio.store;
    }

    sellCash = Math.ceil(sellCash);
    this.logic.lord.addRes({ cash: sellCash }, scale, startPos);

    userData.flag(this.userInfo.store);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.StoreModify, types);
}

/**
 * 获取某个物品数量
 * @param mark
 * @returns {number|*}
 */
handler.getItemNum = function (key) {
    if (!key) { return 0; }
    let storeClass = articsConfig.entityHash[key].storeClass;
    let oneType = this.userInfo.store.shelves[storeClass];
    if (!oneType.list[key]) {
        return 0;
    }

    return oneType.list[key]
};

/**
 * 获取一个单类
 */
handler.getArticleInfo = function (typeIndex) {
    let key = Object.keys(buildConfig.storeClass)[typeIndex];
    return this.userInfo.store.shelves[key].list;
};

/**
 * 获取等级 
 */
handler.getLevel = function () {
    return this.userInfo.store.level;
};

/**
 * 获取容量信息
 */
handler.getCapacity = function () {
    let info = {
        totalNum: this.userInfo.store.totalNum,
        level: this.userInfo.store.level,
        capacity: this.userInfo.store.maxNum + this.userInfo.store.extraGrid,
    };

    return info;
};

/**
 * 获取升级所需
 * @param {*} index 
 */
handler.getUpdateInfo = function () {
    let nextLevel = this.userInfo.store.level + 1;
    if (nextLevel > buildConfig.store.length - 1) {
        nextLevel = buildConfig.store.length - 1;
    }

    let levelLimit = buildConfig.store[nextLevel].unlock;
    let priceNeed = buildConfig.store[nextLevel].price;

    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        level: this.userInfo.store.level,
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed
    };
};

/**
 * 获取仓库中材料信息
 * @returns 
 */
handler.getMaterialInfo = function () {
    let info = {
        "mineral-shitou": this.getItemNum("mineral-shitou"),
        "mineral-mutou": this.getItemNum("mineral-mutou"),
        "mineral-niantu": this.getItemNum("mineral-niantu"),
    }

    return info;
};

/**
 * 获取已存在的物品信息
 */
handler.getLivedGoods = function () {
    let arr = ["food", "industrial", "land", "animal", "orchard", "aquatic", "flower", "outdoor"];

    let goodsMap = {};
    for (let i = 0, len = arr.length; i < len; i++) {
        let list = this.userInfo.store.shelves[arr[i]].list;
        for (const key in list) {
            if (list[key] <= 1) { continue; }
            goodsMap[key] = list[key];
        }

        if (Object.keys(goodsMap).length >= 3) {
            return goodsMap;
        }
    }

    return null;
};