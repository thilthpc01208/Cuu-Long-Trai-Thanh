const MenuBase = require("MenuBase");

cc.Class({
    extends: MenuBase,

    properties: {
        progressBar: {
            type: cc.ProgressBar,
            default: null
        },

        spin: {
            type: cc.Node,
            default: null
        },

        info: {
            type: cc.Label,
            default: null
        }
    },

    menuEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.LoadInfo, this.setProgressBar, this);
        this.setTip();
    },

    menuDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.LoadInfo, this);
    },

    setTip() {
        if (this.node.getChildByName("limitBtn")) {
            this.node.getChildByName("limitBtn").active = true;
        }

        if (this.node.getChildByName("tip")) {
            this.node.getChildByName("tip").active = true;
        }
    },

    setProgressBar(data) {
        this.scheduleOnce(function () {
            let process = data.scale.split("/");
            process = parseInt(process[0]) / parseInt(process[1]);
            this.progressBar.progress = process;

            let routeDis = this.progressBar.node.width;
            let current = routeDis * process - routeDis / 2;
            this.spin.x = current;

            this.info.string = data.info;
            if (!data.end) { return; }
            this.scheduleOnce(function () {
                this.node.removeFromParent();
            }.bind(this), 1);    
        }.bind(this), 0.05);
    }
});
