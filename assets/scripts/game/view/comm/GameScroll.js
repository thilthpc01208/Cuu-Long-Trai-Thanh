cc.Class({
    extends: cc.Component,

    properties: {
        speedReduce: 0.75,
        speedRatio: 0.5,
    },

    onLoad() {
        /*
        console.log("canvas size:", cc.view.getCanvasSize());
        console.log("visible Size:", cc.view.getVisibleSize());
        console.log("DesignResolutionSize Size:", cc.view.getDesignResolutionSize());
        console.log("frame size", cc.view.getFrameSize());
        console.log("winSize:", cc.winSize);
        */

        this.mapSize = { width: this.node.width, height: this.node.height };
        this.winSize = cc.winSize;// { width: 1080, height: 2340 };
        this.scaleLimit = { max: 1, min: this.winSize.width / this.mapSize.width };
        this.startScale = 1;

        this.velocityY = 0;
        this.velocityX = 0;
        this.speed = { x: 0, y: 0 };

        this.inertia = { x: false, y: false };
        this.touchBeginPos = cc.v3(0, 0, 0);

        this.touchSave = {};
    },

    start: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

        let currScale = cc.sys.localStorage.getItem("mapScale");
        if (currScale && currScale != "") {
            this.mapScale(parseFloat(currScale));
        }
    },

    touchStart: function (event) {
        // 停止当前进行的惯性移动
        this.inertia = { x: false, y: false };

        this.velocityY = 0;
        this.velocityX = 0;
        this.speed = { x: 0, y: 0 };

        this.touchBeginPos = event.getLocation();

        let touch = event.touch;
        this.touchSave["pos" + touch.getID()] = touch;

        this.startScale = this.node.scale;
    },

    touchMove: function (event) {
        if (cc.Global.casualStory.getData("GameGuideState")) {
            return;
        }

        if (Object.keys(this.touchSave).length === 1) {
            this.node.x += event.getDelta().x;
            this.node.y += event.getDelta().y;

            this.posLimit();

            this.velocityY = event.getDelta().y;
            this.velocityX = event.getDelta().x;
            this.speed = { x: Math.abs(this.velocityX), y: Math.abs(this.velocityY) };
        }
        else {
            this.mapScale();
        }
    },

    touchEnd: function (event) {
        if (Object.keys(this.touchSave).length === 1) {
            let distance = this.touchBeginPos.sub(event.getLocation()).mag();
            if (distance >= 5) {
                // 触发惯性移动
                this.inertia = { x: true, y: true };
            }
        }
        else {
            this.mapScale();
        }

        let touch = event.touch;
        delete this.touchSave["pos" + touch.getID()];
    },

    touchCancel: function (event) {
        let touch = event.touch;
        delete this.touchSave["pos" + touch.getID()];
    },

    update: function (dt) {
        if (!this.inertia.x && !this.inertia.y) {
            return;
        }

        if (this.inertia.x) { this.xMove(); }
        if (this.inertia.y) { this.yMove(); }

        this.posLimit();
    },

    xMove() {
        this.speed.x -= this.speedReduce;
        if (this.speed.x < 0.1) {
            this.speed.x = 0;
            this.inertia.x = false;
            return;
        }

        let moveX = this.speed.x * this.speedRatio;
        if (this.velocityX < 0) {
            moveX *= -1;
        }

        if (Math.abs(moveX) < 0.001) {
            this.inertia.x = false;
            return;
        }
        this.node.x = this.node.x + moveX;
    },

    yMove() {
        this.speed.y -= this.speedReduce;
        if (this.speed.y < 0.1) {
            this.speed.y = 0;
            this.inertia.y = false;
            return;
        }

        let moveY = this.speed.y * this.speedRatio;
        if (this.velocityY < 0) {
            moveY *= -1;
        }

        if (Math.abs(moveY) < 0.001) {
            this.inertia.y = false;
            return;
        }
        this.node.y = this.node.y + moveY;
    },

    posLimit() {
        let down = this.node.y - this.mapSize.height / 2;
        if (down > (-this.winSize.height / 2)) {
            this.node.y = (this.mapSize.height - this.winSize.height) / 2;
        }

        let top = this.node.y + this.mapSize.height / 2;
        if (top < this.winSize.height / 2) {
            this.node.y = (this.winSize.height - this.mapSize.height) / 2;
        }

        //X 方向
        let xDiff = this.mapSize.width / 2 - this.winSize.width / 2;
        if (this.node.x > xDiff) {
            this.node.x = xDiff;
        }

        if (this.node.x < -xDiff) {
            this.node.x = -xDiff;
        }
    },

    mapScale(lastScale = null) {
        if (lastScale) {
            this.mapSize = { width: this.node.width * lastScale, height: this.node.height * lastScale };
            this.node.scale = lastScale;
            this.posLimit();
            return;
        }

        let touchKeys = Object.keys(this.touchSave);
        if (touchKeys.length < 2) { return; }

        let oneStartPos = this.touchSave[touchKeys[0]].getStartLocation();
        let twoStartPos = this.touchSave[touchKeys[1]].getStartLocation();

        let oneEndPos = this.touchSave[touchKeys[0]].getLocation();
        let twoEndPos = this.touchSave[touchKeys[1]].getLocation();

        let startDis = oneStartPos.sub(twoStartPos).mag() + 1200;
        let endDis = oneEndPos.sub(twoEndPos).mag() + 1200;

        let scaleDiff = (endDis / startDis) - 1;
        //scaleDiff = scaleDiff / 5;
        let currScale = this.startScale + scaleDiff;

        if (currScale > this.scaleLimit.max) { currScale = this.scaleLimit.max; }
        if (currScale < this.scaleLimit.min) { currScale = this.scaleLimit.min; }

        this.mapSize = { width: this.node.width * currScale, height: this.node.height * currScale };
        this.node.scale = currScale;
        this.posLimit();

        cc.sys.localStorage.setItem("mapScale", currScale);
    }
});