const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
        fieldsNode: {
            type: cc.Node,
            default: null
        },
        animalsNode: {
            type: cc.Node,
            default: null
        }
    },

    faciliteLoad() {
        this.buildName = "aquatic";

        this.animals = this.animalsNode.children;
        this.fields = this.fieldsNode.children;
    },

    faciliteEnable() {
        this.setFieldsTexture();
        this.initAquatics();
    },

    touchStart(event) {
        this.startPos = event.getLocation();
        this.canSelect = true;
    },

    touchMove(event) {
        let movePos = event.getLocation();
        let dis = (movePos.subSelf(this.startPos)).mag()
        if (dis >= 10) {
            this.canSelect = false;
        }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; } let touchPos = event.getLocation();

        for (let index = 0, len = this.fields.length; index < len; index++) {
            let field = this.fields[index];
            let box = field.getBoundingBoxToWorld();
            if (!box.contains(touchPos)) { continue; }

            let fieldInfo = this.logic.aquatic.getFieldInfo(index);
            if (fieldInfo.state >= 0) {
                let pageInfo = cc.Global.pageConfig.findPageInfo("aquaticPage");
                let data = { index: index, fish: "aquatic-liyu" };
                cc.Global.assertCenter.openPage(pageInfo, true, null, data);
            }
            else {
                let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                let data = { type: "aquatic", index: index };
                cc.Global.assertCenter.openPage(pageInfo, true, null, data);
            }
            return false;
        }
    },

    /**
     * 设置纹理所需信息
     */
    setFieldsTexture() {
        for (let index = 0, len = this.fields.length; index < len; index++) {
            let fieldInfo = this.logic.aquatic.getFieldInfo(index);
            this.setOneFieldTexture(fieldInfo);
        }
    },

    setOneFieldTexture(fieldInfo) {
        let field = this.fields[fieldInfo.index];
        let state = fieldInfo.state;
        if (state !== -1) { state = fieldInfo.grid - 1; }

        let path = "builds/aquatic/ui_SC_" + fieldInfo.index + "_" + state;
        cc.Global.assertCenter.replaceSpriteFrame(field, path);
    },

    initAquatics() {
        let fieldsInfo = this.logic.aquatic.getFieldsInfo();
        let len = fieldsInfo.length;
        for (let index = 0; index < len; index++) {
            let fieldInfo = fieldsInfo[index];
            this.setAquaticAnimation(fieldInfo);
        }
    },

    updateAquaticCallback(fieldInfo) {
        let index = fieldInfo.index;
        if (index > (this.fields.length - 1)) {
            return;
        }

        this.setOneFieldTexture(fieldInfo);
    },

    setAquaticAnimation(fieldInfo) {
        let aquatic = this.animals[fieldInfo.index];
        if (fieldInfo.state === -1 && aquatic.active === true) {
            aquatic.active = false;
            return false;
        }

        if (fieldInfo.state === - 1) { return; }
        aquatic.active = true;

        let spin = aquatic.getComponent("sp.Skeleton");
        let name = this.getAnimationName(fieldInfo.aquatic, fieldInfo.state, fieldInfo.grid);
        if (spin.animation !== name) { spin.setAnimation(0, name, true); }
    },

    loadFishCallback(fieldInfo) {
        this.setAquaticAnimation(fieldInfo);
    },

    updateFishCallback(fieldInfo) {
        this.setAquaticAnimation(fieldInfo);
    },

    collectFishCallback(fieldInfo) {
        this.setAquaticAnimation(fieldInfo);
    },

    getAnimationName(animal, state, num) {    
        let mainName = { "aquatic-liyu": "LY", "aquatic-dazhaxie": "DZX", "aquatic-duixia": "DX", "aquatic-geli": "GL" };
        let trueName = ["wait", "grow", "done"];
        let name = "A_" + mainName[animal] + "_" + trueName[state] + "_" + num;
        return name;
    }
});
