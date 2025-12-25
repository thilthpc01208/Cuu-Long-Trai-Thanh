const Logic = require('../../logic/logic');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.logic = Logic.getInstance();

        this.buildMap = {/*"truckSpin": { "x": 300, "y": -1550, "z": 15, needBuild: true }*/ };
        this.uiList = cc.Global.pageConfig.main_scene;

        this.totalItemNumber = Object.keys(this.buildMap).length;
        this.totalItemNumber += this.uiList.length;

        this.doneNum = 0;
        this.canLoadNext = true;
        this.buildNext = null;
    },

    start() {
        //this.initBuild();
        this.initUi();
    },

    onEnable() {
        this.schedule(this.updateStep.bind(this), 0.1);
    },

    onDisable() {
        this.unschedule(this.updateStep.bind(this), 0.1);
    },

    updateStep(dt) {
        if (!this.canLoadNext) { return; }

        if (this.uiNext != null) {
            let result = this.uiNext();
            if (!result) { this.uiNext = null; }
            else { return; }
        }

        if (this.buildNext != null) {
            let result = this.buildNext();
            if (!result) { this.buildNext = null; }
            else { return; }
        }
    },

    initBuild() {
        this.buildNext = null;

        let builds = Object.keys(this.buildMap);
        let len = builds.length;

        let index = 0;
        let buildNext = function () {
            let info = this.buildMap[builds[index]];
            if (info.needBuild) {
                this.createBuild(builds[index], info);
            }
            else {
                this.setBuild(builds[index], info);
            }

            index++;

            return index < len;
        }.bind(this);

        this.buildNext = buildNext;
    },

    initUi() {
        this.uiNext = null;
        let len = this.uiList.length;

        let index = 0;
        let uiNext = function () {
            let info = this.uiList[index];
            this.createUi(info);

            index++;

            return index < len;
        }.bind(this);

        this.uiNext = uiNext;
    },

    createBuild(name, pos) {
        this.canLoadNext = false;
        cc.Global.assertCenter.readLocalPrefab("builds/" + name, function (err, profab) {
            if (err) { return; }

            let build = cc.instantiate(profab);
            build.x = pos.x;
            build.y = pos.y;
            build.zIndex = pos.z;
            build.parent = this.node;

            this.doneNum++;
            this.castMsg(name);
            this.canLoadNext = true;
        }.bind(this));
    },

    setBuild(name, pos) {
        this.canLoadNext = false;

        let node = this.node.getChildByName(name);
        node.x = pos.x;
        node.y = pos.y;
        node.zIndex = pos.z;
        this.doneNum++;

        this.canLoadNext = true;
    },

    createUi(uiInfo) {
        if (!uiInfo.needLoad) {
            this.doneNum++;
            this.castMsg(uiInfo.name);
            return;
        }

        let currentLevel = this.logic.lord.getLevel();
        if (currentLevel < uiInfo.level) {
            this.doneNum++;
            this.castMsg(uiInfo.name);
            return;
        }

        this.canLoadNext = false;
        cc.Global.assertCenter.openPage(uiInfo, true, function (page) {
            this.doneNum++;
            this.castMsg(uiInfo.name);
            this.scheduleOnce(function () {
                page.getComponent("PageBase").close();
            }.bind(this), 0.05);
            this.canLoadNext = true;
        }.bind(this), null);
    },

    castMsg(name) {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.LoadInfo, {
            scale: this.doneNum + "/" + this.totalItemNumber,
            info: Math.ceil((this.doneNum / this.totalItemNumber) * 100) + "%",
            end: this.doneNum == this.totalItemNumber
        });
    }
});
