const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Stewedmeat(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Stewedmeat(userInfo, logic) {
    this.name = "stewedmeat";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Stewedmeat.prototype = factoryBase;
