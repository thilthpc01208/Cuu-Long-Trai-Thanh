cc.Class({
    extends: cc.Component,

    properties: {

    },

    /*
    cc.Node.EventType.TOUCH_START	touchstart	当手指触点落在目标节点区域内时
    cc.Node.EventType.TOUCH_MOVE	touchmove	当手指在屏幕上目标节点区域内移动时
    cc.Node.EventType.TOUCH_END	    touchend	当手指在目标节点区域内离开屏幕时
    cc.Node.EventType.TOUCH_CANCEL	touchcancel	当手指在目标节点区域外离开屏幕
    */

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },

    /*Event的属性和方法
    touch	            cc.Touch	与当前事件关联的触点对象
    getID	            Number	    获取触点的 ID，用于多点触摸的逻辑判断
    getLocation	        Object	    获取触点位置对象，对象包含 x 和 y 属性
    getLocationX	    Number	    获取触点的 X 轴位置
    getLocationY	    Number	    获取触点的 Y 轴位置
    getPreviousLocation	Object	    获取触点上一次触发事件时的位置对象，对象包含 x 和 y 属性
    getStartLocation	Object	    获取触点初始时的位置对象，对象包含 x 和 y 属性
    getDelta	        Object	    获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性

    在同一个节点,如果同时多个手指点击,那么这时event的getTouches()方法是可以获取到多个点的，其结果是一个数组，touchStart和touchMove,touchEnd都一样。
    event.stopPropagation() 可以主动停止冒泡过程。
    */
    touchStart(event) {

    },

    touchMove(event) {

    },

    touchEnd(event) {

    },

    touchCancel(event) {

    },
});
