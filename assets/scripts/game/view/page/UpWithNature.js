const PageBase = require("PageBase");
const buildConfig = require("../../../config/alone/BuildsConfig");

// truck,depot,stall(update)

cc.Class({
    extends: PageBase,

    properties: {
        updateBtn: {
            type: cc.Node,
            default: null
        },

        icon: {
            type: cc.Sprite,
            default: null
        },

        nature: {
            type: cc.Node,
            default: null
        },

        tittle: {
            type: cc.Label,
            default: null
        }
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { type: "depot", callback: null }
        }

        this.setPageState();
        this.loadIcon();
        this.setNature();
    },

    pageDisable() {

    },

    updateClick(event, data) {
        
        let type = this.extraMsg.type;

        if (type === "depot") { this.logic.depot.updateDepot(); }
        if (type === "stall") { this.logic.stall.updateStall(); }
        if (type === "truck") { this.logic.depot.updateTruck(); }

        this.setPageState();
        this.loadIcon();
        this.setNature();

        if (this.extraMsg.callback) { this.extraMsg.callback(); }
    },

    setPageState() {
        let type = this.extraMsg.type;
        let updateInfo = null;
        if (type === "truck") {
            updateInfo = this.logic.depot.getUpdateTruckInfo();
        }
        else {
            updateInfo = this.logic[type].getUpdateInfo();
        }

        this.updateBtn.getChildByName("price").getComponent(cc.Label).string = updateInfo.priceNeed;
        this.node.getChildByName("levelInfo").getComponent(cc.Label).string = (updateInfo.level + 1) + cc.Global.wordsConfig.extra["levelT"];

        let buildInfo = buildConfig[type];
        if (parseInt((updateInfo.level + 1)) >= buildInfo.length) {
            this.close();
            this.updateBtn.active = false;
        }
        else {
            this.updateBtn.active = true;
        }
    },

    setNature() {
        let type = this.extraMsg.type;
        let list = this.nature.children;

        if (type === "depot") {
            this.setDepotPage(list);
        }

        if (type === "stall") {
            this.setStallPage(list);
        }

        if (type === "truck") {
            this.setTruckPage(list);
        }
    },

    setDepotPage(list) {
        let nextLevel = this.logic.depot.getLevel() + 1;
        if (nextLevel >= buildConfig.depot.length) {
            nextLevel = buildConfig.depot.length - 1;
        }
        let nextInfo = buildConfig.depot[nextLevel];

        let currentLevel = this.logic.depot.getLevel();
        let currentInfo = buildConfig.depot[currentLevel];

        list[0].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["orderNum"];
        list[1].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["orderTime"];
        list[2].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["profitAdd"];

        let order_count_Str = currentInfo.order_count + cc.Global.wordsConfig.extra["one"];
        let order_cycle_Str = currentInfo.order_cycle + cc.Global.wordsConfig.extra["second"];
        let revenu_increase_Str = Math.floor(currentInfo.revenu_increase * 100) + "%";

        if (currentLevel != nextLevel) {
            order_count_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + nextInfo.order_count + cc.Global.wordsConfig.extra["one"] + ")";
            order_cycle_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + nextInfo.order_cycle + cc.Global.wordsConfig.extra["second"] + ")";
            revenu_increase_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + Math.floor(nextInfo.revenu_increase * 100) + "%" + ")";
        }

        list[0].getChildByName("info").getComponent(cc.Label).string = order_count_Str;
        list[1].getChildByName("info").getComponent(cc.Label).string = order_cycle_Str;
        list[2].getChildByName("info").getComponent(cc.Label).string = revenu_increase_Str;
    },

    setStallPage(list) {
        let nextLevel = this.logic.stall.getLevel() + 1;
        if (nextLevel >= buildConfig.stall.length) {
            nextLevel = buildConfig.stall.length - 1;
        }
        let nextInfo = buildConfig.stall[nextLevel];
        let currentLevel = this.logic.stall.getLevel();
        let currentInfo = buildConfig.stall[currentLevel];

        list[0].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["customTime"];
        list[1].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["buyNum"];
        list[2].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["incomeAdd"];

        let guest_cycle_Str = currentInfo.guest_cycle + cc.Global.wordsConfig.extra["second"];
        let buy_count_Str = currentInfo.buy_count + cc.Global.wordsConfig.extra["one"];
        let revenu_increase_Str = Math.floor(currentInfo.revenu_increase * 100) + "%";

        if (currentLevel != nextLevel) {
            guest_cycle_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + nextInfo.guest_cycle + cc.Global.wordsConfig.extra["second"] + ")";
            buy_count_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + nextInfo.buy_count + cc.Global.wordsConfig.extra["one"] + ")";
            revenu_increase_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + Math.floor(nextInfo.revenu_increase * 100) + "%" + ")";
        }

        list[0].getChildByName("info").getComponent(cc.Label).string = guest_cycle_Str;
        list[1].getChildByName("info").getComponent(cc.Label).string = buy_count_Str;
        list[2].getChildByName("info").getComponent(cc.Label).string = revenu_increase_Str;
    },

    setTruckPage(list) {
        let nextLevel = this.logic.depot.getTruck().level + 1;
        if (nextLevel >= buildConfig.truck.length) {
            nextLevel = buildConfig.truck.length - 1;
        }
        let nextInfo = buildConfig.truck[nextLevel];
        let currentLevel = this.logic.depot.getTruck().level;
        let currentInfo = buildConfig.truck[currentLevel];

        list[0].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["truckCapacity"];
        list[1].getChildByName("name").getComponent(cc.Label).string = cc.Global.wordsConfig.extra["deliverTime"];
        list[2].getChildByName("name").getComponent(cc.Label).string = "";

        let capacity_Str = currentInfo.capacity + cc.Global.wordsConfig.extra["one"];
        let transport_time_Str = currentInfo.transport_time + cc.Global.wordsConfig.extra["one"];

        if (currentLevel != nextLevel) {
            capacity_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + nextInfo.capacity + cc.Global.wordsConfig.extra["one"] + ")";
            transport_time_Str += "(" + cc.Global.wordsConfig.extra["atNextLevel"] + nextInfo.transport_time + cc.Global.wordsConfig.extra["second"] + ")";
        }

        list[0].getChildByName("info").getComponent(cc.Label).string = capacity_Str;
        list[1].getChildByName("info").getComponent(cc.Label).string = transport_time_Str;
        list[2].getChildByName("info").getComponent(cc.Label).string = "";
    },

    loadIcon() {
        let type = this.extraMsg.type;

        let path = "";
        let tittle = "";

        if (type === "depot") {
            let nextLevel = this.logic.depot.getLevel() + 1;
            if (nextLevel >= buildConfig.depot.length) {
                nextLevel -= 1;
            }
            path = "icon/depot/" + nextLevel;
            tittle = cc.Global.wordsConfig.build["shenji"] + cc.Global.wordsConfig.build["depot"];
        }

        if (type === "stall") {
            let nextLevel = this.logic.stall.getLevel() + 1;
            if (nextLevel >= buildConfig.stall.length) {
                nextLevel -= 1;
            }
            path = "icon/stall/" + nextLevel;
            tittle = cc.Global.wordsConfig.build["shenji"] + cc.Global.wordsConfig.build["stall"];
        }

        if (type === "truck") {
            let nextLevel = this.logic.depot.getTruck().level + 1;
            if (nextLevel >= buildConfig.stall.length) {
                nextLevel -= 1;
            }
            path = "icon/truck/" + nextLevel;
            tittle = cc.Global.wordsConfig.build["shenji"] + cc.Global.wordsConfig.build["truck"];
        }

        this.tittle.string = tittle;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            this.icon.spriteFrame = spriteFrame;
        }.bind(this));
    }
});
