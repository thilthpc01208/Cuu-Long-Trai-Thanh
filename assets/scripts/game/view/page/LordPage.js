const buildConfig = require("../../../config/alone/BuildsConfig");
const articsConfig = require("../../../config/alone/ArticsConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        nextContent: {
            type: cc.Node,
            default: null
        },

        needContent: {
            type: cc.Node,
            default: null
        },

        needBuild: {
            type: cc.Node,
            default: null
        },

        cashStr: {
            type: cc.Label,
            default: null
        }
    },

    pageLoad() {
        this.needItems = this.needContent.children;
        this.nextItems = this.nextContent.children;
        this.buildItems = this.needBuild.children;
    },

    pageEnable() {
        let nextLevel = this.logic.lord.getLevel() + 1;
        if (buildConfig.lord.length <= (nextLevel)) {
            this.close(); return;
        }

        this.initMaterial();
        this.initNext();
        this.initCash();
        this.initBuild();
    },

    pageDisable() {

    },

    updateBtn(event, data) {
        let nextLevel = this.logic.lord.updateLord();
        if (!nextLevel) {this.close(); return; }

        if (buildConfig.lord.length <= (nextLevel + 1)) {
            this.close(); return;
        }

        this.initMaterial();
        this.initNext();
        this.initCash();
        this.initBuild();

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);

        this.close();
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

    initMaterial() {
        let level = this.logic.lord.getLevel() + 1;
        let material = buildConfig.lord[level].material;

        let index = 0;
        for (const key in material) {
            let has = this.logic.store.getItemNum(key);
            let need = material[key];
            this.needItems[index].recipeName = key;

            if (has >= need) {
                this.needItems[index].getChildByName("info").getComponent(cc.Label).string = need + "/" + need;
                this.needItems[index].getChildByName("info").color = new cc.Color().fromHEX("#F2E8DD");
            }
            else {
                this.needItems[index].getChildByName("info").getComponent(cc.Label).string = has + "/" + need;
                this.needItems[index].getChildByName("info").color = new cc.Color().fromHEX("#E57C60");
            }

            let path = "artics/" + articsConfig.entityHash[key].id;
            let currentIndex = index;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                this.needItems[currentIndex].getChildByName("icon").getComponent(cc.Sprite)
                    .spriteFrame = spriteFrame;
            }.bind(this));

            index++;
        }
    },

    initNext() {
        let level = this.logic.lord.getLevel() + 1;
        let next = buildConfig.unlock[level];

        let index = 0;
        for (const key in next) {
            let item = this.nextItems[index];
            if (next[key] != false || next[key] === 0) {
                item.active = true;
                this.loadIcon(item, next, key);
                let info = item.getComponentsInChildren(cc.Label)[0];
                info.string = cc.Global.wordsConfig.unLockType[key].replace("@", (next[key] + 1));
                index++;
            } else {
                item.active = false;
            }
        }

        let len = this.nextItems.length;
        for (let i = index; i < len; i++) {
            this.nextItems[i].active = false;
        }

        this.needContent.parent.getChildByName("info").getComponent(cc.Label).string = cc.Global.wordsConfig.extra.levelH + (level);
    },

    initBuild() {
        let level = this.logic.lord.getLevel() + 1;
        let precondition = buildConfig.lord[level].precondition;

        this.buildItems[0].active = false;
        this.buildItems[1].active = false;

        if ((precondition.harbour || precondition.harbour == 0) && precondition.harbour != -1) {
            this.buildItems[0].active = true;
            let str = (precondition.harbour + 1) + cc.Global.wordsConfig.extra["levelT"];
            this.buildItems[0].getChildByName("info").getComponent(cc.Label).string = str;
        }
        
        if ((precondition.route || precondition.route == 0) && precondition.route != -1) {
            this.buildItems[1].active = true;
            let str = (precondition.route + 1) + cc.Global.wordsConfig.extra["levelT"];
            this.buildItems[1].getChildByName("info").getComponent(cc.Label).string = str;
        }
    },

    initCash() {
        let level = this.logic.lord.getLevel() + 1;
        let needPrice = buildConfig.lord[level].price;
        this.cashStr.string = needPrice;
    },

    loadIcon(item, next, key) {
        let path = "";
        switch (key) {
            case "land":
                {
                    path = "icon/land";
                    break;
                }
            case "livestock":
                {
                    path = "icon/livestock/" + next[key] + "/0";
                    break;
                }
            case "store":
                {
                    path = "icon/store/0";
                    break;
                }
            case "orchard":
                {
                    path = "icon/orchard";
                    break;
                }
            case "aquatic":
                {
                    path = "icon/aquatic";
                    break;
                }
            case "paddy":
                {
                    path = "icon/paddy";
                    break;
                }
            case "factory":
                {
                    path = "icon/factory/" + Math.floor(next[key] / 3);
                    break;
                }
            case "harbour":
                {
                    path = "icon/harbour/" + Math.floor(next[key] / 2);
                    break;
                }
            case "route":
                {
                    path = "icon/route/0";
                    break;
                }        
            ////////////////////////////////////////////////////////////////////////////////
            case "canteen":
                {
                    path = "icon/canteen/" + Math.floor(next[key] / 2);
                    break;
                }
            case "hotel":
                {
                    path = "icon/hotel/" + Math.floor(next[key] / 2);
                    break;
                }
            case "floor":
                {
                    path = "icon/floor/0" /*+ Math.floor(next[key] / 2)*/;
                    break;
                }
            case "store":
                {
                    path = "icon/store/" + Math.floor(next[key] / 2);
                    break;
                }
            case "paddy":
                {
                    path = "icon/paddy";
                    break;
                }        
        }

        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        let roomPath = "icon/lord/" + Math.floor(((this.logic.lord.getLevel() + 1) / 3));
        cc.Global.assertCenter.readLocalSpriteFrame(roomPath, function (err, spriteFrame) {
            this.node.getChildByName("background").getChildByName("frame").getChildByName("room")
                .getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }.bind(this));
    },

    closeBtn(event, data) {
        this.close();
        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    }
});
