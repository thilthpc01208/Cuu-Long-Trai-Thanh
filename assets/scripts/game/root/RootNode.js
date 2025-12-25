const CasualStory = require("CasualStory");

const EventConfig = require("EventConfig");
const ResConfig = require("ResConfig");
const PageConfig = require("PageConfig");
const ObjConfig = require("ObjConfig");

const PageCreator = require("PageCreator");
const ObjCreator = require("ObjCreator");
const AssertCenter = require("AssertCenter");
const ListenCenter = require("ListenCenter");

const ToolsUtil = require("ToolsUtil");
const MathUtil = require('MathUtil');
const AxexUtil = require('AxexUtil');
const HttpUtil = require("HttpUtil");
const WordsConfig = require("WordsConfig");

const GameLogic = require("../logic/logic");
const { create_catch_data } = require("../logic/sustain/dataGroup/dataCreate");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.createGlobal();

        //logic
        this.logic = GameLogic.getInstance();
        this.logic.onLoad();

        // 设置帧率
        cc.game.setFrameRate(45);
    },

    start() {
        cc.game.addPersistRootNode(this.node);

        cc.game.on(cc.game.EVENT_HIDE, function () {
            this.onHideGame();
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, function () {
            this.onShowGame();
        }, this);

        //步进
        this.schedule(this.logic.updateStep.bind(this.logic), 0.5);

        cc.director.loadScene("login_scene");
    },

    update(dt) {
        this.logic.addSysTime(Math.floor(dt * 1000));
        this.logic.updateFrame(dt);
    },

    //处理游戏切到后台时的事件
    onHideGame() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.HideGame, null);
    },

    //处理游戏切回前台时的事件
    onShowGame() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.ShowGame, null);
        this.logic.setSysTime();
    },

    onDestroy() {

    },

    createGlobal() {
        cc.Global = {};

        //系统级别
        cc.Global.listenCenter = ListenCenter.getInstance();
        cc.Global.casualStory = CasualStory.getInstance();
        cc.Global.eventConfig = EventConfig.getInstance();
        cc.Global.resConfig = ResConfig.getInstance();
        cc.Global.pageConfig = PageConfig.getInstance();
        cc.Global.pageCreator = PageCreator.getInstance();
        cc.Global.objConfig = ObjConfig.getInstance();
        cc.Global.objCreator = ObjCreator.getInstance();
        cc.Global.assertCenter = AssertCenter.getInstance();
        cc.Global.toolsUtil = ToolsUtil.getInstance();
        cc.Global.mathUtil = MathUtil.getInstance();
        cc.Global.axexUtil = AxexUtil.getInstance();
        cc.Global.httpUtil = HttpUtil.getInstance();
        cc.Global.wordsConfig = WordsConfig;

        //共用了小小大农场的
        cc.Global.casualStory.setData("ip", "http://8.142.24.253:9099/");

        //用户级别
        cc.Global.sdk = require("PlatSdk");

        cc.Global.casualStory.setData("GameType", "ZLCZ");
        cc.Global.sdk.getLogoType(function (code) {
            if (code == 0) {
                cc.Global.casualStory.setData("GameType", "ZLCZ");
            }
            else {
                cc.Global.casualStory.setData("GameType", "NJL");
            }
        }.bind(this));
    }
});