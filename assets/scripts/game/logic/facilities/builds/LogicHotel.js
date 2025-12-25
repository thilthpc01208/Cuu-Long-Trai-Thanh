const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Hotel(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Hotel(userInfo, logic) {
    this.name = "hotel";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Hotel.prototype;

handler.init = function () {
};

handler.load = function () {
    let level = this.userInfo.hotel.level;
    level = level >= 0 ? level : 0;
    this.createPersonTime = buildConfig.hotel[level].circle_time;
};

handler.update = function (dt) {
    this.updateCustom();
    this.updatePerson();
};

/**
 * 升级宾馆
 */
handler.updateHotel = function () {
    let nextLevel = this.userInfo.hotel.level + 1;
    let hotelConfig = buildConfig.hotel[nextLevel];

    let needLevel = hotelConfig.unlock;
    if (needLevel > this.logic.lord.getLevel()) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return;
    }

    let needCash = hotelConfig.price;
    if (needCash > this.userInfo.lord.cash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    let needMaterial = hotelConfig.material;
    let result = this.logic.store.canUseItems(needMaterial);
    if (!result) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "material", extra: Object.keys(needMaterial) });
        return false;
    }

    this.logic.lord.useRes({ cash: needCash });
    this.logic.store.useItems(needMaterial);

    this.userInfo.hotel.level = nextLevel;
    userData.flag(this.userInfo.hotel);

    this.logic.sendMsgToScene("hotel", {
        event: "updateHotelCallback",
        data: nextLevel
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("hotel_level", nextLevel);
    
    return true;
};

/**
 * 查看利润
 */
handler.getProfit = function () {
    return this.userInfo.hotel.profit;
};

/**
 * 获取利润
 */
handler.drawProfit = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let res = { cash: this.userInfo.hotel.profit };

    this.userInfo.hotel.profit = 0;
    userData.flag(this.userInfo.hotel);

    this.logic.lord.addRes(res, scale, data.startPos);
};

/**
 * 是否有空床位
 */
handler.hasBlackBed = function () {
    let currentPerson = this.userInfo.hotel.persons.length;
    let maxBedNum = buildConfig.hotel[this.getLevel()].capacity;
    return maxBedNum - currentPerson;
};

/**
 * 旅客进入
 */
handler.roleEnter = function (data) {
    let level = this.getLevel();

    let endTime = this.logic.getSysTime() + buildConfig.hotel[level].sleep * 1000;
    this.userInfo.hotel.persons.push({ "endTime": endTime });

    let profit = buildConfig.hotel[level].profit;
    this.userInfo.hotel.profit += profit;

    this.logic.task.plusBrunchTask({ code: "BT_HotelCustomerCount", num: 1, goods: null});
    this.logic.task.plusDayTask({ code: "DT_HotelCustomCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_HotelCustomerCount", num: 1 });

    userData.flag(this.userInfo.hotel);
};

/**
 * 穿建旅客
 * @param {*} dt 
 */
handler.updateCustom = function (dt = 1) {
    if (this.userInfo.hotel.level < 0) { return; }
    this.createPersonTime -= dt;
    if (this.createPersonTime > 0) { return; }

    this.createPersonTime = buildConfig.hotel[this.getLevel()].circle_time;
    let maxBedNum = buildConfig.hotel[this.getLevel()].capacity;
    let personNum = this.userInfo.hotel.persons.length;
    if (maxBedNum > personNum) {
        //创建旅客
        this.logic.sendMsgToScene("square", {
            event: "updateHotelCustomCallback",
            data: {}
        });
    }
};

/**
 * 更新旅客状态
 * @param {*} dt 
 */
handler.updatePerson = function (dt) {
    let currentTime = this.logic.getSysTime()

    let persons = this.userInfo.hotel.persons;
    for (let index = 0, len = persons.length; index < len; index++) {
        let person = persons[index];
        if (person.endTime > currentTime) { continue; }
        persons.splice(index, 1);
        userData.flag(this.userInfo.hotel);
        break;
    }
};

handler.getLevel = function () {
    return this.userInfo.hotel.level;
};

handler.getSleepTime = function () {
    return buildConfig.hotel[this.getLevel()].sleep;
};

/**
 * 获取升级信息
 * @returns 
 */
handler.getUpdateInfo = function () {
    let currentLevel = this.getLevel();

    let nextLevel = currentLevel + 1;
    let maxLevel = buildConfig.hotel.length - 1;
    if (nextLevel > maxLevel) {
        nextLevel = maxLevel;
    }

    let levelLimit = buildConfig.hotel[nextLevel].unlock;
    let priceNeed = buildConfig.hotel[nextLevel].price;

    let material = buildConfig.hotel[nextLevel].material;
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
