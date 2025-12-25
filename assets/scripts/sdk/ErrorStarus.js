window.currentErrorStack = [];
window.currentSendErrorMsg = function (msg) {
    msg.gameName = "WalledCity";

    for (let index = 0, len = window.currentErrorStack.length; index < len; index++) {
        let info = window.currentErrorStack[index];
        if (info.errorMessage == msg.errorMessage &&
            info.scriptURI == msg.scriptURI &&
            info.lineNumber == msg.lineNumber &&
            info.errorObj == msg.errorObj) {
            return;
        }
    }
    window.currentErrorStack.push(msg);

    let errstr = "";
    for (const key in msg) {
        if (key != "errorObj") {
            errstr += key + "=" + msg[key] + "&";
        }
        else {
            errstr += key + "=" + msg[key];
        }
    }

    let url = "http://8.142.24.253:15001/api/error/receiveErrorInfo?" + errstr;
    cc.Global.httpUtil.httpGet(url, function (data) {
        if (data == -1) {
            return;
        }
    });
}

// 注册监听
if (cc.sys.isNative) {
    window.currentErrorStack = [];
    window.__errorHandler = function (message, line, file, error) {
        let errInfo = {
            errorMessage: message,
            scriptURI: file,
            lineNumber: line,
            columnNumber: 0,
            errorObj: error
        }

        window.currentSendErrorMsg(errInfo);
    };
}
else if (cc.sys.isBrowser) {
    window.onerror = function (message, line, file, column, error) {
        let errInfo = {
            errorMessage: message,
            scriptURI: file,
            lineNumber: line,
            columnNumber: column,
            errorObj: error
        }

        window.currentSendErrorMsg(errInfo);
    };
}
