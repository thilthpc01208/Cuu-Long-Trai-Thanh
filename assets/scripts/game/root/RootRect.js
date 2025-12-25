cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.startNode = null;
        this.endNode = null;
        this.currentNode = null;

        this.nodeMap = {};
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.RegisterNodeRectCheck, this.addNode, this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.RemoveNodeRectCheck, this.cutNode, this);
    },

    onDisable() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.RegisterNodeRectCheck, this.addNode, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.RemoveNodeRectCheck, this.cutNode, this);
    },

    update(dt) {
        this.check();
    },

    addNode(info) {
        if (this.nodeMap[info.id]) { return; }

        let node = { id: info.id, callback: info.callback, last: null, next: null };
        this.nodeMap[info.id] = node;

        if (this.startNode == null) {
            this.startNode = node;
            this.currentNode = node;
            return;
        }

        if (this.startNode.next == null) {
            this.startNode.next = node;
            node.last = this.startNode;
            this.endNode = node;
            return;
        }

        if (this.endNode != null) {
            this.endNode.next = node;
            node.last = this.endNode;
            this.endNode = node;
        }
    },

    cutNode(info) {
        if (!this.nodeMap[info.id]) { return; }

        let node = this.nodeMap[info.id];
        if (node.last == null) {
            this.startNode = node.next;
            delete this.nodeMap[info.id];
            return
        }

        node.last.next = node.next;
        if (node.next != null) {
            node.next.last = node.last;
        }
        else {
            this.endNode = null;
        }

        if (this.currentNode == node) {
            this.currentNode = node.next;
        }

        if (this.currentNode == null) {
            this.currentNode = this.startNode;
        }

        delete this.nodeMap[info.id];
    },

    check() {
        if (!this.currentNode) { return; }
        this.currentNode.callback();
        this.currentNode = this.currentNode.next;

        if (!this.currentNode) {
            this.currentNode = this.startNode;
        }
    }
});