const articsConfig = require('../../../config/alone/ArticsConfig');
const buildConfig = require('../../../config/alone/BuildsConfig');
const normalConfig = require('../../../config/alone/NormConfig');

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        fristTypeToggle: {
            type: cc.Toggle,
            default: null
        },

        storeNode: {
            type: cc.Node,
            default: null
        },

        stallNode: {
            type: cc.Node,
            default: null
        },

        updateNode: {
            type: cc.Node,
            default: null
        },

        profitStr: {
            type: cc.Label,
            default: null
        }
    },

    pageLoad() {
        this.storeItems = this.storeNode.children;
        this.stallItems = this.stallNode.children;
        this.selectStoreIndex = 0;

        this.storeNext = null;
        this.stallNext = null;
    },

    pageEnable() {
        this.fristTypeToggle.isChecked = true;
        this.initPage();

        if (this.selectNode != null) {
            this.selectNode.getChildByName("light").active = false;
            this.selectNode = null;
            this.selectGoods = null;
        }

        cc.Global.listenCenter.register(cc.Global.eventConfig.StoreModify, this.initStore.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.StallModify, this.stallModify.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.ChangeLanguage, this.initPage.bind(this), this);
    },

    pageDisable() {
        this.selectGoods = null;

        cc.Global.listenCenter.remove(cc.Global.eventConfig.StoreModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.StallModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.ChangeLanguage, this);
    },

    initPage() {
        this.initStore();
        this.stallModify();
    },

    update() {
        if (!this.isAlive) { return; }

        if (this.storeNext != null) {
            let storeResult = this.storeNext();
            if (!storeResult) {
                this.storeNext = null;
            }
        }

        while (this.stallNext) {
            let stallResult = this.stallNext();
            if (!stallResult) {
                this.stallNext = null;
                this.addStallBtn();
            }
        }
    },

    stallModify() {
        this.initLevelInfo();
        this.initStall();
    },

    /**
     * 增加格子
     * @param {*} event 
     * @param {*} data 
     */
    addGrid(event, data) {
        

        this.logic.stall.openGrid();
    },

    /**
     * 仓库类别toggle
     * @param {*} event 
     * @param {*} data 
     */
    storeIndexBtn(event, data) {
        

        if (this.selectNode) {
            this.selectNode.getChildByName("light").active = false;
            this.selectNode = null;
            this.selectGoods = null;
        }

        this.selectStoreIndex = parseInt(data);
        this.initStore();
    },

    /**
     * 选择特定物品
     * @param {*} event 
     * @param {*} data 
     */
    selectArtic(event, data) {
        

        if (this.selectNode) {
            this.selectNode.getChildByName("light").active = false;
            this.selectGoods = null;
        }

        this.selectNode = event.target;
        this.selectNode.getChildByName("light").active = true;
        this.selectGoods = this.selectNode.itemKey;
    },

    /**
     * 物品转换位置
     * @param {*} event 
     * @param {*} data 
     */
    switchBtn(event, data) {
        if (!this.selectGoods) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
                content: cc.Global.wordsConfig.tips["noSelect"] ,
                type: "fly"
            });
            return false;
        }

        let select = {};
        select[this.selectGoods] = 1;
        let result = this.logic.stall.pushGoods(select, data);
        if (!result) {
            this.selectNode.getChildByName("light").active = false;
            this.selectGoods = null;
            this.selectNode = null;
        }
    },

    /**
     * 获取利润
     * @param {*} event 
     * @param {*} data 
     */
    collectBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.logic.stall.drawProfit({ startPos: startPos, adv: false });
        this.initLevelInfo();
    },

    /**
     * 获取利润
     * @param {*} event 
     * @param {*} data 
     */
    doubletBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        if (this.logic.stall.getProfit() <= 0) {
            return;
        }

        cc.Global.sdk.postEvent2("ads_start_position",22);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",22);

            this.logic.stall.drawProfit({ startPos: startPos, adv: true });
            this.initLevelInfo();
        }.bind(this));
    },

    /**
     * 升级货摊
     * @param {*} event 
     * @param {*} data 
     */
    updateBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("upWithNaturePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "stall",
            callback: this.updateStallCallback.bind(this)
        });
    },

    updateStallCallback() {
        this.initLevelInfo();
    },

    /**
     * 初始化等级信息
     */
    initLevelInfo() {
        let collectNode = this.node.getChildByName("bottomBar").getChildByName("collect");
        collectNode.getChildByName("doubleBtn").active = true;

        let profit = this.logic.stall.getProfit();
        this.profitStr.string = Math.floor(profit);

        if (this.logic.stall.getLevel() <
            (buildConfig.stall.length - 1)) {
            return false;
        }
        this.updateNode.active = false;
    },

    /**
     * 初始化货摊
    */
    initStall() {
        this.stallNext = null;
        let store = this.logic.stall.getGoods();
        let storeLen = store.length;

        let index = 0;
        let stallNext = function () {
            let item = null;
            if (index > (this.stallItems.length - 1)) {
                item = cc.instantiate(this.stallItems[0]);
            }
            else {
                item = this.stallItems[index];
            }

            item.getChildByName("add").getChildByName("num").getComponent(cc.Label).string = normalConfig.extendStallPrice;
            item.parent = this.stallNode; item.active = true;
            item.getChildByName("add").active = false;

            let nameLabel = item.getChildByName("name").getComponent(cc.Label);
            let numLabel = item.getChildByName("num").getComponent(cc.Label);
            let iconSprite = item.getChildByName("icon").getComponent(cc.Sprite);

            let goods = store[index];
            if (Object.keys(goods).length > 0) {

                let price = articsConfig.entityHash[goods.name].price;
                price *= (1 + buildConfig.stall[this.logic.stall.getLevel()].revenu_increase);
                price *= normalConfig.revenuRadio.stall;
                nameLabel.string = Math.floor(price);

                numLabel.string = "x" + goods.num;
                let path = "artics/" + articsConfig.entityHash[goods.name].id;
                cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                    iconSprite.spriteFrame = spriteFrame;
                });
            }
            else {
                nameLabel.string = "0";
                numLabel.string = "";
                iconSprite.spriteFrame = null;
            }

            index++;

            return index < storeLen;
        }.bind(this);

        this.stallNext = stallNext;
    },

    /**
     * 初始化仓库
     */
    initStore() {
        let stallkey = Object.keys(buildConfig.stallClass)[this.selectStoreIndex];
        let storeIndex = Object.keys(buildConfig.storeClass).indexOf(stallkey);
        let items = this.logic.store.getArticleInfo(storeIndex);

        let itemsKey = Object.keys(items);
        let itemsLen = itemsKey.length;
        let storeLen = this.storeItems.length;
        if (storeLen > itemsLen) {
            for (let index = itemsLen; index < storeLen; index++) {
                this.storeItems[index].active = false;
            }
        }

        if (this.selectNode) {
            let num = this.logic.store.getItemNum(this.selectNode.itemKey);
            this.selectNode.getChildByName("num").getComponent(cc.Label).
                string = + num;
        }

        if (itemsLen <= 0) {
            return;
        }

        this.storeNext = null;
        let index = 0;
        let storeNext = function () {
            let name = itemsKey[index];
            let num = items[name];

            let storeItem = null;
            if (index < storeLen) { storeItem = this.storeItems[index]; }
            else {
                storeItem = cc.instantiate(this.storeItems[0]);
                storeItem.getChildByName("light").active = false;
            }

            storeItem.parent = this.storeNode;
            storeItem.active = true;
            storeItem.itemKey = itemsKey[index];

            storeItem.getChildByName("name").getComponent(cc.Label)
                .string = articsConfig.entityHash[name].name;
            storeItem.getChildByName("num").getComponent(cc.Label)
                .string = "x" + num;

            let path = "artics/" + articsConfig.entityHash[name].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                storeItem.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });

            index++;

            return index < itemsLen;
        }.bind(this);

        this.storeNext = storeNext;
    },

    addStallBtn() {
        let storeLen = this.logic.stall.getGoods().length;
        let itemsLen = this.stallItems.length;
        if (storeLen < itemsLen) {
            let addItem = this.stallItems[itemsLen - 1];
            addItem.parent = this.stallNode;
            addItem.active = true;
            addItem.getChildByName("add").active = true;
        }
        else {
            let addItem = cc.instantiate(this.stallItems[0]);
            addItem.parent = this.stallNode;
            addItem.active = true;
            addItem.getChildByName("add").active = true;
        }
    },

    closePage() {
        if (this.selectNode) {
            this.selectNode.getChildByName("light").active = false;
            this.selectNode = null;
            this.selectGoods = null;
        }
    }
});
