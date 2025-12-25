const factoryBase = require("./LogicFactoryBase");

module.exports = function (userInfo, logic) {
    return new Candiedfruit(userInfo, logic);
}

/**
 * 主房
 * @constructor
 */
function Candiedfruit(userInfo, logic) {
    this.name = "candiedfruit";
    this.userInfo = userInfo;
    this.logic = logic;
    this.init();
}

Candiedfruit.prototype = factoryBase;