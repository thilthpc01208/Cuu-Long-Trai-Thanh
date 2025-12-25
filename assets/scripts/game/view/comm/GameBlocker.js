cc.Class({
    extends: cc.Component,

    properties: {
        info: {
            type: cc.Label,
            default: null
        }
    },

    start() {
        this.index = 0;
        this.stop = true;
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.GameBlock, this.setState, this);
        this.schedule(this.updateTime.bind(this), 1);
    },

    onDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.GameBlock, this);
        this.unschedule(this.updateTime.bind(this), 1);
    },

    setState(state) {
        if (state == true) {
            this.node.scaleX = 1;
            this.node.scaleY = 1;

            this.index = 0;
            this.info.string = "";
            this.stop = false;
        }
        else {
            this.node.scaleX = 0;
            this.node.scaleY = 0;
            this.stop = true;
        }
    },

    updateTime() {
        if (this.stop) { return; }

        let str = "";
        for (let index = 0; index < this.index; index++) {
            str += ".";
        }

        //this.info.string = cc.Global.wordsConfig.extra["orderProice"] + str;

        this.index++;
        if (this.index >= 6) { this.index = 0; }
    }
});
