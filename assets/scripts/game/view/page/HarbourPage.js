const articsConfig = require("../../../config/alone/ArticsConfig");
const buildConfig = require("../../../config/alone/BuildsConfig");
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        ordersContent: {
            type: cc.Node,
            default: null
        },

        shipAwardPanel: {
            type: cc.Node,
            default: null
        },

        selectPanel: {
            type: cc.Node,
            default: null
        },

        levelPanel: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.ordersList = this.ordersContent.children;
    },

    pageEnable() {
        this.schedule(this.updateTime, 1);

        this.initOrdersPanel();
        this.initShipAwardPanel();
        this.initLevelPanel();
    },

    openPage() {
        this.initOrdersPanel();
        this.initShipAwardPanel();
        this.initLevelPanel();
    },

    pageDisable() {
        this.unschedule(this.updateTime);

        this.shipAwardPanel.artive = false;
        this.selectPanel.active = false;
    },

    selectItemBtn(event, data) {
        let orderIndex = event.target.orderIndex;
        let itemIndex = event.target.itemIndex;

        let temp = {
            orderIndex: orderIndex,
            itemIndex: itemIndex
        }
        let itemInfo = this.logic.harbour.getItemInfo(temp);
        if (itemInfo.load) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content:cc.Global.wordsConfig.tips["loaded"] ,
                type: "fly"
            });    
            return false;
        }

        this.selectItem = temp;

        let tempPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.selectPanel.parent);
        this.selectPanel.x = tempPos.x;
        this.selectPanel.y = tempPos.y;
        this.selectPanel.active = true;

        this.initSelectPanel(itemInfo);
    },

    closeSelectPanel(event, data) {
        this.selectPanel.active = false;
        this.selectItem = null;
    },

    normalReciveBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = { index: event.target.parent.parent.parent.orderIndex, startPos: startPos, adv: false };
        this.logic.harbour.getOrderAward(temp);
        this.initOrdersPanel();
        this.initShipAwardPanel();
    },

    adverReciveBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = { index: event.target.parent.parent.parent.orderIndex, startPos: startPos, adv: true };
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",25);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",25);

            logic.harbour.getOrderAward(temp);
            this.initOrdersPanel();
            this.initShipAwardPanel();
        }.bind(this));
    },

    openShipAwardPanel(event, data) {
        let shipAward = this.logic.harbour.getHarbourInfo().award;
        if (!shipAward.has || shipAward.draw) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: cc.Global.wordsConfig.tips["noAward"] ,
                type: "fly"
            });
            return false;
        }

        let pageInfo = cc.Global.pageConfig.findPageInfo("shipRewardPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    setOutBtn(event, data) {
        let allOrderIsDone = this.logic.harbour.allOrderIsDone();
        if (allOrderIsDone) {
            if (this.logic.harbour.goodsShipFire()) {
                this.close();
            }
            return;
        }

        let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "ship", callBack: function () {
                if (this.logic.harbour.goodsShipFire()) {
                    this.close();
                }
            }.bind(this)
        });
    },

    awardBtn(event, data) {
        let shipAward = this.logic.harbour.getHarbourInfo().award;
        if (shipAward.has && !shipAward.draw) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("shipRewardPage");
            let temp = { callback: this.getShipRewardCallBack.bind(this) };
            cc.Global.assertCenter.openPage(pageInfo, true, null, temp);
        }
        else {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content:cc.Global.wordsConfig.tips["noAward"] ,
                type: "fly"
            });
        }
    },

    getShipRewardCallBack() {
        /*
        if (this.logic.harbour.goodsShipFire()) {
            this.close();
        }
        */
    },

    updateHarbourBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "harbour",
            callback: this.updateHarbourCallback.bind(this)
        });
    },

    updateHarbourCallback() {
        this.initOrdersPanel();
        this.initLevelPanel();
    },

    loadItemBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.selectItem.startPos = startPos;

        this.logic.harbour.pushGoodsToShip(this.selectItem);
        this.initOrdersPanel();
        this.selectPanel.active = false;
        this.initShipAwardPanel();
    },

    gemRefuseBtn(event, data) {
        this.selectItem.adv = false;
        this.logic.harbour.resumeShipOrder(this.selectItem);
        this.initOrdersPanel();
        this.selectPanel.active = false;
    },

    advRefuseBtn(event, data) {
        let selectItem = this.selectItem;
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",11);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",11);

            this.selectPanel.active = false;
            selectItem.adv = true;
            logic.harbour.resumeShipOrder(selectItem);
            this.initOrdersPanel();
        }.bind(this));
    },

    initOrdersPanel() {
        let orders = this.logic.harbour.getHarbourInfo().orders;
        if (!orders) {
            return;
        }

        let len = orders.length;
        for (let index = 0; index < len; index++) {
            let orderItem = this.ordersList[index];
            let orderInfo = orders[index];

            orderItem.orderIndex = index;
            this.setOrderItem(orderItem, orderInfo, index);
        }
    },

    setOrderItem(orderItem, orderInfo, index) {
        let orderIndex = orderItem.getChildByName("index").getChildByName("num").getComponent(cc.Label);
        orderIndex.string = index;

        let lock = orderItem.getChildByName("lock");
        let dark = orderItem.getChildByName("index").getChildByName("dark");

        if (orderInfo.state === -1) {
            lock.active = true;
            dark.active = true;

            for (let indexHarbour = 0, len = buildConfig.harbour.length; indexHarbour < len; indexHarbour++) {
                if (buildConfig.harbour[indexHarbour].order_count >= (index + 1)) {
                    let info = cc.Global.wordsConfig.extra["harbourOrderUnlock"].replace("@", indexHarbour + 1);
                    lock.getChildByName("num").getComponent(cc.Label).string = info;
                    break;
                }
            }

            return;
        }
        lock.active = false;
        dark.active = false;

        if (orderInfo.state === 0) {
            return;
        }

        let awardNode = orderItem.getChildByName("award");
        let drawNode = orderItem.getChildByName("draw");
        awardNode.active = false;
        drawNode.active = false;

        let profit = this.logic.harbour.getOrderProfit({ index: index });
        if (orderInfo.award.has && !orderInfo.award.draw) {
            drawNode.active = true;
            drawNode.getChildByName("num").getComponent(cc.Label).string = profit;

            let collectNode = drawNode.getChildByName("collect");
            collectNode.getChildByName("adverGet").active = true; 
        }
        else if (orderInfo.award.has && orderInfo.award.draw) {
            awardNode.active = true;
            awardNode.getChildByName("num").getComponent(cc.Label).string = profit;
            awardNode.getChildByName("dark").active = true;
        }
        else if (!orderInfo.award.has) {
            awardNode.active = true;
            awardNode.getChildByName("num").getComponent(cc.Label).string = profit;
            awardNode.getChildByName("dark").active = false;
        }

        let itemsList = orderItem.getChildByName("goods").children;
        let len = itemsList.length;
        for (let i = 0; i < len; i++) {
            let info = orderInfo.items[i];
            let item = itemsList[i];

            item.getChildByName("load").active = info.load;
            item.orderIndex = index;
            item.itemIndex = i;

            item.getChildByName("num").getComponent(cc.Label).string = info.num;
            let path = "artics/" + articsConfig.entityHash[info.goods].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame
                    = spriteFrame;
            });
        }
    },

    initShipAwardPanel() {
        let shipAward = this.logic.harbour.getHarbourInfo().award;
        if (!shipAward.has || shipAward.draw) {
            //this.shipAwardPanel.getChildByName("box").active = false;
            return;
        }
        this.shipAwardPanel.getChildByName("box").active = true;
    },

    initSelectPanel(itemInfo) {
        let icon = this.selectPanel.getChildByName("icon").getComponent(cc.Sprite);
        let profit = this.selectPanel.getChildByName("cash").getComponent(cc.Label);
        let num = this.selectPanel.getChildByName("num").getComponent(cc.Label);

        num.string = this.logic.store.getItemNum(itemInfo.goods);
        profit.string = this.logic.harbour.getItemProfit(this.selectItem);

        let path = "artics/" + articsConfig.entityHash[itemInfo.goods].id;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            icon.spriteFrame = spriteFrame;
        });

        this.selectPanel.getChildByName("gemResume").getChildByName("num").
            getComponent(cc.Label).string = normalConfig.harbourGoodsReplaceCost;
    },

    initLevelPanel() {
        let harbourInfo = this.logic.harbour.getHarbourInfo();
        if (harbourInfo.level >= (buildConfig.harbour.length - 1)) {
            this.levelPanel.getChildByName("update").active = false;
        }
    },

    updateTime() {

    }
});
