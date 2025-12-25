const articsConfig = require("../../../config/alone/ArticsConfig");
const normalConfig = require("../../../config/alone/NormConfig");
const Logic = require('../../logic/logic');

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        icon: {
            type: cc.Sprite,
            default: null
        },

        gem: {
            type: cc.Label,
            default: null
        },

        time: {
            type: cc.Label,
            default: null
        }
    },

    onLoad() {
        this.logic = Logic.getInstance();
        module.exports.CurrentNode = null;
    },

    onEnable() {
        this.passTime = 0;

        if (module.exports.CurrentNode != null) {
            module.exports.CurrentNode.removeFromParent();
            module.exports.CurrentNode = null;
        }

        module.exports.CurrentNode = this.node;
        this.schedule(this.updateTime.bind(this), 1);

        let field = this.logic[this.type].getFieldInfo(this.index);
        this.initPanel(this.seed, field.endTime);
    },

    onDisable() {
        this.saveDot.plantTip = null;
        this.type = null;
        this.seed = null;
        this.index = null;
        this.saveDot = null;
        module.exports.CurrentNode = null;

        this.unschedule(this.updateTime.bind(this), 1);
    },

    update(dt) {
        if (this.passTime >= 3) { return; }

        this.passTime += dt;
        if (this.passTime < 3) { return; }

        this.node.removeFromParent();
    },

    speedBtn(event, data) {
        this.logic[this.type].quickGrow({ index: this.index });
    },

    advBtn(event, data) {
        let index = this.index;
        let type = this.type;
        let logic = this.logic;

        let code = 1;
        switch (this.extraMsg.type) {
            case "land":
                code = 1;
                break;
            case "orchard":
                code = 2;
                break;
            case "paddy":
                code = 3;
                break;
            default:
                break;
        }

        cc.Global.sdk.postEvent2("ads_start_position",code);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",code);
            logic[type].quickGrow({ index: index });
        });
    },

    setPlantInfo(field, saveDot) {
        this.saveDot = saveDot;

        this.type = field.type;
        this.seed = field.seed;
        this.index = field.index;

        this.initPanel(this.seed, field.endTime);
    },

    plus(field) {
        if (field.index !== this.index) { return; }

        if (field.state === 2) {
            this.node.removeFromParent();
            return;
        }

        this.initPanel(this.seed, field.endTime);
    },

    initPanel(seed, endTime) {
        if (!this.logic) { return; }

        let currentTime = this.logic.getSysTime();
        let time = (endTime - currentTime) / 1000;
        time = Math.ceil(time);

        let remain = cc.Global.mathUtil.secondFormart(time);
        let gem = Math.ceil(time / normalConfig.oneGemCutSecond);

        this.gem.string = gem;
        this.time.string = remain;

        let texturePath = "artics/" + articsConfig.entityHash[this.seed].id;
        cc.Global.assertCenter.readLocalSpriteFrame(texturePath, function (err, sprite) {
            this.icon.spriteFrame = sprite;
        }.bind(this));
    },

    updateTime() {
        if (this.type == null || this.seed == null || this.index == null) { return; }
        let field = this.logic[this.type].getFieldInfo(this.index);
        this.initPanel(this.seed, field.endTime);
    },
});
