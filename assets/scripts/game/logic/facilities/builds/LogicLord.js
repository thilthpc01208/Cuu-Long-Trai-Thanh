const buildConfig = require("../../../../config/alone/BuildsConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const userData = require("../../../logic/sustain/dataGroup/userData");

module.exports = function (userInfo, logic) {
    return new Lord(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Lord(userInfo, logic) {
    this.name = "lord";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

const handler = Lord.prototype;

handler.init = function () {
    cc.Global.casualStory.setData("level", this.userInfo.lord.level);
    this.initTime();
};

/**
 * 初始化时间
 */
handler.initTime = function () {
    this.dayNum = this.userInfo.lord.dayPass % normalConfig.oneYearDay;
    this.yearNum = Math.floor(this.userInfo.lord.dayPass / normalConfig.oneYearDay);
    this.season = Math.floor(this.dayNum / normalConfig.oneSeasonDay);

    caculateTime(this);
    this.passSecond = 0;
    this.passMinite = 0;
};

handler.update = function (dt) {
    this.timePass(dt);
};

/**
 * 时间流逝
 */
handler.timePass = function (dt) {
    this.passSecond += dt;
    this.passMinite += dt;

    if ((this.passMinite / 60) >= 1) {
        this.passMinite = 0;
        this.logic.task.plusDayTask({ code: "DT_TimePassMinite", num: 1, goods: null });
    }

    if (this.passSecond >= normalConfig.oneDaySecond) {
        this.userInfo.lord.dayPass += 1;
        this.passSecond = 0;

        userData.flag(this.userInfo.lord);
        caculateTime(this);
    }
};

/**
 * 主房更新
 */
handler.updateLord = function (data) {
    let lordLevel = this.userInfo.lord.level;
    let lordConfig = buildConfig.lord;
    let nextLevel = lordLevel + 1;

    if (lordLevel >= lordConfig.length - 1) {
        this.logic.castMsgToScreen(cc.Global.wordsConfig.tips["fullLevel"]);
        return null;
    }

    let cash = this.userInfo.lord.cash;
    let cost = lordConfig[nextLevel].price;
    if (cash < cost) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return null;
    }

    let needMaterial = lordConfig[nextLevel].material;
    if (!this.logic.store.canUseItems(needMaterial)) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "material", extra: Object.keys(needMaterial) });
        return null;
    }

    if (this.userInfo.harbour.level < lordConfig[nextLevel].precondition.harbour) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "harbour" });
        return null;
    }

    this.logic.store.useItems(needMaterial)
    this.useRes({ cash: cost });

    this.userInfo.lord.level = nextLevel;
    userData.flag(this.userInfo.lord);

    this.logic.sendMsgToScene("LordInGame", { event: "updateLordCallback", data: null });

    cc.Global.listenCenter.fire(cc.Global.eventConfig.LordModify, null);

    if (nextLevel == 4 || nextLevel == 9 || nextLevel == 14) {
        //let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        //cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "skipWeb" });
    }

    this.logic.task.plusMainTask();
    
    cc.Global.sdk.postEvent2("mainhouse_level", nextLevel);

    return nextLevel;
};

/**
 * 升级路
 */
handler.updateRoute = function () {
    let nextLevel = this.userInfo.lord.route + 1;
    if (nextLevel >= buildConfig.route.length) {
        return false;
    }

    let needMaterial = buildConfig.route[nextLevel].needMaterial;
    let needCash = buildConfig.route[nextLevel].price;

    if (this.userInfo.lord.cash < needCash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash", num: needCash });
        return false;
    }

    let canUse = this.logic.store.canUseItems(needMaterial);
    if (!canUse) {
        return false;
    }

    this.logic.lord.useRes({ "cash": needCash });
    this.logic.store.useItems(needMaterial);
    this.userInfo.lord.route += 1;
    userData.flag(this.userInfo.lord);

    this.logic.sendMsgToScene("route", {
        event: "updateRouteCallBack",
        data: this.userInfo.lord
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("road_level",nextLevel);
    
    return true;
};

/**
 * 升级花坛
 */
handler.buyGarden = function (data) {
    let arr = this.userInfo.lord.garden;
    let currentLevel = arr.indexOf(1);
    let nextLevel = data.index;
    if (nextLevel >= buildConfig.garden.length) {
        return false;
    }

    let needLevel = buildConfig.garden[nextLevel].unlock;
    let needCash = buildConfig.garden[nextLevel].price;

    if (this.userInfo.lord.level < needLevel) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return false;
    }

    if (this.userInfo.lord.cash < needCash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    this.logic.lord.useRes({ "cash": needCash });
    this.userInfo.lord.garden[currentLevel] = 0;
    this.userInfo.lord.garden[needLevel] = 1;

    userData.flag(this.userInfo.lord);
    this.logic.sendMsgToScene("garden", {
        event: "updateGardenCallBack",
        data: this.userInfo.lord
    });

    let buyNum = 0;
    for (let index = 0, len = arr.length; index < len; index++) {
        if (arr[index] === -1) { continue; }
        buyNum++;
    }
    cc.Global.sdk.postEvent3("theme_count", "garden", buyNum);

    return true;
};

/**
 * 升级院墙
 */
handler.buyWall = function (data) {
    let arr = this.userInfo.lord.wall;
    let currentLevel = arr.indexOf(1);

    let nextLevel = data.index;
    if (nextLevel >= buildConfig.wall.length) {
        return false;
    }

    let needLevel = buildConfig.wall[nextLevel].unlock;
    let needCash = buildConfig.wall[nextLevel].price;

    if (this.userInfo.lord.level < needLevel) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return false;
    }

    if (this.userInfo.lord.cash < needCash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    this.logic.lord.useRes({ "cash": needCash });
    this.userInfo.lord.wall[currentLevel] = 0;
    this.userInfo.lord.wall[nextLevel] = 1;

    userData.flag(this.userInfo.lord);

    this.logic.sendMsgToScene("frontWall", {
        event: "updateWallCallBack",
        data: this.userInfo.lord
    });

    this.logic.sendMsgToScene("backWall", {
        event: "updateWallCallBack",
        data: this.userInfo.lord
    });

    let buyNum = 0;
    for (let index = 0, len = arr.length; index < len; index++) {
        if (arr[index] === -1) { continue; }
        buyNum++;
    }
    cc.Global.sdk.postEvent3("theme_count", "wall", buyNum);

    return true;
};

/**
 * 升级院墙
 */
handler.buyGround = function (data) {
    let arr = this.userInfo.lord.ground;
    let currentLevel = arr.indexOf(1);

    let nextLevel = data.index;
    if (nextLevel >= buildConfig.wall.length) {
        return false;
    }

    let needLevel = buildConfig.ground[nextLevel].unlock;
    let needCash = buildConfig.ground[nextLevel].price;

    if (this.userInfo.lord.level < needLevel) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: needLevel });
        return false;
    }

    if (this.userInfo.lord.cash < needCash) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "cash" });
        return false;
    }

    this.logic.lord.useRes({ "cash": needCash });
    this.userInfo.lord.ground[currentLevel] = 0;
    this.userInfo.lord.ground[nextLevel] = 1;

    userData.flag(this.userInfo.lord);
    this.logic.sendMsgToScene("ground", {
        event: "updateGroundCallBack",
        data: this.userInfo.lord
    });

    let buyNum = 0;
    for (let index = 0, len = arr.length; index < len; index++) {
        if (arr[index] === -1) { continue; }
        buyNum++;
    }
    cc.Global.sdk.postEvent3("theme_count", "ground", buyNum);

    return true;
};

/**
 * 升级楼层
 */
handler.updateFloor = function () {
    let nextLevel = this.userInfo.lord.floor + 1;
    if (nextLevel >= buildConfig.floor.length) {
        return false;
    }

    let needLevel = buildConfig.floor[nextLevel].unlock;
    let needCash = buildConfig.floor[nextLevel].price;
    if (this.userInfo.lord.level < needLevel) {
        return false;
    }

    if (this.userInfo.lord.cash < needCash) {
        return false;
    }

    this.logic.lord.useRes({ "cash": needCash });
    this.userInfo.lord.floor += 1;
    userData.flag(this.userInfo.lord);

    this.logic.sendMsgToScene("castle", {
        event: "updateCastleCallBack",
        data: this.userInfo.lord
    });

    this.logic.task.plusMainTask();

    cc.Global.sdk.postEvent2("floor_level",nextLevel);

    return true;
};

handler.getFloor = function () {
    return this.userInfo.lord.floor;
};

/**
 * 增加资源
 * @param res
 * @param multiple
 */
handler.addRes = function (res, multiple = 1, startPos = null) {
    if (multiple == null || multiple == undefined || !parseInt(multiple)) {
        multiple = 1;
    }

    for (const key in res) {
        if (res[key] === null || res[key] === undefined || !parseInt(res[key])) {
            continue;
        }

        let addNum = Math.ceil(res[key] * multiple);
        this.userInfo.lord[key] += addNum;

        if (res[key]) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, "confirm");
        }

        if (startPos != null && res[key] > 0) {
            let temp = { startPos: startPos, name: key, to: key, num: addNum };
            cc.Global.listenCenter.fire(cc.Global.eventConfig.GameSky, temp);
        }
    }
    userData.flag(this.userInfo.lord);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.CashModify, null);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.GemModify, null);
};

/**
 * 使用资源
 * @param res
 */
handler.useRes = function (res) {
    for (const key in res) {
        if (res[key] === null || res[key] === undefined || !parseInt(res[key])) {
            continue;
        }

        let cutNum = Math.floor(res[key]);
        this.userInfo.lord[key] -= cutNum;
    }
    userData.flag(this.userInfo.lord);

    cc.Global.listenCenter.fire(cc.Global.eventConfig.CashModify, null);
    cc.Global.listenCenter.fire(cc.Global.eventConfig.GemModify, null);
};

/**
 * 获取账号
 */
handler.getAccount = function () {
    return this.userInfo.lord.account;
};

/**
 * 获取等级
 */
handler.getLevel = function () {
    return this.userInfo.lord.level;
};

/**
 * 获取资源数据
 */
handler.getRes = function () {
    return this.userInfo.lord;
};

/**
 * 获取日期信息
 */
handler.getDate = function () {
    let week = this.userInfo.lord.dayPass % 7;
    if (week === 0) {
        week = 7
    }

    let day = this.dayNum % 30;
    if (day === 0) {
        day = 30;
    }

    let date = {
        year: this.yearNum,
        season: this.season,
        week: week - 1,
        day: day,
    };

    return date;
};

/**
 * 观看广告
 */
handler.watchAdv = function () {
    this.userInfo.lord.adv += 1;
    userData.flag(this.userInfo.lord);

    this.logic.task.plusDayTask({ code: "DT_WatchAdverCount", num: 1, goods: null });
};

handler.getGameGuideState = function () {
    return this.userInfo.lord.gameGuide;
};

handler.setGameGuideState = function (state) {
    this.userInfo.lord.gameGuide = state;
    userData.flag(this.userInfo.lord);
};

handler.getGroundLevel = function () {
    return this.userInfo.lord.ground.indexOf(1);
};

handler.getGroundState = function (index) {
    return this.userInfo.lord.ground[index];
};

handler.useGround = function (index) {
    let current = this.getGroundLevel();
    this.userInfo.lord.ground[current] = 0;
    this.userInfo.lord.ground[index] = 1;

    userData.flag(this.userInfo.lord);

    this.logic.sendMsgToScene("ground", {
        event: "updateGroundCallBack",
        data: this.userInfo.lord
    });

    return true;
};

handler.getWallLevel = function () {
    return this.userInfo.lord.wall.indexOf(1);
};

handler.getWallState = function (index) {
    return this.userInfo.lord.wall[index];
};

handler.useWall = function (index) {
    let current = this.getWallLevel();
    this.userInfo.lord.wall[current] = 0;
    this.userInfo.lord.wall[index] = 1;

    userData.flag(this.userInfo.lord);

    this.logic.sendMsgToScene("frontWall", {
        event: "updateWallCallBack",
        data: this.userInfo.lord
    });

    this.logic.sendMsgToScene("backWall", {
        event: "updateWallCallBack",
        data: this.userInfo.lord
    });

    return true;
};

handler.getGardenLevel = function () {
    return this.userInfo.lord.garden.indexOf(1);
};

handler.getGardenState = function (index) {
    return this.userInfo.lord.garden[index];
};

handler.useGarden = function (index) {
    let current = this.getGardenLevel();
    this.userInfo.lord.garden[current] = 0;
    this.userInfo.lord.garden[index] = 1;

    userData.flag(this.userInfo.lord);

    this.logic.sendMsgToScene("garden", {
        event: "updateGardenCallBack",
        data: this.userInfo.lord
    });

    return true;
};

handler.getRoute = function () {
    return this.userInfo.lord.route;
};

handler.addFieldTool = function (data) {
    let endTime = this.userInfo.lord[data.type].endTime;
    let currentTime = this.logic.getSysTime();

    if (endTime < currentTime) {
        this.userInfo.lord[data.type].endTime = currentTime + 10 * 60 * 1000;
    }
    else {
        this.userInfo.lord[data.type].endTime += 10 * 60 * 1000;
    }
};

handler.getFieldTool = function (data) {
    let endTime = this.userInfo.lord[data.type].endTime;
    let currentTime = this.logic.getSysTime();
    return endTime >= currentTime ? 2 : 1;
};

/**
 * 计算时间
 * @param {} self 
 */
function caculateTime(self) {
    self.dayNum = self.userInfo.lord.dayPass % normalConfig.oneYearDay;

    let currentYear = Math.floor(self.userInfo.lord.dayPass / normalConfig.oneYearDay);
    if (self.yearNum != currentYear && self.dayNum == 1) {
        self.yearNum = currentYear;
    }

    let currentSeason = Math.floor(self.dayNum / normalConfig.oneSeasonDay);
    if (self.season != currentSeason && self.dayNum % 30 == 1) {
        self.season = currentSeason;
        cc.Global.listenCenter.fire(cc.Global.eventConfig.ShowScreen, currentSeason);
    }

    cc.Global.listenCenter.fire(cc.Global.eventConfig.DateModify, null);
}