const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Bushmeat(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Bushmeat(userInfo, logic) {
    this.name = "bushmeat";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Bushmeat.prototype = factoryBase;