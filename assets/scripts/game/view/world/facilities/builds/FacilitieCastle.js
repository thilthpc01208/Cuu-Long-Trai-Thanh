const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
        floorsNode: { type: cc.Node, default: null },
        stairsNode: { type: cc.Node, default: null },
        factorysNode: { type: cc.Node, default: null },
    },

    faciliteLoad() {
        this.buildName = "castle";

        this.backStairs = this.stairsNode.getChildByName("back").children;
        this.fontStairs = this.stairsNode.getChildByName("font").children;
        this.floors = this.floorsNode.children;
        this.factorys = this.factorysNode.children;
    },

    faciliteEnable() {
        this.setCastle();
    },

    touchStart(event) {
        this.startPos = event.getLocation();
        this.canSelect = true;
    },

    touchMove(event) {
        let movePos = event.getLocation();
        let dis = (movePos.subSelf(this.startPos)).mag()
        if (dis >= 10) {
            this.canSelect = false;
        }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; }
    },

    updateCastleCallBack(level) {
        this.setCastle();
    },

    setCastle() {
        let floor = this.logic.lord.getFloor();
        for (let index = 0; index <= floor; index++) {
            this.factorys[index].active = true;
            this.floors[index].active = true;
            
            let tempIndex = 5 - index;
            if (tempIndex >= 0) {
                this.backStairs[5 - index].active = true;
                this.fontStairs[5 - index].active = true;
            }
        }
    }
});
