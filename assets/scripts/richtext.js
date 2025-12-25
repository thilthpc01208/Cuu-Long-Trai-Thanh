// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    BTN_XY1(){
        cc.Global.sdk.postReview("http://www2.quarkstudios.cn:10051/static/yinsibaohu-zlcz.html");
        //cc.sys.openURL("http://8.142.24.253:10051/static/yinsibaohu-zlcz.html")
    },
    BTN_XY2(){
        cc.Global.sdk.postReview("http://www2.quarkstudios.cn:10051/static/yonghufuwu-zlcz.html");
        //cc.sys.openURL("http://8.142.24.253:10051/static/yonghufuwu-zlcz.html")
    },

    // update (dt) {},
});
