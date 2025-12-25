const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildsConfig = require("../../../../config/alone/BuildsConfig");

const entityList = ["land", "paddy", "orchard", "livestock", "aquatic", "hunt", "pick", "catch", "noddle", "tofu", "condiment", "tavern", "candy", "milk", "stewedmeat", "tea", "cake", "candiedfruit", "bushmeat", "seafood"];
const farmList = ["land", "paddy", "orchard", "livestock", "aquatic"];
const factoryList = ["noddle", "tofu", "condiment", "tavern", "candy", "milk", "stewedmeat", "tea", "cake", "candiedfruit", "bushmeat", "seafood"];
const outList = ["hunt", "pick", "catch"];

const handler = module.exports;

/**
 * 获取货运站订单
 * @param {*} 
 * @returns 
 */
handler.getDepotOrderFromRule = function (logic) {
    let canUseItems = selectCanUseNormalItems(logic);
    let typeNum = 1 + Math.floor(Math.random() * 4);

    let items = {};
    for (let index = 0; index < typeNum; index++) {
        let totalNum = canUseItems.length;
        let tempIndex = Math.floor(Math.random() * totalNum);

        let key = canUseItems[tempIndex];
        items[key] = caculateItemNum(logic, key);

        canUseItems.splice(tempIndex, 1);
    }

    return items;
};

/**
 * 依据仓库中物品产生订单
 */
handler.getDepotOrderFromStore = function (logic) {
    let lordLevel = logic.userInfo.lord.level;

    let random = (Math.random() * 10000) % 100;
    if (random >= 20) {
        return this.getDepotOrderFromRule(logic);
    }

    let livedGoods = logic.store.getLivedGoods();
    if (livedGoods == null) {
        return this.getDepotOrderFromRule(logic);
    }
    let goodsArr = Object.keys(livedGoods);

    let typeNum = 3;
    if (goodsArr.length >= 4) {
        typeNum = 4;
    }

    let items = {};
    for (let index = 0; index < typeNum; index++) {
        let totalNum = goodsArr.length;
        let tempIndex = Math.floor(Math.random() * totalNum);

        let goodsNum = 2 + Math.floor(Math.random() * 5);
        let key = goodsArr[tempIndex];
        if (livedGoods[key] < goodsNum) {
            goodsNum = livedGoods[key];
        }

        items[key] = goodsNum;
        goodsArr.splice(tempIndex, 1);
    }

    return items;
};

/**
 * 获取港口订单
 * @param {*} 
 */
handler.getHarbourOrderFromRule = function (logic) {
    let canUseItems = selectCanUseNormalItems(logic);

    let items = {};
    for (let index = 0; index < 3; index++) {
        let totalNum = canUseItems.length;
        let tempIndex = Math.floor(Math.random() * totalNum);

        let key = canUseItems[tempIndex];
        items[key] = caculateItemNum(logic, key);

        canUseItems.splice(tempIndex, 1);
    }

    return items;
};

/**
 * 选一定数量 排除外的物品
 * @param {*} extra 
 * @param {*} itemNum 
 */
handler.getHarbourSomeExtraItem = function (logic, extra, itemNum) {
    let canUseItems = selectCanUseNormalItems(logic);

    let len = extra.length;
    for (let index = 0; index < len; index++) {
        let pos = canUseItems.indexOf(extra[index]);
        canUseItems.splice(pos, 1);
    }

    let items = {};
    for (let index = 0; index < itemNum; index++) {
        let totalNum = canUseItems.length;
        let tempIndex = Math.floor(Math.random() * totalNum);

        let key = canUseItems[tempIndex];
        items[key] = caculateItemNum(logic,key);

        canUseItems.splice(tempIndex, 1);
    }

    return items;
};

/**
 * 选一定数量 排除外的物品
 * @param {*} extra 
 * @param {*} itemNum 
 */
handler.getTruckSomeExtraItem = function (logic, extra, itemNum) {
    let canUseItems = selectCanUseNormalItems(logic);

    let len = extra.length;
    for (let index = 0; index < len; index++) {
        let pos = canUseItems.indexOf(extra[index]);
        canUseItems.splice(pos, 1);
    }

    let items = {};
    for (let index = 0; index < itemNum; index++) {
        let totalNum = canUseItems.length;
        let tempIndex = Math.floor(Math.random() * totalNum);

        let key = canUseItems[tempIndex];
        items[key] = caculateItemNum(logic,key);

        canUseItems.splice(tempIndex, 1);
    }

    return items;
};

/**
 * 找出全部可用物品
 */
function selectCanUseNormalItems(logic) {
    let lordLevel = logic.userInfo.lord.level;
    let canUseItems = [];

    let filerTypeFun = function (type) {
        if (outList.indexOf(type) != -1) {
            let unlock = buildsConfig.outdoor[type].unlock;
            return unlock <= lordLevel;
        }

        if (farmList.indexOf(type) != -1) {
            let num = logic[type].getFieldNum();
            return num > 0;
        }

        if (factoryList.indexOf(type) != -1) {
            let level = logic[type].getLevel();
            return level >= 0;
        }
    };

    let len = entityList.length;
    for (let index = 0; index < len; index++) {
        let type = entityList[index];
        if (!filerTypeFun(type)) { continue; }
        filterNormalItems(type, logic, canUseItems);
    }

    return canUseItems;
}

/**
 * 筛选物品
 */
function filterNormalItems(type, logic, canUseItems) {
    let lordLevel = logic.userInfo.lord.level;

    let check = function (item) {
        if (item.storeClass === "livestock") {
            let field = logic.livestock.getFieldInfo(item.index);
            return field.state !== -1;
        };

        return true;
    };

    let maxTypeNum = 100000;
    if (type == "orchard" || type == "paddy") {
        maxTypeNum = logic[type].getFieldNum() + 1;
    }

    let items = articsConfig[type];
    for (const key in items) {
        let item = items[key];

        if (item.unlock > lordLevel) { continue; }
        if (!check(item)) { continue; }
        canUseItems.push(key);

        maxTypeNum--;
        if (maxTypeNum <= 0) { break; }
    }
}

/**
 * 计算物品数量
 */
function caculateItemNum(logic, key) {
    let storeClass = articsConfig.entityHash[key].storeClass;
    if (storeClass == "outdoor") {
        return 1;
    }

    if (storeClass != "orchard" && storeClass != "paddy") {
        return 1 + Math.floor(Math.random() * 5);
    }

    let fieldNum = logic[storeClass].getFieldNum();
    let random = 1 + Math.floor(Math.random() * 5);
    let resultNum = fieldNum >= random ? random : (fieldNum + 1);

    return resultNum;
}