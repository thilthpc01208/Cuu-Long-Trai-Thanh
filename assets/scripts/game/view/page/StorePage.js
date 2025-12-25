const articsConfig = require('../../../config/alone/ArticsConfig');
const buildConfig = require('../../../config/alone/BuildsConfig');

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        scrollView: {
            type: cc.ScrollView,
            default: null
        },

        levelStr: {
            type: cc.Label,
            default: null
        },

        capacityStr: {
            type: cc.Label,
            default: null
        },

        updateNode: {
            type: cc.Node,
            default: null
        },

        fristTogggle: {
            type: cc.Toggle,
            default: null
        }
    },

    pageLoad() {
        this.next = null;
    },

    pageEnable() {
        this.fristTogggle.isChecked = true;
        this.selectType = 0;

        this.initArticles();
        cc.Global.listenCenter.register(cc.Global.eventConfig.StoreModify, this.initArticles.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.ChangeLanguage, this.initArticles.bind(this), this);
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.StoreModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.ChangeLanguage, this);
    },

    openPage() {
        this.initLevelInfo();
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

    toggleBtn(event, data) {
        this.selectType = parseInt(data);
        this.initArticles();
    },

    updateBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "store",
            callback: this.updateStoreCallback.bind(this)
        });
    },

    updateStoreCallback() {
        this.initLevelInfo();
    },

    articleBtn(event, data) {
        let temp = { goodsId: event.target.goodsId };
        let pageInfo = cc.Global.pageConfig.findPageInfo("salePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, temp);
    },

    initLevelInfo() {
        let info = this.logic.store.getCapacity();
        this.capacityStr.string = info.totalNum + "/" + info.capacity;
        this.levelStr.string = cc.Global.wordsConfig.extra.levelH + (info.level + 1);

        if (buildConfig.store.length > info.level + 1) {
            this.updateNode.getChildByName("cash").getComponent(cc.Label)
                .string = buildConfig.store[info.level + 1].price;
        }
        else {
            this.updateNode.active = false;
        }
    },

    initArticles(types) {
        this.initLevelInfo();

        this.next = null;        
        let articles = this.logic.store.getArticleInfo(this.selectType);
        let keys = Object.keys(articles);
        let items = this.scrollView.content.children;
        
        let len = keys.length;
        if (items.length >= len) {
            this.hideGrid(len, items.length, items);
        }

        if (len <= 0) { return; }

        let index = 0;
        let next = function()
        {
            let key = keys[index];
            let info = articsConfig.entityHash[key];

            let texturePath = "artics/" + info.id;
            let name = articsConfig.entityHash[info.id].name;
            let num = articles[key];

            let item = null;
            if (items.length > index) {
                item = this.setGrid(items[index], texturePath, name, num, key, false);
            }
            else {
                item = this.setGrid(items[0], texturePath, name, num, key, true);
            }
            item.goodsId = info.id;

            index++;
            return index < len; 
        }.bind(this);

        this.next = next;
    },

    setGrid(node, texturePath, name, num, key, add = false) {
        if (add) {
            node = cc.instantiate(node);
            node.parent = this.scrollView.content;
        }
        node.active = true;

        cc.Global.assertCenter.readLocalSpriteFrame(texturePath, function (err, sprite) {
            node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = sprite;
        });
        node.getChildByName("name").getComponent(cc.Label).string = name;
        node.getChildByName("num").getComponent(cc.Label).string = "x" + num;

        return node;
    },

    hideGrid(startIndex, endIndex, items) {
        for (let index = startIndex; index < endIndex; index++) {
            items[index].active = false;
        }
    },

    advBtn(event, data) {
        cc.Global.sdk.postEvent2("ads_start_position",42);

        let logic = this.logic;
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",42);

            logic.store.addGrid();
            this.initLevelInfo();
        }.bind(this));
    },

    closeBtn() {
        this.close();
        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    }
});

