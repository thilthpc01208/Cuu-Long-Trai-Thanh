const articsConfig = require('../../../config/alone/ArticsConfig');
const buildsConfig = require('../../../config/alone/BuildsConfig');
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        foodPanel: {
            type: cc.Node,
            default: null
        },

        benchPanel: {
            type: cc.Node,
            default: null
        },

        profitStr: {
            type: cc.Label,
            default: null
        },

        updateBtnNode: {
            type: cc.Node,
            default: null
        }
    },

    pageLoad() {
        this.foodList = this.foodPanel.getChildByName("foods").children;
        this.stoveList = this.benchPanel.children;

        this.benchNext = null;
        this.foodNext = null;
        this.selectFood = null;

        this.foodType = "main";
    },

    pageEnable() {
        this.schedule(this.updateTime, 1);
        cc.Global.listenCenter.register(cc.Global.eventConfig.CanteenChange, this.canteenChange.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.ChangeLanguage, this.initFoodPanel.bind(this), this);

        this.initPage();
    },

    pageDisable() {
        this.unschedule(this.updateTime);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.CanteenChange, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.ChangeLanguage, this);
    },

    openPage() {
        this.initFoodPanel();
    },

    initPage() {
        this.initFoodPanel();
        this.initBenchPanel();
        this.initBar();
        this.setUpdateBtnState();
    },

    update() {
        if (!this.isAlive) { return; }

        if (this.benchNext != null) {
            let result = this.benchNext();
            if (!result) {
                this.benchNext = null;
            }
        }

        if (this.foodNext != null) {
            let result = this.foodNext();
            if (!result) {
                this.foodNext = null;
            }
        }
    },

    selectFoodBtn(event, data) {
        let foodInfo = articsConfig.entityHash[event.target.food];
        if (!foodInfo) { return; }

        this.selectFood = foodInfo;
        this.initSelectFood(this.selectFood);
    },

    unLock(event, data) {
        this.logic.canteen.openCanteenGird({ index: event.target.stoveIndex });
        this.initBenchPanel();
    },

    cookFoodBtn(event, data) {
        let foodInfo = { food: event.target.food };
        if (!foodInfo.food) { return; }

        this.logic.canteen.cookieFood(foodInfo);
        this.initBenchPanel();
        this.initSelectFood(articsConfig.entityHash[event.target.food]);
    },

    quickGrowBtn(event, data) {
        let foodInfo = { index: event.target.stove };
        this.logic.canteen.quickCook(foodInfo);
        this.initBenchPanel();
    },

    normalProfit(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let info = {
            startPos: startPos,
            adv: false,
        };

        this.logic.canteen.drawProfit(info);
        this.initBar();
    },

    updateBtn(event, data) {
        let updateInfo = this.logic.canteen.getUpdateInfo();
        if (!updateInfo.levelSure) {
            let pageInfo = cc.Global.pageConfig.findPageInfo("alertPage");
            cc.Global.assertCenter.openPage(pageInfo, true, null, { type: "lord", level: updateInfo.levelLimit });
            return;
        }

        let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: "canteen",
            callback: this.setUpdateBtnState.bind(this)
        });
    },

    seleceTypeBtn(event, data) {
        this.foodType = this.logic.canteen.getCanteenType()[parseInt(data)];
        this.initFoodPanel();
    },

    advProfit(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let info = { startPos: startPos, adv: true, };

        let logic = this.logic;
        if (this.logic.canteen.getProfit() <= 0) { return; }

        cc.Global.sdk.postEvent2("ads_start_position", 23);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",23);
            logic.canteen.drawProfit(info);
            this.initBar();
        }.bind(this));
    },

    /**
     * 选择配料
    */
    recipeBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("searchPage");
        let info = {
            goodsId: event.target.recipeName,
            pos: cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky),
            closeHandle: this.close.bind(this),
            fromType: "",
        };
        cc.Global.assertCenter.openPage(pageInfo, true, null, info);
    },

    canteenChange(data) {
        if (data.holidayCharge) { this.selectFood = null; }
        if (data.benchCharge) { this.initBenchPanel(); }

        this.initFoodPanel();
        this.setUpdateBtnState();
    },

    benchCharge() {
        this.initBenchPanel();
    },

    initBenchPanel() {
        let fieldsInfo = this.logic.canteen.getBenchsInfo();
        if (!fieldsInfo) { return; }

        for (let index = 0, len = fieldsInfo.length; index < len; index++) {
            let info = fieldsInfo[index];
            this.initStove(this.stoveList[index], info, index);
        }
    },

    initStove(stove, info, index) {
        let currentTime = this.logic.getSysTime();

        let done = stove.getChildByName("done");
        let icon = stove.getChildByName("icon").getComponent(cc.Sprite);

        let lock = stove.getChildByName("lock");
        let buyCost = lock.getChildByName("cost").getComponent(cc.Label);

        let doing = stove.getChildByName("doing");
        let quick = doing.getChildByName("quick");
        let speedCost = doing.getChildByName("cost").getComponent(cc.Label);
        let makeTime = doing.getChildByName("time").getComponent(cc.Label);

        done.active = false;
        lock.active = false;

        quick.stove = index;
        doing.stove = index;
        done.stove = index;

        if (info.state === -1) {
            lock.active = true;
            buyCost.string = normalConfig.canteenSlotPrice[index];
            lock.stoveIndex = index;
            lock.getChildByName("unlockBtn").stoveIndex = index;
        }

        if (info.state === 0) {
            icon.spriteFrame = null;
            icon.node.getChildByName("info").active = true;
            doing.active = false;
        }
        else {
            icon.node.getChildByName("info").active = false;
        }

        if (info.state === 1) {
            let path = "artics/" + articsConfig.entityHash[info.id].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                icon.spriteFrame = spriteFrame;
            });

            let remain = Math.ceil((info.endTime - currentTime) / 1000);
            if (remain < 0) {
                remain = 0;
            }

            doing.active = true;
            makeTime.string = cc.Global.mathUtil.secondFormart(remain);
            speedCost.string = Math.ceil(remain / normalConfig.oneGemCutSecond);
        }

        if (info.state === 2) {
            done.active = true;
            let path = "artics/" + articsConfig.entityHash[info.id].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                icon.spriteFrame = spriteFrame;
            });
        }
    },

    initFoodPanel() {
        let foodsInfo = this.logic.canteen.getFoodsInfo({ type: this.foodType });
        if (!foodsInfo) { return; }

        let len = foodsInfo.length;
        for (let i = len; i < this.foodList.length; i++) {
            this.foodList[i].active = false;
        }

        let index = 0;
        let foodNext = function () {
            let food = foodsInfo[index];
            let item = this.foodList[index];
            item.food = food.id;
            item.active = true;

            let num = this.logic.canteen.getFoodNum(food.id);
            item.getChildByName("num").getComponent(cc.Label).string = "x" + num;

            let path = "artics/" + food.id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite)
                    .spriteFrame = spriteFrame;
            });

            index++;

            if (index < len) { return true; }
            else { return false; }
        }.bind(this);

        this.foodNext = foodNext;
        this.initSelectFood(foodsInfo[0]);
    },

    initSelectFood(foodInfo) {
        if (!foodInfo) { return; }
        this.selectFood = foodInfo;

        let selectPanel = this.foodPanel.getChildByName("select");
        selectPanel.getChildByName("cook").food = foodInfo.id;

        let icon = selectPanel.getChildByName("icon").getComponent(cc.Sprite);
        let name = selectPanel.getChildByName("name").getComponent(cc.Label);
        let recipe = selectPanel.getChildByName("recipe").children;

        name.string = foodInfo.name;
        let path = "artics/" + foodInfo.id;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            icon.spriteFrame = spriteFrame;
        });

        let recipeInfo = foodInfo.recipe;
        let index = 0;
        for (const key in recipeInfo) {
            let item = recipe[index];
            item.active = true;
            item.recipeName = key;

            let path = "artics/" + articsConfig.entityHash[key].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite)
                    .spriteFrame = spriteFrame;
            });

            let has = this.logic.store.getItemNum(key);
            let need = recipeInfo[key];

            if (has >= need) {
                has = need;
                item.getChildByName("num").color = new cc.Color().fromHEX("#4C1313");
            }
            else {
                item.getChildByName("num").color = new cc.Color().fromHEX("#E57C60");
            }

            item.getChildByName("num").getComponent(cc.Label).string = has + "/" + need;
            index++;
        }

        if (recipe.length <= index) { return; }

        for (let i = index; i < recipe.length; i++) {
            recipe[i].active = false;
        }
    },

    initBar() {
        this.profitStr.string = this.logic.canteen.getProfit();
        let collectNode = this.node.getChildByName("bar").getChildByName("collect");
        collectNode.getChildByName("adv").active = true;
    },

    updateTime() {
        this.updateBenchPanel();
        this.initBar();
    },

    updateBenchPanel() {
        let fieldsInfo = this.logic.canteen.getBenchsInfo();
        if (!fieldsInfo) { return; }

        let len = fieldsInfo.length;
        for (let index = 0; index < len; index++) {
            let info = fieldsInfo[index];
            if (info.state === -1 || info.state === 0) {
                continue;
            }
            this.initStove(this.stoveList[index], info, index);
        }
    },

    setUpdateBtnState() {
        let level = this.logic.canteen.getLevel() + 1;
        if (level >= buildsConfig.canteen.length) {
            this.updateBtnNode.active = false;
        }
        else {
            this.updateBtnNode.active = true;
        }
    }
});
