const articsConfig = require("../../../../config/alone/ArticsConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");
const taskConfig = require("../../../../config/alone/TaskConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Task(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Task(userInfo, logic) {
    this.name = "task";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Task.prototype;

handler.init = function () {

};

handler.load = function () {
    let task = this.userInfo.task;

    if (task.mainTask == null) {
        createMainTask(this.logic, this.userInfo);
        userData.flag(this.userInfo.task);
    }

    if (task.brunchTask == null) {
        createBrunchTask(this, this.userInfo);
        userData.flag(this.userInfo.task);
    }

    if (task.dayTask.length <= 0) {
        createDayTask(this.userInfo);
        userData.flag(this.userInfo.task);
    }

    let len = task.dayTask.length;
    this.dayTaskMap = {};
    for (let index = 0; index < len; index++) {
        let info = task.dayTask[index];
        this.dayTaskMap[info.code] = info;
    }
};

/**
 * 推进每日任务
 * @param {*} data 
 */
handler.plusDayTask = function (data) {
    let code = data.code;
    let num = data.num;
    let goods = data.goods;

    if (!this.dayTaskMap.hasOwnProperty(code)) {
        return;
    }

    let task = this.dayTaskMap[code];
    if (task.goods != null && task.goods != goods) {
        return;
    }

    task.current += num;
    cc.Global.listenCenter.fire(cc.Global.eventConfig.DayTaskModify, null);

    userData.flag(this.userInfo.task);
    if (task.current < task.target) {
        return;
    }

    if (task.done === true) {
        return;
    }

    task.done = true;
    task.draw = false;
    userData.flag(this.userInfo.task);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.DayTaskModify, null);
};

/**
 * 推进支线任务
 * @param {*} data 
 */
handler.plusBrunchTask = function (data) {
    let code = data.code;
    let num = data.num;
    let goods = data.goods;

    let brunchTask = this.userInfo.task.brunchTask;
    if (brunchTask.code != code) {
        return;
    }

    if (brunchTask.goods != null &&
        brunchTask.goods != goods) {
        return;
    }

    brunchTask.current += num;
    this.plusDayTask({ code: "DT_DoneBrunchCount", num: 1, goods: null });
    cc.Global.listenCenter.fire(cc.Global.eventConfig.BrunchTaskModify, null);

    userData.flag(this.userInfo.task);
    if (brunchTask.current < brunchTask.target) {
        return;
    }

    brunchTask.done = true;
    brunchTask.draw = false;

    userData.flag(this.userInfo.task);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.BrunchTaskModify, null);
};

/**
 * 推进主线任务
 * @param {*} data 
 */
handler.plusMainTask = function (data) {
    checkMainTask(this.logic, this.userInfo.task.mainTask);
    userData.flag(this.userInfo.task);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.MainTaskModify, null);
};

/**
 * 获取每日任务奖励
 * @param {*} data 
 */
handler.getDayTaskAward = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let code = data.code;

    let task = this.dayTaskMap[code];
    for (const key in task.award) {
        if (key === "material") {
            this.logic.store.storeItems(task.award[key], scale, data.startPos);
        }

        if (key === "cash" || key === "gem") {
            let res = {};
            res[key] = task.award[key];
            this.logic.lord.addRes(res, scale, data.startPos);
        }
    }
    task.draw = true;

    let isComplete = true;
    for (const key in this.dayTaskMap) {
        let temp = this.dayTaskMap[key];
        if (temp.done && temp.draw) {
            continue;
        }
        isComplete = false;
    }

    if (isComplete) {
        this.userInfo.task.dayBigAwardState = true;
        this.userInfo.task.dayBigAwardDraw = false;
    }

    task.draw = true;
    userData.flag(this.userInfo.task);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.DayTaskModify, null);
};

/**
 * 立即完成每日任务
 */
handler.immatureDayTask = function (data) {
    let code = data.code;

    let task = this.dayTaskMap[code];
    task.current = task.target;
    task.done = true;
    task.draw = false;
    userData.flag(this.userInfo.task);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.DayTaskModify, null);
};

/**
 * 获取支线任务奖励
 * @param {*} data 
 */
handler.getBrunchTaskAward = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;

    let taskInfo = this.userInfo.task.brunchTask;
    for (const key in taskInfo.award) {
        if (key === "material") {
            this.logic.store.storeItems(taskInfo.award[key], scale, data.startPos);
        }

        if (key === "cash" || key === "gem") {
            let res = {};
            res[key] = taskInfo.award[key];
            this.logic.lord.addRes(res, scale, data.startPos);
        }
    }
    taskInfo.draw = true;

    this.userInfo.task.brunchDoneNum++;
    if (this.userInfo.task.brunchDoneNum >= 3) {
        this.userInfo.task.brunchDoneNum = 0;
    }

    //主线任务开启
    if (this.userInfo.task.brunchDoneNum == 0) {
        this.userInfo.task.currentCanSelectTask = "main";
    }

    createBrunchTask(this, this.userInfo);
    userData.flag(this.userInfo.task);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.BrunchTaskModify, this.userInfo.task.currentCanSelectTask);
};

/**
 * 获取主线任务奖励
 * @param {*} data 
 */
handler.getMainTaskAward = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;

    let mainTask = this.userInfo.task.mainTask;
    if (mainTask.done === false ||
        mainTask.draw === true) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntGet"]);
        return;
    }

    for (const key in mainTask.award) {
        if (key === "material") {
            this.logic.store.storeItems(mainTask.award[key], scale, data.startPos);
        }

        if (key === "cash" || key === "gem") {
            let res = {};
            res[key] = mainTask.award[key];
            this.logic.lord.addRes(res, scale, data.startPos);
        }
    }
    mainTask.draw = true;

    if ((mainTask.index + 1) < taskConfig.mainTask.length) {
        createMainTask(this.logic, this.userInfo);
        userData.flag(this.userInfo.task);
    }

    //支线任务开启
    this.userInfo.task.currentCanSelectTask = "brunch";
    userData.flag(this.userInfo.task);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.MainTaskModify, this.userInfo.task.currentCanSelectTask);
};

/**
 * 获取每日任务大奖励
 * @param {*} data 
 */
handler.getBigAward = function (data) {
    if (!this.userInfo.task.dayBigAwardState || this.userInfo.task.dayBigAwardDraw) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntGetDayBigTask"]);
        return;
    }
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;

    let bigAward = taskConfig.bigAward;
    for (const key in bigAward) {
        if (key === "material") {
            this.logic.store.storeItems(bigAward.material, scale, data.startPos);
        }

        if (key === "cash" || key === "gem") {
            let res = {};
            res[key] = bigAward[key];
            this.logic.lord.addRes(res, scale, data.startPos);
        }
    }

    this.userInfo.task.dayBigAwardDraw = true;
    userData.flag(this.userInfo.task);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.DayTaskModify, null);
};

/**
 * 替换支线任务
 */
handler.replaceBrunchTask = function (data) {
    if (!data.adv) {
        if (this.userInfo.lord.gem < normalConfig.replaceBrunchTaskGem) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "gem" });
            return;
        }
        this.logic.lord.useRes({ gem: normalConfig.replaceBrunchTaskGem });
    }

    createBrunchTask(this, this.userInfo);
    userData.flag(this.userInfo.task);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.BrunchTaskModify, null);
};

/**
 * 获取每日任务信息
 */
handler.getDayTaskInfo = function () {
    let dayTask = this.userInfo.task.dayTask;
    dayTask = JSON.parse(JSON.stringify(dayTask));

    dayTask.sort(function (a, b) {
        if (a.done && a.draw) {
            a.percent = -1;
        }
        else {
            a.percent = a.current / a.target;
        }

        if (b.done && b.draw) {
            b.percent = -1;
        }
        else {
            b.percent = b.current / b.target;
        }

        return b.percent - a.percent;
    });

    return dayTask;
};

/**
 * 获取支线任务信息
 */
handler.getBrunchTaskInfo = function () {
    return this.userInfo.task.brunchTask;
};

/**
 * 获取主线任务信息
 */
handler.getMainTaskInfo = function () {
    return this.userInfo.task.mainTask;
};

handler.getCurrentSelectTask = function () {
    return this.userInfo.task.currentCanSelectTask;
};

/**
 * 是否有任务完成 
 */
handler.hasOneTaskDone = function () {
    let brunch = this.userInfo.task.brunchTask.done == true && this.userInfo.task.brunchTask.draw == false;
    let main = this.userInfo.task.mainTask.done == true && this.userInfo.task.mainTask.draw == false;
    let day = false;

    let dayTask = this.userInfo.task.dayTask;
    for (let index = 0, len = dayTask.length; index < len; index++) {
        day = dayTask[index].done == true && dayTask[index].draw == false;
        if (day == true) {
            break;
        }
    }

    let data = { brunch: brunch, main: main, day: day, result: brunch || main || day };
    return data;
};

/**
 * 新的一天
 */
handler.createNewDailyTask = function () {
    this.userInfo.task.dayTask = [];
    createDayTask(this.userInfo);
    userData.flag(this.userInfo.task);

    let dayTask = this.userInfo.task.dayTask;
    let len = dayTask.length;
    this.dayTaskMap = {};
    for (let index = 0; index < len; index++) {
        let info = dayTask[index];
        this.dayTaskMap[info.code] = info;
    }

    cc.Global.listenCenter.fire(cc.Global.eventConfig.DayTaskModify, null);
};

/*
* 获取大礼包状态
*/
handler.getBigAwardInfo = function () {
    return {
        dayBigAwardState: this.userInfo.task.dayBigAwardState,
        dayBigAwardDraw: this.userInfo.task.dayBigAwardDraw,
    };
};

// 创建主线任务
function createMainTask(logic, userInfo) {
    let mainTask = userInfo.task.mainTask;
    if (!mainTask) {
        userInfo.task.mainTask = { index: 0, done: false, draw: true };
        userInfo.task.mainTask.award = JSON.parse(JSON.stringify(taskConfig.mainTask[userInfo.task.mainTask.index].award));
        userInfo.task.mainTask.descript = taskConfig.mainTask[userInfo.task.mainTask.index].descript;

        checkMainTask(logic, userInfo.task.mainTask);
        userData.flag(userInfo.task);

        cc.Global.sdk.postEvent2("mainline_task", userInfo.task.mainTask.index);
        return;
    }
    else {
        if ((userInfo.task.mainTask.index + 1) > taskConfig.mainTask.length - 1) {
            return;
        }

        userInfo.task.mainTask.index++;
        userInfo.task.mainTask.done = false;
        userInfo.task.mainTask.draw = true;
        userInfo.task.mainTask.award = JSON.parse(JSON.stringify(taskConfig.mainTask[userInfo.task.mainTask.index].award));
        userInfo.task.mainTask.descript = taskConfig.mainTask[userInfo.task.mainTask.index].descript;

        checkMainTask(logic, userInfo.task.mainTask);
        userData.flag(userInfo.task);

        cc.Global.sdk.postEvent2("mainline_task", userInfo.task.mainTask.index);
    }
}

// 创建支线任务
function createBrunchTask(self, userInfo) {
    let len = taskConfig.brunchTask.length;
    let optional = [];

    let lordLevel = userInfo.lord.level;
    for (let index = 0; index < len; index++) {
        let info = taskConfig.brunchTask[index];
        if (info.unlock <= lordLevel) {
            optional.push(info);
        }
    }

    let index = Math.floor((Math.random() * 1000)) % optional.length;
    let info = optional[index];
    let task = {
        code: info.code,
        descript: info.descript,
        goods: null,
        target: 0,
        current: 0,
        award: caculateBrunchAward(lordLevel),
        done: false,
        draw: true,
    };

    let random = Math.floor(Math.random() * 10000);
    let disValue = (info.num.max - info.num.min);
    let target = info.num.min + (random % disValue);
    task.target = target;

    if (info.type === "land" || info.type === "orchard" ||
        info.type === "livestock" || info.type === "aquatic" ||
        info.type === "paddy" || (info.type === "factory" &&
            info.code == "BT_FactoryOneFoodCount")) {
        task.goods = selectGoods(info.type, lordLevel, self.logic);
    }

    if (task.goods) {
        task.descript = task.descript.replace("@", articsConfig.entityHash[task.goods].name);
    }
    task.descript = task.descript.replace("#", task.target);

    userInfo.task.brunchTask = task;
}

// 创建每日任务
function createDayTask(userInfo) {
    let len = taskConfig.dailyTask.length;
    let necessary = [];
    let optional = [];

    let lordLevel = userInfo.lord.level;
    let totalNum = 0;

    for (let index = 0; index < len; index++) {
        let info = taskConfig.dailyTask[index];
        if (info.isMust === 1) {
            necessary.push(info);
        }
        else if (info.unlock <= lordLevel) {
            optional.push(info);
        }
    }

    len = necessary.length;
    for (let index = 0; index < len; index++) {
        let info = necessary[index];
        let task = {
            code: info.code,
            descript: info.descript,
            target: info.target,
            current: 0,
            advDone: info.advDone,
            award: caculateDailyAward(lordLevel),
            done: false,
            draw: true
        };
        task.descript = task.descript.replace("#", info.target);
        totalNum++;

        userInfo.task.dayTask.push(task);
    }

    while (totalNum <= 10 && optional.length > 0) {
        let index = Math.floor((Math.random() * 1000)) % optional.length;
        let info = optional[index];
        optional.splice(index, 1);

        let task = {
            code: info.code,
            descript: info.descript,
            target: info.target,
            current: 0,
            advDone: info.advDone,
            award: caculateDailyAward(lordLevel),
            done: false,
            draw: true
        };
        task.descript = task.descript.replace("#", info.target);
        totalNum++;
        userInfo.task.dayTask.push(task);
    }

    userInfo.task.dayBigAwardState = false;
    userInfo.task.dayBigAwardDraw = true;
}

// 挑选任务中的物品
function selectGoods(type, lordLevel, logic) {
    let map = ["noddle", "tofu", "condiment", "tavern", "candy", "milk",
        "stewedmeat", "tea", "cake", "candiedfruit", "bushmeat", "seafood"];

    if (type == "factory") {
        let canUse = [];
        for (let index = 0, len = map.length; index < len; index++) {
            let key = map[index];
            if (logic.userInfo[key].level < 0) {
                continue;
            }
            canUse.push(key);
        }

        let random = Math.floor((Math.random() * 1000 % (canUse.length)));
        type = canUse[random];
    }

    let select = [];
    let hash = articsConfig[type];
    for (const key in hash) {
        let info = hash[key];
        if (info.unlock > lordLevel) {
            continue;
        }
        select.push(key);
    }

    let index = Math.floor(Math.random() * 1000) % select.length;
    return select[index];
}

// 检查任务状态
function checkMainTask(logic, mainTask) {
    let taskInfo = taskConfig.mainTask[mainTask.index];
    let isDone = false;

    if (taskInfo.build === "factory") {
        let keys = Object.keys(buildConfig.factorys);
        isDone = logic[keys[taskInfo.target]].getLevel() >= 0;
    }

    let builds = ["harbour", "lord", "canteen", "hotel", "store"];
    if (builds.indexOf(taskInfo.build) != -1) {
        isDone = logic[taskInfo.build].getLevel() >= taskInfo.target;
    }

    if (taskInfo.build === "floor" && logic.userInfo.lord.floor >= taskInfo.target) {
        isDone = true;
    }

    if (taskInfo.build === "route" && logic.userInfo.lord.route >= taskInfo.target) {
        isDone = true;
    }

    if (taskInfo.build === "land" && logic.land.getFieldNum() >= (taskInfo.target + 1)) {
        isDone = true;
    }

    if (taskInfo.build === "aquatic" && logic.aquatic.getFieldNum() >= (taskInfo.target + 1)) {
        isDone = true;
    }

    if (taskInfo.build === "livestock" && logic.livestock.getFieldInfo(taskInfo.target).state >= 0) {
        isDone = true;
    }

    if (taskInfo.build === "paddy" && logic.paddy.getFieldNum() >= (taskInfo.target + 1)) {
        isDone = true;
    }

    if (taskInfo.build === "orchard" && logic.orchard.getFieldNum() >= (taskInfo.target + 1)) {
        isDone = true;
    }

    if (isDone && mainTask.done == false && mainTask.draw == true) {
        mainTask.done = true;
        mainTask.draw = false;
    }
}

// 计算支线任务奖励
function caculateBrunchAward(level) {
    let award = {
        cash: function (level) {
            return (1000 + 100 * level);
        }(level),
        material: { "mineral-shitou": 1, "mineral-mutou": 1, "mineral-niantu": 1 },
        gem: 3,
    }
    return award;
}

// 计算每日任务奖励
function caculateDailyAward(level) {
    let award = {
        material: { "mineral-shitou": 10, "mineral-mutou": 10, "mineral-niantu": 10 },
        gem: 3,
    }
    return award;
}
