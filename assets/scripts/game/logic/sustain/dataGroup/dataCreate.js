const achiveConfig = require("../../../../config/alone/AchievConfig");
const normalConfig = require("../../../../config/alone/NormConfig");
const buildConfig = require("../../../../config/alone/BuildsConfig");

const handler = module.exports;

// 主房
handler.create_lord_data = function (account, logic) {
    let lord = { account: account, cash: 30000, gem: 50, level: 0, floor: 1, route: 0, adv: 0, dayPass: 1, gameGuide: false };

    lord.ground = [1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    lord.wall = [1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    lord.garden = [1, -1, -1, -1, -1, -1];

    lord.orchardTools = { endTime: 0 };
    lord.landTools = { endTime: 0 };
    lord.paddyTools = { endTime: 0 };

    return lord;
};

// 签到
handler.create_sign_data = function (account, logic) {
    let sign = {
        state: [0, -1, -1, -1, -1, -1, -1],
        time: logic.getSysTime(),
        continue: 0,
    };

    return sign;
};

// 成就
handler.create_achive_data = function (account, logic) {
    let achive = [];

    let achivesInfo = achiveConfig.achivement;
    for (let index = 0, len = achivesInfo.length; index < len; index++) {
        let info = {
            id: achivesInfo[index].id,
            code: achivesInfo[index].code,
            index: 0,
            current: 0,
            target: achivesInfo[index].target[0],
            award: achivesInfo[index].award[0],
            done: false,
            draw: true,
            descript: achivesInfo[index].descript
        };

        info.descript = info.descript.replace("#", info.target);
        achive.push(info);
    }

    return achive;
};

// 任务
handler.create_task_data = function (account, logic) {
    let task = {
        dayBigAwardState: false,
        dayBigAwardDraw: true,
        currentCanSelectTask: "main",
        mainTask: null,
        dayTask: [],
        brunchTask: {
            "code": "BT_FactoryOneFoodCount",
            "goods": "noddle-miantiao",
            "target": 2,
            "current": 0,
            "award": { "cash": 1000, "gem": 3, "material": { "mineral-shitou": 3, "mineral-mutou": 3, "mineral-niantu": 3 } },
            "done": false,
            "draw": true,
            "descript": "加工面条2把"
        },
        brunchDoneNum: 0,
    };
    return task;
};

// 出租屋
handler.create_rental_data = function (account, logic) {
    let rental = [];

    for (let index = 0; index < 12; index++) {
        let item = { open: false, profit: 0, level: 0, endTime: 0, accrualNum: 0 };
        rental.push(item);
    }

    rental[0].open = true;
    rental[1].open = true;

    return rental;
};

// 仓库
handler.create_store_data = function (account, logic) {
    let store = { shelves: {} };
    for (const key in buildConfig.storeClass) {
        store.shelves[key] = {
            "descript": buildConfig.storeClass[key],
            "list": {},
            "total": 0
        }
    }

    store.level = 0;
    store.totalNum = 0;
    store.maxNum = buildConfig.store[0].capacity;
    store.extraGrid = 0;
    store.init = false;

    return store;
};

// 货摊
handler.create_stall_data = function (account, logic) {
    let stall = {
        store: [{}, {}, {}, {}, {}],
        level: -1, profit: 0
    };
    return stall;
};

// 货运站
handler.create_depot_data = function (account, logic) {
    let depot = {
        level: 0,
        truck: { level: 0, state: 0, endTime: 0, goodsNum: 0, profit: 0, material: {} },
        orders: [
            { "state": 1, "endTime": 0, "items": { "land-xiaomai": 5 } },
            { "state": 1, "endTime": 0, "items": {"land-yumi":2, "land-xiaomai": 1, "land-dadou": 2} },
            { "state": 1, "endTime": 0, "items": {"land-hongshu":2, "land-yumi": 2, "land-lajiao": 1 } },
            { "state": 1, "endTime": 0, "items": {"land-hongshu":2} },
            { "state": 1, "endTime": 0, "items": {"land-tudou":1, "land-gaoliang": 2, "land-lajiao": 1 } }
        ]
    };
    return depot;
};

// 港口
handler.create_harbour_data = function (account, logic) {
    let harbour = {
        level: 0, ship: { state: 0, endTime: 0 }, orders: [], complete: -1,
        award: { has: false, draw: false, gem: 0, cash: 0, material: {} }
    };
    return harbour;
};

// 宾馆
handler.create_hotel_data = function (account, logic) {
    let hotel = { level: -1, persons: [], profit: 0 };
    return hotel;
};

// 外出
handler.create_outdoor_data = function (account, logic) {
    let outdoor = [];

    let outdoorTypes = ["hunt", "pick", "catch"];
    let outdoorLen = outdoorTypes.length;
    for (let index = 0; index < outdoorLen; index++) {
        let item = {
            type: outdoorTypes[index],
            state: 0,
            endTime: 0,
            take: {}
        };

        if (item.type === "catch") {
            item.catch = [1, -1, -1, -1, -1, -1];
        }

        outdoor.push(item);
    }

    return outdoor;
}

// 种植
handler.create_land_data = function (account, logic) {
    let land = [];
    for (let index = 0, len = normalConfig.maxLandCount; index < len; index++) {
        let field = {
            "index": index, "state": -1, "plant": "",
            "num": 0,
            "useTool": false,
            "endTime": 0
        };
        land.push(field);
        if (index < 3) { field.state = 0; }
    }

    land[0].plant = "land-xiaomai";
    land[0].state = 2;
    land[0].num = 1;

    return land;
};

// 水田
handler.create_paddy_data = function (account, logic) {
    let paddy = [];
    for (let index = 0, len = normalConfig.maxPaddyCount; index < len; index++) {
        let field = {
            "index": index, "state": -1, "plant": "",
            "num": 0,
            "useTool": false,
            "endTime": 0
        };
        paddy.push(field);
    }

    return paddy;
};

// 果园
handler.create_orchard_data = function (account, logic) {
    let orchard = [];
    for (let index = 0, len = normalConfig.maxOrchardCount; index < len; index++) {
        let block = {
            "index": index,
            "state": -1,
            "plant": "",
            "num": 0,
            "useTool": false,
            "endTime": 0
        };
        orchard.push(block);
    }

    return orchard;
};

// 养殖
handler.create_livestock_data = function (account, logic) {
    let livestock = [];
    for (let index = 0, len = normalConfig.maxBreedCount; index < len; index++) {
        let block = {
            "index": index,
            "state": -1,
            "animal": buildConfig.livestock[index].product,
            "grid": 2,
            "num": 2,
            "endTime": 0
        };
        livestock.push(block);
    }

    return livestock;
};

// 水产
handler.create_aquatic_data = function (account, logic) {
    let aquatic = [];

    for (let index = 0, len = normalConfig.maxAquticCount; index < len; index++) {
        let block = {
            "index": index,
            "state": -1,
            "aquatic": "",
            "grid": 2,
            "num": 2,
            "endTime": 0
        };
        aquatic.push(block);
    }

    return aquatic;
};

// 打猎
handler.create_hunt_data = function (account, logic) {
    let hunt = { state: 0, endTime: 0, take: {} };
    return hunt;
};

// 采摘
handler.create_pick_data = function (account, logic) {
    let pick = { state: 0, endTime: 0, take: {} };
    return pick;
};

// 捕鱼
handler.create_catch_data = function (account, logic) {
    let catchs = { state: 0, endTime: 0, take: {} };
    return catchs;
};

// 餐厅
handler.create_canteen_data = function (account, logic) {
    let canteen = { level: -1, stove: [], store: {}, profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0,
            "endTime": 0, "index": index
        };
        canteen.stove.push(item);
        if (index <= 4) { item.state = 0; }
    }

    canteen.desk = [1, -1, -1, -1, -1, -1];

    return canteen;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 面食
handler.create_noddle_data = function (account, logic) {
    let noddle = { level: 0, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        noddle.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return noddle;
};

// 豆制品
handler.create_tofu_data = function (account, logic) {
    let tofu = { level: 0, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        tofu.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return tofu;
};

// 调料店
handler.create_condiment_data = function (account, logic) {
    let condiment = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        condiment.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return condiment;
};

// 酒馆
handler.create_tavern_data = function (account, logic) {
    let tavern = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        tavern.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return tavern;
};

// 糖果
handler.create_candy_data = function (account, logic) {
    let candy = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        candy.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return candy;
};

// 奶制品
handler.create_milk_data = function (account, logic) {
    let milk = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        milk.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return milk;
};

// 奶制品
handler.create_stewedmeat_data = function (account, logic) {
    let stewedmeat = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        stewedmeat.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return stewedmeat;
};

// 茶
handler.create_tea_data = function (account, logic) {
    let tea = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        tea.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return tea;
};

// 蛋糕
handler.create_cake_data = function (account, logic) {
    let cake = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        cake.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return cake;
};

// 果制品
handler.create_candiedfruit_data = function (account, logic) {
    let candiedfruit = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        candiedfruit.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return candiedfruit;
};

// 野味
handler.create_bushmeat_data = function (account, logic) {
    let bushmeat = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        bushmeat.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return bushmeat;
};

// 海鲜
handler.create_seafood_data = function (account, logic) {
    let seafood = { level: -1, store: {}, save: "remote", capacity: 50, stove: [], profit: 0 };

    for (let index = 0; index < 10; index++) {
        let item = {
            "state": -1, "id": "", "num": 0, "endTime": 0,
            "run": false, "index": index
        };
        seafood.stove.push(item);
        if (index <= 2) { item.state = 0; }
    }

    return seafood;
};