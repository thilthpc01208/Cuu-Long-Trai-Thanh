const buildConfig = require('../../../../config/alone/BuildsConfig');
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        listNode: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.list = this.listNode.children;
        this.next = null;
    },

    pageEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.LordModify, this.lordModify.bind(this), this);
        this.initPanel();
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.LordModify, this);
    },

    lordModify() {
        this.initPanel();
    },

    update() {
        if (!this.isAlive) { return; }
        if (!this.next) { return; }
        if (!this.next()) { this.next = null; }
    },

    buyItemBtn(event, data) {
        let target = event.target.parent;
        let result = false;

        if (buildConfig.factorys[target.facility]) {
            result = this.logic[target.facility].updateFactory();
        };

        if (target.facility === "floor") {
            result = this.logic.lord.updateFloor();
        }

        if (result) { this.initPanel(); }
    },

    initPanel() {
        let factorys = Object.keys(buildConfig.factorys)
        let factoryLen = factorys.length;
        let listLen = this.list.length - 1;
        let index = 0;
        let next = function () {
            let name = factorys[index];

            let item = null;
            if (listLen <= index) {
                item = cc.instantiate(this.list[1]);
            }
            else {
                item = this.list[index + 1];
            }
            item.active = true;
            item.parent = this.listNode;
            item.facility = name;

            let level = this.logic[name].getLevel();
            this.initItem(item, name, level + 1);
            index++;
            return index < factoryLen;
        }.bind(this);
        this.next = next;


        let nextFloor = this.logic.lord.getFloor() + 1;
        if (nextFloor >= buildConfig.floor.length) {
            this.list[0].active = false;
            return;
        }
        this.list[0].facility = "floor";

        let tittle = this.list[0].getChildByName("tittle").getComponent(cc.Label);
        tittle.string = "建造第@层".replace("@", nextFloor + 1);

        let needs = this.list[0].getChildByName("needs").getComponentsInChildren(cc.Label);
        let floorInfo = buildConfig.floor[nextFloor];
        needs[3].string = floorInfo.price;
        needs[0].string = floorInfo.material["mineral-mutou"];
        needs[1].string = floorInfo.material["mineral-niantu"];
        needs[2].string = floorInfo.material["mineral-shitou"];

        let currentLevel = this.logic.lord.getLevel();
        if (floorInfo.unlock > currentLevel) {
            this.list[0].getChildByName("require").active = true;
            this.list[0].getChildByName("buyBtn").active = false;

            let requireStr = this.list[0].getChildByName("require")
                .getChildByName("info").getComponent(cc.Label);
            requireStr.string = "需要主房@级".replace("@", floorInfo.unlock + 1);
        }
        else {
            this.list[0].getChildByName("require").active = false;
            this.list[0].getChildByName("buyBtn").active = true;
        }
    },

    initItem(item, name, level) {
        let currentLevel = this.logic.lord.getLevel();
        let infos = buildConfig[name];
        let info = infos.length > level ? infos[level] : infos[level - 1];

        let require = item.getChildByName("require");
        let buyBtn = item.getChildByName("buyBtn");
        let high = item.getChildByName("high");

        let targetLevel = level + 1;
        item.getChildByName("level").getComponent(cc.Label).string = targetLevel + "级";

        item.getChildByName("needs").active = !(info.unlock > currentLevel) && (infos.length > level);
        buyBtn.active = !(info.unlock > currentLevel) && (infos.length > level);

        require.active = (info.unlock > currentLevel);
        high.active = !(infos.length > level);

        if (infos.length > level && info.unlock > currentLevel) {
            let str = "需要主房@级".replace("@", info.unlock + 1);
            require.getChildByName("info").getComponent(cc.Label).string = str;
        }

        let descript = "·加工时间@秒\n·销售价格增加#%";
        descript = descript.replace("#", Math.floor(info.revenu_increase * 100));
        descript = descript.replace("@", info.make_time);

        item.getChildByName("nature").getComponent(cc.Label).string = descript;
        item.getChildByName("name").getComponent(cc.Label).string = info.name;

        let path = "icon/factory/" + Object.keys(buildConfig.factorys).indexOf(name);
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (error, spriteFrame) {
            item.getChildByName("back").getChildByName("icon").getComponent(cc.Sprite)
                .spriteFrame = spriteFrame;
        });

        let needs = item.getChildByName("needs").getComponentsInChildren(cc.Label);
        needs[3].string = info.price;
        needs[0].string = info.material["mineral-mutou"];
        needs[1].string = info.material["mineral-niantu"];
        needs[2].string = info.material["mineral-shitou"];

        console.log(targetLevel);

        if (targetLevel > 1) {
            item.getChildByName("buyBtn").getChildByName("buyInfo").getComponent(cc.Label).string = "升级";
        }
        else {
            item.getChildByName("buyBtn").getChildByName("buyInfo").getComponent(cc.Label).string = "建造";
        }
    }
});
