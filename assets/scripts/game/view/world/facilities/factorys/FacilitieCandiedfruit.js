const FacilitieFactoryBase = require("./FacilitieFactoryBase");

cc.Class({
    extends: FacilitieFactoryBase,

    properties: {

    },

    faciliteLoad() {
        this.coinSpin = this.node.getChildByName("coinSpin");
        this.coinSpin.active = false;
        this.buildName = "candiedfruit";
    },
});
