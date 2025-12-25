cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.dots = this.node.children;
    },

    start() {
        let map = {};

        let len = this.dots.length;
        for (let index = 0; index < len; index++) {
            let dot = this.dots[index];
            let num = dot.getChildByName("info").getComponent(cc.Label);
            map[num.string] = dot.position;
        }
    },
});
