const ActionShop = require("../../character/action/ActionShop");
const RoleBase = require("../../character/role/RoleBase");

const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "footwalk";
        this.customs = {};
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

    updateStallCustomCallback() {
        let path = [{ x: -1150, y: 0 }, { x: -525 + (Math.random() * 200 - 100), y: 0 }];

        let roleIndex = Math.floor(Math.random() * 1000) % 20;
        if (!this.customs[roleIndex]) { this.customs[roleIndex] = []; }

        if (this.customs[roleIndex].length <= 0) {
            let url = "chara/chara_" + roleIndex;
            cc.Global.assertCenter.readLocalPrefab(url, function (err, perfab) {
                let custom = cc.instantiate(perfab);
                custom.addComponent(ActionShop);
                custom.addComponent(RoleBase);

                custom.parent = this.node;
                custom.getComponent("RoleBase").setPath(path, null, this.customs[roleIndex]);
            }.bind(this));
        }
        else {
            let custom = this.customs[roleIndex].pop();
            custom.parent = this.node;
            custom.addComponent(ActionShop);
            custom.addComponent(RoleBase);

            custom.getComponent("RoleBase").setPath(path, null, this.customs[roleIndex]);
        }
    },
});
