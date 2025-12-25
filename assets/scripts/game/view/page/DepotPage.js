const articsConfig = require("../../../config/alone/ArticsConfig");
const buildConfig = require("../../../config/alone/BuildsConfig");
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        updateDepotNode: {
            type: cc.Node,
            default: null
        },

        updateTruckNode: {
            type: cc.Node,
            default: null
        },

        ordersContent: {
            type: cc.Node,
            default: null
        },

        truckContent: {
            type: cc.Node,
            default: null
        },
    },

    pageLoad() {
        this.next = null;
    },

    pageEnable() {
        this.orderList = this.ordersContent.children;
        this.initPage();

        cc.Global.listenCenter.register(cc.Global.eventConfig.StoreModify, this.initOrderPanel.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.ChangeLanguage, this.initPage.bind(this), this);

        this.schedule(this.updateTime, 1);
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.StoreModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.ChangeLanguage, this);

        this.unschedule(this.updateTime);
    },

    initPage() {
        this.initLevelInfo();
        this.initOrderPanel();
        this.initTruckPanel();
    },

    update() {
        if (!this.isAlive) { return; }

        if (this.next != null) {
            let result = this.next();
            if (!result) {
                this.next = null;
            }
        }
    },

    orderSetOutBtn(event, data) {
        let index = event.target.parent.orderIndex;
        this.logic.depot.packThing({ index: index });
        this.initOrderPanel();
        this.initTruckPanel();

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    truckSetOutBtn(event, data) {
        this.logic.depot.transportThing();
        this.initTruckPanel();

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    cutBtn(event, data) {
        let index = event.target.parent.orderIndex;
        this.logic.depot.deleteOrder({ index: index });
        this.initOrderPanel();
    },

    gemOrderSpeedBtn(event, data) {
        let index = event.target.parent.orderIndex;
        this.logic.depot.quickCreateOrder({ index: index, adv: false });
        this.initOrderPanel();
    },

    advOrderSpeedBtn(event, data) {
        let index = event.target.parent.orderIndex;
        let msg = { index: index, adv: true };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",9);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",9);
            logic.depot.quickCreateOrder(msg);
            this.initOrderPanel();
        }.bind(this));
    },

    gemTruckSpeedBtn(event, data) {
        this.logic.depot.quickTransport({ adv: false });
        this.initTruckPanel();
    },

    advTruckSpeedBtn(event, data) {
        let logic = this.logic;
        cc.Global.sdk.postEvent2("ads_start_position",6);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",6);
            logic.depot.quickTransport({ adv: true });
            this.initTruckPanel();
        }.bind(this));
    },

    updateTruckBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("upWithNaturePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "truck",
            callback: this.updateTruckCallback.bind(this)
        });
    },

    updateTruckCallback() {
        this.initLevelInfo();
        this.initOrderPanel();

        let truckInfo = this.logic.depot.getTruck();
        let ready = this.truckContent.getChildByName("ready");
        this.setTruckReady(truckInfo, ready);
    },

    updateDepot(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("upWithNaturePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "depot",
            callback: this.updateDepotCallback.bind(this)
        });
    },

    updateDepotCallback() {
        this.initLevelInfo();
        this.initOrderPanel();
    },

    collectBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.logic.depot.transportProfit({ startPos: startPos, adv: false });
        this.initTruckPanel();

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    doubleBtn(event, data) {
        let result = this.logic.depot.isCanCollect({ adv: true });
        if (!result) { return; }

        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let msg = { startPos: startPos, adv: true };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",21);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",21);
            logic.depot.transportProfit(msg);
            this.initTruckPanel();
        }.bind(this));
    },

    /**
     * 选择配料
    */
    recipeBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("searchPage");
        let info = {
            goodsId: event.target.recipeName,
            pos: cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky),
            closeHandle: this.close.bind(this),
            fromType: "",
        };
        cc.Global.assertCenter.openPage(pageInfo, true, null, info);
    },

    /**
     * 初始化与等级相关信息
     */
    initLevelInfo() {
        let level = this.logic.depot.getLevel();
        if (level >= (buildConfig.depot.length - 1)) {
            this.updateDepotNode.active = false;
        }

        let truckInfo = this.logic.depot.getTruck();
        if (truckInfo.level >= (buildConfig.truck.length - 1)) {
            this.updateTruckNode.active = false;
        }
    },

    initOrderPanel(types) {
        this.next = null;

        if (!this.orderList) {
            this.orderList = this.ordersContent.children;
        }

        let orders = this.logic.depot.getOrders();
        let len = orders.length;

        if (this.orderList.length > len) {
            let orderLen = this.orderList.length;
            for (let index = len; index < orderLen; index++) {
                this.orderList[index].active = false;
            }
        }

        let index = 0;
        let next = function () {
            let order = orders[index];
            let item = null;
            if (this.orderList.length > index) {
                item = this.orderList[index];
            }
            else {
                item = cc.instantiate(this.orderList[0]);
            }
            item.parent = this.ordersContent;
            item.active = true;
            this.setOrderItem(item, order, index);

            index++;
            if (index < len) {
                return true;
            }
            else {
                return false;
            }
        }.bind(this);

        this.next = next;
    },

    setOrderItem(item, order, index) {
        let indexStr = item.getChildByName("index").getChildByName("info").getComponent(cc.Label);
        indexStr.string = index + 1;

        item.orderIndex = order.index;
        let leakNode = item.getChildByName("leak");
        let waitNode = item.getChildByName("wait");
        leakNode.orderIndex = order.index;
        waitNode.orderIndex = order.index;

        if (order.state !== 0) {
            this.setLeakItem(order, item);
        }
        else {
            this.setWaitItem(order, item);
        }
    },

    initTruckPanel() {
        let truckInfo = this.logic.depot.getTruck();
        let tipInfo = this.truckContent.getChildByName("tipInfo").getComponent(cc.Label);

        if (truckInfo.state === 2) {
            tipInfo.string = cc.Global.wordsConfig.extra["depotCollect"];
        }
        else {
            tipInfo.string = cc.Global.wordsConfig.extra["delveryDetials"];
        }

        let ready = this.truckContent.getChildByName("ready");
        let depature = this.truckContent.getChildByName("depature");
        let back = this.truckContent.getChildByName("back");

        ready.active = false;
        depature.active = false;
        back.active = false;

        if (truckInfo.state === 0) {
            ready.active = true;
            this.setTruckReady(truckInfo, ready);
        }

        if (truckInfo.state === 1) {
            depature.active = true;
            this.setTruckDepature(truckInfo, depature);
        }

        if (truckInfo.state === 2) {
            back.active = true;
            this.setTruckBack(truckInfo, back);
        }
    },

    setTruckReady(truckInfo, node) {
        let capacity = node.getChildByName("capacity").getComponent(cc.Label);
        let time = node.getChildByName("time").getComponent(cc.Label);
        let profit = node.getChildByName("profit").getComponent(cc.Label);

        let truckConfig = buildConfig.truck[truckInfo.level];
        let maxCapacity = truckConfig.capacity;
        let currCapacity = truckInfo.goodsNum;
        capacity.string = currCapacity + "/" + maxCapacity;

        time.string = cc.Global.mathUtil.secondFormart(truckConfig.transport_time);
        profit.string = truckInfo.profit;

        let path = "icon/truckFlag/" + this.logic.depot.getTruck().level;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            node.getChildByName("truck").getComponent(cc.Sprite).
                spriteFrame = spriteFrame;
        });
    },

    setTruckDepature(truckInfo, node) {
        let profit = node.getChildByName("profit").getComponent(cc.Label);
        let time = node.getChildByName("time").getComponent(cc.Label);

        let remain = Math.floor((truckInfo.endTime - this.logic.getSysTime()) / 1000);
        time.string = cc.Global.mathUtil.secondFormart(remain);
        profit.string = truckInfo.profit;

        node.getChildByName("gemSpeedBtn").getChildByName("num").getComponent(cc.Label)
            .string = Math.ceil(remain / normalConfig.oneGemCutSecond);
    },

    setTruckBack(truckInfo, node) {
        let profit = node.getChildByName("profit").getComponent(cc.Label);
        profit.string = truckInfo.profit;

        let toolsKey = Object.keys(truckInfo.material);
        let toolsList = node.getChildByName("list").children;
        let len = toolsList.length;
        for (let index = 0; index < len; index++) {
            let tool = toolsList[index];

            let key = toolsKey[index];
            tool.getChildByName("info").getComponent(cc.Label)
                .string = "x" + truckInfo.material[key];

            let path = "artics/" + articsConfig.entityHash[key].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                tool.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        let collectNode = node.getChildByName("collect");
        collectNode.getChildByName("doubleBtn").active = true;
    },

    setWaitItem(order, item) {
        let leakNode = item.getChildByName("leak");
        let waitNode = item.getChildByName("wait");

        leakNode.active = false;
        waitNode.active = true;

        let tipTop = waitNode.getChildByName("tipTop").getComponent(cc.Label);
        tipTop.string = cc.Global.wordsConfig.extra["depotOrderArrive"];

        let tipDown = waitNode.getChildByName("tipDown").getComponent(cc.Label);
        let second = Math.ceil((order.endTime - this.logic.getSysTime()) / 1000);
        tipDown.string = cc.Global.mathUtil.secondFormart(second);

        let numStr = waitNode.getChildByName("gemSpeedBtn").getChildByName("num").getComponent(cc.Label);
        numStr.string = Math.ceil(second / normalConfig.oneGemCutSecond);
    },

    setLeakItem(order, item) {
        let leakNode = item.getChildByName("leak");
        let waitNode = item.getChildByName("wait");

        leakNode.active = true;
        waitNode.active = false;

        let profitStr = leakNode.getChildByName("profit").getChildByName("price")
            .getComponent(cc.Label);
        profitStr.string = this.logic.depot.getOrderProfit({ index: order.index });

        let goodsList = leakNode.getChildByName("list").children;
        let len = goodsList.length;
        for (let index = 0; index < len; index++) {
            goodsList[index].active = false;
        }

        let orderIndex = 0;
        for (const key in order.items) {
            let item = goodsList[orderIndex];
            item.active = true;

            let icon = item.getChildByName("icon").getComponent(cc.Sprite);
            let info = item.getChildByName("info").getComponent(cc.Label);

            let need = order.items[key];
            let has = this.logic.store.getItemNum(key);

            if (has >= need) {
                has = need;
                info.node.color = new cc.Color().fromHEX("#F2E8DD");
            }
            else {
                info.node.color = new cc.Color().fromHEX("#E57C60");
            }
            info.string = has + "/" + need;

            item.recipeName = key;
            let path = "artics/" + articsConfig.entityHash[key].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                icon.spriteFrame = spriteFrame;
            });

            orderIndex++;
        }
    },

    updateTime() {
        if (!this.scrollViewSingle) {
            this.scrollViewSingle = this.node.getChildByName("scrollView").getComponent(cc.ScrollView);
        }
        this.scrollViewSingle.vertical = !cc.Global.casualStory.getData("GameGuideState");

        this.updateOrderPanel();
        this.updateTruckPanel();
    },

    updateOrderPanel() {
        this.initOrderPanel();
    },

    updateTruckPanel() {
        let truckInfo = this.logic.depot.getTruck();
        let tipInfo = this.truckContent.getChildByName("tipInfo").getComponent(cc.Label);

        if (truckInfo.state !== 2) {
            tipInfo.string = cc.Global.wordsConfig.extra["delveryDetials"];
        }
        else {
            tipInfo.string = cc.Global.wordsConfig.extra["depotCollect"];
        }

        let ready = this.truckContent.getChildByName("ready");
        let depature = this.truckContent.getChildByName("depature");
        let back = this.truckContent.getChildByName("back");

        if (truckInfo.state === 0 && ready.active == false) {
            ready.active = true;
            depature.active = false;
            back.active = false;

            this.setTruckReady(truckInfo, ready);
        }

        if (truckInfo.state === 1) {
            ready.active = false;
            depature.active = true;
            back.active = false;

            this.setTruckDepature(truckInfo, depature);
        }

        if (truckInfo.state === 2 && back.active == false) {
            ready.active = false;
            depature.active = false;
            back.active = true;

            this.setTruckBack(truckInfo, back);
        }
    },

    closeBtn() {
        this.close();
        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    }
});
