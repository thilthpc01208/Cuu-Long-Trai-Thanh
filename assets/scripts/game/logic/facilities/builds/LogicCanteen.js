const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Canteen(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Canteen(userInfo, logic) {
    this.name = "canteen";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Canteen.prototype;

handler.init = function () {
    this.dinerTime = 0;
    this.seatsState = [];
    for (let index = 0; index < 4; index++) {
        //0:空着,使用中
        this.seatsState.push(0);
    }

    this.canteenType = [];
    this.canteenFood = {};
};

handler.load = function () {
    let canteen = articsConfig.canteen;
    for (const key in canteen) {
        let food = canteen[key];
        let type = food.type;

        if (!this.canteenFood.hasOwnProperty(type)) {
            this.canteenFood[type] = [];
            this.canteenType.push(type);
        }

        this.canteenFood[type].push(food)
    }
};

handler.update = function (dt) {
    this.updateDiner(dt);
    this.updateFood();
};

/**
 * 升级设施
 */
handler.updateCanteen = function (data) {
    let currentLevel = this.userInfo.canteen.level;
    let nextLevel = currentLevel + 1;

    if (nextLevel > buildConfig.canteen.length - 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fullLevel"] );
        return false;
    }

    let material = buildConfig.canteen[nextLevel].material;
    let result = this.logic.store.canUseItems(material);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "material",
            extra: Object.keys(material)
        });
        return false;
    }

    this.logic.store.useItems(material);
    this.userInfo.canteen.level = nextLevel;
    userData.flag(this.userInfo.canteen);

    this.logic.sendMsgToScene(this.name, {
        event: "updateCanteenCallback",
        data: nextLevel
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("goodsstation_level", nextLevel);

    return true;
};

/**
 * 开格子
 * @param data
 */
handler.openCanteenGird = function (data) {
    let canteenInfo = this.userInfo.canteen;
    let stoves = canteenInfo.stove;

    if (canteenInfo.level < 0) {return;}

    let len = stoves.length;
    for (let index = 0; index < len; index++) {
        let stove = stoves[index];
        if (stove.state !== -1) { continue; }

        let needGem = normalConfig.canteenSlotPrice[index];
        if (needGem > this.userInfo.lord.gem) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
            break;
        }

        this.logic.lord.useRes({ gem: needGem });
        stove.state = 0;
        userData.flag(this.userInfo.canteen);
        break;
    }
};

/**
 * 生产食物
 * @param data
 */
handler.cookieFood = function (data) {
    let food = articsConfig.entityHash[data.food];

    let stoves = this.userInfo.canteen.stove;
    let store = this.userInfo.canteen.store;
    let level = this.userInfo.canteen.level;

    let addNum = 1 * 1;
    if (!canCookieFoodByCapacity(stoves, store, level, data.food, addNum)) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "store" });
        return;
    }

    let cookieTime = buildConfig.canteen[this.getLevel()].produce_cycle;
    let currentTime = this.logic.getSysTime();
    for (let index = 0, len = stoves.length; index < len; index++) {
        let stove = stoves[index];
        if (stove.state !== 0) { continue; }

        let result = this.logic.store.canUseItems(food.recipe);
        if (!result) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "goods", extra: food.recipe });
            return;
        }
        this.logic.store.useItems(food.recipe);

        stove.useTool = false;
        stove.num = addNum;
        stove.endTime = currentTime + cookieTime / 1 * 1000;
        stove.state = 1;
        stove.id = food.id;

        userData.flag(this.userInfo.canteen);

        return;
    }
};

/**
 * 快速完成
 * @param data
 */
handler.quickCook = function (data) {
    let stoves = this.userInfo.canteen.stove;
    let stove = stoves[data.index];

    if (stove.state !== 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["noAddSpeed"] );
        return;
    }

    let ramainTime = Math.ceil((stove.endTime - this.logic.getSysTime()) / 1000);
    let needGem = Math.ceil(ramainTime / normalConfig.oneGemCutSecond);
    if (this.userInfo.lord.gem < needGem) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
        return;
    }

    this.logic.lord.useRes({ gem: needGem });
    stove.state = 2;

    userData.flag(this.userInfo.canteen);
};

/**
 * 收取食物
 */
handler.collectFood = function (data) {
    let stoves = this.userInfo.canteen.stove;
    let stove = stoves[data.index];

    let name = stove.id;
    let store = this.userInfo.canteen.store;
    if (!store.hasOwnProperty(name)) {
        store[name] = 0;
    }
    store[name] += stove.num;

    stove.state = 0;
    stove.id = "";
    stove.num = 0;
    stove.endTime = 0;

    modifyProcesPos(stoves);
    userData.flag(this.userInfo.canteen);
};

/**
 * 获取等待时间
 * @returns 
 */
handler.getWaitTime = function () {
    let waitTime = buildConfig.desk[this.getDeskLevel()].wait_time;
    return waitTime;
};

/**
 * 获取吃饭时间
 * @returns 
 */
handler.getEatTime = function () {
    let eatTime = buildConfig.desk[this.getDeskLevel()].eat_time;
    return eatTime;
};

/**
 * 食客吃饭
 */
handler.dinerEat = function () {
    let store = this.userInfo.canteen.store;
    let food = { name: null };

    let hasEat = false;
    for (let key in store) {
        if (store[key] <= 0) {continue;}
        store[key]--;
        food.name = key;
        hasEat = true;
        break;
    }

    if (hasEat) {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.CanteenChange, {
            holidayCharge: false,
            benchCharge: false
        });

        let priceIncreaseDesk = buildConfig.desk[this.getDeskLevel()].revenu_increase;
        let price = articsConfig.entityHash[food.name].price * (1 + priceIncreaseDesk);
        price = price * normalConfig.revenuRadio.canteen;

        this.userInfo.canteen.profit += price;
        userData.flag(this.userInfo.canteen);

        this.logic.task.plusBrunchTask({ code: "BT_CanteenCustomerCount", num: 1, goods: null});
        this.logic.task.plusDayTask({ code: "DT_CanteenCustomCount", num: 1, goods: null });
        this.logic.achive.plusAchive({ code: "AT_CanteenCustomerCount", num: 1 });
    }

    return food;
};

/**
 * 食客离开
 */
handler.dinerLeave = function (seatIndex) {
    this.seatsState[seatIndex] = 0;
};

/**
 * 更新食客
 * @param {*} data 
 */
handler.updateDiner = function (dt) {
    if (this.getLevel() < 0) { return; }

    this.dinerTime -= dt;
    if (this.dinerTime > 0) { return; }

    this.dinerTime = buildConfig.desk[this.getDeskLevel()].guest_cycle;
    let dinerInfo = {
        type: "diner",
        seatIndex: this.getBlackSeat()
    };

    if (dinerInfo.seatIndex != -1) {
        this.seatsState[dinerInfo.seatIndex] = 1;
        this.logic.sendMsgToScene("square", {
            event: "updateCanteenCustomCallback",
            data: dinerInfo
        });
    }
};

/**
 * 获取空座位
 * @param {*} seatList 
 * @param {*} seatState 
 * @returns 
 */
handler.getBlackSeat = function () {
    let len = this.seatsState.length;
    for (let index = 0; index < len; index++) {
        if (this.seatsState[index] == 1) {
            continue;
        }
        return index;
    }

    return -1;
};

/**
 * 更新加工的食物
 */
handler.updateFood = function () {
    let currentTime = this.logic.getSysTime();
    let checkProcess = function (stoves) {
        let len = stoves.length;
        for (let index = 0; index < len; index++) {
            let current = stoves[index];
            if (current.endTime > currentTime) {
                continue;
            }
            if (current.state !== 1) { continue; }

            current.state = 2;
            userData.flag(this.userInfo.canteen);
        }
    }.bind(this);

    let canteen = this.userInfo.canteen;
    if (canteen.level >= 0) {
        checkProcess(canteen.stove);
    }

    let stoves = this.userInfo.canteen.stove;
    let collecetNum = 0;
    for (let index = stoves.length - 1; index >= 0; index--) {
        let current = stoves[index];
        if (current.state != 2) { continue; }

        this.collectFood({ index: index });
        collecetNum++;
    }

    if (collecetNum > 0) {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.CanteenChange, {
            holidayCharge: false,
            benchCharge: true
        });
    }
};

/**
 * 正在加工的物品
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
    }.bind(this);

    let canteen = this.userInfo.canteen;
    let num = checkProcess(canteen.stove);

    return num;
};

/**
 * 获取等级
 */
handler.getLevel = function () {
    return this.userInfo.canteen.level;
};

/**
 * 获取加工位信息
 */
handler.getBenchsInfo = function () {
    return this.userInfo.canteen.stove;
};

/**
 * 获取当前主题所对应食物
 */
handler.getFoodsInfo = function (data) {
    let foodsList = this.canteenFood[data.type];
    let lordLevel = this.logic.lord.getLevel();
    let foods = [];
    for (let index = 0, len = foodsList.length; index < len; index++) {
        let food = foodsList[index];
        if (food.unlock > lordLevel) {
            continue;
        }
        foods.push(food);
    }
    return foods;
};

/**
 * 获得对应物品数量
 */
handler.getFoodNum = function (food) {
    let store = this.userInfo.canteen.store;
    if (!store[food]) {return 0;}

    return store[food];
}

/**
 * 查看收益
 * @returns 
 */
handler.getProfit = function () {
    return this.userInfo.canteen.profit;
};

/**
 * 获取收益
 * @param {*} data 
 * @returns 
 */
handler.drawProfit = function (data) {
    if (this.userInfo.canteen.profit <= 0) {return;}

    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let res = { cash: this.userInfo.canteen.profit };
    this.logic.lord.addRes(res, scale, data.startPos);
    this.userInfo.canteen.profit = 0;

    userData.flag(this.userInfo.canteen);
};

handler.getCanteenType = function () {
    return this.canteenType;
};

/**
 * 获取升级信息
 * @returns 
 */
handler.getUpdateInfo = function () {
    let currentLevel = this.getLevel();

    let nextLevel = currentLevel + 1;
    let maxLevel = buildConfig.canteen.length - 1;
    if (nextLevel > maxLevel) {
        nextLevel = maxLevel;
    }

    let levelLimit = buildConfig.canteen[nextLevel].unlock;
    let priceNeed = buildConfig.canteen[nextLevel].price;

    let material = buildConfig.canteen[nextLevel].material;
    let levelSure = this.userInfo.lord.level >= levelLimit;
    let priceSure = this.userInfo.lord.cash >= priceNeed;

    return {
        level: currentLevel,
        levelSure: levelSure,
        priceSure: priceSure,
        levelLimit: levelLimit,
        priceNeed: priceNeed,
        materials: material
    };
};

handler.getDeskLevel = function () {
    return this.userInfo.canteen.desk.indexOf(1)
};

handler.getDeskState = function (index) {
    return this.userInfo.canteen.desk[index];
};

handler.useDesk = function (index) {
    let current = this.getDeskLevel();
    this.userInfo.canteen.desk[current] = 0;
    this.userInfo.canteen.desk[index] = 1;
    userData.flag(this.userInfo.canteen);

    this.logic.sendMsgToScene("canteen", {
        event: "updateDeskCallBack",
        data: null
    });

    return true;
};

handler.buyDesk = function (data) {
    let index = data.index;

    let desks = buildConfig.desk;
    if (index >= desks.length) { return; }

    let unlock = desks[index].canteen;
    let price = desks[index].price;

    if (unlock > this.logic.canteen.getLevel()) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "canteen",
            level: unlock
        });
        return;
    }

    if (price > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "cash"
        });
        return;
    }
    this.logic.lord.useRes({ cash: price });

    let current = this.getDeskLevel();
    this.userInfo.canteen.desk[current] = 0;
    this.userInfo.canteen.desk[index] = 1;

    userData.flag(this.userInfo.canteen);

    this.logic.sendMsgToScene("canteen", {
        event: "updateDeskCallBack",
        data: null
    });

    return true;
};


// 加工位排序
function modifyProcesPos(stoves) {
    let save = [];

    let len = stoves.length;
    for (let i = 0; i < len; i++) {
        let stove = stoves[i];
        if (stove.state <= 0) {
            continue;
        }

        let item = {
            state: stove.state,
            id: stove.id,
            num: stove.num,
            endTime: stove.endTime
        };

        save.push(item);

        stove.state = 0;
        stove.id = "";
        stove.num = 0;
        stove.endTime = 0;
    }

    for (let i = 0; i < len; i++) {
        if (i >= save.length) {
            break;
        }

        let stove = stoves[i];
        stove.state = save[i].state;
        stove.id = save[i].id;
        stove.num = save[i].num;
        stove.endTime = save[i].endTime;
    }
}

/**
 * 仓库够不够生产
 * @param {*} stoves 
 * @param {*} store 
 * @param {*} level 
 * @param {*} food 
 * @returns 
 */
function canCookieFoodByCapacity(stoves, store,level, food,num) {
    let current = 0;
    if (store[food]) {
        current += store[food];
    }

    let len = stoves.length;
    for (let index = 0; index < len; index++) {
        let stove = stoves[index];
        if (stove.id != food) {
            continue;
        }
        current++;
    }

    let slotCapacity = buildConfig.canteen[level].capacity;
    current += num;
    if (current >= slotCapacity) {
        return false;
    }

    return true;
}
