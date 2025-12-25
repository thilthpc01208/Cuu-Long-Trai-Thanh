module.exports = class CasualStory {
    constructor() {
        this.data = {};
    }

    static instance = null;
    static getInstance() {
        if (CasualStory.instance == null) {
            CasualStory.instance = new CasualStory();
        }
        return CasualStory.instance;
    }

    setData(key, value) {
        this.data[key] = value;
    }

    getData(key) {
        return this.data[key];
    }
}//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html