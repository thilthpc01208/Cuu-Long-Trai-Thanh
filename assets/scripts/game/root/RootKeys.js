cc.Class({
    extends: cc.Component,
    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                break;
        }

        cc.Global.listenCenter.fire(cc.Global.eventConfig.keyCode, event.keyCode);
    },

    onKeyUp: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                break;
        }
    }
});