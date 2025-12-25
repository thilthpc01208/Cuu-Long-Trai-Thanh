const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        brunchPanel: {
            type: cc.Node,
            default: null
        },

        mainPanel: {
            type: cc.Node,
            default: null
        },

        dayPanel: {
            type: cc.Node,
            default: null
        },

        toggleList: {
            type: [cc.Toggle],
            default: []
        },

        mainTip: {
            type: cc.Node,
            default: null
        },

        brunchTip: {
            type: cc.Node,
            default: null
        },

        dayTip: {
            type: cc.Node,
            default: null
        },
    },

    pageLoad() {
        // 是否同时出现主线任务和支线任务
        this.allShow = true;
    },

    pageEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.MainTaskModify, this.mainTaskModify.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.BrunchTaskModify, this.brunchTaskModify.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.DayTaskModify, this.dayTaskModify.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.ChangeLanguage, this.initPage.bind(this), this);

        this.selectPanel = this.dayPanel;
        this.schedule(this.updateTime.bind(this), 1);

        this.initCurrentTask();
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.MainTaskModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.BrunchTaskModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.DayTaskModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.ChangeLanguage, this);

        this.unschedule(this.updateTime.bind(this), 1);
    },

    toggleBtn(toggle, data) {
        
        this.hidePage(this.selectPanel);

        if (data === "brunchtask") {
            this.selectPanel = this.brunchPanel;
            cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
        }

        if (data === "maintask") {
            this.selectPanel = this.mainPanel;
        }

        if (data === "daytask") {
            this.selectPanel = this.dayPanel;
        }

        this.showPage(this.selectPanel);
    },

    openPage() {
        this.initCurrentTask();
    },

    initPage() {
        this.mainPanel.getComponent("MainTask").initPage();
        this.brunchPanel.getComponent("BrunchTask").initPage();
        this.dayPanel.getComponent("DayTask").initPage();
    },

    mainTaskModify(currentTaskType) {
        this.mainPanel.getComponent("MainTask").initPage();

        if (currentTaskType == "brunch" && !this.allShow) {
            this.initCurrentTask("brunch");

            this.toggleList[1].isChecked = false;
            this.toggleList[2].isChecked = true;

            this.brunchPanel.getComponent("BrunchTask").initPage();
            this.hidePage(this.selectPanel);
            this.selectPanel = this.brunchPanel;
            this.showPage(this.selectPanel);
        }
    },

    brunchTaskModify(currentTaskType) {
        this.brunchPanel.getComponent("BrunchTask").initPage();

        if (currentTaskType == "main" && !this.allShow) {
            this.initCurrentTask("main");

            this.toggleList[1].isChecked = true;
            this.toggleList[2].isChecked = false;

            this.mainPanel.getComponent("MainTask").initPage();
            this.hidePage(this.selectPanel);
            this.selectPanel = this.mainPanel;
            this.showPage(this.selectPanel);
        }
    },

    dayTaskModify() {
        this.dayPanel.getComponent("DayTask").initPage();
    },

    initCurrentTask(currentSelectTask) {
        if (this.allShow) { return; }

        if (!currentSelectTask) {
            currentSelectTask = this.logic.task.getCurrentSelectTask();
        }

        if (currentSelectTask == "main") {
            this.toggleList[1].node.active = true;
            this.toggleList[2].node.active = false;
        }

        if (currentSelectTask == "brunch") {
            this.toggleList[1].node.active = false;
            this.toggleList[2].node.active = true;
        }
    },

    hidePage(page) {
        page.scaleX = 0;
        page.scaleY = 0;
        page.opacity = 0;
    },

    showPage(page) {
        page.scaleX = 1;
        page.scaleY = 1;
        page.opacity = 255;
    },

    closeBtn() {
        this.close();
        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    updateTime() {
        let info = this.logic.task.hasOneTaskDone();
        this.dayTip.active = info.day;

        let currentSelectTask = this.logic.task.getCurrentSelectTask();
        if (currentSelectTask == "main" || this.allShow) {
            this.mainTip.active = info.main;
        }

        if (currentSelectTask == "brunch" || this.allShow) {
            this.brunchTip.active = info.brunch;
        }
    }
});
