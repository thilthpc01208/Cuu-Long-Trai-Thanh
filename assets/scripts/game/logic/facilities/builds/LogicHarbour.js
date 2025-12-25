const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const orderHandle = require("../../sustain/orderGroup/userOrder");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Harbour(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Harbour(userInfo, logic) {
    this.name = "harbour";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Harbour.prototype;

handler.init = function () {
    this.stopOprate = false;
};

handler.load = function () {
    let harbour = this.userInfo.harbour;
    if (harbour.orders.length > 0) { return; }

    let harbourConfig = buildConfig.harbour;
    let maxOrderNum = harbourConfig[harbourConfig.length - 1].order_count;
    let currentLevel = harbour.level;
    if (currentLevel === -1) { currentLevel = 0; }
    let currOrderNum = harbourConfig[currentLevel].order_count;

    for (let index = 0; index < maxOrderNum; index++) {
        let order = {
            state: 0,    //-1:未开放,0:出发,1:可以装载
            complete: -1,//-1:完全没有,0:没有完成,1:完成
            award: { has: false, draw: false, cash: 0 },
            items: []
        }

        if (index < currOrderNum) { order.state = 0; }
        else { order.state = -1; }
        harbour.orders.push(order);
    }

    createHarbourOrder(harbour.orders, this.logic);
    userData.flag(this.userInfo.harbour);
},

handler.update = function (dt) {
    this.updateShip();
};

/**
 * 升级港口
 * @param data
 */
handler.updateHarbour = function (data) {
    let nextLevel = this.userInfo.harbour.level + 1;
    let harbours = buildConfig.harbour;
    if (harbours.length <= nextLevel) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fullLevel"]);
        return false;
    }

    let harbourConfig = harbours[nextLevel];
    let needMaterial = harbourConfig.material;
    let needCash = harbourConfig.price;

    if (harbourConfig.unlock > this.userInfo.lord.level) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: harbourConfig.unlock });
        return false;
    }

    if (this.userInfo.lord.cash < needCash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    let result = this.logic.store.canUseItems(needMaterial);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "material", extra: Object.keys(needMaterial) });
        return false;
    }

    this.logic.store.useItems(needMaterial);
    this.logic.lord.useRes(needCash);
    this.userInfo.harbour.level = nextLevel;

    let currOrderNum = harbourConfig.order_count;
    for (let index = 0; index < currOrderNum; index++) {
        let order = this.userInfo.harbour.orders[index];
        if (order.state === -1) {
            order.state = 0;
        }
    }

    createHarbourOrder(this.userInfo.harbour.orders, this.logic);
    clearShipAward(this.userInfo.harbour);

    userData.flag(this.userInfo.harbour);

    this.logic.sendMsgToScene("harbour", {
        event: "updateHarbourCallback",
        data: null
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("port_level",nextLevel);

    return true;
};

/**
 * 刷新货船订单
 */
handler.resumeShipOrder = function (data) {
    let orderIndex = data.orderIndex;
    let itemIndex = data.itemIndex;

    if (this.stopOprate) { return; }
    if (!data.adv) {
        let needGem = normalConfig.harbourGoodsReplaceCost;
        if (this.userInfo.lord.gem < needGem) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
            return;
        }
        else {
            this.logic.lord.useRes({ gem: needGem });
        }
    }

    let orders = this.userInfo.harbour.orders;
    let order = orders[orderIndex];

    let extraItem = [];
    let len = order.items.length;
    for (let index = 0; index < len; index++) {
        let item = order.items[index];
        if (index === itemIndex) { continue; }
        extraItem.push(item.goods);
    }

    let newItem = orderHandle.getHarbourSomeExtraItem(this.logic, extraItem, 1);
    let goods = Object.keys(newItem)[0];
    let num = newItem[goods];
    order.items[itemIndex].goods = goods;
    order.items[itemIndex].num = num;

    userData.flag(this.userInfo.harbour);
};

/**
 * 给货船装东西
 * @param data
 */
handler.pushGoodsToShip = function (data) {
    if (this.stopOprate) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["notReady"]);
        return;
    }

    let orderIndex = data.orderIndex;
    let itemIndex = data.itemIndex;

    let orders = this.userInfo.harbour.orders;
    let order = orders[orderIndex];

    let item = order.items[itemIndex];
    let tempItem = {};
    tempItem[item.goods] = item.num;

    let result = this.logic.store.canUseItems(tempItem);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "goods", extra: tempItem });
        return;
    }
    this.logic.store.useItems(tempItem);

    let profit = this.getItemProfit(data);
    this.logic.lord.addRes({ cash: profit }, 1, data.startPos);

    item.load = true;
    order.complete = 0;

    checkOneOrderIsDone(order, this.userInfo.harbour.level);
    checkAllOrderIsDone(this.userInfo.harbour);

    userData.flag(this.userInfo.harbour);
};

/**
 * 获取订单奖励
 */
handler.getOrderAward = function (data) {
    let index = data.index;
    let order = this.userInfo.harbour.orders[index];

    if (order.state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntGet"]);
        return;
    }

    if (!order.award.has) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAward"]);
        return;
    }

    if (order.award.draw) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntGet"]);
        return;
    }

    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let cash = order.award.cash;
    this.logic.lord.addRes({ cash: cash }, scale, data.startPos);
    order.award.draw = true;

    userData.flag(this.userInfo.harbour);
};

/**
 * 是否可以领取
 * @param {*} data 
 * @returns 
 */
handler.isCanCollect = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let award = this.userInfo.harbour.award;
    let result = this.logic.store.canStore(award.material, scale);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }

    return result;
};

/**
 * 获取货船奖励
 */
handler.getShipAward = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let award = this.userInfo.harbour.award;
    if (!award.has) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAward"]);
        return;
    }

    if (award.draw) {
        return;
    }

    let result = this.logic.store.canStore(award.material, scale);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
        return;
    }

    this.logic.store.storeItems(award.material, scale, data.startPos);
    this.logic.lord.addRes({ gem: award.gem, cash: award.cash }, scale, data.startPos);

    award.draw = true;
    userData.flag(this.userInfo.harbour);
};

/**
 * 货船出发
 * @param data
 */
handler.goodsShipFire = function (data) {
    let harbour = this.userInfo.harbour;
    let orders = this.userInfo.harbour.orders;
    let hasGoods = false;

    let len = orders.length;
    for (let index = 0; index < len; index++) {
        let order = orders[index];
        if (order.award.has && !order.award.draw) {
            this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["awardNotGet"]);
            return false;
        }

        if (hasGoods) { continue; }

        let items = order.items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (!item.load) { continue; }
            hasGoods = true;
        }
    }

    shipDepature(this, harbour);
    userData.flag(this.userInfo.harbour);

    this.logic.sendMsgToScene("harbour", {
        event: "shipBoatOutCallback",
        data: null
    });

    if (hasGoods) {
        this.logic.task.plusBrunchTask({ code: "BT_HarbourDeliverCount", num: 1, goods: null });
        this.logic.task.plusDayTask({ code: "DT_ShipDeliverCount", num: 1, goods: null });
        this.logic.achive.plusAchive({ code: "AT_HarbourDeliverCount", num: 1 });
    }

    return true;
};

/**
 * 货船快速返回
 */
handler.shipQuickBack = function (data) {
    let harbour = this.userInfo.harbour;

    let shipInfo = harbour.ship;
    let currentTime = this.logic.getSysTime();
    let time = (shipInfo.endTime - currentTime) / 1000;
    if (time < 0) { time = 0; }

    time = Math.ceil(time);
    let gem = Math.ceil(time / normalConfig.oneGemCutSecond);
    if (this.userInfo.lord.gem < gem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return;
    }
    this.logic.lord.useRes({ gem: gem });

    this.stopOprate = false;
    harbour.ship.endTime = 0;
    harbour.ship.state = 0;

    createHarbourOrder(harbour.orders, this.logic);
    userData.flag(this.userInfo.harbour);

    this.logic.sendMsgToScene("harbour", {
        event: "shipBoatBackCallback",
        data: { quick: true }
    });
};

/**
 * 获取海港信息
 * @param data
 */
handler.getHarbourInfo = function (data) {
    return this.userInfo.harbour;
};

/**
 * 更新货船
 */
handler.updateShip = function () {
    let currentTime = this.logic.getSysTime();

    let ship = this.userInfo.harbour.ship;
    if (ship.state != 1) {
        return;
    }

    if (ship.endTime > currentTime) {
        return;
    }

    ship.endTime = 0;
    ship.state = 0;

    let orders = this.userInfo.harbour.orders;
    createHarbourOrder(orders, this.logic);
    userData.flag(this.userInfo.harbour);

    this.logic.sendMsgToScene("harbour", {
        event: "shipBoatBackCallback",
        data: { quick: false }
    });
};

/**
 * 获取等级
 */
handler.getLevel = function () {
    return this.userInfo.harbour.level;
};

/**
 * 获取单项信息
 */
handler.getItemInfo = function (data) {
    let orderIndex = data.orderIndex;
    let itemIndex = data.itemIndex;

    let orders = this.userInfo.harbour.orders;
    let order = orders[orderIndex];

    return order.items[itemIndex];
};

/**
 * 获取订单利润
 */
handler.getOrderProfit = function (data) {
    let index = data.index;

    let order = this.userInfo.harbour.orders[index];
    let len = order.items.length;
    let level = this.userInfo.harbour.level;

    let profit = 0;
    for (let index = 0; index < len; index++) {
        let item = order.items[index];
        profit += articsConfig.entityHash[item.goods].price * item.num * (1 + buildConfig.harbour[level].revenu_increase);
    }
    profit *= normalConfig.revenuRadio.shipOrder;
    profit = Math.ceil(profit);

    return profit;
};

/**
 * 单个物品利润
 */
handler.getItemProfit = function (data) {
    let orderIndex = data.orderIndex;
    let itemIndex = data.itemIndex;
    let level = this.userInfo.harbour.level;

    let orders = this.userInfo.harbour.orders;
    let order = orders[orderIndex];
    let item = order.items[itemIndex];

    let price = articsConfig.entityHash[item.goods].price * item.num *
        (1 + buildConfig.harbour[level].revenu_increase) * normalConfig.revenuRadio.shipSingle;

    return Math.ceil(price);
};

/**
 * 获取升级所需
 * @param {*} index 
 */
handler.getUpdateInfo = function () {
    let nextLevel = this.userInfo.harbour.level + 1;
    if (nextLevel > buildConfig.harbour.length - 1) {
        nextLevel = buildConfig.harbour.length - 1;
    }

    let levelLimit = buildConfig.harbour[nextLevel].unlock;
    let priceNeed = buildConfig.harbour[nextLevel].price;

    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        level: this.userInfo.harbour.level,
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed
    };
};

/**
 * 获取货船信息
 */
handler.getShipBoatInfo = function () {
    this.userInfo.harbour.ship.level = this.userInfo.harbour.level;
    return this.userInfo.harbour.ship;
};

handler.setStopOprate = function (state) {
    this.stopOprate = state;
};

/**
 * 是否所有订单都已完成
 * @returns 
 */
handler.allOrderIsDone = function () {
    return this.userInfo.harbour.award.has;
}

/**
 * 获取某个物品需求量
 * @param {*} goodsId 
 * @returns 
 */
handler.getOneGoodsNeed = function (goodsId) {
    if (this.userInfo.harbour.level < 0 ||
        this.userInfo.harbour.ship.state == 1) { return 0; }

    let orders = this.userInfo.harbour.orders;
    let num = 0
    for (let indexOrder = 0, lenOrder = orders.length; indexOrder < lenOrder; indexOrder++) {
        let items = orders[indexOrder].items;
        for (let indexItem = 0, lenItem = items.length; indexItem < lenItem; indexItem++) {
            if (items[indexItem]["goods"] == goodsId) { num += items[indexItem]["num"]; }
        }
    }
    return num;
};

/**
 * 设置订单
 * @param {*} harbour 
 */
function createHarbourOrder(orders, logic) {
    let initOrderFun = function (order) {
        let items = orderHandle.getHarbourOrderFromRule(logic);
        let goodsKey = Object.keys(items);
        for (let i = 0; i < 3; i++) {
            let key = goodsKey[i];
            let item = {
                load: false, goods: key,
                num: items[key],
            };
            order.items.push(item);
        }
    };

    let len = orders.length;
    for (let index = 0; index < len; index++) {
        let order = orders[index];
        if (order.state !== 0) { continue; }
        order.state = 1;
        initOrderFun(order);
    }
}

/**
 * 检查单个订单是否完成
 * @param {*} order 
 */
function checkOneOrderIsDone(order, level) {
    let len = order.items.length;

    let profit = 0;
    for (let index = 0; index < len; index++) {
        let item = order.items[index];
        profit += articsConfig.entityHash[item.goods].price * item.num * (1 + buildConfig.harbour[level].revenu_increase);
        if (item.load === true) {
            continue;
        }
        return false;
    }
    order.complete = 1;

    profit *= normalConfig.revenuRadio.shipOrder;
    order.award.cash = Math.ceil(profit);
    order.award.has = true;
    order.award.draw = false;

    return true;
}

/**
 * 检查所有订单是否完成
 */
function checkAllOrderIsDone(harbour) {
    for (let index = 0, len = harbour.orders.length; index < len; index++) {
        let order = harbour.orders[index];
        if (order.state === -1) { continue; }

        if (order.complete === 1) { harbour.complete = 0; }
        else { return false; }
    }

    let orders = harbour.orders;
    let level = harbour.level;
    let profit = 0;
    for (let orderIndex = 0, len = orders.length; orderIndex < len; orderIndex++) {
        let items = orders[orderIndex].items;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            let item = items[itemIndex];
            profit += articsConfig.entityHash[item.goods].price * item.num *
                (1 + buildConfig.harbour[level].revenu_increase);
        }
    }
    profit *= normalConfig.revenuRadio.shipAll;
    profit = Math.ceil(profit);

    setShipAward(harbour, profit);

    return true;
}

function setShipAward(harbour, profit) {
    harbour.complete = 1;
    harbour.award.draw = false;
    harbour.award.has = true;
    harbour.award.gem = 5;
    harbour.award.cash = profit;

    let num = buildConfig.harbour[harbour.level].materialNum;
    harbour.award.material = {
        "mineral-niantu": num,
        "mineral-mutou": num,
        "mineral-shitou": num,
    };
}

function clearShipAward(harbour) {
    harbour.complete = -1;
    harbour.award.draw = false;
    harbour.award.has = false;
    harbour.award.gem = 0;
    harbour.award.cash = 0;
    harbour.award.material = {};
}

/**
 * 货船出发
 * @param {*} harbour 
 */
function shipDepature(self, harbour) {
    clearShipAward(harbour);

    let len = harbour.orders.length;
    for (let index = 0; index < len; index++) {
        let order = harbour.orders[index];
        if (order.state === -1) {
            continue;
        }

        order.state = 0;
        order.complete = -1;
        order.award.draw = false;
        order.award.has = false;
        order.award.cash = 0;
        order.items = [];
    }

    let ship = harbour.ship;
    /**
     * state 0:在港
     *       1:不在港
     */
    ship.state = 1;
    let needTime = buildConfig.harbour[harbour.level].transport_time * 1000;
    ship.endTime = self.logic.getSysTime() + needTime;
}