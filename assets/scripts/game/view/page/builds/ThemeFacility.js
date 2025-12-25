const buildConfig = require('../../../../config/alone/BuildsConfig');
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        firstToggle: {
            type: cc.Toggle,
            default: null
        },

        listNode: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.list = this.listNode.children;
        this.next = null;
        this.selectIndex = 0;

        this.themes = ["ground", "wall", "garden"];
    },

    pageEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.LordModify, this.lordModify.bind(this), this);

        this.firstToggle.isChecked = true;
        this.initPanel(0);
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.LordModify, this);
    },

    lordModify() {
        this.initPanel(this.selectIndex);
    },

    update() {
        if (!this.isAlive) { return; }
        if (!this.next) { return; }
        if (!this.next()) { this.next = null; }
    },

    typeToggleBtn(toggle, data) {
        this.initPanel(data);
        this.selectIndex = data;
    },

    buyItemBtn(event, data) {
        let target = event.target.parent;
        let result = false;

        switch (this.themes[this.selectIndex]) {
            case "ground":
                result = this.logic.lord.buyGround({ index: target.themeIndex })
                break;
            case "wall":
                result = this.logic.lord.buyWall({ index: target.themeIndex })
                break;
            case "garden":
                result = this.logic.lord.buyGarden({ index: target.themeIndex })
                break;    
            default:
                break;
        }

        if (result) {
            this.initPanel(target.themeType);
        }
    },

    useItemBtn(event, data) {
        let target = event.target.parent;
        let result = false;

        switch (this.themes[this.selectIndex]) {
            case "ground":
                result = this.logic.lord.useGround(target.themeIndex)
                break;
            case "wall":
                result = this.logic.lord.useWall(target.themeIndex)
                break;
            case "garden":
                result = this.logic.lord.useGarden(target.themeIndex)
                break;    
            default:
                break;
        }

        if (result) {
            this.initPanel(target.themeType);
        }
    },

    initPanel(type) {
        let config = buildConfig[this.themes[type]];
        let listLen = this.list.length;
        let configLen = config.length;

        for (let index = configLen - 1; index < listLen; index++) {
            this.list[index].active = false;
        }

        let index = 0;
        let next = function () {
            let info = config[index];
            let item = null;
            if (listLen <= index) {
                item = cc.instantiate(this.list[0]);
            }
            else {
                item = this.list[index];
            }
            item.active = true;
            item.parent = this.listNode;
            item.themeIndex = index;
            item.themeType = type;

            let state = -1;
            switch (this.themes[type]) {
                case "ground":
                    state = this.logic.lord.getGroundState(index);
                    break;
                case "wall":
                    state = this.logic.lord.getWallState(index);
                    break;
                case "garden":
                    state = this.logic.lord.getGardenState(index);
                    break;
                default:
                    break;
            }

            this.initItem(item, info, state);

            index++;

            return index < configLen;
        }.bind(this);

        this.next = next;
    },

    initItem(item, info, state) {
        item.getChildByName("des").getComponent(cc.Label).string = info.descript;
        item.getChildByName("name").getComponent(cc.Label).string = info.name;

        let buyBtn = item.getChildByName("buyBtn");
        let require = item.getChildByName("require");
        let useBtn = item.getChildByName("useBtn");
        let inUse = item.getChildByName("inUse");

        buyBtn.active = false;
        require.active = false;
        useBtn.active = false;
        inUse.active = false;

        if (state == -1) {
            let currLevel = this.logic.lord.getLevel();
            let needLevel = info.unlock;
            if (currLevel >= needLevel) {
                buyBtn.active = true;
                buyBtn.getChildByName("num").getComponent(cc.Label).string = info.price;

                let coin = buyBtn.getChildByName("coin");
                let gem = buyBtn.getChildByName("gem");
                /*
                if (info.price_type == 0) {
                    coin.active = true;
                    gem.active = false;
                }
                else {
                    coin.active = false;
                    gem.active = true;
                }
                */

                coin.active = true;
                gem.active = false;
            }
            else {
                require.active = true;
                let str = "需要主房@级";
                require.getChildByName("info").getComponent(cc.Label).string = str.replace("@", needLevel + 1);
            }
        }
        else if (state == 0) {
            useBtn.active = true;
        }
        else if (state == 1) {
            inUse.active = true;
        }

        let sprite = item.getChildByName("back").getChildByName("icon").
            getComponent(cc.Sprite);
        let path = "icon/" + this.themes[this.selectIndex] + "/" + item.themeIndex;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
    }
});
