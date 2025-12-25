const MenuBase = require("MenuBase");

cc.Class({
    extends: MenuBase,

    properties: {
        alertPanel: {
            type: cc.Node,
            default: null
        },

        loadPanel: {
            type: cc.Node,
            default: null
        }
    },

    menuEnable() {

    },

    menuDisable() {

    },

    start() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayMusic, "bg");
        cc.Global.sdk.postEvent1("enter_start");

        this.antiAddsat();

    },

    startBtn(event, data) {
        event.target.active = false;
        this.enterGame(event);
    },

    closeAlert(event, data) {
        this.alertPanel.active = false;
    },

    openAlert(event, data) {
        this.alertPanel.active = true;
    },

    protectionLaw(event, data) {
        cc.Global.sdk.postReview("http://8.142.24.253:10051/static/中华人民共和国个人信息保护法.html");
    },

    enterGame(event) {
        if (!this.logic.logicSucess) {
            this.scheduleOnce(this.enterGame.bind(this), 1.0);
            return;
        }
        cc.director.loadScene("main_scene");
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
