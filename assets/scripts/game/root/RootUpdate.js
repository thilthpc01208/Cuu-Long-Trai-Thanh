cc.Class({
    extends: cc.Component,

    properties: {

    },

    start() {
        this.updateList = [];
        this.runIndex = 0;
        this.stepTime = (1 / 30) * 1000;
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.AddUpdateEvent, this.addUpdate, this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.DelUpdateEvent, this.delUpdate, this);
    },

    onDestroy() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.AddUpdateEvent, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.DelUpdateEvent, this);
    },

    update(dt) {
        return;
        
        if (this.updateList.length <= 0) {
            return;
        }

        this.removeUpdate();

        let startTime = (new Date()).getTime();
        let condition = true;

        do {
            let updateFun = this.updateList[this.runIndex];

            this.runIndex++;
            if (this.runIndex >= this.updateList.length) {
                this.runIndex = 0;
                condition = false;
            }

            if (updateFun["sign_delete"] == true) {
                continue;
            }

            updateFun(dt);

            let endTime = (new Date()).getTime();
            if (endTime - startTime >= this.stepTime) {
                condition = false;
            }
        } while (condition);
    },

    addUpdate(updateFun) {
        if (this.updateList.indexOf(updateFun) != -1) {
            return;
        }

        updateFun["sign_delete"] = false;
        this.updateList.push(updateFun);
    },

    delUpdate(updateFun) {
        let index = this.updateList.indexOf(updateFun);
        if (index == -1) {
            return;
        }

        this.updateList["sign_delete"] = true;
    },

    removeUpdate() {
        let len = this.updateList.length - 1;
        for (let i = len; i >= 0; i--) {
            let signDelete = this.updateList[i]["sign_delete"];
            if (signDelete == false) {
                continue;
            }

            if (this.runIndex > 0 && i <= this.runIndex) {
                this.runIndex--;
            }

            this.updateList.splice(i, 1);
        }
    }
});
