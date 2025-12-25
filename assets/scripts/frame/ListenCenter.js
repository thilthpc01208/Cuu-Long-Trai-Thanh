class Observer {
    constructor(callback, context) {
        this.callback = callback;
        this.context = context;
    }

    /**
    * 发送通知
    * @param args 不定参数
    */
    notify(args) {
        this.callback.call(this.context, args);
    }

    /**
    * 上下文比较
    * @param context 上下文
    */
    compar(context) {
        return context === this.context;
    }
}

module.exports = class ListenCenter {
    constructor() {
        /** 监听数组 */
        this.listeners = {};
    }

    static instance = null;
    static getInstance() {
        if (ListenCenter.instance == null) {
            ListenCenter.instance = new ListenCenter();
        }
        return ListenCenter.instance;
    }

    /**
    * 注册事件
    * @param name 事件名称
    * @param callback 回调函数
    * @param context 上下文
    */
    register(name, callback, context) {
        let observers = this.listeners[name];
        if (!observers) {
            this.listeners[name] = [];
        }

        let len = this.listeners[name].length;
        for (let i = 0; i < len; i++) {
            if (this.listeners[name][i].context != context) {
                continue;
            }

            return;
        }

        this.listeners[name].push(new Observer(callback, context));
    }

    /**
    * 移除事件
    * @param name 事件名称
    * @param callback 回调函数
    * @param context 上下文
    */
    remove(name, context) {
        let observers = this.listeners[name];
        if (!observers) return;

        let length = observers.length;
        for (let i = 0; i < length; i++) {
            let observer = observers[i];
            if (observer.compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }

        if (observers.length == 0) {
            delete this.listeners[name];
        }
    }

    /**
    * 发送事件
    * @param name 事件名称
    */
    fire(name, args) {
        let observers = this.listeners[name];
        if (!observers) return;
        let length = observers.length - 1;
        for (let i = length; i >= 0; i--) {
            let observer = observers[i];
            if (observer != null && observer != undefined) {
                observer.notify(args);
            }
        }
    }
}