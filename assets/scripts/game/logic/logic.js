const articsConfig = require("../../config/alone/ArticsConfig");

const lord = require('./facilities/builds/LogicLord');
const store = require('./facilities/builds/LogicStore');
const hotel = require('./facilities/builds/LogicHotel');
const harbour = require('./facilities/builds/LogicHarbour');
const canteen = require('./facilities/builds/LogicCanteen');
const depot = require('./facilities/builds/LogicDepot');
const rental = require('./facilities/builds/LogicRental');
const stall = require('./facilities/builds/LogicStall');

const aquatic = require('./facilities/builds/LogicAquatic');
const land = require('./facilities/builds/LogicLands');
const orchard = require('./facilities/builds/LogicOrchard');
const paddy = require('./facilities/builds/LogicPaddy');
const livestock = require('./facilities/builds/LogicLivestock');
const outdoor = require('./facilities/builds/LogicOutdoor');

const noddle = require('./facilities/factorys/LogicNoddle');
const tofu = require('./facilities/factorys/LogicTofu');
const condiment = require('./facilities/factorys/LogicCondiment');
const tavern = require('./facilities/factorys/LogicTavern');
const candy = require('./facilities/factorys/LogicCandy');
const milk = require('./facilities/factorys/LogicMilk');
const stewedmeat = require('./facilities/factorys/LogicStewedmeat');
const tea = require('./facilities/factorys/LogicTea');
const cake = require('./facilities/factorys/LogicCake');
const candiedfruit = require('./facilities/factorys/LogicCandiedfruit');
const bushmeat = require('./facilities/factorys/LogicBushmeat');
const seafood = require('./facilities/factorys/LogicSeafood');

const arch = require("./facilities/auxiliary/LogicAchive");
const task = require("./facilities/auxiliary/LogicTask");
const sign = require("./facilities/auxiliary/LogicSign");

const userData = require('../logic/sustain/dataGroup/userData');
const httpUtil = require("../../util/HttpUtil");

class Logic {
    static instance = null;
    constructor() {
        //游戏状态
        this.startGame = false;

        this.userInfo = {};
        this.buildArr = [];

        //逻辑与显示部分的连接
        this.sceneRoot = null;

        //逻辑帧更新闭包
        this.updatePack = null;

        this.setSysTime();

        //获取数据成功
        this.logicSucess = false;
    }

    static getInstance() {
        if (Logic.instance == null) {
            Logic.instance = new Logic();
        }

        return Logic.instance;
    }

    onLoad() {
        let isNetGame = false;
        cc.Global.casualStory.setData("isNetGame", isNetGame);

        if (!isNetGame) {
            let account = cc.sys.localStorage.getItem("account");
            if (account == null || account == "") {
                account = cc.Global.mathUtil.getUserId();
            }
            this.getUserMsg(account);
        }
    }

    getUserMsg(account) {
        userData.getUserInfo(this, account, function (useInfo) {
            this.userInfo = useInfo;
            articsConfig.caculatePrice(this.userInfo);
            this.createFarm();
            this.logicSucess = true;
        }.bind(this));
    }

    setGameState(state) {
        this.startGame = state;
    }

    createFarm() {
        let buildArray = [];

        buildArray.push(new store(this.userInfo, this));
        buildArray.push(new lord(this.userInfo, this));
        buildArray.push(new hotel(this.userInfo, this));
        buildArray.push(new harbour(this.userInfo, this));
        buildArray.push(new canteen(this.userInfo, this));
        buildArray.push(new depot(this.userInfo, this));
        buildArray.push(new rental(this.userInfo, this));
        buildArray.push(new stall(this.userInfo, this));

        buildArray.push(new aquatic(this.userInfo, this));
        buildArray.push(new land(this.userInfo, this));
        buildArray.push(new orchard(this.userInfo, this));
        buildArray.push(new outdoor(this.userInfo, this));
        buildArray.push(new paddy(this.userInfo, this));
        buildArray.push(new livestock(this.userInfo, this));

        buildArray.push(new noddle(this.userInfo, this));
        buildArray.push(new tofu(this.userInfo, this));
        buildArray.push(new condiment(this.userInfo, this));
        buildArray.push(new tavern(this.userInfo, this));
        buildArray.push(new candy(this.userInfo, this));
        buildArray.push(new milk(this.userInfo, this));
        buildArray.push(new stewedmeat(this.userInfo, this));
        buildArray.push(new tea(this.userInfo, this));
        buildArray.push(new cake(this.userInfo, this));
        buildArray.push(new candiedfruit(this.userInfo, this));
        buildArray.push(new bushmeat(this.userInfo, this));
        buildArray.push(new seafood(this.userInfo, this));

        buildArray.push(new arch(this.userInfo, this));
        buildArray.push(new task(this.userInfo, this));
        buildArray.push(new sign(this.userInfo, this));

        let len = buildArray.length;
        for (let i = 0; i < len; i++) {
            let build = buildArray[i];
            this[build.name] = build;
        }

        for (let i = 0; i < len; i++) {
            let build = buildArray[i];
            if (build.load) { build.load(); }
        }

        this.buildArr = buildArray;
    }

    updateStep(dt = 0.5) {
        httpUtil.getInstance().onTimeCallBack();

        if (!this.startGame) { return; }
        if (!this.stepNum) { this.stepNum = 0; }
        this.stepNum++;

        if (this.stepNum % 2 == 0) {
            this.logicStepPack();
        }

        if (this.stepNum % 2 == 1) {
            userData.flush(this.userInfo);
        }

    }

    updateFrame() {
        this.logicFrameStep();
    }

    /**
     * 发送消息到场景
     * @param {*} target 
     * @param {*} data 
     * @returns 
     */
    sendMsgToScene(target, data) {
        if (!this.sceneRoot ||
            !this.sceneRoot[target]) {
            return;
        }
        this.sceneRoot[target][data.event](data.data);
    }

    /**
     * 发送提示信息到屏幕
     * @param {*} content 
     */
    castMsgToScreen(content) {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
            content: content,
            type: "fly"
        });
    }

    /**
     * 设置系统时间
     */
    setSysTime() {
        //设置获取服务器时间
        this.sysTime = (new Date()).getTime();
        cc.Global.sdk.getSysTime(function (time) {
            this.sysTime = time;
        }.bind(this));
    }

    /**
     * 增加系统时间
     * @param {*} dt 
     */
    addSysTime(dt) {
        this.sysTime += dt;
    }

    /**
     * 获取系统时间
     * @returns 
     */
    getSysTime() {
        return this.sysTime;
    }

    // 使用建筑更新闭包
    logicStepPack() {
        if (this.updatePack != null) { return; }
        let len = this.buildArr.length;
        let index = 0;
        this.updatePack = function () {
            let build = this.buildArr[index];
            let update = build.update;
            if (update) { update.call(build, 1); }

            index++;

            if (index >= len) { return false; }
            if (index < len) { return true; }
        };
    }

    //帧更新
    logicFrameStep() {
        if (!this.updatePack) { return; }
        if (this.updatePack()) { return; }
        this.updatePack = null;
    }
}

module.exports = Logic;