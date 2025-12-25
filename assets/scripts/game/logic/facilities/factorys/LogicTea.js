const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Tea(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Tea(userInfo, logic) {
    this.name = "tea";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Tea.prototype = factoryBase;
