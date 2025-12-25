const SquareConfig = require("../../../../../config/alone/SquareConfig");
const ActionDinner = require("../../character/action/ActionDinner");
const ActionHotel = require("../../character/action/ActionHotel");

const RoleBase = require("../../character/role/RoleBase");
const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
        back: {
            type: cc.Node,
            default: null
        },

        font: {
            type: cc.Node,
            default: null
        }
    },

    faciliteLoad() {
        this.buildName = "square";
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

    updateCanteenCustomCallback(data) {
        let start = Math.floor(Math.random() * 10) % 2;
        let end = 7;
        switch (data.seatIndex) {
            case 0:
                end = 7;
                break;
            case 1:
                end = 4;
                break;
            case 2:
                end = 7;
                break;
            case 3:
                end = 5;
                break;
            default:
                break;
        }

        let path = this.createPath(start, end);
        let roleIndex = 12 + Math.floor(Math.random() * 1000) % 8;
        if (!this.customs[roleIndex]) { this.customs[roleIndex] = []; }

        if (this.customs[roleIndex].length <= 0) {
            let url = "chara/chara_" + roleIndex;
            cc.Global.assertCenter.readLocalPrefab(url, function (err, perfab) {
                let custom = cc.instantiate(perfab);

                custom.addComponent(ActionDinner);
                custom.addComponent(RoleBase);
                custom.parent = this.node;

                data.back = this.back;
                data.font = this.font;
                data.roleIndex = roleIndex;

                custom.getComponent("RoleBase").setPath(path, data, this.customs[roleIndex]);
            }.bind(this));
        }
        else {
            let custom = this.customs[roleIndex].pop();
            custom.active = true;

            custom.addComponent(ActionDinner);
            custom.addComponent(RoleBase);
            custom.parent = this.node;

            data.back = this.back;
            data.font = this.font;
            data.roleIndex = roleIndex;

            custom.getComponent("RoleBase").setPath(path, data, this.customs[roleIndex]);
        }
    },

    updateHotelCustomCallback(data) {
        let start = Math.floor(Math.random() * 10) % 2;
        let end = 8;
        let path = this.createPath(start, end);

        let roleIndex = 12 + Math.floor(Math.random() * 1000) % 8;
        if (!this.customs[roleIndex]) { this.customs[roleIndex] = []; }

        if (this.customs[roleIndex].length <= 0) {
            let url = "chara/chara_" + roleIndex;
            cc.Global.assertCenter.readLocalPrefab(url, function (err, perfab) {
                let custom = cc.instantiate(perfab);

                custom.addComponent(ActionHotel);
                custom.addComponent(RoleBase);

                custom.parent = this.node;
                data.back = this.back;
                data.font = this.font;

                custom.getComponent("RoleBase").setPath(path, data, this.customs[roleIndex]);
            }.bind(this));
        }
        else {
            let custom = this.customs[roleIndex].pop();
            custom.active = true;

            custom.addComponent(ActionHotel);
            custom.addComponent(RoleBase);

            custom.parent = this.node;
            data.back = this.back;
            data.font = this.font;

            custom.getComponent("RoleBase").setPath(path, data, this.customs[roleIndex]);
        }
    },

    createPath(start, end) {
        let name = start + "-" + end;
        let dots = SquareConfig.pathMap[name];

        let path = [];
        for (let i = 0, len = dots.length; i < len; i++) {
            let dotInfo = SquareConfig.dots[dots[i]];
            path.push({ x: dotInfo.x, y: dotInfo.y });
        }

        return path;
    }
});
