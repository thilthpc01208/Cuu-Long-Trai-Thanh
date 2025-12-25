const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Tofu(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Tofu(userInfo, logic) {
    this.name = "tofu";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Tofu.prototype = factoryBase;
