const Logic = require("../game/logic/logic");

module.exports = cc.Class({
    extends: cc.Component,
    properties: {

    },

    statics: {
        currentPage: null,
    },

    onLoad() {
        this.gameSky = cc.find("Canvas/GameSky");
        this.logic = Logic.getInstance();

        // 是否第一次打开
        this.isFristOpen = true;
        // 是否在运行
        this.isAlive = false;

        this.pageLoad();
    },

    onEnable() {
        this.extraMsg = this.node.msg;
        if (!this.gameSky || !this.logic) {
            this.gameSky = cc.find("Canvas/GameSky");
            this.logic = Logic.getInstance();
        }

        this.pageEnable();

        this.isFristOpen = false;
        this.isAlive = true;

        cc.Global.listenCenter.fire(cc.Global.eventConfig.AddUpdateEvent, this.updateFun);
    },

    onDisable() {
        this.pageDisable();
        this.isAlive = false;

        cc.Global.listenCenter.fire(cc.Global.eventConfig.DelUpdateEvent, this.updateFun);
    },

    pageLoad() {

    },

    pageEnable() {

    },

    pageDisable() {

    },

    // 对于不会移出节点数的ui,第一次以外的打开调用这个,因为不会触发onEnable
    openPage() {

    },

    // 对于不会移出节点数的ui,关闭调用这个,因为不会触发onDisable
    closePage() {

    },
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
    updateFun() {

    },

    open() {
        this.extraMsg = this.node.msg;

        if (!this.gameSky || !this.logic) {
            this.gameSky = cc.find("Canvas/GameSky");
            this.logic = Logic.getInstance();
        }

        this.setZIndex();
        if (this.node.pageInfo.isHide) {
            this.node.x = 0;
            this.node.opacity = 255;
            this.isAlive = true;
        }

        if (!this.isFristOpen) {
            this.openPage();
        }

        this.isFristOpen = false;
    },

    // 设置ui的遮挡关系
    setZIndex() {
        let uiRoot = cc.find("Canvas/GameUI").children;
        for (let index = 0; index < uiRoot.length; index++) {
            uiRoot[index].zIndex = index;
        }
        this.node.zIndex = uiRoot.length;
    },

    close(event, data) {
        // 引导是空白区域点击不生效
        if (event != null && data != null && data == "block" &&
            cc.Global.casualStory.getData("GameGuideState")) {
            return;
        }

        if (this.node.pageInfo.isHide) {
            this.node.x = 2000;
            // 可以节省drawcall,还不出发active
            this.node.opacity = 0;
            this.isAlive = false;
            this.closePage();
        }
        else {
            cc.Global.pageCreator.destroyPage(this.node.pageInfo, false);
            this.node.removeFromParent();
        }
    }
});
