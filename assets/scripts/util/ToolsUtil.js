const Logic = require('../game/logic/logic');

module.exports = class ToolsUtil {
    constructor() {

    }

    static instance = null;
    static getInstance() {
        if (ToolsUtil.instance == null) {
            ToolsUtil.instance = new ToolsUtil();
        }
        return ToolsUtil.instance;
    }

    /**
     * 给一个按钮添加事件
     * @param {*} targetNode 
     * @param {*} componentNode 
     * @param {*} componentName 
     * @param {*} funcName 
     * @param {*} eventData 
     */
    addBtnEvent(targetNode, componentNode, componentName, funcName, eventData) {
        var clickEventHandler = new cc.Component.EventHandler();

        //这个node节点是你的事件处理代码组件所属的节点
        clickEventHandler.target = componentNode;
        //这个是代码文件名
        clickEventHandler.component = componentName;
        clickEventHandler.handler = funcName;
        clickEventHandler.customEventData = eventData;
        
        var button = targetNode.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);

        //或者
        //targetNode.on('click', this.callback, this);
    }

    /*
    * 生成一个迭代器	
    */
    createItemIterator(self, parent, items, infos, fun) {
        self.next = null;
        let index = 0;

        let infosLen = infos.length;
        let itemsLen = items.length;

        self.next = function () {
            let item = null;
            if (index > (itemsLen - 1)) {
                item = cc.instantiate(items[0]);
            } else {
                item = items[index];
            }

            item.parent = parent;
            item.active = true;
            fun(item, infos[index]);

            index++;
            return index < infosLen;
        }.bind(self);

        if (itemsLen <= infosLen) {
            return;
        }

        for (let i = infosLen; i < items.length; i++) {
            items[i].active = false;
        }
    }
}//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html