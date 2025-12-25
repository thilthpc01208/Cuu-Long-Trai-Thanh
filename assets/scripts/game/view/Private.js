cc.Class({
    extends: cc.Component,

    properties: {
        tip: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {

        let result = cc.sys.localStorage.getItem("Private");
        if (result == "ok") {
            this.antiAddsat();
            this.node.active = false;
            return;
        }
        else {
            cc.Global.sdk.showPrivacy(function (code) {
                if (code == 1) {
                    this.node.active = true;
                }
                else {
                    this.antiAddsat();
                    this.node.active = false;
                }
            }.bind(this));
        }

    },

    BTN_XY1(){
        cc.sys.openURL("http://www2.quarkstudios.cn:10051/static/yinsibaohu-zlcz.html")
    },
    BTN_XY2(){
        cc.sys.openURL("http://www2.quarkstudios.cn:10051/static/yonghufuwu-zlcz.html")
    },

    cancelBtn(event, data) {
        this.tip.active = true;
        this.scheduleOnce(function () {
            this.tip.active = false;
        }, 2);
    },

    sureBtn(event, data) {
        this.antiAddsat();

        cc.sys.localStorage.setItem("Private", "ok");
        this.node.active = false;
    },

    /**
     * 实名认证
     */
    antiAddsat() {
        console.log("call antiAddict1");

        let account = cc.sys.localStorage.getItem("account");
        if (cc.Global.casualStory.getData("GameType") == "ZLCZ") {
            if (account == null || account == "") {
                account = cc.Global.mathUtil.getUserId();
                cc.sys.localStorage.setItem("account", account);
                let url = cc.Global.casualStory.getData("ip") + "dispose/getGameDispose?field=dispose&key=AntiAddsat";
                cc.Global.httpUtil.httpGet(url, function (data) {

                    console.log("net rewturen");

                    if (data == -1) { return; }
                    if (data.value === "1") {
                        cc.Global.sdk.antiAddict(account);

                        console.log("call antiAddict2");
                    }
                });

            }

        }
        else {
            if (account == null || account == "") {
                account = cc.Global.mathUtil.getUserId();
                cc.Global.casualStory.setData("account", account);
                cc.Global.sdk.antiAddict(account);
                console.log("call antiAddict");

            }
        }

        cc.Global.casualStory.setData("account", account);
    }
});
