const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Milk(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Milk(userInfo, logic) {
    this.name = "milk";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Milk.prototype = factoryBase;