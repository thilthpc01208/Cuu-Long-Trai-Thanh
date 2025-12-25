const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {

    },

    faciliteLoad() {
        this.buildName = "frontWall";
        this.setWallTexture();
    },

    faciliteEnable() {

    },

    faciliteDisable() {

    },

    touchStart(event) {
        this.startPos = event.getLocation();
        this.canSelect = true;
    },

    touchMove(event) {
        let movePos = event.getLocation();
        let dis = (movePos.subSelf(this.startPos)).mag()
        if (dis >= 10) {
            this.canSelect = false;
        }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; }
    },

    updateWallCallBack(level) {
        this.setWallTexture();
    },

    /**
     * 设置纹理所需信息
     */
    setWallTexture() {
        let level = this.logic.lord.getWallLevel();
        let doorPath = "builds/wall/WeiQiang_Zheng_mentou_" + level;
        let wallPath = "builds/wall/WeiQiang_Zheng_" + level;

        let arr = this.node.children;
        for (let index = 0, len = arr.length; index < len; index++) {
            if (index <= 1) {
                cc.Global.assertCenter.replaceSpriteFrame(arr[index], wallPath);
            }
            else {
                cc.Global.assertCenter.replaceSpriteFrame(arr[index], doorPath);
            }
        }
    }
});
