cc.Class({
    extends: cc.Component,

    properties: {
        dotsNode: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {
        this.sortDots(this.dotsNode.children);

        let squareRightRoute = [];
        let squareLeftRoute = [];

        let lamper = ["lamp_-2", "lamp_-1", "lamp_0", "lamp_1", "lamp_2", "lamp_3", "lamp_4", "lamp_5"];
        let factoryer = ["dot_2", "dot_3"];
        let outdoor = ["dot_-1", "dot_0", "dot_1", "dot_2"];
        let mine = ["dot_-2", "dot_0", "dot_1", "dot_2"];

        let diner = [
            ["holiday_8", "holiday_9", "holiday_10", "holiday_11"],
            ["holiday_12", "holiday_13", "holiday_14", "holiday_15"],
            ["holiday_0", "holiday_1", "holiday_2", "holiday_3"],
            ["holiday_4", "holiday_5", "holiday_6", "holiday_7"],
        ];

        ///////////////////////////////////////////////////////////////////////////////
        this.setSingleRoute("squareRightRoute", squareRightRoute);
        this.setSingleRoute("squareLeftRoute", squareLeftRoute);

        this.setSingleRoute("lamper", lamper);
        this.setSingleRoute("factoryer", factoryer);
        this.setSingleRoute("outdoor", outdoor);
        this.setSingleRoute("mine", mine);
        this.setDoubleRoute("diner", diner);
    },

    sortDots(dotArr) {
        let len = dotArr.length;
        this.dotMap = {};
        for (let index = 0; index < len; index++) {
            let dot = dotArr[index];
            let info = {
                name: dot.name,
                x: dot.x,
                y: dot.y
            };
            this.dotMap[info.name] = info;
        }
    },

    setSingleRoute(name, array) {
        let len = array.length;
        this[name] = [];
        for (let index = 0; index < len; index++) {
            let info = this.dotMap[array[index]];
            let dot = { x: info.x, y: info.y };
            this[name].push(dot);
        }
    },

    setDoubleRoute(name, arrays) {
        let len1 = arrays.length;
        this[name] = [];
        for (let index1 = 0; index1 < len1; index1++) {
            let array = arrays[index1];
            let len2 = array.length;
            this[name][index1] = [];
            for (let index2 = 0; index2 < len2; index2++) {
                let info = this.dotMap[array[index2]];
                let dot = { x: info.x, y: info.y };
                this[name][index1].push(dot);
            }
        }
    }
});
