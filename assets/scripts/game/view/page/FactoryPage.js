const articsConfig = require('../../../config/alone/ArticsConfig');
const buildConfig = require('../../../config/alone/BuildsConfig');
const normalConfig = require("../../../config/alone/NormConfig");

const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        benchPanel: {
            type: cc.Node,
            default: null
        },

        detailPanel: {
            type: cc.Node,
            default: null
        },

        foodContent: {
            type: cc.Node,
            default: null
        },

        generyPanel: {
            type: cc.Node,
            default: null
        },

        profitPanel: {
            type: cc.Node,
            default: null
        },
    },

    pageLoad() {
        this.stoveList = this.benchPanel.children;
        this.foodList = this.foodContent.children;

        this.benchNext = null;
        this.foodNext = null;
    },

    pageEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.SaleInFactory, this.saleInFactory.bind(this), this);
        this.schedule(this.updateTime, 1);

        if (!this.extraMsg) {this.extraMsg = { foodType: "noddle", foodIndex: 0 };}
        this.factoryLogic = this.logic[this.extraMsg.foodType];
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.SaleInFactory, this);
        this.unschedule(this.updateTime);
    },

    openPage() {
        if (!this.extraMsg) {this.extraMsg = { foodType: "noddle", foodIndex: 0 };}
        
        this.selectFood = null        
        this.factoryLogic = this.logic[this.extraMsg.foodType];

        
        this.initStovesPanel();
        this.initGeneryPanel();
        this.initFoodsContent();

        this.initLocalStorePanel();
        this.initOneClickPanel();
        this.initProfitPanel();

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    update() {
        if (!this.isAlive) { return; }

        if (this.benchNext != null) {
            let benchResult = this.benchNext();
            if (!benchResult) {
                this.benchNext = null;
            }
        }

        if (this.foodNext != null) {
            let foodResult = this.foodNext();
            if (!foodResult) {
                this.foodNext = null;
            }
        }
    },

    setSaveTypeBtn(toggle, data) {
        this.factoryLogic.setSaveType(data);
    },

    /**
     * 选择特定物品
     * @param {*} event 
     * @param {*} data 
     */
    selectArticBtn(event, data) {
        this.selectFood = articsConfig.entityHash[event.target.food];
        this.initDetailPanel(this.selectFood);
    },

    /**
     * 加工
     * @param {*} event 
     * @param {*} data 
     */
    cookFoodBtn(event, data) {
        let foodInfo = { food: event.target.food };
        this.factoryLogic.cookieFood(foodInfo);

        this.initStovesPanel();
        this.initDetailPanel(this.selectFood);
        this.initOneClickPanel();

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    },

    /**
     * 加速完成
     * @param {*} event 
     * @param {*} data 
     */
    quickGrowBtn(event, data) {
        let foodInfo = { index: event.target.stove };
        this.factoryLogic.quickCook(foodInfo);

        this.initStovesPanel();
    },

    /**
     * 转移到仓库
     * @param {*} event 
     * @param {*} data 
     */
    transLocalToRemoteBtn(event, data) {
        if (!this.selectFood) { return; }

        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        this.factoryLogic.transLocalToRemote({ food: this.selectFood.id, startPos: startPos });
        this.initLocalStorePanel();
        this.initFoodsContent();
    },

    /**
     * 增加本地仓容量
     * @param {*} event 
     * @param {*} data 
     */
    addCapacityNumBtn(event, data) {
        let logic = this.logic;

        cc.Global.sdk.postEvent2("ads_start_position",41);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",41);
            logic[this.extraMsg.foodType].addLocalCapacity(5);
            this.initLocalStorePanel();
        }.bind(this));
    },

    /**
     * 获取利润
     * @param {*} event 
     * @param {*} data 
     * @returns 
     */
    drawProfitBtn(event, data) {
        let profit = this.factoryLogic.getProfit();
        if (profit <= 0) { return; }

        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        if (data != "adv") {
            this.factoryLogic.drawProfit({ startPos: startPos });
            this.initProfitPanel();

            this.logic.task.plusBrunchTask({ code: "BT_FactoryGetProfitCount", num: 1, goods: null });
            this.logic.task.plusDayTask({ code: "DT_FactoryGetProfitCount", num: 1, goods: null });
            this.logic.achive.plusAchive({ code: "AT_FactoryGetProfitCount", num: 1 });
            return;
        }

        let logic = this.logic;
        cc.Global.sdk.postEvent2("ads_start_position",27);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",27);

            logic[this.extraMsg.foodType].drawProfit({ adv: true, startPos: startPos });
            this.initProfitPanel();

            this.logic.task.plusBrunchTask({ code: "BT_FactoryGetProfitCount", num: 1, goods: null });
            this.logic.task.plusDayTask({ code: "DT_FactoryGetProfitCount", num: 1, goods: null });
            this.logic.achive.plusAchive({ code: "AT_FactoryGetProfitCount", num: 1 });
        }.bind(this));
    },

    /**
     * 获取
     * @param {*} event 
     * @param {*} data 
     */
    collectFoodBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = { index: event.target.stove, startPos: startPos };
        this.factoryLogic.collectFood(temp);

        this.initStovesPanel();
        this.initDetailPanel(this.selectFood);
        this.initOneClickPanel();
        this.initLocalStorePanel();
        this.initFoodsContent();

        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
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
            fromType: "food",
        };
        cc.Global.assertCenter.openPage(pageInfo, true, null, info);
    },

    /**
     * 解锁新位置
     * @param {*} event 
     * @param {*} data 
     */
    unlockBtn(event, data) {
        this.factoryLogic.openFactoryGrid();
        this.initStovesPanel();
    },

    /**
     * 一键获取
     * @param {*} event 
     * @param {*} data 
     * @returns 
     */
    oneClickDrawFoodBtn(event, data) {
        let startPos = cc.Global.axexUtil.convetOtherNodeSpace(event.target, this.gameSky);
        let temp = { adv: false, startPos: startPos };

        if (data !== "adv") {
            this.factoryLogic.collectAllFood(temp);
            this.initStovesPanel();
            this.initDetailPanel(this.selectFood);
            this.initOneClickPanel();
            this.initLocalStorePanel();
            this.initFoodsContent();
            return;
        }

        let logic = this.logic;
        temp.adv = true;
        let result = logic[this.extraMsg.foodType].isCanCollect(temp);
        if (!result) { return; }

        cc.Global.sdk.postEvent2("ads_start_position",18);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",18);

            logic[this.extraMsg.foodType].collectAllFood(temp);
            this.initStovesPanel();
            this.initDetailPanel(this.selectFood);
            this.initOneClickPanel();
            this.initLocalStorePanel();
            this.initFoodsContent();
        }.bind(this));
    },

    /**
     * 升级单个作坊
     */
    updateFactoryBtn(event, data) {
        let pageInfo = cc.Global.pageConfig.findPageInfo("upNoNaturePage");
        cc.Global.assertCenter.openPage(pageInfo, true, null, {
            type: this.extraMsg.foodType,
            callback: this.updateFactoryCallback.bind(this)
        });
    },

    updateFactoryCallback() {
        this.initDetailPanel(this.selectFood);
        this.initGeneryPanel();
        this.initFoodsContent();
        this.initProfitPanel();
    },

    /**
     * 设置利润界面
     */
    initProfitPanel() {
        if (!this.profitStr) {
            this.profitStr = this.profitPanel.getChildByName("profit").getComponent(cc.Label);
        }

        let profit = this.factoryLogic.getProfit();
        this.profitStr.string = profit;
    },

    /**
     * 设置加工界面
     */
    initStovesPanel() {
        let benchInfo = this.factoryLogic.getBenchInfo();
        let stovesInfo = benchInfo.stove;
        for (let index = 0, len = stovesInfo.length; index < len; index++) {
            let info = stovesInfo[index];
            this.initStove(this.stoveList[index], info, index);
        }
    },

    /**
    * 更新加工界面
    */
    updateStovesPanel(index = 0) {
        let benchInfo = this.factoryLogic.getBenchInfo();
        let stovesInfo = benchInfo.stove;

        for (let index = 0, len = stovesInfo.length; index < len; index++) {
            let info = stovesInfo[index];
            if (info.state == -1 || info.state == 0) { continue; }
            if (info.state == 1 && info.run === false) { continue; }

            this.initStove(this.stoveList[index], info, index);
        }
    },

    saleInFactory() {
        if (!this.isAlive) { return; }

        this.initFoodsContent();
        this.initLocalStorePanel();
        this.initProfitPanel();
    },

    /**
     * 设置加工槽位
     * @param {*} stove 
     * @param {*} info 
     * @param {*} index 
     */
    initStove(stove, info, index) {
        let currentTime = this.logic.getSysTime();

        let done = stove.getChildByName("done");
        let icon = stove.getChildByName("icon").getComponent(cc.Sprite);
        let black = stove.getChildByName("info");

        let lock = stove.getChildByName("lock");
        let buyCost = lock.getChildByName("cost").getComponent(cc.Label);

        let doing = stove.getChildByName("doing");
        let quick = doing.getChildByName("quick");
        let speedCost = doing.getChildByName("cost").getComponent(cc.Label);
        let makeTime = doing.getChildByName("time").getComponent(cc.Label);

        done.active = false;
        lock.active = false;

        doing.stove = index;
        quick.stove = index;
        done.stove = index;

        if (info.state === -1) {
            buyCost.string = normalConfig.factorySlotPrice[index];
            lock.active = true;
        }

        if (info.state === 0) {
            icon.spriteFrame = null;
            icon.node.active = false;

            black.active = true;
            doing.active = false;
        }
        else {
            icon.node.active = true;
            black.active = false;
        }

        if (info.state === 1) {
            let path = "artics/" + articsConfig.entityHash[info.id].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                icon.spriteFrame = spriteFrame;
            });

            if (info.run) {
                let remain = Math.ceil((info.endTime - currentTime) / 1000);
                if (remain < 0) { remain = 0; }
                makeTime.string = cc.Global.mathUtil.secondFormart(remain);
                speedCost.string = Math.ceil(remain / normalConfig.oneGemCutSecond);
            }
            else {
                let remain = Math.ceil(info.life / 1000);
                makeTime.string = cc.Global.mathUtil.secondFormart(remain);
                speedCost.string = Math.ceil(remain / normalConfig.oneGemCutSecond);
            }

            doing.active = true;
        }

        if (info.state === 2) {
            done.active = true;
            let path = "artics/" + articsConfig.entityHash[info.id].id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                icon.spriteFrame = spriteFrame;
            });
        }
    },

    /**
     * 初始化可加工列表
     */
    initFoodsContent() {
        this.foodNext = null;

        let foodsInfo = this.factoryLogic.getFoodList();
        let factoryLevel = this.factoryLogic.getLevel();
        let foodsLen = foodsInfo.length;

        let foodIndex = 0 | this.extraMsg.foodIndex;
        delete this.extraMsg["foodIndex"];

        this.selectFood = foodsInfo[foodIndex];
        this.initDetailPanel(this.selectFood);

        let itemsLen = this.foodList.length;
        for (let index = foodsLen; index < itemsLen; index++) {
            this.foodList[index].active = false;
        }

        let index = 0;
        let foodNext = function () {
            let foodInfo = foodsInfo[index];

            let item = null;
            if (itemsLen > index) {
                item = this.foodList[index];
            }
            else {
                item = cc.instantiate(this.foodList[0]);
            }
            item.active = true;
            item.parent = this.foodContent;
            item.food = foodInfo.id;
            index++;

            let num = this.factoryLogic.getLocalItemNum(foodInfo.id);
            let path = "artics/" + foodInfo.id;
            cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                item.getChildByName("num").getComponent(cc.Label).string = num;
            });

            if (foodInfo.unlock > factoryLevel) {
                item.getChildByName("suo").active = true;
                item.getChildByName("num").active = false;
                item.getChildByName("icon").active = false;
            }
            else {
                item.getChildByName("suo").active = false;
                item.getChildByName("num").active = true;
                item.getChildByName("icon").active = true;
            }

            return index < foodsLen
        }.bind(this);

        this.foodNext = foodNext;

        for (let index = foodsLen; index < itemsLen; index++) {
            this.foodList[index].active = false;
        }
    },

    /**
     * 初始化设施信息界面
     */
    initGeneryPanel() {
        let benchInfo = this.factoryLogic.getBenchInfo();

        let icon = this.generyPanel.getChildByName("back").getChildByName("icon")
            .getComponent(cc.Sprite);
        let descript = this.generyPanel.getChildByName("descript").getComponent(cc.Label);
        let nextStr = this.generyPanel.getChildByName("nextLevel");

        let name = this.generyPanel.getChildByName("name").getComponent(cc.Label);
        let time = this.generyPanel.getChildByName("time").getComponent(cc.Label);
        let profit = this.generyPanel.getChildByName("profit").getComponent(cc.Label);

        let index = Object.keys(buildConfig.factorys).indexOf(this.extraMsg.foodType);
        name.string = buildConfig.factorys[this.extraMsg.foodType];
        descript.string = cc.Global.wordsConfig.extra["categoryIntroduction"];

        let path = "icon/factoryType/" + index;
        cc.Global.assertCenter.readLocalSpriteFrame(path, function (err, spriteFrame) {
            icon.spriteFrame = spriteFrame;
        });

        let updateBtn = this.generyPanel.getChildByName("updateBtn");
        if (benchInfo.level >= (buildConfig[this.extraMsg.foodType].length - 1)) {
            let level = buildConfig[this.extraMsg.foodType].length - 1;
            profit.string = "+%" + Math.floor(buildConfig[this.extraMsg.foodType][level].revenu_increase * 100);
            time.string = buildConfig[this.extraMsg.foodType][level].make_time;

            updateBtn.active = false;
            nextStr.active = false;
        }
        else {
            let level = benchInfo.level + 1;
            profit.string = "+%" + Math.floor(buildConfig[this.extraMsg.foodType][level].revenu_increase * 100);
            time.string = buildConfig[this.extraMsg.foodType][level].make_time;
            updateBtn.active = true;
            updateBtn.process = index;
            nextStr.active = true;
        }
    },

    /**
     * 初始化食物详细信息界面
     * @param {*} foodInfo 
     */
    initDetailPanel(foodInfo) {
        let icon = this.detailPanel.getChildByName("back").getChildByName("icon")
            .getComponent(cc.Sprite);

        let stock = this.detailPanel.getChildByName("stock").getComponent(cc.Label);
        let need = this.detailPanel.getChildByName("need").getComponent(cc.Label);

        let outNum = this.detailPanel.getChildByName("outNum").getComponent(cc.Label);
        let name = this.detailPanel.getChildByName("name").getComponent(cc.Label);
        let time = this.detailPanel.getChildByName("time").getComponent(cc.Label);
        let info = this.detailPanel.getChildByName("info").getComponent(cc.Label);

        let outPut = 1;
        if (articsConfig.entityHash[foodInfo.id].flag === "forage") { outPut *= 3; }

        let stockNumber = this.logic.store.getItemNum(foodInfo.id);
        let needNumber = this.factoryLogic.getOneGoodsNeed(foodInfo.id);
        let remainNumber = needNumber - stockNumber;
        if (remainNumber < 0) { remainNumber = 0; }

        stock.string = cc.Global.wordsConfig.extra["stock"] + stockNumber;
        need.string = cc.Global.wordsConfig.extra["need"] + remainNumber;

        outNum.string = cc.Global.wordsConfig.extra["outPut"] + outPut;
        name.string = articsConfig.entityHash[foodInfo.id].name;

        let cookTime = this.factoryLogic.getFoodCookTime({ food: foodInfo.id });
        time.string = cc.Global.mathUtil.secondFormart(cookTime);

        info.string = articsConfig.entityHash[foodInfo.id].descript;
        let iconPath = "artics/" + foodInfo.id;
        cc.Global.assertCenter.readLocalSpriteFrame(iconPath, function (err, spriteFrame) {
            icon.spriteFrame = spriteFrame;
        });

        let recipe = Object.keys(foodInfo.recipe);
        let items = this.detailPanel.getChildByName("recipe").children;
        for (let index = 0, len = items.length; index < len; index++) {
            let item = items[index];

            if (index >= recipe.length) {
                item.active = false;
                continue;
            }
            item.active = true;

            let name = recipe[index];
            let has = this.logic.store.getItemNum(name);
            let need = foodInfo.recipe[name];
            item.recipeName = name;

            let recipePath = "artics/" + articsConfig.entityHash[name].id;
            cc.Global.assertCenter.readLocalSpriteFrame(recipePath, function (err, spriteFrame) {
                item.getChildByName("icon").getComponent(cc.Sprite)
                    .spriteFrame = spriteFrame;
            });

            if (has >= need) {
                item.getChildByName("info").color = new cc.Color().fromHEX("#361A09");
                has = need;
            }
            else {
                item.getChildByName("info").color = new cc.Color().fromHEX("#E57C60");
            }

            let info = has + "/" + need;
            item.getChildByName("info").getComponent(cc.Label).string = info;
        }

        this.detailPanel.getChildByName("cookBtn").food = foodInfo.id;
    },

    /**
    * 初始化一键领取界面
    */
    initOneClickPanel() {
        let useTool = this.factoryLogic.isUseTool({});

        let toggles = this.node.getChildByName("drawPanel").getChildByName("toggles").children;
        let saveType = this.factoryLogic.getSaveType();
        if (saveType === "local") {
            toggles[0].getComponent(cc.Toggle).isChecked = true;
        }

        if (saveType === "remote") {
            toggles[1].getComponent(cc.Toggle).isChecked = true;
        }

        if (this.oneClickAdvBtn) {
            this.oneClickAdvBtn.active = !useTool;
            return;
        }

        this.oneClickAdvBtn = this.node.getChildByName("drawPanel")
            .getChildByName("oneClickAdv");
        this.oneClickAdvBtn.active = !useTool;
    },

    /**
    * 初始化本地仓库界面
    */
    initLocalStorePanel() {
        let localInfo = this.factoryLogic.getLocalCapacity();

        if (this.localInfoStr) {
            this.localInfoStr.string = "货架容量:" + localInfo.use + "/" + localInfo.max;
            return;
        }

        this.localInfoStr = this.node.getChildByName("storePanel").
            getChildByName("capacity").getComponent(cc.Label);
        this.localInfoStr.string = "货架容量:" + localInfo.use + "/" + localInfo.max;
    },
    
    updateTime() {
        if (!this.isAlive) { return; }

        this.updateStovesPanel();
        this.initDetailPanel(this.selectFood);
    },

    closeBtn(event, data) {
        this.close();
        cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
    }
});
