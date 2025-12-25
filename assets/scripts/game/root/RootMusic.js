cc.Class({
    extends: cc.Component,

    properties: {

    },

    start() {
        this.musicId = null;
    },

    onEnable() {
        cc.Global.listenCenter.register(cc.Global.eventConfig.PlayMusic, this.playMusic, this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.PlayEffect, this.playEffect, this);

        cc.Global.listenCenter.register(cc.Global.eventConfig.MusicStateChange, this.musicStateChange, this);
        cc.Global.listenCenter.register(cc.Global.eventConfig.EffectStateChange, this.effectStateChange, this);

        this.musicState = cc.sys.localStorage.getItem("musicState");
        if (this.musicState == null) {
            this.musicState = true;
            cc.sys.localStorage.setItem("musicState", this.musicState);
        }
        else {
            this.musicState = this.musicState == "true" ? true : false;
        }
        this.musicStateChange(this.musicState);

        this.effectState = cc.sys.localStorage.getItem("effectState");
        if (this.effectState == null) {
            this.effectState = true;
            cc.sys.localStorage.setItem("effectState", this.effectState);
        }
        else {
            this.effectState = this.effectState == "true" ? true : false;
        }
        this.effectStateChange(this.effectState);
    },

    //改变音乐状态
    musicStateChange(state) {
        if (state == false) {
            cc.audioEngine.setMusicVolume(0);
        }
        else {
            cc.audioEngine.setMusicVolume(1);
        }
        this.musicState = state;
        cc.sys.localStorage.setItem("musicState", this.musicState);
    },

    //改变音效状态
    effectStateChange(state) {
        if (state == false) {
            cc.audioEngine.setEffectsVolume(0);
        }
        else {
            cc.audioEngine.setEffectsVolume(1);
        }
        this.effectState = state;
        cc.sys.localStorage.setItem("effectState", this.effectState);
    },

    //播放音乐
    playMusic(name) {
        cc.Global.assertCenter.readLocalMusic(name, function (err, audioClip) {
            if (this.musicId != null) {
                cc.audioEngine.stop(this.musicId);
            }
            this.musicId = cc.audioEngine.playMusic(audioClip, true);
        }.bind(this));
    },

    //播放音效
    playEffect(name) {
        cc.Global.assertCenter.readLocalMusic(name, function (err, audioClip) {
            if (err != null) { return; }
            cc.audioEngine.playEffect(audioClip, false);
        });
    },

    onDestroy() {
        cc.Global.listenCenter.remove(cc.Global.eventConfig.PlayMusic, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.PlayEffect, this);

        cc.Global.listenCenter.remove(cc.Global.eventConfig.MusicStateChange, this);
        cc.Global.listenCenter.remove(cc.Global.eventConfig.EffectStateChange, this);
    },
});
