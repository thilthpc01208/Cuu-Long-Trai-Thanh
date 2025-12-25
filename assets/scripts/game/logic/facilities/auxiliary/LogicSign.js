const normalConfig = require("../../../../config/alone/NormConfig");
const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Sign(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Sign(userInfo, logic) {
    this.name = "sign";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Sign.prototype;

handler.init = function () {
    this.oneDay = 60 * 60 * 24 * 1000;
};

handler.update = function (dt) {
    this.updateSignIn();
};

/**
 * 获取奖励
 */
handler.getAward = function (data) {
    let index = data.index;
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;

    let state = this.userInfo.sign.state;
    if (state[index] === -1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntGet"]);
        return;
    }

    if (state[index] === 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["repeatGet"]);
        return;
    }

    let awards = normalConfig.sign[index];
    for (const key in awards) {
        if (key === "material" && Object.keys(awards[key]).length > 0) {
            this.logic.store.storeItems(awards[key], scale, data.startPos);
        }

        if (key === "cash" || key === "gem" && awards[key] > 0) {
            let res = {}; res[key] = awards[key];
            this.logic.lord.addRes(res, scale, data.startPos);
        }
    }

    state[index] = 1;
    userData.flag(this.userInfo.sign);
};

/**
 * 获取签到状态
 */
handler.getSignState = function () {
    return this.userInfo.sign.state;
};

/**
 * 更新状态
 * @returns 
 */
handler.updateSignIn = function () {
    let time = this.logic.getSysTime();
    let sign = this.userInfo.sign;

    let lastDay = Math.floor(sign.time / this.oneDay);
    let currentDay = Math.floor(time / this.oneDay);
    if (lastDay === currentDay) { return; }

    this.logic.task.createNewDailyTask();

    let disDay = currentDay - lastDay;
    if (disDay === 1) {
        this.userInfo.sign.continue++;
    }
    else {
        this.userInfo.sign.continue = 0;
    }
    this.userInfo.sign.time = time;

    if (this.userInfo.sign.continue === 7 ||
        this.userInfo.sign.continue === 0) {
        this.userInfo.sign.state = [
            0, -1, -1, -1, -1, -1, -1, -1
        ];
        this.userInfo.sign.continue = 0;
        userData.flag(this.userInfo.sign);
        return;
    }

    let index = this.userInfo.sign.continue;
    this.userInfo.sign.state[index] = 0;
    userData.flag(this.userInfo.sign);
};