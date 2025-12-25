module.exports = class ObjCreator {
    constructor() {
        this.waitCatch = {};
    }

    static instance = null;
    static getInstance() {
        if (ObjCreator.instance == null) {
            ObjCreator.instance = new ObjCreator();
        }
        return ObjCreator.instance;
    }

    //创建物体
    createObj(objInfo) {
        let createObj = function (err, prefab) {
            if (err != null) {
                objInfo.callBack(null);
                return;
            }

            let obj = cc.instantiate(prefab);
            initObj(obj, objInfo);
        }.bind(this);

        let initObj = function (obj, objInfo) {
            obj.objInfo = objInfo;
            obj.msg = objInfo.msg;

            if (objInfo.show == true) {
                this.showObj(obj, objInfo);
            }
            else {
                this.saveObj(obj, objInfo);
            }

            if (objInfo.callBack != null) {
                objInfo.callBack(obj);
            }
        }.bind(this);

        let objList = this.waitCatch[objInfo.name];
        if (objList == null || (objList != null && objList.length == 0)) {
            this.waitCatch[objInfo.name] = [];
            cc.Global.assertCenter.readLocalPrefab(objInfo.path, createObj.bind(this));
            return;
        }

        if (objList != null && objList.length > 0) {
            let obj = this.waitCatch[objInfo.name].pop();
            initObj(obj, objInfo);
            return;
        }
    }

    saveObj(obj, info) {
        if (this.waitCatch[info.name] == null) {
            this.waitCatch[info.name] = [];
        }

        obj.objInfo.parent = null;
        delete obj.objInfo;
        delete obj.msg;

        this.waitCatch[info.name].push(obj);
    }

    showObj(obj, info) {
        obj.parent = info.parent;
        obj.x = info.position.x;
        obj.y = info.position.y;
        obj.active = true;
    }

    destroyObj(objInfo) {
        let waitList = this.waitCatch[objInfo.name];
        if (waitList != null && waitList.length > 0) {
            for (let i = waitList.length - 1; i >= 0; i--) {
                waitList[i] = null;
            }
        }

        this.waitCatch[objInfo.name] = null;
    }

    clearAll() {
        for (const key in this.waitCatch) {
            let waitList = this.waitCatch[key];
            if (waitList != null && waitList.length > 0) {
                for (let i = waitList.length - 1; i >= 0; i--) {
                    waitList[i].parent = null;
                    waitList[i] = null;
                }
            }
            this.waitCatch[key] = null;
        }

        this.waitCatch = {};
    }
}