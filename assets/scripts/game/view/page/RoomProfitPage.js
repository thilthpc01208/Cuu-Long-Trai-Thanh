const normalConfig = require("../../../config/alone/NormConfig");
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        tittle: {
            type: cc.Label,
            default: null
        },

        descript: {
            type: cc.Label,
            default: null
        },

        advInfo: {
            type: cc.Label,
            default: null
        }
    },

    pageEnable() {
        if (!this.extraMsg) {
            this.extraMsg = { "build": "hotel", "type": "single", "index": 0 };
        }

        this.initPanel();
    },

    receiveBtn(event, data) {
        let adv = data == 1 ? true : false;
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);

        let factorys = ["noddle", "tofu", "condiment", "candy", "milk", "tea", "stewedmeat",
            "tavern", "cake", "candiedfruit", "bushmeat", "seafood"];

        if (adv === true) {
            let msg = this.extraMsg, logic = this.logic;

            let advcode = 24;
            switch (this.extraMsg.build) {
                case "hotel":
                    advcode = 24;
                    break;
                case "factory":
                    advcode = 28;
                    break;
                case "rental":
                    advcode = 26;
                    break;
                default:
                    break;
            }
            cc.Global.sdk.postEvent2("ads_start_position", advcode);

            cc.Global.sdk.videoExc(function (code) {
                if (code != 1) { return; }
                cc.Global.sdk.postEvent2("ads_finish_position",advcode);

                if (this.extraMsg.build === "hotel") { logic.hotel.drawProfit({ adv: true, startPos: startPos, oneClick: true }); }
                if (this.extraMsg.build === "factory") {
                    for (let index = 0, len = factorys.length; index < len; index++) {
                        this.logic[factorys[index]].drawProfit({ adv: true, startPos: startPos, scale: 2, oneClick: true });
                    }
                }

                if (this.extraMsg.build === "rental") {
                    let funName = msg.type == "single" ? "drawOneRentalCash" : "drawAllRentalCash";
                    let scale = msg.type == "single" ? normalConfig.rewardVideoScale : 2;
                    logic.rental[funName]({ adv: true, index: msg.index, startPos: startPos, scale: scale, oneClick: true });
                }
                this.close();
            }.bind(this));
        }
        else {
            if (this.extraMsg.build === "hotel") { this.logic.hotel.drawProfit({ adv: false, startPos: startPos, oneClick: true }); }

            if (this.extraMsg.build === "factory") {
                for (let index = 0, len = factorys.length; index < len; index++) {
                    this.logic[factorys[index]].drawProfit({ adv: false, startPos: startPos, oneClick: true });
                }
            }

            if (this.extraMsg.build === "rental") {
                let funName = this.extraMsg.type == "single" ? "drawOneRentalCash" : "drawAllRentalCash";
                this.logic.rental[funName]({ adv: false, index: this.extraMsg.index, startPos: startPos, oneClick: true });
            }
            this.close();
        }
    },

    initPanel() {
        let profit = 0;

        if (this.extraMsg.build == "factory") {
            let factorys = ["noddle", "tofu", "condiment", "candy", "milk", "tea", "stewedmeat",
                "tavern", "cake", "candiedfruit", "bushmeat", "seafood"];
            for (let index = 0, len = factorys.length; index < len; index++) {
                profit += this.logic[factorys[index]].getProfit();
            }
        }

        if (this.extraMsg.build == "rental") {
            let index = this.extraMsg.type == "single" ? this.extraMsg.index : null;
            profit = this.logic.rental.getProfit({ index: index });
        }

        if (this.extraMsg.build == "hotel") {
            profit = this.logic.hotel.getProfit();
        }

        let cash = this.node.getChildByName("cash").getChildByName("num").getComponent(cc.Label);
        cash.string = profit;

        let collectNode = this.node.getChildByName("collect");
        collectNode.getChildByName("normalRecive").active = (this.extraMsg.type === "single");

        if (this.extraMsg.build == "factory") {
            this.descript.string = "一键领取作坊收益";
            this.tittle.string = "作坊";
            this.advInfo.string = "双倍领取";
        }

        if (this.extraMsg.build == "rental") {
            this.tittle.string = "出租房";

            let des = this.extraMsg.type == "single" ? "领取单个房间收益" : "一键领取所有房间收益";
            this.descript.string = des;

            let adv = this.extraMsg.type == "single" ? "三倍领取" : "双倍领取";
            this.advInfo.string = adv;
        }

        if (this.extraMsg.build == "hotel") {
            this.descript.string = "领取宾馆收益";
            this.tittle.string = "宾馆";
            this.advInfo.string = "三倍领取";
        }

        collectNode.getChildByName("adverRecive").getComponent(cc.Button).interactable = (profit > 0);
    }
});
