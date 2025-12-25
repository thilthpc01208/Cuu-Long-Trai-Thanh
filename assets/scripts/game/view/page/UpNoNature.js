const articsConfig = require("../../../config/alone/ArticsConfig");
const buildConfig = require("../../../config/alone/BuildsConfig");

const PageBase = require("PageBase");

// store,harbour,factory(update)
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

        material: {
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
            this.extraMsg = { type: "store", index: 0 }
        }

        this.setPageState();
        this.loadIcon();
        this.setMaterial();
    },

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

    updateClick(event, data) {
        if (this.extraMsg.type === "store") {
            this.logic.store.updateStore();
            this.close();
        }

        if (buildConfig.factorys[this.extraMsg.type]) {
            this.logic[this.extraMsg.type].updateFactory();
            this.close();
        }

        if (this.extraMsg.type === "harbour") {
            this.logic.harbour.updateHarbour();
            this.close();
        }

        if (this.extraMsg.type === "canteen") {
            this.logic.canteen.updateCanteen();
            this.close();
        }

        this.setPageState();
        this.loadIcon();
        this.setMaterial();

        if (this.extraMsg.callback) {
            this.extraMsg.callback();
        }
    },

    setPageState() {
        let info = null;
        if (this.extraMsg.type === "store" || this.extraMsg.type === "harbour" || this.extraMsg.type === "canteen") {
            info = this.logic[this.extraMsg.type].getUpdateInfo();
        }

        if (buildConfig.factorys[this.extraMsg.type]) {
            info = this.logic[this.extraMsg.type].getUpdateInfo();
        }

        this.updateBtn.getChildByName("layout").getChildByName("cost").getChildByName("price").getComponent(cc.Label).string = info.priceNeed;
        this.node.getChildByName("descript").getComponent(cc.Label).string = (info.level + 1) + cc.Global.wordsConfig.extra["levelT"];

        if (info.priceNeed <= 0) {
            this.updateBtn.getChildByName("layout").getChildByName("cost").active = false;
        }
        else {
            this.updateBtn.getChildByName("layout").getChildByName("cost").active = true;
        }
    },

    setMaterial() {
        let nextLevel = 0;

        if (this.extraMsg.type === "store" || this.extraMsg.type === "harbour" || this.extraMsg.type === "canteen") {
            nextLevel = this.logic[this.extraMsg.type].getLevel() + 1;
        }

        if (buildConfig.factorys[this.extraMsg.type]) {
            nextLevel = this.logic[this.extraMsg.type].getLevel() + 1;
        }

        if (nextLevel > buildConfig[this.extraMsg.type].length - 1) {
            this.close();
            return;
        }

        let material = buildConfig[this.extraMsg.type][nextLevel].material;
        let list = this.material.children;
        let index = 0;
        for (const key in material) {
            let item = list[index];

            item.getChildByName("num").getComponent(cc.Label).string = "x" + material[key];
            let icon = item.getChildByName("icon").getComponent(cc.Sprite);

            item.recipeName = key;
            let path = "artics/" + articsConfig.entityHash[key].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                icon.spriteFrame = spriteFrame;
            });

            index++;
        }
    },

    loadIcon() {
        let tittle = "";
        let path = "";

        if (this.extraMsg.type === "store") {
            let nextLevel = this.logic.store.getLevel() + 1;
            if (nextLevel >= buildConfig.store.length) {
                nextLevel -= 1;
            }
            //path = "icon/store/" + Math.floor(nextLevel / 5);
            path = "icon/store/" + 0;
            tittle = cc.Global.wordsConfig.build["shenji"] + cc.Global.wordsConfig.build["store"];
        }

        if (buildConfig.factorys[this.extraMsg.type]) {
            let nextLevel = this.logic[this.extraMsg.type].getLevel() + 1;
            if (nextLevel >= buildConfig[this.extraMsg.type].length) {
                nextLevel -= 1;
            }
            path = "icon/" + this.extraMsg.type + "/" + Math.floor(nextLevel / 3);
            tittle = cc.Global.wordsConfig.build["shenji"] + buildConfig.factorys[this.extraMsg.type];
        }

        if (this.extraMsg.type === "harbour") {
            let nextLevel = this.logic.harbour.getLevel() + 1;
            if (nextLevel >= buildConfig.harbour.length) {
                nextLevel -= 1;
            }
            path = "icon/harbour/" + Math.floor(nextLevel / 2);
            tittle = cc.Global.wordsConfig.build["shenji"] + cc.Global.wordsConfig.build["harbour"];
        }

        if (this.extraMsg.type === "canteen") {
            let nextLevel = this.logic.canteen.getLevel() + 1;
            if (nextLevel >= buildConfig.canteen.length) {
                nextLevel -= 1;
            }
            path = "icon/canteen/" + Math.floor(nextLevel / 2);
            tittle = cc.Global.wordsConfig.build["shenji"] + cc.Global.wordsConfig.build["canteen"];
        }

        this.tittle.string = tittle;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            this.icon.spriteFrame = spriteFrame;
        }.bind(this));
    }
});
