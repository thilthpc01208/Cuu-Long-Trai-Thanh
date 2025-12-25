const Logic = require("../../../../logic/logic");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.roleBase = this.node.getComponent("RoleBase");
        this.logic = Logic.getInstance();
    },

    startAction() {

    },

    endAction() {

    },

    doneAction() {

    },

    nextDot(index) {

    },

    setPath(path, data) {
        return path;
    }
});
