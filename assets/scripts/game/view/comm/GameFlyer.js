const Logic = require('../../logic/logic');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.logic = Logic.getInstance();
    },

    start() {
        this.node.x = -2000;
    },

    onEnable() {
        this.schedule(this.bridShow.bind(this), 60);
    },

    onDisable() {
        this.unschedule(this.bridShow.bind(this), 60);
    },

    clickBrid() {
        //this.node.stopAllActions();
        this.node.x = -2000;
        
        let pageInfo = cc.Global.pageConfig.findPageInfo("bridPage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, null);
    },

    bridShow() {
        if (!this.logic.lord.getGameGuideState()) {
            return;
        }

        if (cc.Global.casualStory.getData("GameGuideState") == true) {
            return;
        }

        this.node.x = -125;
        //let moveTo = cc.moveTo(15, cc.v2(-700, this.node.y));
        //this.node.runAction(moveTo);

        this.scheduleOnce(function () {
            this.node.x = -2000;
        }.bind(this), 20);
    }
});
