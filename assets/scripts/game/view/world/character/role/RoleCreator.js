const Logic = require('../../../../logic/logic');

cc.Class({
    extends: cc.Component,

    properties: {
        lordRoleLayer: {
            type: cc.Node,
            default: null
        },

        lampRoleLayer: {
            type: cc.Node,
            default: null
        },

        dinerUpRoleLayer: {
            type: cc.Node,
            default: null
        },

        dinerUpDownLayer: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {
        this.msg = [];

        this.logic = Logic.getInstance();
        this.animalIndex = 0;
    },

    start() {
        this.routeDots = this.node.getComponent("RouteDots");
    },

    onEnable() {
        this.rolePool = {};

        cc.Global.listenCenter.register(cc.Global.eventConfig.CreateRole, this.saveMsg, this);
        this.schedule(this.createRole.bind(this), 0.5);
    },

    onDisable() {
        this.rolePool = {};

        cc.Global.listenCenter.remove(cc.Global.eventConfig.CreateRole, this);
        this.unschedule(this.createRole.bind(this),0.5);
    },

    saveMsg(data) {
        if (data.extra == "immediate") {
            this.createRole(0, data);
        }
        else {
            this.msg.push(data);
        }
    },

    createRole(dt, data = null) {
        if (data == null) {
            if (this.msg.length <= 0) {
                return;
            }
            data = this.msg.pop();
        }

        let roleType = data.type;
        let rolePath = JSON.parse(JSON.stringify(this.routeDots[roleType]));
        let aniPath = "";
        if (data.rolePath) {
            aniPath = data.rolePath;
        }
        else {
            aniPath = this.getAnimalPath(roleType);
        }
        
        if (this.getRoleLayer(roleType,data) == null) {
            return;
        }

        cc.Global.assertCenter.readLocalSpin(aniPath, function (err, spine) {
            let roleProfabPath = this.getRolePath(roleType);
            if (!this.rolePool[roleType]) { this.rolePool[roleType] = []; }
            
            if (this.rolePool[roleType].length > 0) {
                let role = this.rolePool[roleType].pop();
                role.getComponent("sp.Skeleton").skeletonData = spine;
                role.aniPath = aniPath;
                this.setRole(role, roleType, data, false);
                role.getComponent("RoleNative").setPath(rolePath, data, this.rolePool[roleType]);
                role.active = true;
            }
            else {
                cc.Global.assertCenter.readLocalPrefab(roleProfabPath, function (err, prefab) {
                    let role = cc.instantiate(prefab);
                    role.getComponent("sp.Skeleton").skeletonData = spine;
                    role.aniPath = aniPath;
                    this.setRole(role, roleType, data, true);
                    role.getComponent("RoleNative").setPath(rolePath, data, this.rolePool[roleType]);
                    role.active = true;
                }.bind(this));
            }
        }.bind(this));
    },

    getAnimalPath(roleType) {
        let index = this.animalIndex + 1;
        this.animalIndex++;
        this.animalIndex = this.animalIndex % 33;

        let aniPath = "";
        if (roleType === "outdoor") {
            aniPath = "leader/zj_5";
        }

        if (roleType === "mine") {
            aniPath = "leader/zj_3";
        }

        if (roleType === "factoryer" ||
            roleType === "lamper" ||
            roleType === "diner") {
            aniPath = "custom/kr_" + index;
        }

        return aniPath;
    },

    getRolePath(roleType) {
        let path = "";
        if (roleType === "outdoor" ||
            roleType === "mine") {
            path = "chara/" + roleType;
        }

        if (roleType === "lamper" ||
            roleType === "diner" ||
            roleType === "factoryer") {
            path = "chara/customer";
        }

        return path;
    },

    setRole(role, roleType, data, frist) {
        let roleLayer = this.getRoleLayer(roleType,data);
        if (!roleLayer) {
            return false;
        }

        if (roleType === "outdoor") {
            role.parent = roleLayer;
        }

        if (roleType === "mine") {
            role.parent = roleLayer;
        }

        if (roleType === "factoryer") {
            role.parent = roleLayer;
        }

        if (roleType === "lamper") {
            role.parent = roleLayer;
        }

        if (roleType === "diner" && data.layer === "up") {
            role.parent = roleLayer;
        }

        if (roleType === "diner" && data.layer === "down") {
            role.parent = roleLayer;
        }

        if (!frist) {
            return true;
        }

        if (roleType === "outdoor") {
            role.addComponent(require('../character/Action_Adve'));
        }

        if (roleType === "mine") {
            role.addComponent(require('../character/Action_Mine'));
        }

        if (roleType === "factoryer") {
            role.addComponent(require('../character/Action_Factory'));
        }

        if (roleType === "lamper") {
            role.addComponent(require('../character/Action_Lamper'));
        }

        if (roleType === "diner" && data.layer === "up") {
            role.addComponent(require('../character/Action_Dinner'));
        }

        if (roleType === "diner" && data.layer === "down") {
            role.addComponent(require('../character/Action_Dinner'));
        }

        return true;
    },

    getRoleLayer(roleType, data) {
        if (roleType != "diner" && this[roleType + "RoleLayer"]) {
            return this[roleType + "RoleLayer"];
        }

        if (roleType == "diner" && this[roleType + "RoleLayer" + data.layer]) {
            return this[roleType + "RoleLayer" + data.layer];
        }

        let build = this.node.parent.getChildByName("build");
        let layer = null;
        if (roleType === "outdoor") {
            layer = build.getChildByName("lordRoleLayer");
        }

        if (roleType === "mine") {
            layer = build.getChildByName("lordRoleLayer");
        }

        if (roleType === "factoryer") {
            layer = build.getChildByName("lordRoleLayer");
        }

        if (roleType === "lamper") {
            layer = build.getChildByName("lampRoleLayer");
        }

        if (layer) {
            this[roleType + "RoleLayer"] = layer;
        }

        if (roleType === "diner" && data.layer === "up") {
            layer = build.getChildByName("bud_square").getChildByName("holiday").getChildByName("dinerRoleUpLayer");
            if (layer) { this[roleType + "RoleLayer" + data.layer] = layer; }
        }

        if (roleType === "diner" && data.layer === "down") {
            layer = build.getChildByName("bud_square").getChildByName("holiday").getChildByName("dinerRoleDownLayer");
            if (layer) { this[roleType + "RoleLayer" + data.layer] = layer; }
        }

        return layer;
    }
});
