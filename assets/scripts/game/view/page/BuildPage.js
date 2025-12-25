const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        contentNode: {
            type: cc.Node,
            default: null
        },

        toggleList: {
            type: [cc.Toggle],
            default: []
        }
    },

    pageLoad() {
        // 建造类别(住户设施,主要设施,附加设施,主题设施)
        this.typeList = ["rentalFacility", "mainFacility", "auxFacility", "themeFacility"];
        this.innerMap = {};
        this.lastPage = null;

        this.currentIndex = 1;
    },

    openPage() {
        if (!this.extraMsg) { this.extraMsg = { index: 0 }; }

        if (this.extraMsg.index || this.extraMsg.index == 0) {
            this.currentIndex = this.extraMsg.index;
        }
        this.getPagePath(this.currentIndex);
    },

    typeToggleBtn(toggle, data) {
        this.currentIndex = parseInt(data);
        this.getPagePath(this.currentIndex);
    },

    getPagePath(index) {
        let path = "";
        switch (index) {
            case 0:
                {
                    path = "page/builds/rentalFacility";
                }
                break;
            case 1:
                {
                    path = "page/builds/mainFacility";
                }
                break;
            case 2:
                {
                    path = "page/builds/auxFacility";
                }
                break;
            case 3:
                {
                    path = "page/builds/themeFacility";
                }
                break;
        }

        this.toggleList[this.currentIndex].isChecked = true;
        this.initSelectPanel(path, index);
    },

    initSelectPanel(path, index) {
        if (this.lastPage) {
            this.lastPage.scaleX = 0;
            this.lastPage.scaleY = 0;
            this.lastPage.opacity = 0;
        }

        if (!path) { return; }

        for (const key in this.innerMap) {
            this.innerMap[key].scaleX = 0;
            this.innerMap[key].scaleY = 0;
            this.innerMap[key].opacity = 0;
        }

        if (this.innerMap[this.typeList[index]]) {
            this.lastPage = this.innerMap[this.typeList[index]];
            this.innerMap[this.typeList[index]].parent = this.contentNode;
            this.innerMap[this.typeList[index]].scaleX = 1;
            this.innerMap[this.typeList[index]].scaleY = 1;
            this.innerMap[this.typeList[index]].opacity = 255;
            return
        }

        cc.Global.assertCenter.readLocalPrefab(path, function (err, prefab) {
            let node = cc.instantiate(prefab);
            node.parent = this.contentNode;
            this.lastPage = node;
            this.innerMap[this.typeList[index]] = node;
            this.innerMap[this.typeList[index]].scaleX = 1;
            this.innerMap[this.typeList[index]].scaleY = 1;
            this.innerMap[this.typeList[index]].opacity = 255;
        }.bind(this));
    }
});
