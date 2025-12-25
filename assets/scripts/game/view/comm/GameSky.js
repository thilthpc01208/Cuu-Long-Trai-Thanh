const articsConfig = require("../../../config/alone/ArticsConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        flag: {
            type: cc.Prefab,
            default: null
        },

        store: {
            type: cc.Node,
            default: null
        },

        cash: {
            type: cc.Node,
            default: null
        },

        gem: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {
        this.flySpeed = 600;
        this.list = [];
    },

    start() {
        this.flag.active = false;
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.GameSky, this.saveFlag, this);
        this.pool = [];
        this.schedule(this.createFlag, 0.1);
    },

    onDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.GameSky, this);
        this.pool = [];
        this.unschedule(this.createFlag);
    },

    createFlag() {
        if (this.list.length <= 0) {return;}
        let data = this.list.pop();

        let name = data.name;
        let to = data.to;

        let startPos = data.startPos;
        let endPos = null;

        if (to === "store") {
            this.getStore();
            endPos = cc.Global.axexUtil.convetOtherNodeSpaceAR(this.store, this.node);
        }
        else if (to === "cash") {
            endPos = cc.Global.axexUtil.convetOtherNodeSpaceAR(this.cash, this.node);
        }
        else if (to === "gem") {
            endPos = cc.Global.axexUtil.convetOtherNodeSpaceAR(this.gem, this.node);
        }

        if (!endPos) { endPos = { x: 0, y: 0 } }

        let tempEnd = { x: endPos.x, y: endPos.y };

        let normal = endPos.subSelf(startPos);
        let distance = normal.mag();
        let time = distance / this.flySpeed;

        let newFlag = null;
        if (this.pool.length <= 0) {
            newFlag = cc.instantiate(this.flag);
            newFlag.parent = this.node;
            newFlag.active = false;
        }
        else {
            newFlag = this.pool.pop();
        }
        newFlag.x = startPos.x;
        newFlag.y = startPos.y;

        let path = "artics" + name;
        if (name !== "cash" && name !== "gem") {
            path = "artics/" + articsConfig.entityHash[name].id;
        }
        else {
            path = "artics/" + name;
        }

        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            newFlag.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            newFlag.active = true;

            let moveTo = cc.moveTo(time, cc.v2(tempEnd.x, tempEnd.y));
            moveTo = moveTo.easing(cc.easeBackOut(time));

            let func = cc.callFunc(function () {
                //newFlag.removeFromParent();
                newFlag.active = false;
                this.pool.push(newFlag);
            }.bind(this));

            let sequence = cc.sequence(moveTo, func);
            newFlag.stopAllActions();
            newFlag.runAction(sequence);
        }.bind(this));

        newFlag.getChildByName("num").getComponent(cc.Label).string = data.num;
    },

    saveFlag(data) {
        for (let index = 0, len = this.list.length; index < len; index++) {
            let last = this.list[index];
            if (last.name == data.name && last.to == data.to) {
                return;
            }
        }
        this.list.push(data);
    },

    getStore() {
        if (this.store) { return; }
        this.store = cc.find("Canvas/GameCT/map/build/bud_store");
    }
});
