const handler = module.exports;

handler.oneGemCutSecond = 60 * 3;       // 一个钻石减少时间

handler.depotOrderCreateCost = 1;       // 立即获取订单
handler.harbourGoodsReplaceCost = 2;    // 替换货船物品
handler.replaceBrunchTaskGem = 2;       // 替换一个支线任务

handler.oneDaySecond = 60;              // 游戏中虚拟的一天的秒数
handler.oneYearDay = 120;               // 游戏中虚拟的一年的天数
handler.oneSeasonDay = 30;              // 游戏中虚拟的一季的天数

handler.extendStallPrice = 20;          // 扩充货架价格
handler.rewardVideoScale = 3;           // 广告倍率

// 扩充厨房加工位置价格
handler.canteenSlotPrice = [
    0, 0, 0, 0, 0, 50, 100, 150, 200, 250
];

// 扩充作坊加工位置价格
handler.factorySlotPrice = [
    0, 0, 0, 20, 40, 60, 80, 100, 120, 140
];

// 不同交易类型的收入系数
handler.revenuRadio = {
    "store": 1,         // 仓库出售
    "depot": 5,         // 汽车订单
    "stall": 3,         // 货摊
    "canteen": 2,       // 餐厅
    "factory": 3,       // 作坊
    "shipSingle": 2,    // 货船单个物品
    "shipOrder": 3,     // 货船单个订单
    "shipAll": 4,       // 货船订单全部完成
};

// 签到奖励
handler.sign = [
    { cash: 0, gem: 3, material: {} },
    { cash: 0, gem: 6, material: {} },
    { cash: 0, gem: 9, material: {} },
    { cash: 0, gem: 12, material: {} },
    { cash: 0, gem: 15, material: {} },
    { cash: 0, gem: 18, material: {} },
    { cash: 0, gem: 21, material: { "mineral-shitou": 10, "mineral-mutou": 10, "mineral-niantu": 10 } },
];

// 最大单位数量
handler.maxStallCount = 6;            // 货摊数量
handler.maxDepotCount = 6;            // 货运站数量

handler.maxLandCount = 36;            // 耕地数量
handler.maxPaddyCount = 8;            // 水田数量
handler.maxBreedCount = 8;            // 养殖场数量
handler.maxOrchardCount = 18;         // 树木数量
handler.maxAquticCount = 4;           // 水产场数量

handler.bridAward = {
    "gem": 10,
    "mineral-shitou": 2,
    "mineral-mutou": 2,
    "mineral-niantu": 2,
};