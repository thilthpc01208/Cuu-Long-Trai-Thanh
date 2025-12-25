const buildsConfig = require('../../../config/alone/BuildsConfig');

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

        icon: {
            type: cc.Sprite,
            default: null
        },

        tittle:{
            type: cc.Label,
            default: null
        }
    },

    pageLoad() {
        this.priceLabel = this.buyBtn.getChildByName("price").getComponent(cc.Label);
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { type: "land", index: 0 };
        }

        this.setPageState();
        this.loadIcon();
    },

    pageDisable() {

    },

    buyClick(event, data) {
        if (this.extraMsg.type === "land" && this.logic.land.updateLand({ index: this.extraMsg.index })) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep,null);
            this.close();
            return false;
        }

        if (this.extraMsg.type === "orchard" && this.logic.orchard.updateOrchard({ index: this.extraMsg.index })) {
            this.close();
            return false;
        }

        if (this.extraMsg.type === "paddy" && this.logic.paddy.updatePaddyField({ index: this.extraMsg.index })) {
            this.close();
            return false;
        }

        if (this.extraMsg.type === "livestock" && this.logic.livestock.updateLivestock({ index: this.extraMsg.index })) {
            this.close();
            return false;
        }

        if (this.extraMsg.type === "aquatic" && this.logic.aquatic.updateAquatic({ index: this.extraMsg.index })) {
            this.close();
            return false;
        }
    },

    setPageState() {
        let info = this.logic[this.extraMsg.type].getUpdateInfo(this.extraMsg.index);
        if (info.levelSure) {
            this.needNode.active = false;
            this.buyBtn.active = true;
            this.priceLabel.string = info.priceNeed;
        }
        else {
            this.needNode.active = true;
            this.buyBtn.active = false;

            let str = cc.Global.wordsConfig.extra["needLordLevel"];
            this.needNode.getChildByName("needDetail").getComponent(cc.Label)
                .string = str.replace("@", info.levelLimit + 1);
        }
    },

    loadIcon() {
        let index = this.extraMsg.index;
        let path = "";
        
        let des = "";
        let tittle = "";

        if (this.extraMsg.type === "land") {
            path = "icon/land";
            des = "第@块耕地".replace("@", index + 1);
            tittle = cc.Global.wordsConfig.build["kaiken"] + cc.Global.wordsConfig.build["land"];
        }

        if (this.extraMsg.type === "orchard") {
            path = "icon/orchard";
            des = "第@块果园".replace("@", index + 1);
            tittle = cc.Global.wordsConfig.build["kaiken"] + cc.Global.wordsConfig.build["orchard"];
        }

        if (this.extraMsg.type === "paddy") {
            path = "icon/paddy";
            des = "第@块水田".replace("@", index + 1);
            tittle = cc.Global.wordsConfig.build["kaiken"] + cc.Global.wordsConfig.build["paddy"];
        }

        if (this.extraMsg.type === "livestock") {
            path = "icon/livestock/" + index + "/0";
            let name = buildsConfig.livestock[index].name;
            tittle = cc.Global.wordsConfig.build["jianzao"] + name;
        }

        if (this.extraMsg.type === "aquatic") {
            path = "icon/aquatic";
            des = "第@块鱼塘".replace("@", index + 1);
            tittle = cc.Global.wordsConfig.build["jianzao"] + cc.Global.wordsConfig.build["aquatic"];
        }

        this.tittle.string = tittle;
        this.node.getChildByName("descript").getComponent(cc.Label).string = des;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            this.icon.spriteFrame = spriteFrame;
        }.bind(this));
    }
});
