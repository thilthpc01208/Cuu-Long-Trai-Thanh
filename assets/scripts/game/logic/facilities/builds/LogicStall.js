const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const userData = require("../../../logic/sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Stall(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Stall(userInfo, logic) {
    this.name = "stall";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Stall.prototype;

handler.init = function () {
    this.customTime = 0;
};

/**
 * 升级货摊
 * @param data
 */
handler.updateStall = function (data) {
    let nextLevel = this.userInfo.stall.level + 1;
    if (nextLevel >= buildConfig.stall.length) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fullLevel"]);
        return false;
    }

    let stallConfig = buildConfig.stall[nextLevel];
    let needLevel = stallConfig.unlock;
    let needCash = stallConfig.price;
    if (needLevel > this.userInfo.lord.level) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return false;
    }

    if (needCash > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    this.logic.lord.useRes({ cash: needCash });
    this.userInfo.stall.level = nextLevel;
    userData.flag(this.userInfo.stall);

    this.logic.sendMsgToScene("stall", {
        event: "updateStallCallback",
        data: nextLevel
    });

    this.logic.task.plusMainTask();
    
    cc.Global.sdk.postEvent2("stall_level", nextLevel);

    return true;
};

/**
 * 开格子
 * @param data
 */
handler.openGrid = function (data) {
    let needGem = normalConfig.extendStallPrice;
    if (needGem > this.userInfo.lord.gem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return false;
    }
    this.logic.lord.useRes({ gem: needGem });

    this.userInfo.stall.store.push({});
    userData.flag(this.userInfo.stall);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.StallModify, null);
    return true;
};

/**
 * 物品放入货架
 */
handler.pushGoods = function (items, type) {
    let articId = Object.keys(items)[0];
    let transItem = {};
    transItem[articId] = 0;

    let currentNum = this.logic.store.getItemNum(articId);
    if (currentNum == 0) {
        return false;
    }

    let entityHash = articsConfig.entityHash;
    let artic = entityHash[articId];
    let storeClass = artic.storeClass;
    let name = articId;

    let item = {
        storeClass: storeClass,
        id: articId,
        name: name,
        num: type == "one" ? 1 : currentNum,
        use: 0
    };

    if (findPos(this, item)) {
        transItem[articId] = item.use;
        this.logic.store.useItems(transItem);
        userData.flag(this.userInfo.stall);
        cc.Global.listenCenter.fire(cc.Global.eventConfig.StallModify, null);
        return true;
    }
    else {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["stallGridShortage"]);
        return false;
    }
};

/**
 * 出售物品
 * @param data
 */
handler.saleGoods = function () {
    let stallConfig = buildConfig.stall[this.userInfo.stall.level];
    let maxNum = stallConfig.buy_count;

    let store = this.userInfo.stall.store;
    let len = store.length;

    let hasGoodsItems = [];
    let select = [];

    for (let index = 0; index < len; index++) {
        let item = store[index];
        if (!item.id) { continue; }
        hasGoodsItems.push({ item: item, index: index });
    }

    while (hasGoodsItems.length > 0 && maxNum > 0) {
        let currIndex = Math.floor(Math.random() * 10000) % hasGoodsItems.length;
        let item = hasGoodsItems[currIndex].item;

        select.push(item.id);
        maxNum--; item.num--;

        if (item.num <= 0) {
            store[hasGoodsItems[currIndex].index] = {};
        }

        hasGoodsItems.splice(currIndex, 1)
    }

    saleDone(this, select);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.StallModify, null);

    this.logic.task.plusBrunchTask({ code: "BT_StallCustomerCount", num: 1, goods: null});
    this.logic.task.plusDayTask({ code: "DT_StallCustomCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_StallCustomerCount", num: 1 });

    return select;
};

/**
 * 显示收益
 */
handler.getProfit = function () {
    return this.userInfo.stall.profit;
};

/**
 * 获取收益
 */
handler.drawProfit = function (data) {
    if (this.userInfo.stall.profit <= 0) {
        return;
    }

    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;

    this.logic.lord.addRes({ cash: this.userInfo.stall.profit }, scale, data.startPos);
    this.userInfo.stall.profit = 0;
    userData.flag(this.userInfo.stall);
};

/**
 * 获取物品
 */
handler.getGoods = function () {
    return this.userInfo.stall.store;
};

/**
 * 获取等级
 */
handler.getLevel = function () {
    return this.userInfo.stall.level;
};

/**
 * 更新购买的客户
 */
handler.updateCustom = function () {
    this.customTime += 0.5;
    let level = this.userInfo.stall.level;
    if (level < 0) { return; }

    let stall = buildConfig.stall[level];
    let needTime = stall.guest_cycle;
    if (this.customTime < needTime) { return; }

    this.customTime = 0;

    this.logic.sendMsgToScene("footwalk", {
        event: "updateStallCustomCallback",
        data: null
    });
};

/**
 * 获取升级所需
 * @param {*} index 
 */
handler.getUpdateInfo = function () {
    let nextLevel = this.userInfo.stall.level + 1;
    if (nextLevel > buildConfig.stall.length - 1) {
        nextLevel = buildConfig.stall.length - 1;
    }

    let levelLimit = buildConfig.stall[nextLevel].unlock;
    let priceNeed = buildConfig.stall[nextLevel].price;

    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        level: this.userInfo.stall.level,
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed
    };
};

/**
 * 寻找可以放置的位置
 * @param {*} self 
 * @param {*} item 
 * @returns 
 */
function findPos(self, item) {
    let level = 0;
    let stallConfig = buildConfig.stall[level];

    let store = self.userInfo.stall.store;
    let len = store.length;

    for (let index = 0; index < len; index++) {
        let grid = store[index];
        if (grid.id === item.id && grid.num < stallConfig.capacity) {

            let needNum = stallConfig.capacity - grid.num;
            let add = item.num >= needNum ? needNum : item.num;
            grid.num += add;
            item.use = add;

            return true;
        }
    }

    for (let index = 0; index < len; index++) {
        let grid = store[index];
        if (!grid.id) {
            grid.storeClass = item.storeClass;
            grid.id = item.id;
            grid.name = item.name;

            let needNum = stallConfig.capacity;
            let add = item.num >= needNum ? needNum : item.num;
            grid.num = add;
            item.use = add;

            return true;
        }
    }

    return false;
}

function saleDone(self, items, isOffLine = false) {
    let entityHash = articsConfig.entityHash;

    let level = self.userInfo.stall.level;
    let revenu_increase = buildConfig.stall[level].revenu_increase;
    let scale = normalConfig.revenuRadio.stall;

    let totalPrice = 0;
    let len = items.length;
    for (let index = 0; index < len; index++) {
        let artic = entityHash[items[index]];
        totalPrice += artic.price * scale * (revenu_increase + 1);
    }

    if (isOffLine) {
        return totalPrice;
    }

    self.userInfo.stall.profit += totalPrice;
    if (items.length > 0) {
        userData.flag(self.userInfo.stall);
    }
}
