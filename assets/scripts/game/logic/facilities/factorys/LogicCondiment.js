const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Condiment(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Condiment(userInfo, logic) {
    this.name = "condiment";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Condiment.prototype = factoryBase;
