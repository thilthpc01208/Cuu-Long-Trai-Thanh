const Logic = require("../../logic/logic")

cc.Class({
    extends: cc.Component,

    properties: {
        dialog: {
            type: cc.Node,
            default: null
        },

        hand: {
            type: cc.Node,
            default: null
        },

        hole: {
            type: cc.Node,
            default: null
        },

        mask: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {
        this.initGuideList();
        this.guideIndex = 0;

        this.logic = Logic.getInstance();
        let gameGuideState = this.logic.lord.getGameGuideState();
        if (gameGuideState) {
            this.node.removeFromParent();
        }
    },

    start() {
        this.enterGuide(this.guideList[this.guideIndex]);
    },

    onEnable() {
        cc.Global.casualStory.setData("GameGuideState", true);

        this.mask.on(cc.Node.EventType.TOUCH_START, this.maskClickStart, this);
        this.mask.on(cc.Node.EventType.TOUCH_END, this.maskClickEnd, this);
        this.mask.on(cc.Node.EventType.TOUCH_CANCEL, this.maskClickEnd, this);

        cc.Global.listenCenter.register(cc.Global.eventConfig.GuideStep, this.guideStep, this);
    },

    onDisable() {
        cc.Global.casualStory.setData("GameGuideState", false);

        this.mask.off(cc.Node.EventType.TOUCH_START, this.maskClickStart, this);
        this.mask.off(cc.Node.EventType.TOUCH_END, this.maskClickEnd, this);
        this.mask.off(cc.Node.EventType.TOUCH_CANCEL, this.maskClickEnd, this);

        cc.Global.listenCenter.remove(cc.Global.eventConfig.GuideStep, this);
    },

    initGuideList() {
        this.guideList = [
            { type: "talk", info: "欢迎来到猪笼城寨，我们来一起建设并守候我们美丽的城寨" },
            { type: "talk", info: "俗话说，万事开头难，让我们先建造两块耕地吧" },
            { type: "click", url: "Canvas/GameCT/map/lands/fields", group: true, index: 3, outCallback: true, move: { x: 485, y: -200 } },
            { type: "talk", info: "点击建造耕地" },
            { type: "click", url: "Canvas/GameUI/createFieldPage/buyBtn", outCallback: true },
            { type: "talk", info: "民以食为天，让我们先种植几颗小麦" },
            { type: "click", url: "Canvas/GameCT/map/lands/fields", group: true, index: 3, outCallback: true },
            { type: "click", url: "Canvas/GameUI/seedPage/background/content", group: true, index: 0, outCallback: true, extraNode: { name: "loadPlant" } },
            { type: "talk", info: "稍等片刻，马上就成熟了" },
            { type: "talk", info: "接下来看看有什么任务等着我们去做" },
            { type: "click", url: "Canvas/GameUI/mainMenu/down/task", outCallback: true },
            { type: "click", url: "Canvas/GameUI/taskPage/toggleContainer", group: true, index: 2, outCallback: true, scale: 0.6, yDiff: 20 },
            { type: "talk", info: "我们的任务是制作两把面条，完成后就可以领取任务奖励" },
            { type: "click", url: "Canvas/GameUI/taskPage/closeBtn", outCallback: true },
            { type: "talk", info: "小麦成熟了，可以收获了" },
            { type: "click", url: "Canvas/GameCT/map/lands/fields", group: true, index: 0, outCallback: true, extraNode: { name: "drawPlant" }, move: { x: 485, y: -200 } },
            { type: "talk", info: "收获的物品被存入仓库中了" },
            { type: "click", url: "Canvas/GameCT/map/castle/house/floors/floor_0/store", outCallback: true, scale: 0.5, move: { x: 0, y: -740 } },
            { type: "talk", info: "这里存放着所有的物品，仓库有容量限制，升级仓库可以提高容量" },
            { type: "click", url: "Canvas/GameUI/storePage/closeBtn", outCallback: true },
            { type: "talk", info: "接下来去面点房加工面条，来完成分配的任务" },
            { type: "click", url: "Canvas/GameCT/map/castle/factorys/items/floor_1/noddle", outCallback: true, scale: 0.8, move: { x: 485, y: -740 } },
            { type: "talk", info: "加工产品需要原材料" },
            { type: "click", url: "Canvas/GameUI/factoryPage/detail/cookBtn", outCallback: true, scale: 0.8 },
            { type: "click", url: "Canvas/GameUI/factoryPage/detail/cookBtn", outCallback: true, scale: 0.8 },
            { type: "talk", info: "面条还得一会儿才能加工完成，我们去看看有什么订单" },
            { type: "click", url: "Canvas/GameUI/factoryPage/closeBtn", outCallback: true },
            { type: "click", url: "Canvas/GameCT/map/depot", outCallback: true, yDiff: 80, scale: 0.5, move: { x: -200, y: -540 } },
            { type: "talk", info: "这里面列出了当前村民们的需求，村民老李家要一些麦子，我们这就给他送过去" },
            { type: "click", url: "Canvas/GameUI/depotPage/scrollView/view/content/item/leak/loadBtn", outCallback: true },
            { type: "talk", info: "货物装车了，现在可以去送货了" },
            { type: "click", url: "Canvas/GameUI/depotPage/truckInfo/ready/setOutBtn", outCallback: true },
            { type: "talk", info: "还得一会儿才能送货回来，我们先去面点房看看，面条应该制作好了" },
            { type: "click", url: "Canvas/GameUI/depotPage/closeBtn", outCallback: true },
            { type: "click", url: "Canvas/GameCT/map/castle/factorys/items/floor_1/noddle", outCallback: true, scale: 0.8, move: { x: 485, y: -740 } },
            { type: "talk", info: "面条已经熟了，可以收取了" },
            { type: "click", url: "Canvas/GameUI/factoryPage/bench/stove/done", outCallback: true, scale: 0.8 },
            { type: "click", url: "Canvas/GameUI/factoryPage/bench/stove/done", outCallback: true, scale: 0.8 },
            { type: "talk", info: "收获的物品同样被存入仓库中" },
            { type: "click", url: "Canvas/GameUI/factoryPage/closeBtn", outCallback: true },
            { type: "talk", info: "任务完成了，现在可以领取奖励了" },
            { type: "click", url: "Canvas/GameUI/mainMenu/down/task", outCallback: true },
            { type: "click", url: "Canvas/GameUI/taskPage/toggleContainer", group: true, index: 2, outCallback: true, scale: 0.6, yDiff: 20 },
            { type: "click", url: "Canvas/GameUI/taskPage/brunchTask/done/normal", outCallback: true },
            { type: "talk", info: "每完成一个任务，会产生一个新的任务" },
            { type: "click", url: "Canvas/GameUI/taskPage/closeBtn", outCallback: true },
            { type: "talk", info: "送货回来了，可以去收钱了" },
            { type: "click", url: "Canvas/GameCT/map/depot", outCallback: true, yDiff: 80, scale: 0.5, move: { x: -200, y: -540 } },
            { type: "click", url: "Canvas/GameUI/depotPage/truckInfo/back/collect/collectBtn", outCallback: true },
            { type: "talk", info: "太棒了，我们赚取了第一笔钱" },
            { type: "click", url: "Canvas/GameUI/depotPage/closeBtn", outCallback: true },
            { type: "talk", info: "主房是整个游戏的核心建筑，升级主房可以解锁更多功能" },
            { type: "click", url: "Canvas/GameCT/map/castle/house/floors/floor_0/lord", outCallback: true, yDiff: -50, scale: 0.7, move: { x: 0, y: -740 } },
            { type: "talk", info: "升级主房需要消耗掉钱和材料" },
            { type: "click", url: "Canvas/GameUI/lordPage/updateBtn", outCallback: true },
            { type: "talk", info: "主房升级完成了，我们可以建造多一块耕地了" },
            { type: "talk", info: "接下来有更多的功能等着你去探索，希望你把我们的城寨建设的更加美好！" },
        ];
    },

    guideStep() {
        this.node.getChildByName("extraNode").active = false;

        this.hole.height = 0;
        this.hole.width = 0;
        this.hand.active = false;

        this.guideIndex++;
        cc.Global.sdk.postEvent2("guide_step", this.guideIndex);

        if (this.guideIndex >= this.guideList.length) {
            this.node.removeFromParent();
        }
        else {
            this.enterGuide(this.guideList[this.guideIndex]);
        }

        if (!this.logic.lord.getGameGuideState()
            && this.guideIndex > 2) {
            this.logic.lord.setGameGuideState(true);
        }
    },

    maskClickStart(event) {
        if (!this.canClickMask) {
            this.mask._touchListener.setSwallowTouches(true);
            event.stopPropagation();
            return;
        }

        let holePosition = this.hole.position;
        let width = this.hole.width;
        let height = this.hole.height;

        let holeRect = cc.rect(holePosition.x - width / 2, holePosition.y - height / 2, width, height);
        let touchPos = cc.Global.axexUtil.worldConvertLocalPointAR(this.node, event.getLocation());

        if (holeRect.contains(touchPos)) {
            this.mask._touchListener.setSwallowTouches(false);
        } else {
            this.mask._touchListener.setSwallowTouches(true);
            event.stopPropagation();
        }

        if (this.guideIndex === 6) {
            this.hole.active = false;

            let extraNode = this.node.getChildByName("extraNode");
            extraNode.getChildByName("loadPlant").active = false;
        }
    },

    maskClickEnd(event) {
        if (this.guideIndex === 6) {
            this.hole.active = true;
            let extraNode = this.node.getChildByName("extraNode");
            extraNode.getChildByName("loadPlant").active = true;
        }
    },

    dialogBtn(event, data) {
        if (this.guideList[this.guideIndex].type != "talk") {
            return;
        }
        this.guideStep();
    },

    getObjInfo(index) {
        let info = this.guideList[index];

        let data = {};
        if (info.type == "talk") {
            let pos = this.dialog.position;
            let height = this.dialog.height;
            let width = this.dialog.width;

            data.pos = pos;
            data.height = height;
            data.width = width;
        }

        if (info.type == "click") {
            let node = cc.find(info.url);

            node = info.group == true ? node.children[info.index] : node;
            let currPos = cc.Global.axexUtil.convetOtherNodeSpaceAR(node, this.node);

            if (!node) {
                this.node.removeFromParent();
                return;
            }

            let pos = currPos;
            let height = node.height;
            let width = node.width;

            if (info.widthScale) {
                width = width * info.widthScale;
            }

            if (info.xDiff) {
                pos.x = pos.x + info.xDiff;
            }

            if (info.yDiff) {
                pos.y = pos.y + info.yDiff;
            }

            if (info.scale) {
                height *= info.scale;
                width *= info.scale;
            }

            data.pos = pos;
            data.height = height;
            data.width = width;
        }

        return data;
    },

    enterGuide(info) {
        if (this.guideIndex !== 6) {
            this.hole.active = true;

            let extraNode = this.node.getChildByName("extraNode");
            extraNode.getChildByName("loadPlant").active = false;
        }

        this.canClickMask = false;
        if (info.move) { this.moveMap(info.move); }
        this.scheduleOnce(function () {
            this.setGuide(info);
        }.bind(this), 0.5);
    },

    setGuide(info) {
        if (info.type === "click") {
            this.dialog.active = false;
            this.hand.active = true;

            let nodeData = this.getObjInfo(this.guideIndex);

            this.hole.height = nodeData.height;
            this.hole.width = nodeData.width;

            this.hole.x = nodeData.pos.x;
            this.hole.y = nodeData.pos.y;

            this.hand.x = nodeData.pos.x;
            this.hand.y = nodeData.pos.y;

            this.canClickMask = true;
        }

        if (info.type === "talk") {
            this.dialog.getChildByName("talk").getComponent(cc.Label).string = info.info;
            this.dialog.active = true;
            this.hand.active = true;

            let nodeData = this.getObjInfo(this.guideIndex);
            this.hole.x = nodeData.pos.x;
            this.hole.y = nodeData.pos.y;

            this.hand.x = nodeData.pos.x;
            this.hand.y = nodeData.pos.y;
        }

        if (info.extraNode) {
            let extraNode = this.node.getChildByName("extraNode");
            extraNode.active = true;
            extraNode.getChildByName("loadPlant").active = false;
            extraNode.getChildByName("drawPlant").active = false;
            extraNode.getChildByName(info.extraNode.name).active = true;

            this.hand.active = false;
        }
        else {
            this.node.getChildByName("extraNode").active = false;
        }
    },

    moveMap(pos) {
        let map = cc.find("Canvas/GameCT/map");
        let move = cc.moveTo(0.2, cc.v2(pos.x, pos.y));
        map.runAction(move);
    }
});
