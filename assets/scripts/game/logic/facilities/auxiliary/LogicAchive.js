const achiveConfig = require("../../../../config/alone/AchievConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const userData = require("../../sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Achive(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Achive(userInfo, logic) {
    this.name = "achive";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Achive.prototype;

handler.init = function () {
    this.achiveUserMap = sortAchiveUser(this.userInfo.achive);
    this.achiveConfMap = sortAchiveConf();
};

/**
 * 推进进度
 */
handler.plusAchive = function (data) {
    let code = data.code;
    let num = data.num;

    this.achiveUserMap[code].current += parseInt(num);

    let done = this.achiveUserMap[code].done;
    let targetNum = this.achiveUserMap[code].target;
    let current = this.achiveUserMap[code].current;
    if (done == false && current >= targetNum) {
        this.achiveUserMap[code].draw = false;
        this.achiveUserMap[code].done = true;
    }

    userData.flag(this.userInfo.achive);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.AchiveModify, null);
};

/**
 * 获取奖励
 */
handler.drawAward = function (data) {
    let scale = data.adv == true ? normalConfig.rewardVideoScale : 1;
    let code = data.code;

    let achiveUser = this.achiveUserMap[code];
    if (achiveUser.done === false ||
        achiveUser.draw === true) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["canntGet"]);
        return;
    }

    let award = this.achiveUserMap[code].award;
    achiveUser.done = false;
    achiveUser.draw = true;

    this.logic.lord.addRes({ gem: award }, scale, data.startPos);
    userData.flag(this.userInfo.achive);

    let achiveConf = this.achiveConfMap[code];
    let nextIndex = achiveUser.index + 1;
    if (nextIndex >= achiveConf.target.length) {
        achiveUser.done = true;
        return;
    }

    achiveUser.index = nextIndex;
    achiveUser.target = achiveConf.target[nextIndex];
    achiveUser.award = achiveConf.award[nextIndex];
    achiveUser.done = false;
    achiveUser.draw = true;
    achiveUser.descript = achiveConf.descript.replace("#", achiveUser.target);

    if (achiveUser.current >= achiveUser.target) {
        achiveUser.done = true;
        achiveUser.draw = false;
    }

    userData.flag(this.userInfo.achive);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.AchiveModify, null);
};

handler.hasGoodsToDraw = function () {
    let achive = this.userInfo.achive;
    for (let index = 0, len = achive.length; index < len; index++) {
        let state = achive[index].done == true && achive[index].draw == false;
        if (state == true) {
            return true;
        }
    }
    return false;
};

/**
 * 获取成就信息
 */
handler.getAchiveInfo = function () {
    let achiveArr = this.userInfo.achive;

    let len = achiveArr.length;
    for (let index = 0; index < len; index++) {
        let info = achiveArr[index];
        info.percent = info.current / info.target;
        if (info.percent > 1) {
            info.percent = 1;
        }
    }

    let temp = JSON.parse(JSON.stringify(achiveArr));
    temp.sort(function (a, b) {
        if (a.done && a.draw) {
            a.tempPercent = -1;
        }
        else {
            a.tempPercent = a.percent;
        }

        if (b.done && b.draw) {
            b.tempPercent = -1;
        }
        else {
            b.tempPercent = b.percent;
        }

        //1,2,3
        return b.tempPercent - a.tempPercent;
    });

    return temp;
};

// 将用户成就map化
function sortAchiveUser(achive) {
    let achiveMap = {};

    let achiveArr = achive;
    let len = achiveArr.length;
    for (let index = 0; index < len; index++) {
        let info = achiveArr[index];
        achiveMap[info.code] = info;
    }

    return achiveMap;
}

// 将成就配置map化
function sortAchiveConf() {
    let achiveMap = {};

    let achiveArr = achiveConfig.achivement;
    let len = achiveArr.length;
    for (let index = 0; index < len; index++) {
        let info = achiveArr[index];
        achiveMap[info.code] = info;
    }

    return achiveMap;
}