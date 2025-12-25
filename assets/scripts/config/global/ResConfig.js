module.exports = class ResConfig {
    constructor() {
        this.init();
    }

    static instance = null;
    static getInstance() {
        if (ResConfig.instance == null) {
            ResConfig.instance = new ResConfig();
        }

        return ResConfig.instance;
    }

    init() {
        this.root_scene = [];
        this.login_scene = [];
        this.main_scene = [];
    }
}