cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.runDir = { x: 0, y: 0 };
        // 0:idle 1:run 2:end
        this.roleState = 0;

        this.spin = this.node.getComponent("sp.Skeleton");
        this.initRoleBase();
    },

    onEnable() {
        this.actionBase = this.node.getComponent("ActionBase");
    },

    onDisable() {
        this.actionBase.endAction();
    },

    initRoleBase() {
        this.runSpeed = 60;
        this.runIndex = 0;
        this.runStep = 1;
    },

    update(dt) {
        if (this.roleState != 1) { return; }

        this.node.x += dt * this.runDir.x * this.runSpeed;
        this.node.y += dt * this.runDir.y * this.runSpeed;

        this.caculateDir(this.node, this.path[this.runIndex], false);
        let arrive = this.caculateDis(this.node, this.path[this.runIndex]);
        if (!arrive) {return;}

        let nextRunIndex = this.runIndex + this.runStep;
        this.nextDot(nextRunIndex);
        if (this.path.length <= nextRunIndex || nextRunIndex < 0) {
            this.roleState = 0;
            this.doneAction();
            return;
        }

        this.runIndex = nextRunIndex;
        this.caculateDir(this.node, this.path[this.runIndex], true);
    },

    setPath(path, data, rolePool) {
        this.initRoleBase();
        
        if (!this.actionBase) {
            this.actionBase = this.node.getComponent("ActionBase");
        }
        this.path = this.actionBase.setPath(path, data);

        this.node.x = this.path[0].x;
        this.node.y = this.path[0].y;

        this.roleState = 1;
        this.caculateDir(this.path[0], this.path[1], false);
        this.actionBase.startAction();

        this.rolePool = rolePool;
    },

    /**
     * 向下一个点移动
     * @param {*} index 
     */
    nextDot(index) {
        this.actionBase.nextDot(index)
    },

    /**
     * 开始干正事
     */
    doneAction() {
        this.actionBase.doneAction();
    },

    caculateDir(curr, target, isTurn) {
        let xDis = Math.floor(target.x - curr.x);
        let yDis = Math.floor(target.y - curr.y);

        this.runDir = cc.v2(xDis, yDis).normalize();
        this.runDir.x = Math.round(this.runDir.x);
        this.runDir.y = Math.round(this.runDir.y);

        if (isTurn) {
            this.setRunAnimation();
        }
    },

    caculateDis(curr, target) {
        let xDis = Math.floor(target.x - curr.x);
        let yDis = Math.floor(target.y - curr.y);

        let dis = cc.v2(xDis, yDis).mag();
        if (dis <= 5) { return true; }
        else { return false; }
    },

    setRunAnimation() {
        let runDir = this.runDir;
        let name = "walk_z";

        //if (runDir.x == -1) { name = "c_walk"; }
        //if (runDir.x == 1) { name = "c_walk"; }
        //if (runDir.y == -1) { name = "walk_z"; }
        //if (runDir.y == 1) { name = "walk_b"; }

        if (runDir.x == -1) { this.node.scaleX = 1; }
        if (runDir.x == 1) { this.node.scaleX = -1; }

        if (this.actionBase.getRunAnimation) {
            name = this.actionBase.getRunAnimation(runDir);
        }
        this.spin.setAnimation(0, name, true);

        let talk = this.node.getChildByName("talk");
        if (runDir.x !== 0) {
            this.node.scaleX = -runDir.x;
            if (talk) { talk.scaleX = -runDir.x; }
        }

        if (runDir.x == 0) {
            this.node.scaleX = 1;
            if (talk) { talk.scaleX = 1; }
        }
    },

    hideRole(node, comp) {
        this.rolePool.push(node);
        node.parent = null;

        node.removeComponent(comp);
        node.removeComponent("RoleBase");

        node.active = false;
    }
});
