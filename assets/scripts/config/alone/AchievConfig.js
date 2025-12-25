const handler = module.exports;

// 成就配置
handler.achivement = [
    { code: 'AT_LandPlantCount', target: [10, 50, 100, 500, 1000, 5000], award: [3, 6, 9, 12, 15, 18], descript: "种植作物#次" },
    { code: 'AT_OrchardPlantCount', target: [10, 50, 100, 500, 1000, 5000], award: [3, 6, 9, 12, 15, 18], descript: "种植果树#次" },
    { code: 'AT_PaddyPlantCount', target: [10, 50, 100, 500, 1000, 5000], award: [3, 6, 9, 12, 15, 18], descript: "种植水田#次" },
    { code: 'AT_LivestockAniCount', target: [10, 50, 100, 500, 1000, 5000], award: [3, 6, 9, 12, 15, 18], descript: "养殖家畜#次" },
    { code: 'AT_AquaticAniCount', target: [10, 50, 100, 500, 1000, 5000], award: [3, 6, 9, 12, 15, 18], descript: "养殖水产#次" },
    { code: 'AT_FactoryFoodCount', target: [10, 50, 100, 500, 1000, 5000], award: [3, 6, 9, 12, 15, 18], descript: "加工食物#次" },
    { code: 'AT_OutdoorHuntCount', target: [10, 50, 100, 500, 1000], award: [3, 6, 9, 12, 15], descript: "打猎#次" },
    { code: 'AT_OutdoorPickCount', target: [10, 50, 100, 500, 1000], award: [3, 6, 9, 12, 15], descript: "采摘#次" },
    { code: 'AT_OutdoorCatchCount', target: [10, 50, 100, 500, 1000], award: [3, 6, 9, 12, 15], descript: "捕鱼#次" },

    { code: 'AT_DepotDeliverCount', target: [10, 50, 100, 500, 1000], award: [3, 6, 9, 12, 15], descript: "货车送货#次" },
    { code: 'AT_HarbourDeliverCount', target: [10, 50, 100, 500, 1000], award: [3, 6, 9, 12, 15], descript: "货船送货#次" },
    { code: 'AT_StallCustomerCount', target: [10, 50, 100, 500, 1000, 5000, 10000], award: [3, 6, 9, 12, 15, 18, 21], descript: "货摊接待客人#次" },
    { code: 'AT_CanteenCustomerCount', target: [10, 50, 100, 500, 1000, 5000, 10000], award: [3, 6, 9, 12, 15, 18, 21], descript: "餐厅接待客人#次" },
    { code: 'AT_HotelCustomerCount', target: [10, 50, 100, 500, 1000, 5000, 10000], award: [3, 6, 9, 12, 15, 18, 21], descript: "宾馆接待客人#次" },
    { code: 'AT_FactoryCustomerCount', target: [10, 50, 100, 500, 1000, 5000, 10000], award: [3, 6, 9, 12, 15, 18, 21], descript: "作坊接待客人#次" },
    { code: 'AT_FactoryGetProfitCount', target: [10, 50, 100, 500, 1000, 5000, 10000], award: [3, 6, 9, 12, 15, 18, 21], descript: "作坊盈利收取#次" },
    { code: 'AT_RentGetProfitCount', target: [10, 50, 100, 500, 1000, 5000, 10000], award: [3, 6, 9, 12, 15, 18, 21], descript: "出租房盈利收取#次" }
];