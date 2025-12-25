const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Seafood(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Seafood(userInfo, logic) {
    this.name = "seafood";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Seafood.prototype = factoryBase;
