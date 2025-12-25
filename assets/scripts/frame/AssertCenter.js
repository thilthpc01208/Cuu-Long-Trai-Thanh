class AssertCenter {
    constructor() {

    }

    static instance = null;
    static getInstance() {
        if (AssertCenter.instance == null) {
            AssertCenter.instance = new AssertCenter();
        }
        return AssertCenter.instance;
    }

    //打开某个界面
    openPage(pageConfig, show = false, callBack = null, msg = null) {
        pageConfig.show = show;
        pageConfig.msg = msg;
        
        pageConfig.callBack = function (page) {
            if (callBack != null) {
                callBack(page);
                delete page.pageInfo.callBack;
            }
        }.bind(this);

        cc.Global.pageCreator.createPage(pageConfig);
    }

    //读取音乐
    readLocalMusic(path, callBack) {
        cc.loader.loadRes("music/" + path, cc.AudioClip, (err, audioClip) => {
            if (err != null) {
                callBack(err, null);
                return;
            }

            this.setAutoReleaseRecursively(audioClip);
            callBack(null, audioClip);
        });
    }

    //替换精灵图片
    replaceSpriteFrame(node, path) {
        let sprite = node.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }

        let frame = sprite.spriteFrame;
        if (frame && frame.resPath) {
            frame.useCount--;
        }

        this.readLocalSpriteFrame(path, function (err, spriteFrame) {
            if (err != null) { return; }

            sprite.spriteFrame = spriteFrame;
            if (frame && frame.resPath == path) { return; }

            this.releaseLocalSpriteFrame(frame);
        }.bind(this));
    }

    //释放精灵图片
    releaseSpriteFrame(node) {
        let sprite = node.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }

        let frame = sprite.spriteFrame;
        if (!frame) {
            return;
        }

        if (frame.resPath) {
            frame.useCount--;
        }

        this.releaseLocalSpriteFrame(frame);
    }

    //读取纹理
    readLocalSpriteFrame(path, callBack) {
        cc.loader.loadRes("texture/" + path, cc.SpriteFrame, (err, spriteFrame) => {
            if (err != null) {
                callBack(err, null);
                return;
            }

            spriteFrame.resPath = path;
            if (!spriteFrame.useCount) {
                spriteFrame.useCount = 0;
            }
            spriteFrame.useCount++;

            callBack(null, spriteFrame);
        });
    }

    // 远程 url 带图片后缀名
    readUrlTexture(remoteUrl, callBack) {
        //let remoteUrl = "http://unknown.org/someres.png";
        cc.loader.load(remoteUrl, function (err, texture) {
            if (err != null) {
                callBack(err, null)
                return;
            }

            this.setAutoReleaseRecursively(texture);
            let spriteFrame = new cc.spriteFrame(texture);
            callBack(null, spriteFrame);
        });
    }

    //释放单个图片资源
    releaseLocalSpriteFrame(spriteFrame) {
        if (!spriteFrame) { return; }

        if (spriteFrame.resPath && spriteFrame.useCount <= 0) {
            spriteFrame.destroy();

            //let path = "texture/" + spriteFrame.resPath;
            //cc.loader.releaseRes(path, cc.SpriteFrame);
        }

        if (!spriteFrame.resPath) {
            //spriteFrame.destroy()
        }
    }

    //读取图集纹理
    readLocalAltas(path, spriteName, callBack) {
        cc.loader.loadRes("texture/" + path, cc.SpriteAtlas, function (err, atlas) {
            if (err != null) {
                callBack(err, null);
                return;
            }

            this.setAutoReleaseRecursively(atlas);
            let spriteFrame = atlas.getSpriteFrame(spriteName);
            callBack(null, spriteFrame)
        });
    }

    //加载 sheep.plist 图集中的所有 SpriteFrame
    readLocalPlist(path, spriteName, callBack) {
        cc.loader.loadResDir("texture/plist/" + path, cc.SpriteFrame, function (err, assets) {
            this.setAutoReleaseRecursively(assert);
            // assets 是一个 SpriteFrame 数组，已经包含了图集中的所有 SpriteFrame。
            // 而 loadRes('test assets/sheep', cc.SpriteAtlas, function (err, atlas) {...}) 获得的则是整个 SpriteAtlas 对象。
        });
    }

    //读取字体
    readLocalFont(path, callBack) {
        cc.loader.loadRes("fonts/" + path, cc.Font, (err, font) => {
            if (err != null) {
                callBack(err, null);
                return;
            }

            callBack(null, font);
        });
    }

    //读取动画
    readLocalSpin(path, callBack) {
        cc.loader.loadRes("spines/" + path + ".json", sp.SkeletonData, (err, spine) => {
            if (err != null) {
                callBack(err, null);
                return;
            }

            callBack(null, spine);
        });
    }

    //释放单个资源(图,音乐,文本.....)
    releaseLocalAssert(assert) {
        cc.loader.release(assert);
    }

    //读取预制体
    readLocalPrefab(path, callBack) {
        cc.loader.loadRes("prefabs/" + path, cc.Prefab, (err, prefab) => {
            if (err != null) {
                callBack(err, null);
                return;
            }

            this.setAutoReleaseRecursively(prefab);
            callBack(null, prefab);
        });
    }

    //释放预制体资源
    releaseLocalProfab(prefabPath) {
        // 释放一个 prefab 以及所有它依赖的资源
        let deps = cc.loader.getDependsRecursively(prefabPath);
        cc.loader.release(deps);
    }

    //加载文件夹资源
    loadFolder(path) {
        cc.loader.loadResDir(path, null, function (err, assets) {
            this.setAutoReleaseRecursively(assets);
        }.bind(this));
    }

    //释放文件夹资源
    releaseFolder(path) {
        cc.loader.releaseResDir(path);
    }

    //设置该资源及其资源递归引用到的所有资源自动释放
    setAutoReleaseRecursively(assert) {
        cc.loader.setAutoReleaseRecursively(assert);
    }

    //设置资源自动释放
    setAutoRelease(assert) {
        cc.loader.setAutoRelease(assert)
    }

    //强制gc
    cocosGC() {
        cc.sys.garbageCollect();
    }
}

module.exports = AssertCenter;