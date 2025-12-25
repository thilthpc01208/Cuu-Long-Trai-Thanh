const buildConfig = require('../../../../config/alone/BuildsConfig');
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        listNode: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.infoArray = ["route", "harbour", "depot", "stall", "hotel"];
        this.list = this.listNode.children;
        this.next = null;
    },

    pageEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.LordModify, this.lordModify.bind(this), this);
        this.initPanel();
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.LordModify, this);
    },

    lordModify() {
        this.initPanel();
    },

    update() {
        if (!this.isAlive) { return; }
        if (!this.next) { return; }
        if (!this.next()) { this.next = null; }
    },

    buyItemBtn(event, data) {
        let target = event.target.parent;
        let result = false;

        if (target.facility === "route") {
            result = this.logic.lord.updateRoute();
        }

        if (target.facility === "harbour") {
            result = this.logic.harbour.updateHarbour();
        }

        if (target.facility === "stall") {
            result = this.logic.stall.updateStall();
        }

        if (target.facility === "depot") {
            result = this.logic.depot.updateDepot();
        }

        if (target.facility === "hotel") {
            result = this.logic.hotel.updateHotel();
        }

        if (result) {
            this.initPanel();
        }
    },

    initPanel() {
        let len = this.infoArray.length;

        let index = 0;
        let next = function () {
            let name = this.infoArray[index];

            let level = -1;
            if (name === "route") { level = this.logic.lord.getRoute(); }
            if (name === "harbour") { level = this.logic.harbour.getLevel(); }
            if (name === "depot") { level = this.logic.depot.getLevel(); }
            if (name === "stall") { level = this.logic.stall.getLevel(); }
            if (name === "hotel") { level = this.logic.hotel.getLevel(); }

            let item = this.list[index];
            item.facility = name;
            this.initItem(item, name, level + 1);

            index++;

            return index < len;
        }.bind(this);
        this.next = next;
    },

    initItem(item, name, level) {
        let currentLevel = this.logic.lord.getLevel();
        let infos = buildConfig[name];

        let require = item.getChildByName("require");
        let buyBtn = item.getChildByName("buyBtn");
        let high = item.getChildByName("high");

        require.active = false;
        buyBtn.active = false;
        high.active = false;

        let info = null;

        if (infos.length > level) {
            info = infos[level];
            if (info.unlock > currentLevel) {
                let str = "需要主房@级";
                require.getChildByName("info").getComponent(cc.Label).string = str.replace("@", info.unlock + 1);
                require.active = true;
            }
            else {
                buyBtn.getChildByName("cash").getComponent(cc.Label).string = info.price;
                buyBtn.active = true;
            }
        }
        else {
            info = infos[level - 1];
            high.active = true;
        }

        item.getChildByName("name").getComponent(cc.Label).string = info.name;
        item.getChildByName("des").getComponent(cc.Label).string = info.descript;

        let icon = item.getChildByName("back").getChildByName("icon");
        let path = "icon/" + name + "/" + level;
        cc.Global.assertCenter.replaceSpriteFrame(icon, path);

        let labels = item.getChildByName("infos").getComponentsInChildren(cc.Label);
        if (name === "route") {
            labels[0].string = "";
            labels[1].string = "";
            labels[2].string = "·运输收益提升@%".replace("@", Math.floor(info.revenu_increase * 100));
            labels[3].string = "";
        }

        if (name === "harbour") {
            labels[0].string = "·订单数量@".replace("@", info.order_count);
            labels[1].string = "·运输时间@".replace("@", info.transport_time);
            labels[2].string = "·收益提升@%".replace("@", Math.floor(info.revenu_increase * 100));
            labels[3].string = "";
        }

        if (name === "stall") {
            labels[0].string = "·购买数量@".replace("@", info.buy_count);
            labels[1].string = "·顾客间隔@".replace("@", info.guest_cycle);
            labels[2].string = "·收益提升@%".replace("@", Math.floor(info.revenu_increase * 100));
            labels[3].string = "";
        }

        if (name === "depot") {
            labels[0].string = "·订单数量@".replace("@", info.order_count);
            labels[1].string = "·订单生成时间@".replace("@", info.order_cycle);
            labels[2].string = "·收益提升@%".replace("@", Math.floor(info.revenu_increase * 100));
            labels[3].string = "";
        }

        if (name === "hotel") {
            labels[0].string = "·拥有@个床位".replace("@", info.capacity);
            labels[1].string = "·住宿价格@".replace("@", info.profit);
            labels[2].string = "·住宿时间@秒".replace("@", info.sleep);
            labels[3].string = "·游客流量@秒/个".replace("@", info.circle_time);
        }
    }
});
