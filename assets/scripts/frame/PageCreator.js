module.exports = class PageCreator {
    constructor() {
        this.pageCatch = {};
    }

    static instance = null;
    static getInstance() {
        if (PageCreator.instance == null) {
            PageCreator.instance = new PageCreator();
        }
        return PageCreator.instance;
    }

    //创建页面
    createPage(pageInfo) {
        let createPage = function (err, prefab) {
            if (err != null) {
                pageInfo.callBack(null);
                return;
            }

            let page = cc.instantiate(prefab);
            if (pageInfo.innerSave) {
                this.pageCatch[pageInfo.name] = page;
            }
            initPage(page, pageInfo);
        };

        let checkParent = function (pageInfo, parent) {
            let children = parent.children;
            for (let index = 0; index < children.length; index++) {
                let child = children[index];
                if (child.name != pageInfo.name) {
                    continue;
                }
                return false;
            }
            return true;
        };

        let initPage = function (page, pageInfo) {
            page.pageInfo = pageInfo;
            page.msg = pageInfo.msg;

            let parent = cc.find(pageInfo.parent);
            if (pageInfo.show) {
                if (checkParent(pageInfo, parent)) {
                    page.parent = parent;
                    page.active = true;
                }

                let component = page.getComponent("PageBase");
                if (component) {
                    component.open();
                }
            }

            if (pageInfo.callBack != null) {
                pageInfo.callBack(page);
            }
        };

        if (this.pageCatch[pageInfo.name] != null) {
            let page = this.pageCatch[pageInfo.name];
            initPage(page, pageInfo);
        }
        else {
            cc.Global.assertCenter.readLocalPrefab(pageInfo.path, createPage.bind(this));
        }
    }

    destroyPage(pageInfo, destroy = false) {
        let page = this.pageCatch[pageInfo.name];
        if (page != null) { page.parent = null; }
        if (page != null && (pageInfo.innerSave == false || destroy)) {
            this.pageCatch[pageInfo.name] = null;
        }
    }

    release() {
        for (const key in this.pageCatch) {
            let page = this.pageCatch[key];
            if (page != null) { page.parent = null; }
            this.pageCatch[key] = null;
        }
    }
}