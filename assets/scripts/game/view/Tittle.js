cc.Class({
    extends: cc.Component,

    properties: {
        ZLCZTexture: {
            type: cc.SpriteFrame,
            default: null
        },

        NJLTexture: {
            type: cc.SpriteFrame,
            default: null
        },
    },

    start() {
        if (cc.Global.casualStory.getData("GameType") == "ZLCZ") {
            this.node.getComponent(cc.Sprite).spriteFrame = this.ZLCZTexture;
        }
        else {
            this.node.getComponent(cc.Sprite).spriteFrame = this.NJLTexture;
        }
    }
});
