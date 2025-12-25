cc.Class({
    extends: cc.Component,

    /**
     * 检测是否需要修改.manifest文件 
     * @param {新的升级包地址} newAppHotUpdateUrl 
     * @param {本地project.manifest文件地址} localManifestPath 
     * @param {修改manifest文件后回调} resultCallback  
     */
    checkNeedModifyManifest(newAppHotUpdateUrl, localManifestPath, resultCallback) {
        if (!cc.sys.isNative) return;

        this.modifyAppLoadUrlForManifestFile(newAppHotUpdateUrl, localManifestPath, function (manifestPath) {
            resultCallback(manifestPath);
        });
    },

    /**
     * 修改.manifest文件
     * @param {新的升级包地址} newAppHotUpdateUrl 
     * @param {本地project.manifest文件地址} localManifestPath 
     * @param {修改manifest文件后回调} resultCallback 
     */
    modifyAppLoadUrlForManifestFile(newAppHotUpdateUrl, localManifestPath, resultCallback) {
        try {
            if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + 'remoteAssets/project.manifest')) {
                let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remoteAssets');
                let loadManifest = jsb.fileUtils.getStringFromFile(storagePath + '/project.manifest');
                let manifestObject = JSON.parse(loadManifest);
                manifestObject.packageUrl = newAppHotUpdateUrl;
                manifestObject.remoteManifestUrl = manifestObject.packageUrl + 'project.manifest';
                manifestObject.remoteVersionUrl = manifestObject.packageUrl + 'version.manifest';

                //更新数据库中的新请求地址，下次如果检测到不一致就重新修改 manifest 文件
                let afterString = JSON.stringify(manifestObject);
                let isWritten = jsb.fileUtils.writeStringToFile(afterString, storagePath + '/project.manifest');
                if (isWritten) {
                    resultCallback(storagePath + '/project.manifest');
                }
                else {
                    resultCallback(null)
                }
            } else {
                let initializedManifestPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remoteAssets');
                if (!jsb.fileUtils.isDirectoryExist(initializedManifestPath)) jsb.fileUtils.createDirectory(initializedManifestPath);
                let originManifestPath = localManifestPath;
                let originManifest = jsb.fileUtils.getStringFromFile(originManifestPath);
                let originManifestObject = JSON.parse(originManifest);
                originManifestObject.packageUrl = newAppHotUpdateUrl;
                originManifestObject.remoteManifestUrl = originManifestObject.packageUrl + 'project.manifest';
                originManifestObject.remoteVersionUrl = originManifestObject.packageUrl + 'version.manifest';

                let afterString = JSON.stringify(originManifestObject);
                let isWritten = jsb.fileUtils.writeStringToFile(afterString, initializedManifestPath + '/project.manifest');
                if (isWritten) {
                    resultCallback(initializedManifestPath + '/project.manifest');
                }
                else {
                    resultCallback(null)
                }
            }

        } catch (error) {
            
        }

    },

});
