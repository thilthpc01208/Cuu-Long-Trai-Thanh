const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Noddle(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Noddle(userInfo, logic) {
    this.name = "noddle";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Noddle.prototype = factoryBase;
