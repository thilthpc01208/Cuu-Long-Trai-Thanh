const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Tavern(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Tavern(userInfo, logic) {
    this.name = "tavern";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Tavern.prototype = factoryBase;