cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.windowsRect = this.getWindowsSize();
        this.check();
    },

    onEnable() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.RegisterNodeRectCheck, { id: this.node.uuid, callback: this.check.bind(this) });
        this.node.hideSelf = false;
    },

    onDisable() {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.RemoveNodeRectCheck, { id: this.node.uuid, callback: this.check.bind(this) });
    },

    check() {
        let nodeRect = this.getInWindowsSize();
        if (this.windowsRect.intersects(nodeRect)) {
            this.node.opacity = 255;
            this.node.hideSelf = false;
        }
        else {
            this.node.opacity = 0;
            this.node.hideSelf = true;
        }
    },

    getWindowsSize() {
        /*
        //设计分辨率
        let designSize = cc.view.getDesignResolutionSize();
        console.log(designSize.width, designSize.height);

        //视图边框尺寸
        let viewSize = cc.view.getFrameSize();
        console.log(viewSize.width, viewSize.height);

        //视图中canvas尺寸
        let canvasSize = cc.view.getCanvasSize();
        console.log(canvasSize.width, canvasSize.height);

        //视图中窗口可见区域的尺寸
        let visibleSize = cc.view.getVisibleSize();
        console.log(visibleSize.width, visibleSize.height);
        */

        //获取当前游戏窗口大小
        let winSize = cc.winSize;
        let rect = new cc.Rect(0, 0, winSize.width, winSize.height)
        return rect;
    },

    getInWindowsSize() {
        //这个不受缩放影响
        //let nodeRect = this.node.getContentSize();

        /*
        let height = this.node.height;
        let width = this.node.width;
        let pos = cc.Global.axexUtil.localConvertWorldPoint(this.node);
        return new cc.Rect(pos.x, pos.y, width, height);
        */

        /*
        let anchorX = this.node.anchorX;
        let anchorY = this.node.anchorY;

        let posX = this.node.x;
        let posY = this.node.y;

        posX -= anchorX * width;
        posY -= anchorY * height;
        */

        return this.node.getBoundingBoxToWorld();
    }
});
