module.exports = class ObjConfig {
    constructor() {
        this.objMap = {};
        this.init();
    }

    static instance = null;
    static getInstance() {
        if (ObjConfig.instance == null) {
            ObjConfig.instance = new ObjConfig();
        }

        return ObjConfig.instance;
    }

    init() {
        this.root_scene =
            [

            ];

        for (let index = 0, len = this.root_scene.length; index < len; index++) {
            let name = this.root_scene[index].name;
            this.objMap[name] = this.root_scene[index];
        }

        this.login_scene =
            [

            ];

        for (let index = 0, len = this.login_scene.length; index < len; index++) {
            let name = this.login_scene[index].name;
            this.objMap[name] = this.login_scene[index];
        }

        this.main_scene =
            [
                //{ name: "hole", path: "chara/hole", parent: null, show: false, unlockLevel: 0 },
            ];

        for (let index = 0, len = this.main_scene.length; index < len; index++) {
            let name = this.main_scene[index].name;
            this.objMap[name] = this.main_scene[index];
        }
    }

    findObjInfo(objName) {
        let msg = this.objMap[objName];
        return JSON.parse(JSON.stringify(msg));
    }
}