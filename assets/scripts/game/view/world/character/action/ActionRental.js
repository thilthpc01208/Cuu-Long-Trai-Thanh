const ActionBase = require('./ActionBase');

cc.Class({
    extends: ActionBase,

    properties: {

    },

    startAction() { },

    endAction() { },

    doneAction() {
        this.roleBase.hideRole(this.node,this);
    },

    setPath(path, data) {
        return path;
    }
});
