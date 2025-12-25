const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

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

    pageLoad() {
        this.loadType = "";
    },

    pageEnable() {
        this.info.string = "";
        cc.Global.listenCenter.register(cc.Global.eventConfig.StartLoad, this.Load, this);
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.StartLoad, this);
    },

    Load(loadInfo) {
        this.scale = loadInfo.scale;
        if (loadInfo.type === cc.Global.eventConfig.LoadType.Folder) {
            this.loadType = cc.Global.wordsConfig.extra["resourceLoad"];
            cc.loader.loadResDir(loadInfo.info.path, this.onProgress.bind(this), function (err, assets) {
                loadInfo.callBack();
                if (loadInfo.end) { this.close(); }
            }.bind(this));
        }

        if (loadInfo.type === cc.Global.eventConfig.LoadType.Page) {
            this.loadType = cc.Global.wordsConfig.extra["resourceLoad"];
            loadInfo.info.show = false;
            loadInfo.info.msg = null;
            loadInfo.info.callBack = function () {
                loadInfo.callBack();
                delete loadInfo.info.callBack;
                if (loadInfo.end) { this.close(); }
            }.bind(this);
            cc.Global.pageCreator.createPage(loadInfo.info);
        }

        if (loadInfo.type === cc.Global.eventConfig.LoadType.Obj) {
            this.loadType = cc.Global.wordsConfig.extra["resourceLoad"];;
            loadInfo.info.show = false;
            loadInfo.info.msg = null;
            loadInfo.info.callBack = function () {
                loadInfo.callBack();
                delete loadInfo.info.callBack;
                if (loadInfo.end) { this.close(); }
            }.bind(this);
            cc.Global.objCreator.createObj(loadInfo.info);
        }

        if (loadInfo.type === cc.Global.eventConfig.LoadType.Scene) {
            this.loadType = cc.Global.wordsConfig.extra["resourceLoad"];
            cc.director.preloadScene(loadInfo.info, this.onProgress.bind(this), function (err, assets) {
                loadInfo.callBack(loadInfo.info);
                this.setProgressBar("100/100", "", true);
                if (loadInfo.end) { this.close(); }
            }.bind(this));
        }

        let info = this.loadType + "(" + this.scale + ")";
        this.setProgressBar(this.scale, info);
    },

    onProgress: function (completedCount, totalCount, item) {
        let info = Math.floor(completedCount / totalCount * 100) + "%";
        if (info == "NaN%") {
            info = "100%";
        }

        info = "(" + info + ")";
        info = this.loadType + info + "";

        this.setProgressBar(completedCount + "/" + totalCount,info,false);
    },

    setProgressBar(scale, info, end = false) {
        /*
        let process = scale.split("/");
        process = parseInt(process[0]) / parseInt(process[1]);
        this.progressBar.progress = process;
    
        let routeDis = this.progressBar.node.width;
        let current = routeDis * process - routeDis / 2;
        this.spin.x = current + 70;
    
        this.info.string = info;
        */

        cc.Global.listenCenter.fire(cc.Global.eventConfig.LoadInfo, {
            scale: scale,
            info: info,
            end: end
        });
    }
});
