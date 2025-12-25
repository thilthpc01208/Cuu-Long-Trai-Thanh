const Logic = require("../game/logic/logic");

module.exports = {
    //激励 视频  0无视频  1成功  2取消
    videoExc: function (callBack) {
        window.videoEndTime = (new Date()).getTime() + 5 * 1000;
        window.videoFunCall = null;
        window.videoFunCall = callBack;

        if (cc.sys.os === cc.sys.OS_IOS) {
            //调用苹果的方法;
            jsb.reflection.callStaticMethod("AppController", "playVideo:", "");
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "showLGRewardedVideo",
                "(Ljava/lang/String;)V", ""
            );
        }
        else {
            Logic.getInstance().lord.watchAdv();
            window.videoEndTime = 0;
            window.video_OcJs(1);
        }
    },

    /*埋点*/
    postEvent1: function (event_name) {
        if (cc.sys.os === cc.sys.OS_IOS) //调用苹果的方法;
        {
            jsb.reflection.callStaticMethod("AppController", "postEvent1:", event_name);
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) //调用安卓的方法;
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "postEvent1", "(Ljava/lang/String;)V", event_name);
        }
        else {

        }
    },

    /*埋点*/
    postEvent2: function (event_name, param1) {
        if (cc.sys.os === cc.sys.OS_IOS) //调用苹果的方法;
        {
            jsb.reflection.callStaticMethod("AppController", "postEvent2:param1:", event_name, `${param1}`);
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) //调用安卓的方法;
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "postEvent2", "(Ljava/lang/String;Ljava/lang/String;)V", event_name, `${param1}`);
        }
        else {

        }
    },

    /*埋点*/
    postEvent3: function (event_name, param1, param2) {
        if (cc.sys.os === cc.sys.OS_IOS) //调用苹果的方法;
        {
            jsb.reflection.callStaticMethod("AppController", "postEvent3:param1:param2", event_name, `${param1}`, `${param2}`);
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) //调用安卓的方法;
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "postEvent3", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", event_name, `${param1}`, `${param2}`);
        }
        else {

        }
    },

    /*语言*/
    language: function (callBack) {
        if (cc.sys.os === cc.sys.OS_IOS) {
            let code = jsb.reflection.callStaticMethod("AppController", "getSystemLanguage:", "");
            let arr = ["zh", "tw", "en"]; code = arr[parseInt(code)];
            if (code == "zh" || code == "tw" || code == "en") {
                callBack(code);
            }
            else {
                callBack("zh");
            }
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) {
            let code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Function", "getSystemLanguage", "()Ljava/lang/String;");
            if (code == "zh" || code == "tw" || code == "en") {
                callBack(code);
            }
            else {
                callBack("zh");
            }
        }
        else {
            callBack("zh");
        }
    },

    /*时间*/
    getSysTime: function (callBack) {
        if (cc.sys.os === cc.sys.OS_IOS) {
            let time = jsb.reflection.callStaticMethod("AppController", "getOCTime:", "");
            if (time == undefined || time == null) {
                time = (new Date()).getTime();
            }
            else {
                time = Number(time);
                if (time <= 0) {
                    time = (new Date()).getTime();
                }
            }
            callBack(time);
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) {
            let time = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Function", "getNetworkTime", "()Ljava/lang/String;");
            if (time == undefined || time == null) {
                time = (new Date()).getTime();
            }
            else {
                time = Number(time);
                if (time <= 0) {
                    time = (new Date()).getTime();
                }
            }
            callBack(time);
        }
        else {
            callBack((new Date()).getTime());
        }
    },

    /*实名认证 */
    antiAddict: function (userId) {
        if (cc.sys.os === cc.sys.OS_IOS) {
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "antiAddicting", "(Ljava/lang/String;)V", userId);
        }
        else {
        }
    },
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
    /*跳转网页*/
    postReview: function (url) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "openUrl",
                "(Ljava/lang/String;)V", url
            );
        }
    },

    /*个人因私*/
    privateReview:function()
    {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "openPrivacy",
                "(Ljava/lang/String;)V", ""
            );
        }
    },

    /*初始化广告*/
    initAds:function()
    {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("jsCallInitRewardedAd 222");
            
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "jsCallInitRewardedAd",
                "()V"
            );
        }
    },

    /**获取游戏类型 */
    getLogoType: function (callBack) {
        console.log("logo type=");

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            let type = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLogoType", "()I");
            if (type == undefined || type == null) {
                type = 0;
            }

            console.log("logo type=" + type);
            callBack(type);
            return;
        }
        callBack(0);
    },

    showPrivacy: function (callBack) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            let result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showPrivacy", "()I");
            if (result == undefined || result == null) {
                result = 0;
            }

            callBack(result);
            return;
        }
        callBack(0);
    }
}

//视频
window.videoFunCall = null;
window.videoEndTime = 0;
window.video_OcJs = function (code) {
    if (!window.videoFunCall) {
        return;
    }

    if (parseInt(code) === 0) {
        cc.Global.listenCenter.fire(cc.Global.eventConfig.InnerTips, {
            content: cc.Global.wordsConfig.extra["noAdv"],
            type: "fly"
        });
        return;
    }

    setTimeout(function () {
        let currentTime = (new Date()).getTime();
        if ((currentTime > window.videoEndTime) && (window.videoFunCall != null)) {
            window.videoFunCall(parseInt(code));
            Logic.getInstance().lord.watchAdv();
        }

        window.videoEndTime = 0;
        window.videoFunCall = null;
    }, 100);
};