const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Cake(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Cake(userInfo, logic) {
    this.name = "cake";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Cake.prototype = factoryBase;
