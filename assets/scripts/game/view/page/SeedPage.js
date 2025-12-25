const articsConfig = require('../../../config/alone/ArticsConfig');
const PageBase = require("PageBase");

cc.Class({
    extends: PageBase,

    properties: {
        board: {
            type: cc.Node,
            default: null
        },

        back: {
            type: cc.Node,
            default: null
        },

        content: {
            type: cc.Node,
            default: null
        },

        seed: {
            type: cc.Node,
            default: null
        },

        remainTime:{
            type: cc.Label,
            default: null
        }
    },

    pageLoad() {
        this.seeds = this.content.children;
        this.boards = this.board.children;

        this.screenHeight = 2340;
        this.pageHeight = 860;
        this.areaHeight = 500;

        this.lastPageName = "";
    },

    start() {
        this.content.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.content.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.content.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    },

    pageEnable() {
        this.openPage();

        cc.Global.listenCenter.register(cc.Global.eventConfig.StoreModify, this.updatePanelNumInfo.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.LordModify, this.updateLordLevel.bind(this), this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.ChangeLanguage, this.initSeedPane.bind(this), this);

        this.schedule(this.updateRemainTime.bind(this),1);
    },

    pageDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.StoreModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.LordModify, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.ChangeLanguage, this);

        this.unschedule(this.updateRemainTime.bind(this),1);
    },

    update() {
        if (!this.next) { return; }
        let result = this.next();
        if (!result) {
            this.next = null;
        }
    },

    updatePanelNumInfo(types) {
        let seedsInfo = [];
        if (types.indexOf('land') != -1 && this.lastPageName === "land") {
            seedsInfo = Object.keys(articsConfig.land);
        }

        if (types.indexOf('orchard') != -1 && this.lastPageName === "orchard") {
            seedsInfo = Object.keys(articsConfig.orchard);
        }

        if (types.indexOf('paddy') != -1 && this.lastPageName === "paddy") {
            seedsInfo = Object.keys(articsConfig.paddy);
        }

        if (seedsInfo.length <= 0) {
            return;
        }

        let len = this.seeds.length;
        this.next = null;
        let index = 0;
        let next = function () {
            let seed = this.seeds[index];
            if (index < seedsInfo.length) {
                let info = articsConfig.entityHash[seedsInfo[index]];
                seed.artic = info.id;
                this.setItemInfo(seed, info);
            }

            index++;
            if (index < len) { return true; }
            else { return false; }
        }.bind(this);
        this.next = next;
    },

    updateLordLevel() {
        let seedsInfo = [];
        if (this.extraMsg.type === "land") { seedsInfo = Object.keys(articsConfig.land); }
        else if (this.extraMsg.type === "orchard") { seedsInfo = Object.keys(articsConfig.orchard); }
        else if (this.extraMsg.type === "paddy") { seedsInfo = Object.keys(articsConfig.paddy); }

        let len = this.seeds.length;
        this.next = null;
        let index = 0;
        let next = function () {
            let seed = this.seeds[index];
            if (index < seedsInfo.length) {
                let info = articsConfig.entityHash[seedsInfo[index]];
                seed.artic = info.id;
                this.setItemInfo(seed, info);
            }

            index++;
            if (index < len) { return true; }
            else { return false; }
        }.bind(this);
        this.next = next;
    },

    touchStart(event) {
        let startPos = event.getLocation();
        let len = this.seeds.length;
        for (let index = 0; index < len; index++) {
            let seed = this.seeds[index];
            let box = seed.getBoundingBoxToWorld();

            if (seed.active === false) {continue;}
            if (!box.contains(startPos)) {continue;}
            this.selectSeed = seed.artic;

            this.seed.active = true;
            this.seed.x = startPos.x - this.node.width / 2;
            this.seed.y = startPos.y - this.node.height / 2;

            return false;
        }

        this.loadGoodsDone = false;
    },

    touchMove(event) {
        if (!this.selectSeed) {return false;}

        let movePos = event.getLocation();
        this.seed.x = movePos.x - this.node.width / 2;
        this.seed.y = movePos.y - this.node.height / 2;

        if (!this.fields) { return false; }

        let len = this.fields.length;
        for (let index = 0; index < len; index++) {
            let field = this.fields[index];
            if (field.active === false) { continue; }

            let info = this.logic[this.extraMsg.type].getFieldInfo(index);
            if (info.state != 0) { continue; }

            let box = field.getBoundingBoxToWorld();
            if (!box.contains(movePos)) { continue; }

            let data = { index: index, seed: this.selectSeed };
            if (this.extraMsg.type === "land") {
                this.logic.land.loadPlant(data);
                this.loadGoodsDone = true;
            }
            else if (this.extraMsg.type === "orchard") {
                this.logic.orchard.loadFruiter(data);
            }
            else if (this.extraMsg.type === "paddy") {
                this.logic.paddy.loadPaddy(data);
            }

            return false;
        }
    },

    touchEnd(event) {
        this.seed.active = false;
        this.selectSeed = null;

        if (this.loadGoodsDone && cc.Global.casualStory.getData("GameGuideState")) {
            cc.Global.listenCenter.fire(cc.Global.eventConfig.GuideStep, null);
            this.close();
        }
    },

    toolsBtn(event, data) {
        let logic = this.logic;
        let temp = { type: this.extraMsg.type + "Tools" };

        let advcode = 13;
        switch (this.extraMsg.type) {
            case "land":
                advcode = 13;
                break;
            case "orchard":
                advcode = 14;
                break;
            case "paddy":
                advcode = 15;
                break;
            default:
                break;
        }
        
        cc.Global.sdk.postEvent2("ads_start_position",advcode);
        cc.Global.sdk.videoExc(function (code) {
            if (code != 1) { return; }
            cc.Global.sdk.postEvent2("ads_finish_position",advcode);
            logic.lord.addFieldTool(temp);
        }.bind(this));
    },

    initSeedPane() {
        let seedsInfo = [];
        if (this.extraMsg.type === "land") { seedsInfo = Object.keys(articsConfig.land); }
        else if (this.extraMsg.type === "orchard") { seedsInfo = Object.keys(articsConfig.orchard); }
        else if (this.extraMsg.type === "paddy") { seedsInfo = Object.keys(articsConfig.paddy); }

        let len = this.seeds.length;
        for (let index = 0; index < len; index++) {
            let seed = this.seeds[index];
            if (index >= seedsInfo.length) { seed.active = false; }
            else {
                let info = articsConfig.entityHash[seedsInfo[index]];
                seed.active = true;
                seed.artic = info.id;
                this.setItemInfo(seed, info);
            }
        }
    },

    setItemInfo(seed, info) {
        let lordLevel = this.logic.lord.getLevel();
        if (lordLevel < info.unlock) {
            seed.getChildByName("lock").active = true;
            return;
        }
        else {
            seed.getChildByName("lock").active = false;
        }

        seed.getChildByName("name").getComponent(cc.Label).string = articsConfig.entityHash[info.id].name;
        seed.getChildByName("num").getComponent(cc.Label).string = "x" + this.logic.store.getItemNum(info.id);

        let miaozhon = Math.floor(info.harvest_cycle % 60);
        let fenzhon = Math.floor(info.harvest_cycle / 60);
        seed.getChildByName("time").getComponent(cc.Label).string = fenzhon + ":" + miaozhon;

        cc.Global.assertCenter.readLocalSpriteFrame("artics/" + info.id, function (err, spriteFrame) {
            seed.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    resumeSetPosY() {
        let distance = this.pageHeight / 2 + this.areaHeight / 2;
        let clickY = this.extraMsg.pos.y;

        let currentY = 0;
        if (clickY > this.screenHeight / 2) {
            currentY = clickY - distance;
        }
        else {
            currentY = clickY + distance;
        }

        currentY -= this.screenHeight / 2;
        this.back.y = currentY;
        this.board.y = currentY;
    },

    setBoardState() {
        if (this.extraMsg.type === "land") {
            this.boards[0].active = true;
        }
        else if (this.extraMsg.type === "orchard") {
            this.boards[1].active = true;
        }
        else if (this.extraMsg.type === "paddy") {
            this.boards[2].active = true;
        }
    },

    openPage() {
        if (!this.extraMsg) {
            this.extraMsg = { type: "land", pageHeight: 0, areaHeight: 0, pos: { x: 0, y: 0 } };
        }

        this.remainTime.string = ""

        this.pageHeight = this.extraMsg.pageHeight;
        this.areaHeight = this.extraMsg.areaHeight;
        this.type = this.extraMsg.type;
        this.fields = this.extraMsg.fields;

        this.resumeSetPosY();
        this.setBoardState();

        if (this.extraMsg.type == this.lastPageName) { return; }

        this.lastPageName = this.extraMsg.type;
        this.initSeedPane();
    },

    updateRemainTime() {
        let temp = { type: this.extraMsg.type + "Tools" };
        let toolInfo = this.logic.lord.getFieldTool(temp);

        if (toolInfo === 2) {
            this.remainTime.string = "(双倍生效中!)"
        }
        else {
            this.remainTime.string = "(双倍已失效!)"
        }
    },

    closePage() {
        this.boards[0].active = false;
        this.boards[1].active = false;
        this.boards[2].active = false;

        this.back.y = 0;
        this.board.y = 0;

        this.seed.active = false;
    }
});
