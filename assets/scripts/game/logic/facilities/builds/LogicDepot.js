const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const orderHandle = require("../../sustain/orderGroup/userOrder");
const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Depot(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Depot(userInfo, logic) {
    this.name = "depot";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Depot.prototype;

handler.init = function () {
    /**
     * state 0:等待生成订单,
     *       1:等待装载
     *       2:等待出发
     *       3:路上
     */

    if (this.userInfo.depot.orders.length > 0) {
        return;
    }

    let depotLevel = this.userInfo.depot.level;
    let orderNum = buildConfig.depot[depotLevel].order_count;
    let orders = this.userInfo.depot.orders;

    for (let index = 0; index < orderNum; index++) {
        createDepotOrder(orders, this.logic);
        userData.flag(this.userInfo.depot);
    }

    userData.flag(this.userInfo.depot);

    /**
     * 汽车导致的操作失效
     */
    this.stopOprate = false;
};

handler.update = function (dt) {
    this.updateTruckState();
    this.updateOrder();
};

/**
 * 升级货运站
 * @param data
 */
handler.updateDepot = function (data) {
    let nextLevel = this.userInfo.depot.level + 1;
    if (nextLevel >= buildConfig.depot.length) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fullLevel"]);
        return false;
    }

    let depotInfo = buildConfig.depot[nextLevel];
    if (depotInfo.unlock > this.userInfo.lord.level) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: depotInfo.unlock });
        return false;
    }

    if (depotInfo.price > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    if (this.stopOprate) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["notReady"]);
        return false;
    }

    this.logic.lord.useRes({ cash: depotInfo.price });
    this.userInfo.depot.level = nextLevel;

    let orders = this.userInfo.depot.orders;
    createDepotOrder(orders, this.logic);
    userData.flag(this.userInfo.depot);

    this.logic.sendMsgToScene("depot", {
        event: "updateDepotCallback",
        data: nextLevel
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("trestle_level", nextLevel);

    return true;
}

/**
 * 快速生成订单
 * @param data
 */
handler.quickCreateOrder = function (data) {
    let index = data.index;

    let order = this.userInfo.depot.orders[index];
    if (order.state !== 0) {
        return;
    }

    if (!data.adv) {
        let remain = Math.ceil((order.endTime - this.logic.getSysTime()) / 1000);
        let gem = Math.ceil(remain / normalConfig.oneGemCutSecond);
        if (this.userInfo.lord.gem < gem) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
            return;
        }
        this.logic.lord.useRes({ gem: gem });
    }

    createOrderItems(order, this.logic)
    userData.flag(this.userInfo.depot);
};

/**
 * 删除订单
 */
handler.deleteOrder = function (data) {
    let index = data.index;

    let order = this.userInfo.depot.orders[index];
    if (order.state !== 1) {
        return;
    }

    deleteOrder(this, order, this.userInfo.depot.level);
    userData.flag(this.userInfo.depot);
};

/**
 * 升级汽车
 */
handler.updateTruck = function (data) {
    let nextLevel = this.userInfo.depot.truck.level + 1;
    if (nextLevel >= buildConfig.truck.length) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fullLevel"]);
        return false;
    }

    if (buildConfig.truck[nextLevel].route > this.userInfo.lord.route) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "route", level: buildConfig.truck[nextLevel].route });
        return false;
    }

    if (buildConfig.truck[nextLevel].price > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    if (this.userInfo.depot.truck.state != 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["truckIsUse"]);
        return false;
    }

    if (this.stopOprate) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["notReady"]);
        return false;
    }

    this.userInfo.depot.truck.level = nextLevel;
    userData.flag(this.userInfo.depot);

    this.logic.sendMsgToScene("depot", {
        event: "updateTruckCallback",
        data: nextLevel
    });
};

/**
 * 装载
 */
handler.packThing = function (data) {
    let index = data.index;

    let order = this.userInfo.depot.orders[index];
    if (order.state !== 1) {
        return;
    }

    let result = this.logic.store.canUseItems(order.items);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "goods", extra: order.items });
        return;
    }

    if (this.stopOprate) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["notReady"]);
        return false;
    }

    let level = this.userInfo.depot.level;
    let truck = this.userInfo.depot.truck;
    if (truckLoad(this.logic, truck, order.items)) {
        this.logic.store.useItems(order.items);
        clearOrder(this, this.userInfo.depot.level, order);
        userData.flag(this.userInfo.depot);
    }
    else {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["truckCapacity"]);
    }

    userData.flag(this.userInfo.depot);
};

/**
 * 运输
 * @param data
 */
handler.transportThing = function (data) {
    if (this.userInfo.depot.truck.state !== 0) { return false; }

    if (this.userInfo.depot.truck.goodsNum <= 0) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["truckEmpt"]);
        return false;
    }

    if (this.stopOprate) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["notReady"]);
        return false;
    }

    createTruckMaterial(this.userInfo.depot.truck);
    truckDepart(this, this.userInfo.depot.truck);
    userData.flag(this.userInfo.depot);

    this.logic.sendMsgToScene("depot", {
        event: "truckLeaveCallback",
        data: null
    });

    this.logic.task.plusBrunchTask({ code: "BT_DepotDeliverCount", num: 1, goods: null});
    this.logic.task.plusDayTask({ code: "DT_TruckDeliverCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_DepotDeliverCount", num: 1 });

    return false;
};

/**
 * 快速运输
 * @param data
 */
handler.quickTransport = function (data) {
    if (this.userInfo.depot.truck.state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"]);
        return;
    }
    this.setStopOprate(false);

    let truck = this.userInfo.depot.truck;
    if (!data.adv) {
        let remain = Math.ceil((truck.endTime - this.logic.getSysTime()) / 1000);
        let gem = Math.ceil(remain / normalConfig.oneGemCutSecond);
        if (this.userInfo.lord.gem < gem) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
            return;
        }
        this.logic.lord.useRes({ gem: gem });
    }

    truckBack(this.userInfo.depot.truck);
    userData.flag(this.userInfo.depot);

    this.logic.sendMsgToScene("depot", {
        event: "truckBackCallback",
        data: { quick: true }
    });
};

/**
 * 是否能够收取
 * @param {*} data 
 * @returns 
 */
handler.isCanCollect = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;

    let truck = this.userInfo.depot.truck;
    let result = this.logic.store.canStore(truck.material, scale);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }

    return result;
};

/**
 * 获取运输收益
 */
handler.transportProfit = function (data) {
    if (this.userInfo.depot.truck.state !== 2) {
        return;
    }

    if (this.stopOprate) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["truckNotReady"]);
        return false;
    }

    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let truck = this.userInfo.depot.truck;
    let result = this.logic.store.canStore(truck.material, scale);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
        return;
    }
    this.logic.store.storeItems(truck.material, scale, data.startPos);

    let profit = this.userInfo.depot.truck.profit;
    this.logic.lord.addRes({ cash: profit }, scale, data.startPos);

    truck.profit = 0;
    truck.state = 0;
    truck.material = {};

    userData.flag(this.userInfo.depot);
};

/**
 * 更新订单
 */
handler.updateOrder = function () {
    /**
     * state 0:等待生成订单,
     *       1:等待装载
     *       2:等待出发
     *       3:路上
    */

    let currentTime = this.logic.getSysTime();
    let orders = this.userInfo.depot.orders;
    let len = orders.length;
    for (let index = 0; index < len; index++) {
        let order = orders[index];

        if (order.endTime > currentTime) {
            continue;
        }

        if (order.state === 0) {
            createOrderItems(order, this.logic);
            userData.flag(this.userInfo.depot);
        }
    }
};

/**
 * 更新货车
 */
handler.updateTruckState = function () {
    let currentTime = this.logic.getSysTime();
    let truck = this.userInfo.depot.truck;

    /**
     * state 0:可以装货
     *       1:路上
     *       2:利润未收取
    */

    if (truck.state !== 1) { return; }
    if (truck.endTime > currentTime) { return; }

    truck.state = 2;
    truck.endTime = 0;
    userData.flag(this.userInfo.depot);

    this.logic.sendMsgToScene("depot", {
        event: "truckBackCallback",
        data: { quick: false }
    });
};

/**
 * 获取等级
 */
handler.getLevel = function () {
    return this.userInfo.depot.level;
};

/**
 * 货车等级
 * @returns 
 */
handler.getTruck = function () {
    return this.userInfo.depot.truck;
}

/**
 * 获取订单收益
 */
handler.getOrderProfit = function (data) {
    let index = data.index;
    let items = this.userInfo.depot.orders[index].items;
    return caculateOneOrderProfit(this.logic, items);
};

/**
 * 返回订单
 * @returns 
 */
handler.getOrders = function () {
    let orders = JSON.parse(JSON.stringify(this.userInfo.depot.orders));
    for (let i = 0, len = orders.length; i < len; i++) {
        orders[i].index = i;
    }

    orders.sort(function (a, b) {
        if (a.state == 1 && b.state == 1) {
            return a.index - b.index;
        }
        else {
            return a.endTime - b.endTime;
        }
    });

    return orders;
};

/**
 * 获取升级信息
 */
handler.getUpdateInfo = function () {
    let nextLevel = this.userInfo.depot.level + 1;
    if (nextLevel > buildConfig.depot.length - 1) {
        nextLevel = buildConfig.depot.length - 1;
    }

    let levelLimit = buildConfig.depot[nextLevel].unlock;
    let priceNeed = buildConfig.depot[nextLevel].price;

    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        level: this.userInfo.depot.level,
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed
    };
};

/**
 * 获取升级货车所需
 */
handler.getUpdateTruckInfo = function () {
    let nextLevel = this.userInfo.depot.truck.level + 1;
    if (nextLevel > buildConfig.truck.length - 1) {
        nextLevel = buildConfig.truck.length - 1;
    }

    let levelLimit = buildConfig.truck[nextLevel].unlock;
    let priceNeed = buildConfig.truck[nextLevel].price;

    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        level: this.userInfo.depot.truck.level,
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed
    };
};

/***
 * 设置操作状态
 */
handler.setStopOprate = function (state) {
    this.stopOprate = state;
};

/**
 * 是否有可运输订单
 */
handler.hasCanDeliverOrder = function () {
    let orders = this.userInfo.depot.orders;
    for (let index = 0, len = orders.length; index < len; index++) {
        let order = orders[index];
        let result = this.logic.store.canUseItems(order.items);
        if (result && order.state == 1) {
            return true;
        }
    }
    return false;
};

/**
 * 某个物品所需数量
 * @param {*} goodsId 
 * @returns 
 */
handler.getOneGoodsNeed = function (goodsId) {
    let orders = this.userInfo.depot.orders;
    let num = 0
    for (let index = 0, len = orders.length; index < len; index++) {
        let items = orders[index].items;
        if (items[goodsId]) { num += items[goodsId]; }
    }
    return num;
};

/**
 * 产生订单
 * @param {*} lordLevel 
 * @param {*} orders 
 */
function createDepotOrder(orders, logic) {
    let hasCanDeliverOrder = logic.depot.hasCanDeliverOrder();

    let items = {};
    items = orderHandle.getDepotOrderFromRule(logic);

    /*
    if (hasCanDeliverOrder) { items = orderHandle.getDepotOrderFromRule(logic); }
    else { items = orderHandle.getDepotOrderFromStore(logic) }
    */
    let order = {
        state: 1,
        endTime: 0,
        items: items
    };

    orders.push(order);
}

/**
 * 替换订单
 * @param {*} lordLevel 
 * @param {*} order 
 */
function createOrderItems(order, logic) {
    let hasCanDeliverOrder = logic.depot.hasCanDeliverOrder();

    let items = {};
    items = orderHandle.getDepotOrderFromRule(logic);
    /*
    if (hasCanDeliverOrder) { items = orderHandle.getDepotOrderFromRule(logic); }
    else { items = orderHandle.getDepotOrderFromStore(logic) }
    */

    order.items = items;
    order.state = 1;
    order.endTime = 0;
}

/**
 * 删除订单
 * @param {*} order 
 */
function deleteOrder(self, order, depotLevel) {
    let needTime = buildConfig.depot[depotLevel].order_cycle;
    order.endTime = self.logic.getSysTime() + needTime * 1000;

    order.state = 0;
    order.items = {};
}

/**
 * 清理订单
 * @param {*} order 
 */
function clearOrder(self, depotLevel, order) {
    let needTime = buildConfig.depot[depotLevel].order_cycle;
    order.endTime = self.logic.getSysTime() + needTime * 1000;

    order.state = 0;
    order.items = {};
}

/**
 * 汽车出发
 * @param {*} truck 
 */
function truckDepart(self, truck) {
    /**
     * state 0:可以装货
     *       1:路上
     *       2:利润未收取
     */

    let needTime = buildConfig.truck[truck.level].transport_time;
    if (cc.Global.casualStory.getData("GameGuideState")) {
        needTime = 5;
    }
    truck.endTime = self.logic.getSysTime() + needTime * 1000;

    truck.state = 1;
    truck.goodsNum = 0;
}

/**
 * 汽车返回
 * @param {*} truck 
 */
function truckBack(truck) {
    truck.endTime = 0;
    truck.state = 2;
}

/**
 * 装货
 */
function truckLoad(logic, truck, items) {
    if (truck.state !== 0) { return false; }

    let capacity = buildConfig.truck[truck.level].capacity;

    let tempNum = 0;
    for (const key in items) {
        let num = items[key];
        tempNum += num;
    }

    let totalNum = truck.goodsNum + tempNum;
    if (totalNum > capacity) {
        return false;
    }

    truck.goodsNum = totalNum;
    truck.profit += caculateOneOrderProfit(logic, items);

    return true;
}

/**
 * 计算一个订单的利润
 */
function caculateOneOrderProfit(logic, items) {
    let depotLevel = logic.userInfo.depot.level;

    let tempProfit = 0;
    for (const key in items) {
        let num = items[key];
        let price = articsConfig.entityHash[key].price;
        tempProfit += price * num * normalConfig.revenuRadio.depot;
    }
    tempProfit *= (1 + buildConfig.depot[depotLevel].revenu_increase);

    let route = logic.userInfo.lord.route;
    tempProfit *= (1 + buildConfig.route[route].revenu_increase);
    tempProfit = Math.round(tempProfit);

    return tempProfit;
}

/**
 * 带回的材料
 */
function createTruckMaterial(truck) {
    let materialArray = ["mineral-mutou", "mineral-shitou", "mineral-niantu"];
    let truckMaterial = { "mineral-mutou": 1, "mineral-shitou": 1, "mineral-niantu": 1 };

    for (let index = 0; index < truck.level; index++) {
        let tempIndex = Math.floor(Math.random() * 3);
        let key = materialArray[tempIndex];
        truckMaterial[key]++;
    }

    truck.material = truckMaterial;
}