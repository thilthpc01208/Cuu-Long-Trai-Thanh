const articsConfig = require("../../../../../config/alone/ArticsConfig");

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
        this.buildName = "paddy";

        this.animals = this.animalsNode.getComponentsInChildren("sp.Skeleton");
        for (let index = 0, len = this.animals.length; index < len; index++) {
            this.animals[index] = this.animals[index].node;
        }
        this.fields = this.fieldsNode.children;
    },

    faciliteEnable() {
        this.currentCollect = false;
        this.tailIndex = -1;

        this.setTailValue();
        this.setFieldsTexture();
        this.initFieldsPlant();
        this.showTailFlag();
    },

    touchStart(event) {
        this.startPos = event.getLocation();
        this.canSelect = true;
        this.currentCollect = false;
    },

    touchMove(event) {
        let movePos = event.getLocation();
        if (this.moveAndDraw(movePos)) {
            this.currentCollect = true;
        }

        let dis = (movePos.subSelf(this.startPos)).mag()
        if (dis >= 10) { this.canSelect = false; }

        if (this.currentCollect) { event.stopPropagation(); }
    },

    touchEnd(event) {
        this.currentCollect = false;
        if (!this.canSelect) { return; }

        this.selectField(this.startPos);
        this.moveAndDraw(event.getLocation());
    },

    setTailValue() {
        let fieldsInfo = this.logic.paddy.getFieldsInfo();
        let len = this.fields.length;
        this.tailIndex = -1;
        for (let index = 0; index < len; index++) {
            let info = fieldsInfo[index];
            if (info.state >= 0) {
                this.tailIndex = index;
            }
        }

        if (this.tailIndex != -1) { this.tailIndex++; }
        else { this.tailIndex = 0; }
        if (this.tailIndex >= len) { this.tailIndex = -1; return; }
    },

    moveAndDraw(touchPos) {
        let len = this.fields.length;
        for (let index = 0; index < len; index++) {
            let field = this.fields[index];

            let box = cc.Global.axexUtil.nodeWorldBox(field);
            if (!box.contains(touchPos)) { continue; }
            if (field.active == false) { return false; }

            let info = this.logic.paddy.getFieldInfo(index);
            if (info.state != 2) { return false; }

            let startPos = cc.Global.axexUtil.convetOtherNodeSpace(field, this.gameSky);
            this.logic.paddy.collectPaddy({ index: index, startPos: startPos });
            return true;
        }
        return false;
    },

    selectField(touchPos) {
        let len = this.fields.length;
        for (let index = 0; index < len; index++) {
            let field = this.fields[index];

            let box = cc.Global.axexUtil.nodeWorldBox(field);
            if (!box.contains(touchPos)) { continue; }
            if (field.active == false) { return; }

            let info = this.logic.paddy.getFieldInfo(index);
            if (info.state < 0 && this.tailIndex != -1) {
                let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "paddy", index: this.tailIndex });
                cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
            }

            if (info.state == 0) {
                let pos = this.fieldsNode.convertToWorldSpaceAR(cc.v2(0, 0));
                let pageInfo = cc.Global.pageConfig.findPageInfo("seedPage");

                let data = {
                    areaHeight: this.node.height,
                    pageHeight: 479,
                    type: "paddy",
                    fields: this.fields,
                    pos: pos,
                };
                cc.Global.assertCenter.openPage(pageInfo, true, null, data);
                cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
            }

            if (info.state == 1) {
                this.createPlantTip(field, info);
            }

            return;
        }
    },

    createPlantTip(field, info) {
        let parent = this.node.parent;
        let child = parent.getChildByName("plantTip");
        if (child) { child.removeFromParent(); }

        let path = "items/PlantTip";
        cc.Global.assertCenter.readLocalPrefab(path, function (err, prefab) {
            let node = cc.instantiate(prefab);
            let plantTip = node.getComponent("GamePlantTip");

            let temp = { type: "paddy", seed: info.plant, index: info.index, endTime: info.endTime };
            plantTip.setPlantInfo(temp, this);

            let newPos = cc.Global.axexUtil.convetOtherNodeSpace(field, this.node.parent);
            node.x = newPos.x;
            node.y = newPos.y;

            node.parent = this.node.parent;
            node.zIndex = 100;
            this.plantTip = plantTip;
        }.bind(this));
    },

    /**
     * 设置纹理所需信息
     */
    setFieldsTexture() {
        for (let index = 0, len = this.fields.length; index < len; index++) {
            let fieldInfo = this.logic.paddy.getFieldInfo(index);
            this.setOneFieldTexture(fieldInfo);
        }
    },

    setOneFieldTexture(fieldInfo) {
        let field = this.fields[fieldInfo.index];
        let state = fieldInfo.state;
        if (state >= 0) { state = 0; }
        if (fieldInfo.index == this.tailIndex) { return; }

        if (state >= 0) {
            let path = "field/ui_Tian_ShuiTian";
            cc.Global.assertCenter.replaceSpriteFrame(field, path);
        }
    },

    initFieldsPlant() {
        let fieldsInfo = this.logic.paddy.getFieldsInfo();
        for (let index = 0, len = fieldsInfo.length; index < len; index++) {
            let fieldInfo = fieldsInfo[index];
            this.setPlantAnimation(fieldInfo);
        }
    },

    setPlantAnimation(fieldInfo) {
        let plant = this.animals[fieldInfo.index];
        if (fieldInfo.state === - 1 || fieldInfo.state === 0) {
            plant.active = false;
            return;
        }
        plant.active = true;

        let spin = plant.getComponent("sp.Skeleton");
        let index = Object.keys(articsConfig.paddy).indexOf(fieldInfo.plant);
        let state = fieldInfo.state - 1;
        let name = "st_" + (index + 1) + "_" + state;
        spin.setAnimation(0, name, true);
    },

    updatePaddyCallback(fieldInfo) {
        let index = fieldInfo.index;
        if (index > (this.fields.length - 1)) { return; }

        this.setTailValue();
        this.showTailFlag();

        this.setOneFieldTexture(fieldInfo);
    },

    loadPaddyCallback(fieldInfo) {
        let field = this.fields[fieldInfo.index];
        cc.Global.assertCenter.readLocalPrefab("items/SeedItem", function (err, prefab) {
            let seed = cc.instantiate(prefab);
            seed.x = 0;
            seed.y = 50;
            seed.parent = field;

            let scaleTo = cc.scaleTo(0.5, 0, 0);
            let moveTo = cc.moveTo(0.5, 0, 0);
            let spawn = cc.spawn(scaleTo, moveTo);
            let finished = cc.callFunc(function () {
                seed.removeFromParent();
                this.setPlantAnimation(fieldInfo);
            }.bind(this));

            let sequence = cc.sequence(spawn, finished);
            seed.stopAllActions();
            seed.runAction(sequence);
        }.bind(this));
    },

    updatePaddyCallBack(fieldInfo) {
        this.setPlantAnimation(fieldInfo);
        if (this.plantTip) {
            this.plantTip.plus(fieldInfo);
        }
    },

    collectPaddyCallBack(fieldInfo) {
        this.setPlantAnimation(fieldInfo);
    },

    showTailFlag() {
        if (this.tailIndex >= this.fields.length || this.tailIndex < 0) {
            return;
        }

        let field = this.fields[this.tailIndex];
        let path = "field/buy_ShuiTian";
        cc.Global.assertCenter.replaceSpriteFrame(field, path);
    },
});
