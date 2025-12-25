const dataCreate = require("./dataCreate");
const handler = module.exports;

const userAttr = ["lord", "sign", "achive", "task", "rental", "store", "stall", "depot",
    "harbour", "hotel", "outdoor", "land", "paddy", "orchard", "livestock", "aquatic",
    "hunt", "pick", "catch", "canteen", "noddle", "tofu", "condiment", "tavern",
    "candy", "milk", "stewedmeat", "tea", "cake", "candiedfruit", "bushmeat",
    "seafood"];

/**
 * 获取用户数据
 */
handler.getUserInfo = function (logic, account, callback = null) {
    let isNetGame = cc.Global.casualStory.getData("isNetGame");
    let userInfo = {};
    if (!isNetGame) {
        getUserDataFromLocal(account, userInfo, logic, callback);
    }

    if (isNetGame) {
        getUserDataFromNet(account, userInfo, logic, callback);
    }
};

/**
 * 初始化数据
 * @param {*} userInfo 
 */
function initUserData(account, userInfo, logic) {
    for (let index = 0, len = userAttr.length; index < len; index++) {
        let attr = userAttr[index];
        userInfo[attr] = dataCreate["create_" + attr + "_data"](account, logic);
        userInfo[attr].isModify = false;
    }

    saveAllUserDataToLocal(userInfo);
}

/**
 * 修改标记
 * @param {} params 
 */
handler.flag = function (node) {
    node.isModify = true;
};

/**
 * 保存数据
 */
handler.flush = function (userInfo) {
    for (let index = 0, len = userAttr.length; index < len; index++) {
        let attr = userAttr[index];
        let value = userInfo[attr];

        let isModify = value.isModify;
        if (!isModify) { continue; }
        value.isModify = false;

        let str = JSON.stringify(value);
        saveUserDataToNet(userInfo, attr);
        cc.sys.localStorage.setItem(attr, str);
    }
};

/**
 * 从本地获取数据
 * @param {*} userInfo 
 */
function getUserDataFromLocal(account, userInfo, logic, callback) {
    userInfo.user = cc.sys.localStorage.getItem("lord");
    if (!userInfo.user || userInfo.user == "") {
        initUserData(account, userInfo, logic);
    }
    else {
        for (let index = 0, len = userAttr.length; index < len; index++) {
            let attr = userAttr[index];
            userInfo[attr] = JSON.parse(cc.sys.localStorage.getItem(attr));
            userInfo[attr].isModify = false;
        }
    }

    callback(userInfo);
}

/**
 * 从网络获取数据
 * @param {*} useInfo 
 */
function getUserDataFromNet(account, useInfo, logic, callback) {
    let url = cc.Global.casualStory.getData("ip") + "api/registerUser?account=" + account;
    cc.Global.httpUtil.httpGet(url, function (userMsg) {
        if (data == -1) {
            return;
        }

        if (!userMsg.is_create) {
            initUserData(account, useInfo, logic);
            callback(useInfo);
            return;
        }

        for (const key in userMsg) {
            useInfo[key] = JSON.parse(userMsg[key]);
            useInfo[key].isModify = false;
        }

        callback(useInfo);
    });
}

/**
 * 保存全部数据到本地
 */
function saveAllUserDataToLocal(userInfo) {
    for (let index = 0, len = userAttr.length; index < len; index++) {
        let attr = userAttr[index];
        cc.sys.localStorage.setItem(attr, JSON.stringify(userInfo[attr]));
    }
}

/**
 * 上传数据到网络
 * @param {*} useInfo 
 * @param {*} key 
 */
function saveUserDataToNet(userInfo, key) {
    let value = JSON.stringify(userInfo[key]);
    let account = userInfo.lord.account;

    let sendData = {
        account: account,
        key: key,
        value: value
    };

    let url = cc.Global.casualStory.getData("ip") + "api/updateUserInfo";
    //cc.Global.httpUtil.httpPost(url, sendData, null);
}