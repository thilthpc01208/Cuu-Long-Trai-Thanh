const buildConfig = require("../../../../../config/alone/BuildsConfig");
const ActionRental = require("../../character/action/ActionRental");
const RoleBase = require("../../character/role/RoleBase");

const RouteConfig = require("../../../../../config/alone/RouteConfig");
const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "tenant";

        this.startArr = {};
        this.endArr = {};

        this.createTime = 48;

        //对象池
        this.rentals = {};
    },

    start() {
        let dots = RouteConfig.dots;
        for (const key in dots) {
            let dot = dots[key];
            if (dot.start == 1) { this.startArr[key] = dot; }
            if (dot.end == 1) { this.endArr[key] = dot; }
        }
    },
   
    onEnable() {
        this.schedule(this.updateRental, 1);
        this.createTime = this.createTime / this.getFactoryNum();
    },

    onDisable() {
        this.unschedule(this.updateRental, 1);
    },

    updateRental(dt) {
        this.createTime -= dt;
        if (this.createTime > 0) { return; }
        this.createTime = 48 / this.getFactoryNum();

        let startDot = this.selectStartDot();
        let endDot = this.selectEndDot(startDot);
        let path = this.createPath(startDot, endDot);

        let roleIndex = Math.floor(Math.random() * 1000) % this.getFactoryNum();
        if (!this.rentals[roleIndex]) { this.rentals[roleIndex] = []; }

        if (this.rentals[roleIndex].length <= 0) {
            let url = "chara/chara_" + roleIndex;
            cc.Global.assertCenter.readLocalPrefab(url, function (err, perfab) {
                let rental = cc.instantiate(perfab);
                rental.addComponent(ActionRental);
                rental.addComponent(RoleBase);

                rental.parent = this.node;
                rental.getComponent("RoleBase").setPath(path, null, this.rentals[roleIndex]);
            }.bind(this));
        }
        else {
            let rental = this.rentals[roleIndex].pop();
            rental.active = true;
            
            rental.addComponent(ActionRental);
            rental.addComponent(RoleBase);

            rental.parent = this.node;
            rental.getComponent("RoleBase").setPath(path, null, this.rentals[roleIndex]);
        }
    },

    selectStartDot() {
        let floor = this.logic.lord.getFloor();
        let random = Math.floor(Math.random() * 1000);
        let index = random % (floor + 1);
        index = index == 0 ? 1 : index;

        let arr = [];
        for (const key in this.startArr) {
            let dot = this.startArr[key];
            if (dot.floor !== index) {
                continue;
            }
            arr.push(key);
        }

        random = Math.floor(Math.random() * 1000);
        let len = arr.length;
        index = random % len;

        return arr[index];
    },

    selectEndDot(start) {
        let floor = this.logic.lord.getFloor();

        let random = Math.floor(Math.random() * 1000);
        let index = random % (floor + 1);
        index = index == 0 ? 1 : index;

        let arr = [];
        for (const key in this.startArr) {
            if (key === start) { continue; }
            let dot = this.startArr[key];
            if (dot.floor !== index) {
                continue;
            }
            arr.push(key);
        }

        random = Math.floor(Math.random() * 1000);
        let len = arr.length;
        index = random % len;

        return arr[index];
    },

    createPath(start, end) {
        let name = start + "-" + end;
        let dots = RouteConfig.pathMap[name];

        let path = [];
        for (let i = 0, len = dots.length; i < len; i++) {
            let dotInfo = RouteConfig.dots[dots[i]];
            path.push({ x: dotInfo.x, y: dotInfo.y });
        }

        return path;
    },

    checkDotIsOpen(dotIndex) {
        let floor = this.logic.lord.getFloor();
        let dot = RouteConfig.dots[dotIndex];

        if (dot.floor > floor) { return false; }
        if (dot.start == 0 || dot.end == 0) {
            return false;
        }

        return true;
    },

    getFactoryNum() {
        let factoryKeys = Object.keys(buildConfig.factorys);
        let factoryNum = 0;
        for (let i = 0, len = factoryKeys.length; i < len; i++) {
            let level = this.logic[factoryKeys[i]].getLevel();
            if (level < 0) { continue; }
            factoryNum++;
        }
        return factoryNum;
    }
});
