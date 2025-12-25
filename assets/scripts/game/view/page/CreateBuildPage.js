const articsConfig = require("../../../config/alone/ArticsConfig");
const buildConfig = require("../../../config/alone/BuildsConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        needNode: {
            type: cc.Node,
            default: null
        },

        buyBtn: {
            type: cc.Node,
            default: null
        },

        material: {
            type: cc.Node,
            default: null
        },

        icon: {
            type: cc.Sprite,
            default: null
        },

        tittle: {
            type: cc.Label,
            default: null
        },

        priceStr:{
            type: cc.Label,
            default: null
        }
    },

    pageLoad() {
        this.materialList = this.material.children;
    },

    pageEnable() {
        if (!this.extraMsg) { this.extraMsg = { type: "harbour" }; }

        this.setPageState();
        this.loadIcon();
    },

    buyClick(event, data) {
        if (this.extraMsg.type === "harbour" && this.logic.harbour.updateHarbour()) {
            this.close(); return false;
        }

        if (buildConfig.factorys[this.extraMsg.type] && this.logic[this.extraMsg.type].updateFactory()) {
            this.close(); return false;
        }

        if (this.extraMsg.type === "stall" && this.logic.stall.updateStall()) {
            this.close(); return false;
        }

        if (this.extraMsg.type === "canteen" && this.logic.canteen.updateCanteen()) {
            this.close(); return false;
        }

        if (this.extraMsg.type === "hotel" && this.logic.hotel.updateHotel()) {
            this.close(); return false;
        }
    },

    setPageState() {
        let info = this.logic[this.extraMsg.type].getUpdateInfo();
        if (!info.levelSure) {
            this.needNode.active = true;
            this.buyBtn.active = false;

            let str = cc.Global.wordsConfig.extra["needLordLevel"];
            this.needNode.getChildByName("needDetail").getComponent(cc.Label)
                .string = str.replace("@", info.levelLimit + 1);
        }
        else {
            this.needNode.active = false;
            this.buyBtn.active = true;
            this.priceStr.string = info.priceNeed;

            if (info.priceNeed <= 0) {
                this.priceStr.node.parent.active = false;
            }
            else {
                this.priceStr.node.parent.active = true;
            }
        }

        let name = cc.Global.wordsConfig.build[this.extraMsg.type];
        this.tittle.string = cc.Global.wordsConfig.build["jianzao"] + name;
        this.node.getChildByName("descript").getComponent(cc.Label).string = "";

        this.setMaterials();
    },

    setMaterials() {
        let nextLevel = this.logic[this.extraMsg.type].getLevel() + 1;
        if (nextLevel > buildConfig[this.extraMsg.type].length - 1) {
            return;
        }

        let materials = buildConfig[this.extraMsg.type][nextLevel].material;
        if (!materials) {
            for (let index = 0; index < 3; index++) {
                let item = this.materialList[index];
                item.active = false;
            }
            return;
        }

        let index = 0;
        for (const key in materials) {
            let item = this.materialList[index];
            item.active = true;

            item.getChildByName("num").getComponent(cc.Label).string = "x" + materials[key];
            item.recipeName = key;

            let path = "artics/" + articsConfig.entityHash[key].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });

            index++;
        }
    },

    loadIcon() {
        let path = "";
        if (this.extraMsg.type === "harbour") {
            let nextLevel = this.logic.harbour.getLevel() + 1;
            if (nextLevel >= buildConfig.harbour.length) {
                nextLevel -= 1;
            }
            path = "icon/harbour/" + nextLevel;
        }

        if (buildConfig.factorys[this.extraMsg.type]) {
            let nextLevel = this.logic[this.extraMsg.type].getLevel() + 1;
            if (nextLevel >= buildConfig[this.extraMsg.type].length) {
                nextLevel -= 1;
            }

            let index = Object.keys(buildConfig.factorys).indexOf(this.extraMsg.type);
            path = "icon/factory/" + index /*this.extraMsg.type + "/" + nextLevel*/;
            console.log(path);
        }

        if (this.extraMsg.type === "stall") {
            let nextLevel = this.logic.stall.getLevel() + 1;
            if (nextLevel >= buildConfig.stall.length) {
                nextLevel -= 1;
            }
            path = "icon/stall/" + nextLevel;
        }

        if (this.extraMsg.type === "canteen") {
            let nextLevel = this.logic.canteen.getLevel() + 1;
            if (nextLevel >= buildConfig.canteen.length) {
                nextLevel -= 1;
            }
            path = "icon/canteen/" + nextLevel;
        }

        if (this.extraMsg.type === "hotel") {
            let nextLevel = this.logic.hotel.getLevel() + 1;
            if (nextLevel >= buildConfig.hotel.length) {
                nextLevel -= 1;
            }
            path = "icon/hotel/" + nextLevel;
        }

        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            this.icon.spriteFrame = spriteFrame;
        }.bind(this));
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
    }
});
