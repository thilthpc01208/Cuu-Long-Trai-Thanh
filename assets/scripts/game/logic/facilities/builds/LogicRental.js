const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");

const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Rental(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Rental(userInfo, logic) {
    this.name = "rental";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Rental.prototype;

handler.init = function () {

};

handler.load = function () {

};

handler.update = function (dt) {
    this.updateRental(dt);
};

/**
 * 开启一个小屋
 */
handler.openOneRental = function (data) {
    let index = data.index;
    this.userInfo.rental[index].open = true;
    this.userInfo.rental[index].level = 0;
    userData.flag(this.userInfo.rental);
};

/**
 * 升级一个小屋
 */
handler.updateOneRental = function (data) {
    let index = data.index;
    this.userInfo.rental[index].open = true;
    this.userInfo.rental[index].level += 1;
    userData.flag(this.userInfo.rental);

    this.logic.task.plusMainTask();
};

/**
 * 获取某个出租屋的具体情况
 * @param {*} data 
 */
handler.getOneRentalInfo = function (data) {
    let index = data.index;
    return this.userInfo.rental[index];
};

handler.getProfit = function (data) {
    let rentals = this.userInfo.rental;

    if (data.index || data.index == 0) {
        let profit = rentals[data.index].profit;
        return profit;
    }

    let totalCash = 0;
    for (let index = 0, len = rentals.length; index < len; index++) {
        let rental = rentals[index];
        totalCash += rental.profit;
    }
    return totalCash;
};

/**
 * 收取某个小屋的租金
 * @param {*} data 
 * @returns 
 */
handler.drawOneRentalCash = function (data) {
    let index = data.index;
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    if (data.scale) { scale = data.scale; }

    let res = { cash: this.userInfo.rental[index].profit };
    if (res.cash <= 0) { return; }

    this.userInfo.rental[index].profit = 0;
    userData.flag(this.userInfo.rental);
    this.logic.lord.addRes(res, scale, data.startPos);

    this.logic.task.plusBrunchTask({ code: "BT_RentGetProfitCount", num: 1, goods: null });
    this.logic.task.plusDayTask({ code: "DT_RentGetProfitCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_RentGetProfitCount", num: 1 });
};

/**
 * 收取全部小屋的租金
 * @param {*} data 
 * @returns 
 */
handler.drawAllRentalCash = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    if (data.scale) { scale = data.scale; }

    let rentals = this.userInfo.rental;
    let totalCash = 0;
    for (let index = 0, len = rentals.length; index < len; index++) {
        let rental = rentals[index];
        totalCash += rental.profit;
        rental.profit = 0;
    }
    userData.flag(this.userInfo.rental);

    let res = { cash: totalCash };
    this.logic.lord.addRes(res, scale, data.startPos);

    this.logic.task.plusBrunchTask({ code: "BT_RentGetProfitCount", num: 1, goods: null });
    this.logic.task.plusDayTask({ code: "DT_RentGetProfitCount", num: 1, goods: null });
    this.logic.achive.plusAchive({ code: "AT_RentGetProfitCount", num: 1 });
};

/**
 * 缓慢产生租金
 * @param {*} dt 
 */
handler.updateRental = function (dt) {
    let currentTime = this.logic.getSysTime();

    let rentals = this.userInfo.rental;
    for (let index = 0, len = rentals.length; index < len; index++) {
        let rental = rentals[index];

        if (rental.endTime > currentTime) { continue; }
        if (rental.open === false) { continue; }

        let level = rental.level;
        let nextTime = currentTime + 1000 * buildConfig.rental[level].disTime;
        if (rental.endTime == 0) { rental.endTime = nextTime; continue; }


        let num = (currentTime - rental.endTime) / (1000 * buildConfig.rental[level].disTime);
        if (num < 1) { continue; }

        num = num > buildConfig.rental[level].maxAccrual ? buildConfig.rental[level].maxAccrual : num;
        let profit = buildConfig.rental[level].rent * Math.floor(num);
        rental.profit += profit;
        rental.endTime = nextTime;

        userData.flag(this.userInfo.rental);
    }
};

/**
 * 是否有大额资金可收取
 */
handler.hasCashToDraw = function () {
    let profit = this.getProfit({});
    return profit >= 100;
};