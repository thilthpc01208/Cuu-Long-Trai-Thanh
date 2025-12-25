module.exports = class PageConfig {
    constructor() {
        this.uiMap = {};
        this.init();
    }

    static instance = null;
    static getInstance() {
        if (PageConfig.instance == null) {
            PageConfig.instance = new PageConfig();
        }

        return PageConfig.instance;
    }

    init() {
        this.root_scene =
            [
                { name: "loadPage", path: "page/comm/LoadPage", parent: "Canvas/GameUI", innerSave: false, outSave: false, isHide: false, unlockLevel: 0 },
            ];

        for (let index = 0, len = this.root_scene.length; index < len; index++) {
            let name = this.root_scene[index].name;
            this.uiMap[name] = this.root_scene[index];
        }

        this.login_scene =
            [

            ];

        for (let index = 0, len = this.login_scene.length; index < len; index++) {
            let name = this.login_scene[index].name;
            this.uiMap[name] = this.login_scene[index];
        }

        this.main_scene =
            [
                { name: "createFieldPage", path: "page/createFieldPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: true },
                { name: "lordPage", path: "page/lordPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: true },
                { name: "storePage", path: "page/storePage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 0, needLoad: true },
                { name: "depotPage", path: "page/depotPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 0, needLoad: true },
                { name: "seedPage", path: "page/seedPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 0, needLoad: true },
                { name: "factoryPage", path: "page/factoryPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 0, needLoad: true },
                { name: "taskPage", path: "page/taskPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 0, needLoad: true },

                //按需加载
                { name: "stallPage", path: "page/stallPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 9, needLoad: true },
                { name: "livestockPage", path: "page/livestockPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 6, needLoad: true },
                { name: "aquaticPage", path: "page/aquaticPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 12, needLoad: true },
                { name: "canteenPage", path: "page/canteenPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 22, needLoad: true },

                //首次不加载,节约时间
                { name: "buildPage", path: "page/buildPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 1, needLoad: true },
                { name: "achivePage", path: "page/achivePage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 1, needLoad: true },

                //使用少,无需加载
                { name: "signPage", path: "page/signPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: true },

                //外出,无需加载
                { name: "outdoorPage", path: "page/outdoorPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 0, needLoad: true },
                { name: "outRewardPage", path: "page/outRewardPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: true },

                //港口,不主动加载
                { name: "harbourPage", path: "page/harbourPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: true, level: 9, needLoad: true },
                { name: "shipRewardPage", path: "page/shipRewardPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 9, needLoad: true },
                { name: "shipPage", path: "page/shipPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 9, needLoad: true },

                //特小,不主动加载
                { name: "setPage", path: "page/comm/SetPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "salePage", path: "page/salePage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "upWithNaturePage", path: "page/upWithNaturePage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "upNoNaturePage", path: "page/upNoNaturePage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "searchPage", path: "page/searchPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "createBuildPage", path: "page/createBuildPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "materialPage", path: "page/materialPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "bridPage", path: "page/bridPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "alertPage", path: "page/alertPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false },
                { name: "roomProfitPage", path: "page/roomProfitPage", parent: "Canvas/GameUI", innerSave: true, outSave: false, isHide: false, level: 0, needLoad: false }
            ];

        for (let index = 0, len = this.main_scene.length; index < len; index++) {
            let name = this.main_scene[index].name;
            this.uiMap[name] = this.main_scene[index];
        }
    }

    findPageInfo(pageName) {
        return JSON.parse(JSON.stringify(this.uiMap[pageName]));
    }
}//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html