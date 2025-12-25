const FacilitieBase = require("../FacilitieBase");

cc.Class({
    extends: FacilitieBase,

    properties: {
    },

    faciliteLoad() {
        this.buildName = "livestock";

        this.animals = this.node.getChildByName("animals").children;
        this.fields = this.node.getChildByName("fields").children;
        this.shacks = this.node.getChildByName("shacks").children;
        this.fences = this.node.getChildByName("fences").children;
        this.blacks = this.node.getChildByName("blacks").children;
    },

    faciliteEnable() {
        this.setFieldsTexture();
        this.initLivestock();
    },

    touchStart(event) {
        this.startPos = event.getLocation();
        this.canSelect = true;
    },

    touchMove(event) {
        let movePos = event.getLocation();
        let dis = (movePos.subSelf(this.startPos)).mag()
        if (dis >= 10) { this.canSelect = false; }
    },

    touchEnd(event) {
        if (!this.canSelect) { return; } let touchPos = event.getLocation();

        for (let index = 0, len = this.fields.length; index < len; index++) {
            let field = this.fields[index];
            let box = field.getBoundingBoxToWorld();
            if (!box.contains(touchPos)) { continue; }


            let fieldInfo = this.logic.livestock.getFieldInfo(index);
            if (fieldInfo.state >= 0) {
                let pageInfo = cc.Global.pageConfig.findPageInfo("livestockPage");
                cc.Global.assertCenter.openPage(pageInfo, true, null, { index: index });
            }
            else {
                let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                cc.Global.assertCenter.openPage(pageInfo, true, null, {
                    type: "livestock", index: index
                });
            }

            return;
        }
    },

    /**
     * 设置纹理所需信息
    */
    setFieldsTexture() {
        for (let index = 0, len = this.fields.length; index < len; index++) {
            let fieldInfo = this.logic.livestock.getFieldInfo(index);
            this.setOneField(fieldInfo);
        }
    },

    initLivestock() {
        let fieldsInfo = this.logic.livestock.getFieldsInfo();
        let len = fieldsInfo.length;
        for (let index = 0; index < len; index++) {
            let fieldInfo = fieldsInfo[index];
            this.setBreedAnimation(fieldInfo);
        }
    },

    updateLivestockCallback(fieldInfo) {
        this.setOneField(fieldInfo);
    },

    setBreedAnimation(fieldInfo) {
        let animal = this.animals[fieldInfo.index];
        if (fieldInfo.state === -1 && animal.active === true) {
            animal.active = false;
            return false;
        }

        if (animal.active === false) {
            animal.active = true;
        }

        if (fieldInfo.state === -1) {
            return;
        }

        let spin = animal.getComponent("sp.Skeleton");
        let name = this.getAnimationName(fieldInfo.animal, fieldInfo.state, fieldInfo.grid);
        if (spin.animation !== name) {
            spin.setAnimation(0, name, true);
        }
        else {
            spin.setAnimation(0, name, true);
        }
    },

    loadFowlCallback(fieldInfo) {
        this.setBreedAnimation(fieldInfo);
    },

    updateFowlCallback(fieldInfo) {
        this.setBreedAnimation(fieldInfo);
        this.setFieldsTexture();
    },

    collectFowlCallback(fieldInfo) {
        this.setBreedAnimation(fieldInfo);
    },

    setOneField(fieldInfo) {
        let state = fieldInfo.state;
        let index = fieldInfo.index;
        let level = fieldInfo.grid - 2;

        if (state < 0) {
            this.shacks[index].opacity = 0;
            this.fences[index].opacity = 0;
            this.blacks[index].active = true;

            return;
        }

        this.shacks[index].opacity = 255;
        this.fences[index].opacity = 255;
        this.blacks[index].active = false;

        let fencePath = "builds/livestock/ui_JC_LiBa" + index + "_" + level;
        let shackPath = "builds/livestock/ui_JC_" + index + "_" + level;

        cc.Global.assertCenter.replaceSpriteFrame(this.shacks[index], shackPath);
        cc.Global.assertCenter.replaceSpriteFrame(this.fences[index], fencePath);
        this.setBreedAnimation(fieldInfo);
    },

    getAnimationName(animal, state, num) {
        let spinName = "";
        switch (animal) {
            case "livestock-zhu":
                spinName = "B_ZR_";
                break;
            case "livestock-nainiu":
                spinName = "B_NN_";
                break;
            case "livestock-yang":
                spinName = "B_SR_";
                break;
            case "livestock-muji":
                spinName = "B_JD_";
                break;
            case "livestock-rouniu":
                spinName = "B_NR_";
                break;
            case "livestock-gongji":
                spinName = "B_JR_";
                break;
            case "livestock-ya":
                spinName = "B_DR_";
                break;
            case "livestock-e":
                spinName = "B_ER_";
                break;
        }

        let stateStr = "";
        if (state == 0) { stateStr = "wait"; }
        if (state == 1) { stateStr = "grow"; }
        if (state == 2) { stateStr = "done"; }
        spinName += (stateStr + "_");
        if (num > 4) { num = 4; }
        spinName += num;

        return spinName;
    }
});
