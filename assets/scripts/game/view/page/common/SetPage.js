const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        musicToggle: {
            type: cc.Toggle,
            default: null
        },

        effectToggle: {
            type: cc.Toggle,
            default: null
        }
    },

    pageEnable() {
        this.initPage();
    },

    pageDisable() {

    },

    musicToggleBtn(toggle, data) {
        
        cc.Global.listenCenter.fire(cc.Global.eventConfig.MusicStateChange, toggle.isChecked);
    },

    effectToggleBtn(toggle, data) {
        
        cc.Global.listenCenter.fire(cc.Global.eventConfig.EffectStateChange, toggle.isChecked);
    },

    traditionalChineseBtn(event, data) {
        
        this.changeLanguage("tw");
    },

    simpleChineseBtn(event, data) {
        
        this.changeLanguage("zh");
    },

    englishBtn(event, data) {
        
        this.changeLanguage("en");
    },

    privateBtn(event, data) { 
        cc.Global.sdk.privateReview();
    },


    /**
     * 初始化页面
     */
    initPage() {
        let musicState = cc.sys.localStorage.getItem("musicState");
        let effectState = cc.sys.localStorage.getItem("effectState");

        effectState = effectState == "true" ? true : false;
        musicState = musicState == "true" ? true : false;

        this.effectToggle.isChecked = effectState;
        this.musicToggle.isChecked = musicState;
    },

    changeLanguage(language) {
        cc.sys.localStorage.setItem("language", language);
        cc.Global.wordsConfig = require("WordsConfig")[language];
        cc.Global.casualStory.setData("language", language);

        this.resumeLabel(language);
        this.close();
    },

    resumeScene() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.GameOver, null);
        cc.Global.objCreator.clearAll();
        cc.Global.pageCreator.release();
        cc.find("Canvas/GameCT/map/build").removeAllChildren(true);

        cc.director.loadScene("main_scene");
    },

    resumeLabel(language) {
        let labels = cc.find('Canvas/GameUI').getComponentsInChildren(cc.Label);
        cc.Global.assertCenter.readLocalFont(language, function (err, font) {
            if (err) {

            }

            for (let index = 0, len = labels.length; index < len; index++) {
                labels[index].font = font;
            }
        });
    }
});
