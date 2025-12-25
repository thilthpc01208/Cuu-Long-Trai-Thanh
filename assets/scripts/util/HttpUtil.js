module.exports = class HttpUtil {
    constructor() {
        this.requestList = [];
    }

    static instance = null;
    static getInstance() {
        if (HttpUtil.instance == null) {
            HttpUtil.instance = new HttpUtil();
        }

        return HttpUtil.instance;
    }

    onTimeCallBack() {
        if (this.requestList.length <= 0) {
            return;
        }

        let pack = this.requestList.shift();
        this.httpRequest(pack);
    }

    addRequest(pack) {
        if (this.requestList.length >= 20) {
            return;
        }
        this.requestList.push(pack);        
    }

    httpGet(url, callback, immediate = false) {
        let pack = { "type": "GET", "url": url, "callback": callback, "num": 0 };
        if (immediate) {
            this.httpRequest(pack);
        }
        else {
            this.addRequest(pack);
        }
    }

    httpPost(url, params, callback, immediate = false) {
        let pack = { "type": "POST", "url": url, "params": params, "callback": callback, "num": 0 };
        if (immediate) {
            this.httpRequest(pack);
        }
        else {
            this.addRequest(pack);
        }
    }

    httpRequest(pack) {        
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == 200) {
                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);
                if (pack.callback != null) {
                    pack.callback(rsp);
                }
            }
            else if (xhr.readyState === 4 && xhr.status == 401) {
                if (pack.callback != null) {
                    pack.callback({ status: 401 });
                }
            }
            else {
                if (pack.callback != null) {
                    pack.callback(-1);
                }
            }
        };

        // 产生了错误
        xhr.onerror = function (err) {
            pack.num++;
            if (pack.num > 3) {
                return;
            }

            //this.addRequest(pack);
        }.bind(this);

        // 请求超时了
        xhr.ontimeout = function () {
            pack.num++;
            if (pack.num > 3) {
                return;
            }

            //this.addRequest(pack);
        }.bind(this);

        xhr.withCredentials = true;
        xhr.open(pack.type, pack.url, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.timeout = 8000;
        if (pack.params) {
            xhr.send(JSON.stringify(pack.params));
        }
        else {
            xhr.send();
        }
    }
}
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html