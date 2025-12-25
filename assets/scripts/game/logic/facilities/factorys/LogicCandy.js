const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Candy(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Candy(userInfo, logic) {
    this.name = "candy";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Candy.prototype = factoryBase;