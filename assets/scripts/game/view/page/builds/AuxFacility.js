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

        this.auxs = ["catch", "desk"];
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

        switch (this.auxs[this.selectIndex]) {
            case "catch":
                result = this.logic.outdoor.buyCatch({ index: target.themeIndex })
                break;
            case "desk":
                result = this.logic.canteen.buyDesk({ index: target.themeIndex })
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

        switch (this.auxs[this.selectIndex]) {
            case "catch":
                result = this.logic.outdoor.useCatch(target.themeIndex)
                break;
            case "desk":
                result = this.logic.canteen.useDesk(target.themeIndex)
                break;
            default:
                break;
        }

        if (result) {
            this.initPanel(target.themeType);
        }
    },

    initPanel(type) {
        let config = buildConfig[this.auxs[type]];
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
            switch (this.auxs[type]) {
                case "catch":
                    state = this.logic.outdoor.getCatchState(index);
                    break;
                case "desk":
                    state = this.logic.canteen.getDeskState(index);
                    break;
                default:
                    break;
            }

            this.initItem(item, info, state,this.auxs[type]);

            index++;

            return index < configLen;
        }.bind(this);

        this.next = next;
    },

    initItem(item, info, state,type) {
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

        if (state == 0) { useBtn.active = true; }
        if (state == 1) { inUse.active = true; }

        let labels = item.getChildByName("infos").getComponentsInChildren(cc.Label);
        switch (type) {
            case "catch":
                labels[3].string = "·渔船容量:@".replace("@", info.capacity);
                labels[2].string = "·捕鱼时间:@秒".replace("@", info.transport_time);
                labels[1].string = "";
                labels[0].string = "";
                break;
            case "desk":
                labels[0].string = "·客人点餐数量:@".replace("@", info.dishes_num);
                labels[1].string = "·客人等待时间:@秒".replace("@", info.wait_time);
                labels[2].string = "·客人吃饭时间:@秒".replace("@", info.eat_time);
                labels[3].string = "·收入加成:@%".replace("@", Math.floor(info.revenu_increase * 100));
                break;
            default:
                break;
        }

        let sprite = item.getChildByName("back").getChildByName("icon").
            getComponent(cc.Sprite);
        let path = "icon/" + this.auxs[this.selectIndex] + "/" + item.themeIndex;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
    }
});
