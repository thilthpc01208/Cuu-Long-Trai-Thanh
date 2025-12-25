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
        this.buildName = "orchard";

        this.animals = this.animalsNode.children;
        this.fields = this.fieldsNode.children;
    },

    faciliteEnable() {
        this.tailIndex = -1;
        this.currentCollect = false;

        this.setTailValue();
        this.setFieldsTexture();
        this.initOrchards();
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

        if (this.currentCollect) {
            event.stopPropagation();
        }
    },

    touchEnd(event) {
        this.currentCollect = false;
        if (!this.canSelect) {return;}

        this.selectField(this.startPos);
        this.moveAndDraw(event.getLocation());
    },

    setTailValue() {
        let fieldsInfo = this.logic.orchard.getFieldsInfo();

        let len = this.fields.length;
        this.tailIndex = -1;
        for (let index = 0; index < len; index++) {
            let info = fieldsInfo[index];
            if (info.state >= 0) { this.tailIndex = index; }
        }

        if (this.tailIndex != -1) { this.tailIndex++; }
        else { this.tailIndex = 0; }
        if (this.tailIndex >= len) { this.tailIndex = -1; }
    },

    selectField(touchPos) {
        for (let index = 0, len = this.fields.length; index < len; index++) {
            let field = this.fields[index];

            let box = cc.Global.axexUtil.nodeWorldBox(field);
            if (!box.contains(touchPos)) { continue; }
            if (field.active == false) { return; }

            let info = this.logic.orchard.getFieldInfo(index);
            if (info.state < 0 && this.tailIndex != -1) {
                let pageInfo = cc.Global.pageConfig.findPageInfo("createFieldPage");
                cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "orchard", index: this.tailIndex });
            }
            else if (info.state == 0) {
                let pos = this.fieldsNode.convertToWorldSpaceAR(cc.v2(0, 0));
                let pageInfo = cc.Global.pageConfig.findPageInfo("seedPage");

                let data = {
                    areaHeight: this.node.height,
                    pageHeight: 708,
                    type: "orchard",
                    fields: this.fields,
                    pos: pos,
                };
                cc.Global.assertCenter.openPage(pageInfo, true, null, data);
            }
            else if (info.state == 1) {
                this.createPlantTip(field, info);
            }
            return;
        }
    },

    /**
     * 设置纹理所需信息
     */
    setFieldsTexture() {
        for (let index = 0, len = this.fields.length; index < len; index++) {
            let fieldInfo = this.logic.orchard.getFieldInfo(index);
            this.setOneFieldTexture(fieldInfo);
        }
    },

    setOneFieldTexture(fieldInfo) {
        let field = this.fields[fieldInfo.index];
        let state = fieldInfo.state;
        if (state >= 0) { state = 0; }
        if (fieldInfo.index == this.tailIndex) { return; }

        if (state >= 0) {
            let path = "field/ui_Tian_GuoYuan"
            cc.Global.assertCenter.replaceSpriteFrame(field, path);
        }
    },

    moveAndDraw(touchPos) {
        for (let index = 0, len = this.fields.length; index < len; index++) {
            let field = this.fields[index];

            let box = cc.Global.axexUtil.nodeWorldBox(field);
            if (!box.contains(touchPos)) { continue; }
            if (field.active == false) { return false; }

            let info = this.logic.orchard.getFieldInfo(index);
            if (info.state != 2) { return false; }

            let startPos = cc.Global.axexUtil.convetOtherNodeSpace(field, this.gameSky);
            this.logic.orchard.collectFruiter({ index: index, startPos: startPos });
            return true;
        }

        return false;
    },

    initOrchards() {
        let fieldsInfo = this.logic.orchard.getFieldsInfo();
        let len = fieldsInfo.length;
        for (let index = 0; index < len; index++) {
            let fieldInfo = fieldsInfo[index];
            this.setFruitAnimation(fieldInfo);
        }
    },

    setFruitAnimation(fieldInfo) {
        let plant = this.animals[fieldInfo.index];
        if (fieldInfo.state == -1 || fieldInfo.state == 0) {
            plant.active = false;
            return;
        }
        plant.active = true;

        let names = ["ani_O_PG_", "ani_O_X_", "ani_O_ShanZ_", "ani_O_L_", "ani_O_SL_",
            "ani_O_T_", "ani_O_YT_", "ani_O_LZ_", "ani_O_HT_", "ani_O_JZ_",
            "ani_O_Z_", "ani_O_SZ_", "ani_O_BL_", "ani_O_PT_"
        ];

        let spin = plant.getComponent("sp.Skeleton");
        let index = Object.keys(articsConfig.orchard).indexOf(fieldInfo.plant);
        let state = fieldInfo.state - 1;
        let name = names[index] + state;
        spin.setAnimation(0, name, true);
    },

    updateOrchardCallback(fieldInfo) {
        let index = fieldInfo.index;
        this.fields[index].active = true;

        if (index > (this.fields.length - 1)) {
            return;
        }

        this.setTailValue();
        this.showTailFlag();

        this.setOneFieldTexture(fieldInfo);
    },

    loadFruitCallback(field) {
        let fieldNode = this.fields[field.index];
        cc.Global.assertCenter.readLocalPrefab("items/SeedItem", function (err, prefab) {
            let seed = cc.instantiate(prefab);
            seed.x = 0;
            seed.y = 50;
            seed.parent = fieldNode;

            let scaleTo = cc.scaleTo(0.5, 0, 0);
            let moveTo = cc.moveTo(0.5, 0, 0);
            let spawn = cc.spawn(scaleTo, moveTo);
            let finished = cc.callFunc(function () {
                seed.removeFromParent();
                this.setFruitAnimation(field);
            }.bind(this));

            let sequence = cc.sequence(spawn, finished);
            seed.stopAllActions();
            seed.runAction(sequence);
        }.bind(this));
    },

    updateFruitCallBack(field) {
        this.setFruitAnimation(field);
        if (this.plantTip) {
            this.plantTip.plus(field);
        }
    },

    collectFruitCallback(field) {
        this.setFruitAnimation(field);
    },

    createPlantTip(field, info) {
        let parent = this.node.parent;
        let child = parent.getChildByName("plantTip");
        if (child) {
            child.removeFromParent();
        }

        let path = "items/PlantTip";
        cc.Global.assertCenter.readLocalPrefab(path, function (err, prefab) {
            let node = cc.instantiate(prefab);
            let plantTip = node.getComponent("GamePlantTip");

            let temp = { type: "orchard", seed: info.plant, index: info.index, endTime: info.endTime };
            plantTip.setPlantInfo(temp, this);

            let newPos = cc.Global.axexUtil.convetOtherNodeSpace(field, this.node.parent);
            node.x = newPos.x;
            node.y = newPos.y;
            node.zIndex = 100;

            node.parent = this.node.parent;
            this.plantTip = plantTip;
        }.bind(this));
    },

    showTailFlag() {
        if (this.tailIndex >= this.fields.length ||
            this.tailIndex < 0) { return; }

        let field = this.fields[this.tailIndex];
        let path = "field/buy_GuoYuan";
        cc.Global.assertCenter.replaceSpriteFrame(field, path);
    }
});
