const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

const handler = {};
module.exports = handler;

handler.init = function () {
    this.factoryData = this.userInfo[this.name];

    let tempLevel = this.factoryData.level == -1 ? 0 : this.factoryData.level;
    let factoryInfo = buildConfig[this.name][tempLevel];
    this.saleTime = factoryInfo.saleTime;
};

handler.update = function (dt) {
    if (this.factoryData.level < 0) { return; }

    this.updateFood(dt);
    this.saleFood(dt);
};

/**
 * 升级设施
 * @param data
 */
handler.updateFactory = function (data) {
    let nextLevel = this.factoryData.level + 1;
    if (nextLevel > (buildConfig[this.name].length - 1)) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fullLevel"]);
        return false;
    }

    let factoryInfo = buildConfig[this.name][nextLevel];
    if (factoryInfo.unlock > this.userInfo.lord.level) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: factoryInfo.unlock });
        return false;
    }

    if (factoryInfo.price > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    if (!this.logic.store.canUseItems(factoryInfo.material)) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "material", extra: Object.keys(factoryInfo.material) });
        return false;
    }

    this.logic.lord.useRes({ cash: factoryInfo.price });
    this.logic.store.useItems(factoryInfo.material);

    this.factoryData.level = nextLevel;
    userData.flag(this.factoryData);

    this.logic.sendMsgToScene(this.name, {
        event: "updateFactoryCallback",
        data: nextLevel
    });

    articsConfig.caculatePrice(this.userInfo);

    let factorykeys = Object.keys(buildConfig.factorys);
    if (nextLevel == 0) { this.logic.rental.openOneRental({ index: factorykeys.indexOf(this.name) }); }
    else { this.logic.rental.updateOneRental({ index: factorykeys.indexOf(this.name) }); }

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent3("kitchen_level", this.name, nextLevel);

    return true;
};

/**
 * 开启某个作坊的一个格子
 * @param data
 */
handler.openFactoryGrid = function (data) {
    let stoves = this.factoryData.stove;
    let len = stoves.length;
    for (let index = 0; index < len; index++) {
        let info = stoves[index];
        if (info.state !== -1) { continue; }

        let cost = normalConfig.factorySlotPrice[index];
        if (this.userInfo.lord.gem < cost) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
            return;
        }

        this.logic.lord.useRes({ gem: cost });
        info.state = 0;
        userData.flag(this.factoryData);
        return;
    }
};

/**
 * 申请制作食物
 * @param data
 */
handler.cookieFood = function (data) {
    let food = articsConfig.entityHash[data.food];
    let stoves = this.factoryData.stove;

    let len = stoves.length;
    for (let index = 0; index < len; index++) {
        let field = stoves[index];
        if (field.state !== 0) { continue; }

        if (!this.logic.store.canUseItems(food.recipe)) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "goods", extra: food.recipe });
            return;
        }
        this.logic.store.useItems(food.recipe);

        field.state = 1;
        field.id = food.id;
        field.run = true;
        field.life = this.getFoodCookTime() * 1000;

        field.useTool = false;
        field.num = 1;

        if (cc.Global.casualStory.getData("GameGuideState")) {
            field.life = 3000;
        }
        
        field.endTime = this.logic.getSysTime() + field.life;
        userData.flag(this.factoryData);

        this.logic.task.plusBrunchTask({ code: "BT_FactoryOneFoodCount", num: 1, goods: data.food});
        this.logic.task.plusDayTask({ code: "DT_FactoryFoodCount", num: 1, goods: data.food });
        this.logic.achive.plusAchive({ code: "AT_FactoryFoodCount", num: 1 });
        return;
    }
};

/**
 * 收取食物
 * @param data
 */
handler.collectFood = function (data) {
    let index = data.index;
    let stoves = this.factoryData.stove;
    let field = stoves[index];

    if (field.state != 2) { return; }

    let item = {};
    item[field.id] = field.num;

    if (this.factoryData.save === "remote" &&
        this.logic.store.canStore(item, 1)) {
        this.logic.store.storeItems(item, 1, data.startPos);

        field.state = 0;
        field.id = "";
        field.num = 0;
        field.life = 0;
        field.endTime = 0;
        field.run = false;

        userData.flag(this.factoryData);
        modifyProcesPos(stoves);
        return;
    }

    if (this.factoryData.save === "local" &&
        this.canAddToLocal(item)) {
        this.addItemToLocal(item);

        field.state = 0;
        field.id = "";
        field.num = 0;
        field.life = 0;
        field.endTime = 0;
        field.run = false;

        userData.flag(this.factoryData);
        modifyProcesPos(stoves);
        return;
    }

    if (this.factoryData.save === "remote") {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "store"
        });
    }
};

/**
 * 收取所有成熟食物
 */
handler.collectAllFood = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let stoves = this.factoryData.stove;

    let items = {};
    for (let index = 0, len = stoves.length; index < len; index++) {
        let field = stoves[index];
        if (field.state != 2) { continue; }

        if (!items[field.id]) {
            items[field.id] = field.num;
        }
        else {
            items[field.id] += field.num;
        }
    }

    if (Object.keys(items).length <= 0) { return; }

    if (this.factoryData.save === "remote" &&
        this.logic.store.canStore(items, scale)) {
        this.logic.store.storeItems(items, scale, data.startPos);

        for (let index = stoves.length - 1; index >= 0; index--) {
            let field = stoves[index];
            if (field.state != 2) { continue; }

            field.state = 0;
            field.id = "";
            field.num = 0;
            field.life = 0;
            field.endTime = 0;
            field.run = false;
        }
        modifyProcesPos(stoves);
        userData.flag(this.factoryData);
        return;
    }

    if (this.factoryData.save === "local" &&
        this.canAddToLocal(items, scale)) {
        this.addItemToLocal(items, scale);

        for (let index = stoves.length - 1; index >= 0; index--) {
            let field = stoves[index];
            if (field.state != 2) { continue; }

            field.state = 0;
            field.id = "";
            field.num = 0;
            field.life = 0;
            field.endTime = 0;
            field.run = false;
        }

        modifyProcesPos(stoves);
        userData.flag(this.factoryData);
        return;
    }

    if (this.factoryData.save === "remote") {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
    }
};

/**
 * 是否有空间收取
 */
handler.isCanCollect = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let stoves = this.factoryData.stove;

    let items = {};
    for (let index = 0, len = stoves.length; index < len; index++) {
        let field = stoves[index];
        if (field.state != 2) { continue; }

        if (!items.hasOwnProperty(field.id)) {
            items[field.id] = 0;
        }

        items[field.id] += field.num;
    }

    if (Object.keys(items).length <= 0) { return false; }

    if (this.factoryData.save === "remote" &&
        this.logic.store.canStore(items, scale)) {
        return true;
    }

    if (this.factoryData.save === "local" &&
        this.canAddToLocal(items, scale)) {
        return true;
    }

    if (this.factoryData.save === "remote") {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "store"
        });
    }

    return false;
};

/**
 * 是否使用了工具
 * @param {*} data 
 * @returns 
 */
handler.isUseTool = function (data) {
    let stoves = this.factoryData.stove;

    for (let index = 0, len = stoves.length; index < len; index++) {
        let field = stoves[index];
        if (field.useTool == true) { return true; }
    }

    return false;
};

/**
 * 快速完成
 * @param data
 */
handler.quickCook = function (data) {
    let index = data.index;
    let stoves = this.factoryData.stove;
    let field = stoves[index];

    if (field.state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"]);
        return;
    }

    if (field.run === false) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"]);
        return;
    }

    let ramainTime = Math.ceil((field.endTime - this.logic.getSysTime()) / 1000);
    let needGem = Math.ceil(ramainTime / normalConfig.oneGemCutSecond);
    if (this.userInfo.lord.gem < needGem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return;
    }
    this.logic.lord.useRes({ gem: needGem });

    field.state = 2;
    field.endTime = this.logic.getSysTime();
    field.run = false;

    userData.flag(this.factoryData);
};

/**
 * 缓慢加工
 * @param dt
 */
handler.updateFood = function (dt) {
    let currentTime = this.logic.getSysTime();

    let checkProcess = function (stoves) {
        let len = stoves.length;
        let hasSucess = false;
        for (let index = 0; index < len; index++) {
            let current = stoves[index];
            if (current.state !== 1) { continue; }
            if (current.endTime <= currentTime) {
                current.state = 2;
                current.run = false;
                hasSucess = true;
            }
        }

        return hasSucess;
    };

    let factory = this.factoryData;
    if (factory.level < 0) {
        return;
    }

    if (checkProcess(factory.stove)) {
        userData.flag(this.factoryData);
    }
};

/**
 * 正在加工的物品数量
 */
handler.getDoingFood = function () {
    let checkProcess = function (stoves) {
        let len = stoves.length;
        let num = 0;
        for (let index = 0; index < len; index++) {
            let current = stoves[index];
            if (current.state == 1) {
                num++;
            }
        }
        return num;
    };

    let num = 0;
    let factory = this.factoryData;
    if (factory.level >= 0) {
        num += checkProcess(factory.stove);
    }

    return num;
};

/**
 * 加工完成的物品数量
 */
handler.getDoneFood = function () {
    let checkProcess = function (stoves) {
        let len = stoves.length;
        let num = 0;
        for (let index = 0; index < len; index++) {
            let current = stoves[index];
            if (current.state == 2) {
                num++;
            }
        }
        return num;
    };

    let num = 0;
    let factory = this.factoryData;
    if (factory.level >= 0) {
        num += checkProcess(factory.stove);
    }

    return num;
};

/**
 * 获取食物加工时间
 */
handler.getFoodCookTime = function () {
    let level = this.factoryData.level;
    return buildConfig[this.name][level].make_time;
};

/**
 * 获去单类信息
 */
handler.getBenchInfo = function (index) {
    return this.factoryData;
};

/**
 * 获取升级信息
 */
handler.getUpdateInfo = function () {
    let nextLevel = this.factoryData.level + 1;
    if (nextLevel > buildConfig[this.name].length - 1) {
        nextLevel = buildConfig[this.name].length - 1;
    }

    let levelLimit = buildConfig[this.name][nextLevel].unlock;
    if (!levelLimit) { levelLimit = 0; }
    let priceNeed = buildConfig[this.name][nextLevel].price;

    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        level: this.factoryData.level,
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed
    };
};

/**
 * 物品需求量
 * @param {*} foodId 
 * @returns 
 */
handler.getOneGoodsNeed = function (foodId) {
    let totalNeed = 0;
    totalNeed += this.logic.harbour.getOneGoodsNeed(foodId);
    totalNeed += this.logic.depot.getOneGoodsNeed(foodId);
    return totalNeed;
};

/**
 * 获取可加工物品
 */
handler.getFoodList = function () {
    let foods = articsConfig[this.name];
    let arr = [];

    for (const key in foods) {
        let food = JSON.parse(JSON.stringify(foods[key]));
        arr.push(food);
    }

    return arr;
};

handler.getFoodIndex = function (foodId) {
    let foodList = this.getFoodList();

    for (let index = 0, len = foodList.length; index < len; index++) {
        let food = foodList[index];
        if (food.id !== foodId) { continue; }
        return index;
    }
};

/**
 * 出售食物
 */
handler.saleFood = function (dt = 1) {
    this.saleTime -= dt;
    if (this.saleTime > 0) { return; }

    let factoryInfo = buildConfig[this.name][this.factoryData.level];
    this.saleTime = factoryInfo.saleTime;

    let localStore = this.factoryData.store;
    let storeKeys = Object.keys(localStore);
    if (storeKeys.length <= 0) { return; }

    let random = Math.floor(Math.random() * 1000) % (storeKeys.length);
    let select = storeKeys[random];

    if (localStore[select] < 1) { return; }
    localStore[select] -= 1;
    if (localStore[select] == 0) { delete localStore[select]; }

    let price = articsConfig.entityHash[select].price * normalConfig.revenuRadio.factory;
    this.addProfit(price);
    userData.flag(this.factoryData);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.SaleInFactory, null);

    this.logic.task.plusBrunchTask({ code: "BT_FactoryCustomerCount", num: 1, goods: null });
    this.logic.task.plusDayTask({ code: "DT_FactoryCustomerCount", num:1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_FactoryCustomerCount", num: 1 });
};

handler.addLocalCapacity = function (num) {
    this.factoryData.capacity += num;
    userData.flag(this.factoryData);
};

handler.getLocalCapacity = function () {
    let use = 0;
    for (const key in this.factoryData.store) {
        if (!this.factoryData.store[key]) {
            continue;
        }
        use += this.factoryData.store[key];
    }

    let info = {
        max: this.factoryData.capacity,
        use: use,
    };

    return info;
};

handler.canAddToLocal = function (items, scale = 1) {
    let localInfo = this.getLocalCapacity();

    let addNum = 0;
    for (const key in items) {
        addNum += items[key];
    }

    localInfo.use += addNum * scale;
    if (localInfo.use > localInfo.max) {
        this.logic.castMsgToScreen("本地仓库放不下!");
        return false;
    }
    else {
        return true;
    }
};

handler.addItemToLocal = function (items, scale = 1) {
    let canAdd = this.canAddToLocal(items, scale);
    if (!canAdd) {return;}

    for (const key in items) {
        if (!this.factoryData.store[key]) {
            this.factoryData.store[key] = 0;
        }

        this.factoryData.store[key] += items[key] * scale;
    }
    
    cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, "collect");
    userData.flag(this.factoryData);
};

handler.getLocalItemNum = function (key) {
    let num = this.factoryData.store[key] | 0;
    return num;
};

handler.transLocalToRemote = function (data) {
    let store = this.factoryData.store;
    if (!store[data.food] || store[data.food] == 0) {
        return;
    }

    let items = {};
    items[data.food] = store[data.food];

    let result = this.logic.store.canStore(items);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
        return;
    }

    this.logic.store.storeItems(items, 1, data.startPos);
    store[data.food] = 0;
    delete store[data.food];

    userData.flag(this.factoryData);
};

handler.addProfit = function (num) {
    this.factoryData.profit += num;
    userData.flag(this.factoryData);
};

handler.getProfit = function () {
    return this.factoryData.profit;
};

handler.drawProfit = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    if (data.scale) { scale = data.scale; }

    let profit = this.factoryData.profit;
    this.logic.lord.addRes({ cash: profit * scale }, 1, data.startPos);

    this.factoryData.profit = 0;
    userData.flag(this.factoryData);

    if (data.oneClick) {
        this.logic.task.plusBrunchTask({ code: "BT_FactoryGetProfitCount", num: 1, goods: null });
        this.logic.task.plusDayTask({ code: "DT_FactoryGetProfitCount", num: 1, goods: null });
        this.logic.achive.plusAchive({ code: "AT_FactoryGetProfitCount", num: 1 });
    }
};

handler.setSaveType = function (type) {
    this.factoryData.save = type;
    userData.flag(this.factoryData);
};

handler.getSaveType = function (type) {
    return this.factoryData.save;
};

/**
 * 获取等级
 */
handler.getLevel = function () {
    return this.factoryData.level;
};

/**
 * 给加工位排队
 * @param {*} stoves 
 */
function modifyProcesPos(stoves) {
    let save = [];

    let len = stoves.length;
    for (let i = 0; i < len; i++) {
        let field = stoves[i];
        if (field.state <= 0) {
            continue;
        }

        let item = {
            state: field.state,
            id: field.id,
            num: field.num,
            run: field.run,
            life: field.life,
            endTime: field.endTime
        };

        save.push(item);

        field.state = 0;
        field.id = "";
        field.num = 0;
        field.run = false;
        field.life = 0;
        field.endTime = 0;
    }

    for (let i = 0; i < len; i++) {
        if (i >= save.length) {
            break;
        }

        let field = stoves[i];
        field.state = save[i].state;
        field.id = save[i].id;
        field.num = save[i].num;
        field.run = save[i].run;
        field.life = save[i].life;
        field.endTime = save[i].endTime;
    }
}