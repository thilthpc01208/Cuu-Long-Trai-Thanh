const buildsConfig = require("../alone/BuildsConfig");
const normalConfig = require("../alone/NormConfig");

const handler = module.exports;

const makeRoom = ["canteen", "noddle", "tofu", "condiment", "tavern", "candy", "milk", "stewedmeat", "tea", "cake", "candiedfruit", "bushmeat", "seafood"];
const outdoor = ["hunt", "pick", "catch"];

handler.entityType = ["mineral", "land", "paddy", "orchard", "livestock", "aquatic", "hunt", "pick", "catch", "canteen", "noddle", "tofu", "condiment", "tavern", "candy", "milk", "stewedmeat", "tea", "cake", "candiedfruit", "bushmeat", "seafood"];
handler.entityHash = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//农作物
handler.land = {
    "land-xiaomai": { "name": "小麦", "descript": "", "price": 2, "harvest_cycle": 30, "unlock": 0 },
    "land-yumi": { "name": "玉米", "descript": "", "price": 3, "harvest_cycle": 30, "unlock": 0 },
    "land-dadou": { "name": "大豆", "descript": "", "price": 6, "harvest_cycle": 30, "unlock": 0 },
    "land-tudou": { "name": "土豆", "descript": "", "price": 7, "harvest_cycle": 30, "unlock": 0 },
    "land-hongshu": { "name": "红薯", "descript": "", "price": 6, "harvest_cycle": 45, "unlock": 0 },
    "land-gaoliang": { "name": "高粱", "descript": "", "price": 9, "harvest_cycle": 45, "unlock": 0 },
    "land-ganzhe": { "name": "甘蔗", "descript": "", "price": 9, "harvest_cycle": 45, "unlock": 0 },
    "land-lajiao": { "name": "辣椒", "descript": "", "price": 12, "harvest_cycle": 45, "unlock": 0 },
    "land-nangua": { "name": "南瓜", "descript": "", "price": 6, "harvest_cycle": 60, "unlock": 0 },
    "land-donggua": { "name": "冬瓜", "descript": "", "price": 9, "harvest_cycle": 60, "unlock": 0 },
    "land-chaye": { "name": "茶叶", "descript": "", "price": 24, "harvest_cycle": 60, "unlock": 0 },
    "land-xihongshi": { "name": "西红柿", "descript": "", "price": 8, "harvest_cycle": 60, "unlock": 0 },
    "land-dacong": { "name": "大葱", "descript": "", "price": 12, "harvest_cycle": 75, "unlock": 0 },
    "land-shengjiang": { "name": "生姜", "descript": "", "price": 18, "harvest_cycle": 75, "unlock": 0 },
    "land-zhima": { "name": "芝麻", "descript": "", "price": 24, "harvest_cycle": 75, "unlock": 0 },
    "land-huanggua": { "name": "黄瓜", "descript": "", "price": 12, "harvest_cycle": 90, "unlock": 0 },
    "land-qingcai": { "name": "青菜", "descript": "", "price": 6, "harvest_cycle": 90, "unlock": 0 },
    "land-lvdou": { "name": "绿豆", "descript": "", "price": 14, "harvest_cycle": 90, "unlock": 0 },
    "land-baicai": { "name": "白菜", "descript": "", "price": 8, "harvest_cycle": 120, "unlock": 0 },
    "land-huluobo": { "name": "胡萝卜", "descript": "", "price": 6, "harvest_cycle": 120, "unlock": 0 },
    "land-bailuobo": { "name": "白萝卜", "descript": "", "price": 6, "harvest_cycle": 120, "unlock": 0 }
};

//水上作物
handler.paddy = {
    "paddy-shuidao": { "name": "水稻", "descript": "", "price": 16, "harvest_cycle": 120, "unlock": 0 },
    "paddy-lianou": { "name": "莲藕", "descript": "", "price": 20, "harvest_cycle": 180, "unlock": 0 },
    "paddy-nuomi": { "name": "糯米", "descript": "", "price": 24, "harvest_cycle": 240, "unlock": 0 },
    "paddy-haidai": { "name": "海带", "descript": "", "price": 28, "harvest_cycle": 300, "unlock": 0 },
    "paddy-zicai": { "name": "紫菜", "descript": "", "price": 32, "harvest_cycle": 360, "unlock": 0 }
};

//果树
handler.orchard = {
    "orchard-pingguo": { "name": "苹果", "descript": "", "price": 20, "harvest_cycle": 180, "unlock": 0 },
    "orchard-xingzi": { "name": "杏", "descript": "", "price": 20, "harvest_cycle": 180, "unlock": 0 },
    "orchard-shanzha": { "name": "山楂", "descript": "", "price": 24, "harvest_cycle": 240, "unlock": 0 },
    "orchard-li": { "name": "梨", "descript": "", "price": 28, "harvest_cycle": 240, "unlock": 0 },
    "orchard-shiliu": { "name": "石榴", "descript": "", "price": 26, "harvest_cycle": 300, "unlock": 0 },
    "orchard-taozi": { "name": "桃子", "descript": "", "price": 21, "harvest_cycle": 300, "unlock": 0 },
    "orchard-yingtao": { "name": "樱桃", "descript": "", "price": 28, "harvest_cycle": 360, "unlock": 0 },
    "orchard-lizi": { "name": "李子", "descript": "", "price": 26, "harvest_cycle": 360, "unlock": 0 },
    "orchard-hetao": { "name": "核桃", "descript": "", "price": 26, "harvest_cycle": 480, "unlock": 0 },
    "orchard-juzi": { "name": "橘子", "descript": "", "price": 24, "harvest_cycle": 480, "unlock": 0 },
    "orchard-zao": { "name": "枣", "descript": "", "price": 28, "harvest_cycle": 600, "unlock": 0 },
    "orchard-shizi": { "name": "柿子", "descript": "", "price": 18, "harvest_cycle": 600, "unlock": 0 },
    "orchard-liizi": { "name": "栗子", "descript": "", "price": 21, "harvest_cycle": 600, "unlock": 0 },
    "orchard-putao": { "name": "葡萄", "descript": "", "price": 26, "harvest_cycle": 600, "unlock": 0 }
};

//养殖
handler.livestock = {
    "livestock-zhu": { "name": "猪肉", "descript": "", "price": 18, "index": 0, "harvest_cycle": 240, "unlock": 6 },
    "livestock-nainiu": { "name": "牛奶", "descript": "", "price": 24, "index": 1, "harvest_cycle": 300, "unlock": 8 },
    "livestock-yang": { "name": "羊肉", "descript": "", "price": 28, "index": 2, "harvest_cycle": 360, "unlock": 10 },
    "livestock-muji": { "name": "鸡蛋", "descript": "", "price": 20, "index": 3, "harvest_cycle": 420, "unlock": 12 },
    "livestock-rouniu": { "name": "牛肉", "descript": "", "price": 28, "index": 4, "harvest_cycle": 480, "unlock": 14 },
    "livestock-gongji": { "name": "鸡肉", "descript": "", "price": 24, "index": 5, "harvest_cycle": 540, "unlock": 16 },
    "livestock-ya": { "name": "鸭肉", "descript": "", "price": 32, "index": 6, "harvest_cycle": 600, "unlock": 18 },
    "livestock-e": { "name": "鹅肉", "descript": "", "price": 36, "index": 7, "harvest_cycle": 660, "unlock": 20 }
};

//水产
handler.aquatic = {
    "aquatic-liyu": { "name": "鲤鱼", "descript": "", "price": 36, "harvest_cycle": 300, "unlock": 0 },
    "aquatic-dazhaxie": { "name": "大闸蟹", "descript": "", "price": 42, "harvest_cycle": 360, "unlock": 0 },
    "aquatic-duixia": { "name": "对虾", "descript": "", "price": 36, "harvest_cycle": 480, "unlock": 0 },
    "aquatic-geli": { "name": "蛤蜊", "descript": "", "price": 54, "harvest_cycle": 600, "unlock": 0 }
};

//打猎
handler.hunt = {
    "hunt-xiong": { "name": "熊", "descript": "", "price": 32, "unlock": 0 },
    "hunt-lu": { "name": "鹿", "descript": "", "price": 36, "unlock": 0 },
    "hunt-yezhu": { "name": "野猪", "descript": "", "price": 40, "unlock": 0 },
    "hunt-yetu": { "name": "野兔", "descript": "", "price": 38, "unlock": 0 },
    "hunt-yeji": { "name": "野鸡", "descript": "", "price": 32, "unlock": 0 },
    "hunt-she": { "name": "蛇", "descript": "", "price": 56, "unlock": 0 },
    "hunt-jiayu": { "name": "甲鱼", "descript": "", "price": 64, "unlock": 0 }
};

//采摘
handler.pick = {
    "pick-caoyao": { "name": "草药", "descript": "", "price": 32, "unlock": 0 },
    "pick-zhusun": { "name": "竹笋", "descript": "", "price": 24, "unlock": 0 },
    "pick-yanwo": { "name": "燕窝", "descript": "", "price": 36, "unlock": 0 },
    "pick-yinger": { "name": "银耳", "descript": "", "price": 26, "unlock": 0 },
    "pick-chongcao": { "name": "虫草", "descript": "", "price": 44, "unlock": 0 },
    "pick-renshen": { "name": "人参", "descript": "", "price": 64, "unlock": 0 },
    "pick-xianggu": { "name": "香菇", "descript": "", "price": 56, "unlock": 0 },
    "pick-mogu": { "name": "蘑菇", "descript": "", "price": 24, "unlock": 0 },
    "pick-muer": { "name": "木耳", "descript": "", "price": 26, "unlock": 0 },
    "pick-songrong": { "name": "松茸", "descript": "", "price": 48, "unlock": 0 },
    "pick-songlu": { "name": "松露", "descript": "", "price": 56, "unlock": 0 },
    "pick-fengmi": { "name": "蜂蜜", "descript": "", "price": 20, "unlock": 0 }
};

//捕鱼
handler.catch = {
    "catch-longxia": { "name": "龙虾", "descript": "", "price": 32, "unlock": 0 },
    "catch-jingqiangyu": { "name": "金枪鱼", "descript": "", "price": 28, "unlock": 0 },
    "catch-daiyu": { "name": "带鱼", "descript": "", "price": 24, "unlock": 0 },
    "catch-manyu": { "name": "鳗鱼", "descript": "", "price": 26, "unlock": 0 },
    "catch-xueyu": { "name": "鳕鱼", "descript": "", "price": 28, "unlock": 0 },
    "catch-youyu": { "name": "鱿鱼", "descript": "", "price": 32, "unlock": 0 },
    "catch-haishen": { "name": "海参", "descript": "", "price": 38, "unlock": 0 }
};

/**
 * 采矿
 */
handler.mineral = {
    "mineral-shitou": { "unlock": 0, "name": "石头", "descript": "", "price": 10 },
    "mineral-mutou": { "unlock": 0, "name": "木头", "descript": "", "price": 20 },
    "mineral-niantu": { "unlock": 0, "name": "黏土", "descript": "", "price": 30 }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1.餐厅
handler.canteen = {
    "canteen-jiaozi": { "canteen": 0, "make_time": 30, "name": "饺子", "type": "main", "descript": "", "recipe": { "land-xiaomai": 2, "livestock-zhu": 1, "land-baicai": 1 }, "unlock": 9 },
    "canteen-hundun": { "canteen": 1, "make_time": 30, "name": "混沌", "type": "main", "descript": "", "recipe": { "land-xiaomai": 2, "livestock-zhu": 1 }, "unlock": 10 },
    "canteen-chunjuan": { "canteen": 2, "make_time": 30, "name": "春卷", "type": "main", "descript": "", "recipe": { "land-xiaomai": 2, "land-baicai": 1, "condiment-douyou": 1 }, "unlock": 11 },
    "canteen-suantangmian": { "canteen": 3, "make_time": 30, "name": "酸汤面", "type": "main", "descript": "", "recipe": { "noddle-miantiao": 2, "condiment-cu": 1, "land-qingcai": 1 }, "unlock": 12 },
    "canteen-zhajiangmian": { "canteen": 4, "make_time": 30, "name": "炸酱面", "type": "main", "descript": "", "recipe": { "noddle-miantiao": 2, "condiment-huangdoujiang": 1, "land-qingcai": 1 }, "unlock": 13 },
    "canteen-niuroumian": { "canteen": 5, "make_time": 30, "name": "牛肉面", "type": "main", "descript": "", "recipe": { "livestock-rouniu": 1, "condiment-jiangyou": 1, "noddle-miantiao": 2 }, "unlock": 14 },
    "canteen-danchaomian": { "canteen": 6, "make_time": 30, "name": "蛋炒面", "type": "main", "descript": "", "recipe": { "noddle-miantiao": 2, "livestock-muji": 1, "land-huluobo": 1 }, "unlock": 15 },
    "canteen-rousimian": { "canteen": 7, "make_time": 30, "name": "肉丝面", "type": "main", "descript": "", "recipe": { "noddle-miantiao": 2, "land-lajiao": 1, "livestock-rouniu": 1 }, "unlock": 16 },
    "canteen-danchaofan": { "canteen": 8, "make_time": 30, "name": "蛋炒饭", "type": "main", "descript": "", "recipe": { "paddy-shuidao": 2, "livestock-muji": 1, "land-lajiao": 1 }, "unlock": 17 },
    "canteen-paocaichaofan": { "canteen": 9, "make_time": 30, "name": "泡菜炒饭", "type": "main", "descript": "", "recipe": { "paddy-shuidao": 2, "condiment-paocai": 1, "livestock-muji": 1 }, "unlock": 18 },
    "canteen-yangzhouchaofan": { "canteen": 10, "make_time": 30, "name": "扬州炒饭", "type": "main", "descript": "", "recipe": { "paddy-shuidao": 2, "livestock-muji": 1, "stewedmeat-huotui": 1, "aquatic-duixia": 1 }, "unlock": 19 },
    "canteen-huangmenjimifan": { "canteen": 11, "make_time": 30, "name": "黄焖鸡米饭", "type": "main", "descript": "", "recipe": { "paddy-shuidao": 2, "livestock-gongji": 1, "land-lajiao": 1, "land-tudou": 1 }, "unlock": 20 },
    "canteen-tianfan": { "canteen": 12, "make_time": 30, "name": "甜饭", "type": "main", "descript": "", "recipe": { "paddy-nuomi": 2, "candy-bingtang": 1, "candiedfruit-mizao": 1 }, "unlock": 21 },
    "canteen-pidanshourouzhou": { "canteen": 13, "make_time": 30, "name": "皮蛋瘦肉粥", "type": "main", "descript": "", "recipe": { "paddy-shuidao": 2, "stewedmeat-pidan": 1, "land-shengjiang": 1 }, "unlock": 22 },
    "canteen-babaozhou": { "canteen": 14, "make_time": 30, "name": "八宝粥", "type": "main", "descript": "", "recipe": { "paddy-nuomi": 2, "orchard-hetao": 1, "candiedfruit-putaogan": 1, "orchard-zao": 1 }, "unlock": 23 },

    "canteen-hongshaofuzhu": { "canteen": 0, "make_time": 30, "name": "红烧腐竹", "type": "hot", "descript": "", "recipe": { "tofu-fuzhu": 2, "condiment-jiangyou": 1 }, "unlock": 9 },
    "canteen-suanlatudousi": { "canteen": 1, "make_time": 30, "name": "酸辣土豆丝", "type": "hot", "descript": "", "recipe": { "land-tudou": 2, "condiment-cu": 1 }, "unlock": 10 },
    "canteen-xihongshichaodan": { "canteen": 2, "make_time": 30, "name": "西红柿炒蛋", "type": "hot", "descript": "", "recipe": { "land-xihongshi": 2, "livestock-muji": 1 }, "unlock": 11 },
    "canteen-mapodoufu": { "canteen": 3, "make_time": 30, "name": "麻婆豆腐", "type": "hot", "descript": "", "recipe": { "tofu-doufu": 2, "condiment-douchi": 1, "land-lajiao": 1 }, "unlock": 12 },
    "canteen-qingjiaochaorou": { "canteen": 4, "make_time": 30, "name": "青椒炒肉", "type": "hot", "descript": "", "recipe": { "livestock-zhu": 2, "land-lajiao": 1 }, "unlock": 13 },
    "canteen-tangcuyu": { "canteen": 5, "make_time": 30, "name": "糖醋鱼", "type": "hot", "descript": "", "recipe": { "aquatic-liyu": 2, "condiment-fanqiejiang": 1 }, "unlock": 14 },
    "canteen-tudoushaoniurou": { "canteen": 6, "make_time": 30, "name": "土豆烧牛肉", "type": "hot", "descript": "", "recipe": { "land-tudou": 2, "livestock-rouniu": 1, "condiment-jiangyou": 1 }, "unlock": 15 },
    "canteen-qingcaimogu": { "canteen": 7, "make_time": 30, "name": "青菜蘑菇", "type": "hot", "descript": "", "recipe": { "land-qingcai": 2, "pick-mogu": 1 }, "unlock": 16 },
    "canteen-sanxianhuicai": { "canteen": 8, "make_time": 30, "name": "三鲜烩菜", "type": "hot", "descript": "", "recipe": { "tofu-fuzhu": 1, "stewedmeat-wanzi": 1, "land-baicai": 1, "tofu-doufu": 1 }, "unlock": 17 },
    "canteen-guangshishaoe": { "canteen": 9, "make_time": 30, "name": "广式烧鹅", "type": "hot", "descript": "", "recipe": { "livestock-e": 1, "condiment-chashaojiang": 1 }, "unlock": 18 },
    "canteen-nanguazhong": { "canteen": 10, "make_time": 30, "name": "南瓜盅", "type": "hot", "descript": "", "recipe": { "land-nangua": 1, "stewedmeat-huotui": 1, "pick-xianggu": 1 }, "unlock": 19 },
    "canteen-dongguamenya": { "canteen": 11, "make_time": 30, "name": "冬瓜焖鸭", "type": "hot", "descript": "", "recipe": { "livestock-ya": 1, "land-donggua": 1 }, "unlock": 20 },
    "canteen-zhusunchaolarou": { "canteen": 12, "make_time": 30, "name": "竹笋炒腊肉", "type": "hot", "descript": "", "recipe": { "stewedmeat-larou": 1, "pick-zhusun": 1, "land-shengjiang": 1 }, "unlock": 21 },
    "canteen-hongshaosherou": { "canteen": 13, "make_time": 30, "name": "红烧蛇肉", "type": "hot", "descript": "", "recipe": { "bushmeat-sherou": 1, "land-lajiao": 1, "land-shengjiang": 1 }, "unlock": 22 },
    "canteen-hongshaoxiongzhang": { "canteen": 14, "make_time": 30, "name": "红烧熊掌", "type": "hot", "descript": "", "recipe": { "bushmeat-xiongzhang": 1, "pick-xianggu": 1, "pick-zhusun": 1 }, "unlock": 23 },

    "canteen-liangbansansi": { "canteen": 0, "make_time": 30, "name": "凉拌三丝", "type": "cool", "descript": "", "recipe": { "tofu-douya": 2, "land-huanggua": 1, "land-huluobo": 1 }, "unlock": 9 },
    "canteen-qiangliancai": { "canteen": 1, "make_time": 30, "name": "炝莲菜", "type": "cool", "descript": "", "recipe": { "paddy-lianou": 2, "land-shengjiang": 1 }, "unlock": 10 },
    "canteen-xiaocongbandoufu": { "canteen": 3, "make_time": 30, "name": "小葱拌豆腐", "type": "cool", "descript": "", "recipe": { "tofu-doufu": 2, "land-dacong": 1 }, "unlock": 11 },
    "canteen-jianjiaopidan": { "canteen": 4, "make_time": 30, "name": "尖椒皮蛋", "type": "cool", "descript": "", "recipe": { "stewedmeat-pidan": 2, "land-lajiao": 1 }, "unlock": 12 },
    "canteen-liangbandoupi": { "canteen": 5, "make_time": 30, "name": "凉拌豆皮", "type": "cool", "descript": "", "recipe": { "tofu-doufupi": 2, "land-huanggua": 1, "land-lajiao": 1 }, "unlock": 13 },
    "canteen-liangbansuji": { "canteen": 6, "make_time": 30, "name": "凉拌素鸡", "type": "cool", "descript": "", "recipe": { "tofu-suji": 1, "land-dacong": 1, "land-lajiao": 1 }, "unlock": 14 },
    "canteen-majiangliangpi": { "canteen": 7, "make_time": 30, "name": "麻酱凉皮", "type": "cool", "descript": "", "recipe": { "noddle-liangpi": 2, "condiment-zhimajiang": 1, "land-huanggua": 1 }, "unlock": 15 },
    "canteen-liangbanhaidai": { "canteen": 8, "make_time": 30, "name": "凉拌海带", "type": "cool", "descript": "", "recipe": { "paddy-haidai": 2, "condiment-cu": 1, "land-lajiao": 1 }, "unlock": 16 },
    "canteen-liangbanshuanger": { "canteen": 9, "make_time": 30, "name": "凉拌双耳", "type": "cool", "descript": "", "recipe": { "pick-muer": 1, "pick-yinger": 1 }, "unlock": 17 },
    "canteen-yanshuiya": { "canteen": 10, "make_time": 30, "name": "盐水鸭", "type": "cool", "descript": "", "recipe": { "livestock-ya": 1, "land-dacong": 1, "land-shengjiang": 1 }, "unlock": 18 },
    "canteen-baizhanji": { "canteen": 11, "make_time": 30, "name": "白斩鸡", "type": "cool", "descript": "", "recipe": { "livestock-gongji": 1, "land-dasuan": 1, "land-shengjiang": 1 }, "unlock": 19 },
    "canteen-malaniurou": { "canteen": 12, "make_time": 30, "name": "麻辣牛肉", "type": "cool", "descript": "", "recipe": { "livestock-rouniu": 1, "land-dacong": 1, "land-lajiao": 1 }, "unlock": 20 },
    "canteen-baiqierou": { "canteen": 13, "make_time": 30, "name": "白切肉", "type": "cool", "descript": "", "recipe": { "livestock-zhu": 1, "seafood-xiajiang": 1, "condiment-jiangyou": 1 }, "unlock": 21 },
    "canteen-baiqieyangrou": { "canteen": 14, "make_time": 30, "name": "白切羊肉", "type": "cool", "descript": "", "recipe": { "livestock-yang": 1, "land-dacong": 1, "condiment-mianjiang": 1 }, "unlock": 22 },

    "canteen-yumigeng": { "canteen": 0, "make_time": 30, "name": "玉米羹", "type": "water", "descript": "", "recipe": { "land-yumi": 2, "livestock-muji": 1 }, "unlock": 9 },
    "canteen-xihongshijidantang": { "canteen": 1, "make_time": 30, "name": "西红柿鸡蛋汤", "type": "water", "descript": "", "recipe": { "land-xihongshi": 2, "livestock-muji": 1 }, "unlock": 10 },
    "canteen-zicaidanhuatang": { "canteen": 2, "make_time": 30, "name": "紫菜蛋花汤", "type": "water", "descript": "", "recipe": { "livestock-muji": 2, "paddy-zicai": 1 }, "unlock": 11 },
    "canteen-xianggulaoyatang": { "canteen": 3, "make_time": 30, "name": "香菇老鸭汤", "type": "water", "descript": "", "recipe": { "livestock-ya": 2, "pick-xianggu": 1 }, "unlock": 12 },
    "canteen-huotuixiansuntang": { "canteen": 4, "make_time": 30, "name": "火腿鲜笋汤", "type": "water", "descript": "", "recipe": { "stewedmeat-huotui": 1, "pick-zhusun": 1 }, "unlock": 13 },
    "canteen-yanwogeng": { "canteen": 5, "make_time": 30, "name": "燕窝羹", "type": "water", "descript": "", "recipe": { "pick-yanwo": 1, "pick-fengmi": 1 }, "unlock": 14 },
    "canteen-haixiantang": { "canteen": 6, "make_time": 30, "name": "海鲜汤", "type": "water", "descript": "", "recipe": { "aquatic-geli": 1, "aquatic-duixia": 1, "tofu-doufupi": 1 }, "unlock": 15 },
    "canteen-haidaipaigutang": { "canteen": 7, "make_time": 30, "name": "海带排骨汤", "type": "water", "descript": "", "recipe": { "livestock-zhu": 1, "paddy-haidai": 1 }, "unlock": 16 },
    "canteen-yinerlianzitang": { "canteen": 8, "make_time": 30, "name": "银耳莲子汤", "type": "water", "descript": "", "recipe": { "pick-yinger": 1, "paddy-lianou": 1, "pick-fengmi": 1 }, "unlock": 17 },
    "canteen-chongcaodunjitang": { "canteen": 9, "make_time": 30, "name": "虫草炖鸡汤", "type": "water", "descript": "", "recipe": { "pick-chongcao": 1, "livestock-gongji": 1, "land-shengjiang": 1 }, "unlock": 18 },
    "canteen-longxianongtang": { "canteen": 10, "make_time": 30, "name": "龙虾浓汤", "type": "water", "descript": "", "recipe": { "catch-longxia": 1, "land-huluobo": 1, "condiment-fanqiejiang": 1 }, "unlock": 19 },
    "canteen-jiayutang": { "canteen": 11, "make_time": 30, "name": "甲鱼汤", "type": "water", "descript": "", "recipe": { "hunt-jiayu": 1, "land-shengjiang": 1, "land-dacong": 1 }, "unlock": 20 },
    "canteen-yejimogutang": { "canteen": 12, "make_time": 30, "name": "野鸡蘑菇汤", "type": "water", "descript": "", "recipe": { "hunt-yeji": 1, "pick-mogu": 1 }, "unlock": 21 },
    "canteen-sanxiantang": { "canteen": 13, "make_time": 30, "name": "三鲜汤", "type": "water", "descript": "", "recipe": { "livestock-gongji": 1, "catch-haishen": 1, "aquatic-duixia": 1 }, "unlock": 22 },
    "canteen-renshenluroutang": { "canteen": 14, "make_time": 30, "name": "人参鹿肉汤", "type": "water", "descript": "", "recipe": { "bushmeat-lurou": 1, "pick-renshen": 1, "orchard-zao": 1 }, "unlock": 23 }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1.面试点
handler.noddle = {
    "noddle-miantiao": { "name": "面条", "descript": "", "recipe": { "land-xiaomai": 1 }, "unlock": 0 },
    "noddle-mantou": { "name": "馒头", "descript": "", "recipe": { "land-xiaomai": 2 }, "unlock": 0 },
    "noddle-huajuan": { "name": "花卷", "descript": "", "recipe": { "land-xiaomai": 3 }, "unlock": 0 },
    "noddle-liangpi": { "name": "凉皮", "descript": "", "recipe": { "land-xiaomai": 3 }, "unlock": 0 },
    "noddle-dabing": { "name": "大饼", "descript": "", "recipe": { "land-xiaomai": 3, "land-zhima": 1 }, "unlock": 0 },
    "noddle-jianbing": { "name": "煎饼", "descript": "", "recipe": { "land-xiaomai": 3, "livestock-muji": 1 }, "unlock": 0 },
    "noddle-conghuabing": { "name": "葱花饼", "descript": "", "recipe": { "land-xiaomai": 3, "land-dacong": 1 }, "unlock": 0 },
    "noddle-mahua": { "name": "麻花", "descript": "", "recipe": { "land-xiaomai": 3, "condiment-douyou": 1 }, "unlock": 0 },
    "noddle-youtiao": { "name": "油条", "descript": "", "recipe": { "land-xiaomai": 3, "condiment-douyou": 1 }, "unlock": 0 },
    "noddle-shaobing": { "name": "烧饼", "descript": "", "recipe": { "land-xiaomai": 3, "condiment-douyou": 1 }, "unlock": 0 },
    "noddle-subaozi": { "name": "素包子", "descript": "", "recipe": { "land-xiaomai": 3, "land-qingcai": 1 }, "unlock": 0 },
    "noddle-roubaozi": { "name": "肉包子", "descript": "", "recipe": { "land-xiaomai": 3, "land-dacong": 1, "livestock-zhu": 1 }, "unlock": 0 }
};

// 2.豆腐店
handler.tofu = {
    "tofu-douya": { "name": "豆芽", "descript": "", "recipe": { "land-lvdou": 2 }, "unlock": 0 },
    "tofu-doufu": { "name": "豆腐", "descript": "", "recipe": { "land-dadou": 3 }, "unlock": 0 },
    "tofu-doujiang": { "name": "豆浆", "descript": "", "recipe": { "land-dadou": 2 }, "unlock": 0 },
    "tofu-douhua": { "name": "豆花", "descript": "", "recipe": { "land-dadou": 2 }, "unlock": 0 },
    "tofu-fuzhu": { "name": "腐竹", "descript": "", "recipe": { "land-dadou": 3 }, "unlock": 0 },
    "tofu-youpi": { "name": "油皮", "descript": "", "recipe": { "land-dadou": 3 }, "unlock": 0 },
    "tofu-dongdoufu": { "name": "冻豆腐", "descript": "", "recipe": { "tofu-doufu": 2 }, "unlock": 0 },
    "tofu-doufupi": { "name": "豆腐皮", "descript": "", "recipe": { "tofu-doujiang": 2 }, "unlock": 0 },
    "tofu-doufugan": { "name": "豆腐干", "descript": "", "recipe": { "tofu-doufu": 3 }, "unlock": 0 },
    "tofu-dousi": { "name": "豆丝", "descript": "", "recipe": { "land-lvdou": 1, "land-xiaomai": 3 }, "unlock": 0 },
    "tofu-suji": { "name": "素鸡", "descript": "", "recipe": { "tofu-doufupi": 2 }, "unlock": 0 },
    "tofu-doufupao": { "name": "豆腐泡", "descript": "", "recipe": { "tofu-doufu": 2, "condiment-douyou": 1 }, "unlock": 0 }
};

// 3.调料店
handler.condiment = {
    "condiment-douyou": { "name": "豆油", "descript": "", "recipe": { "land-dadou": 3 }, "unlock": 0 },
    "condiment-zhimayou": { "name": "芝麻油", "descript": "", "recipe": { "land-zhima": 3 }, "unlock": 0 },
    "condiment-zhimajiang": { "name": "芝麻酱", "descript": "", "recipe": { "land-zhima": 3 }, "unlock": 0 },
    "condiment-douchi": { "name": "豆豉", "descript": "", "recipe": { "land-dadou": 3 }, "unlock": 0 },
    "condiment-jiangyou": { "name": "酱油", "descript": "", "recipe": { "land-dadou": 3 }, "unlock": 0 },
    "condiment-cu": { "name": "醋", "descript": "", "recipe": { "paddy-shuidao": 3 }, "unlock": 0 },
    "condiment-paocai": { "name": "泡菜", "descript": "", "recipe": { "land-qingcai": 2, "land-lajiao": 1, "land-bailuobo": 1, "land-huluobo": 1 }, "unlock": 0 },
    "condiment-mianjiang": { "name": "面酱", "descript": "", "recipe": { "land-xiaomai": 3 }, "unlock": 0 },
    "condiment-doufuru": { "name": "豆腐乳", "descript": "", "recipe": { "tofu-doufu": 2, "land-lajiao": 1 }, "unlock": 0 },
    "condiment-chashaojiang": { "name": "叉烧酱", "descript": "", "recipe": { "condiment-jiangyou": 2, "candy-bingtang": 1 }, "unlock": 0 },
    "condiment-huangdoujiang": { "name": "黄豆酱", "descript": "", "recipe": { "land-dadou": 3 }, "unlock": 0 },
    "condiment-fanqiejiang": { "name": "番茄酱", "descript": "", "recipe": { "land-xihongshi": 3, "candy-bingtang": 1 }, "unlock": 0 }
};

// 4.酒馆
handler.tavern = {
    "tavern-pijiu": { "name": "啤酒", "descript": "", "recipe": { "land-xiaomai": 3 }, "unlock": 0 },
    "tavern-huangjiu": { "name": "黄酒", "descript": "", "recipe": { "paddy-shuidao": 3 }, "unlock": 0 },
    "tavern-baijiu": { "name": "白酒", "descript": "", "recipe": { "paddy-shuidao": 3 }, "unlock": 0 },
    "tavern-mijiu": { "name": "米酒", "descript": "", "recipe": { "paddy-nuomi": 3 }, "unlock": 0 },
    "tavern-lizijiu": { "name": "李子酒", "descript": "", "recipe": { "orchard-lizi": 3 }, "unlock": 0 },
    "tavern-putaojiu": { "name": "葡萄酒", "descript": "", "recipe": { "orchard-putao": 3 }, "unlock": 0 },
    "tavern-diguashao": { "name": "地瓜烧", "descript": "", "recipe": { "land-hongshu": 3 }, "unlock": 0 },
    "tavern-gaoliangjiu": { "name": "高粱酒", "descript": "", "recipe": { "land-gaoliang": 3 }, "unlock": 0 },
    "tavern-renshenjiu": { "name": "人参酒", "descript": "", "recipe": { "tavern-baijiu": 3, "pick-renshen": 1 }, "unlock": 0 },
    "tavern-chongcaojiu": { "name": "虫草酒", "descript": "", "recipe": { "tavern-baijiu": 3, "pick-chongcao": 1 }, "unlock": 0 },
    "tavern-shedanjiu": { "name": "蛇胆酒", "descript": "", "recipe": { "tavern-baijiu": 1, "hunt-she": 1 }, "unlock": 0 },
    "tavern-caoyaojiu": { "name": "草药酒", "descript": "", "recipe": { "tavern-baijiu": 3, "pick-caoyao": 1 }, "unlock": 0 }
};

// 5.糖果
handler.candy = {
    "candy-bingtang": { "name": "冰糖", "descript": "", "recipe": { "land-ganzhe": 3 }, "unlock": 0 },
    "candy-hongtang": { "name": "红糖", "descript": "", "recipe": { "land-ganzhe": 3 }, "unlock": 0 },
    "candy-gaoliangyi": { "name": "高粱饴", "descript": "", "recipe": { "land-gaoliang": 3 }, "unlock": 0 },
    "candy-maiyatang": { "name": "麦芽糖", "descript": "", "recipe": { "land-xiaomai": 3 }, "unlock": 0 },
    "candy-jiangtang": { "name": "姜糖", "descript": "", "recipe": { "land-shengjiang": 3, "candy-hongtang": 1 }, "unlock": 0 },
    "candy-tanghulu": { "name": "糖葫芦", "descript": "", "recipe": { "candy-bingtang": 3, "orchard-shanzha": 1 }, "unlock": 0 },
    "candy-niunaitang": { "name": "牛奶糖", "descript": "", "recipe": { "candy-bingtang": 3, "livestock-nainiu": 1 }, "unlock": 0 },
    "candy-shijinshuiguotang": { "name": "什锦水果糖", "descript": "", "recipe": { "candy-bingtang": 2, "orchard-pingguo": 1, "orchard-juzi": 1, "orchard-taozi": 1 }, "unlock": 0 },
    "candy-xingrentang": { "name": "杏仁糖", "descript": "", "recipe": { "orchard-xingzi": 2, "candy-maiyatang": 1 }, "unlock": 0 },
    "candy-zhimatang": { "name": "芝麻糖", "descript": "", "recipe": { "land-zhima": 3, "candy-maiyatang": 1 }, "unlock": 0 },
    "candy-fengmitang": { "name": "蜂蜜糖", "descript": "", "recipe": { "pick-fengmi": 2, "candy-hongtang": 1 }, "unlock": 0 },
    "candy-taifeitang": { "name": "太妃糖", "descript": "", "recipe": { "candy-hongtang": 2, "milk-naiyou": 1 }, "unlock": 0 }
};

// 6.牛奶
handler.milk = {
    "milk-naifeng": { "name": "奶粉", "descript": "", "recipe": { "livestock-nainiu": 3 }, "unlock": 0 },
    "milk-lianru": { "name": "炼乳", "descript": "", "recipe": { "livestock-nainiu": 3, "candy-bingtang": 1 }, "unlock": 0 },
    "milk-huangyou": { "name": "黄油", "descript": "", "recipe": { "livestock-nainiu": 3 }, "unlock": 0 },
    "milk-naiyou": { "name": "奶油", "descript": "", "recipe": { "livestock-nainiu": 3 }, "unlock": 0 },
    "milk-nailao": { "name": "奶酪", "descript": "", "recipe": { "livestock-nainiu": 3 }, "unlock": 0 },
    "milk-suannai": { "name": "酸奶", "descript": "", "recipe": { "livestock-nainiu": 3, "candy-bingtang": 1 }, "unlock": 0 },
    "milk-naipian": { "name": "奶片", "descript": "", "recipe": { "milk-naifeng": 3, "candy-bingtang": 1 }, "unlock": 0 },
    "milk-naidoufu": { "name": "奶豆腐", "descript": "", "recipe": { "livestock-nainiu": 3 }, "unlock": 0 },
    "milk-naipizi": { "name": "奶皮子", "descript": "", "recipe": { "livestock-nainiu": 3 }, "unlock": 0 },
    "milk-suyou": { "name": "酥油", "descript": "", "recipe": { "livestock-nainiu": 3 }, "unlock": 0 },
    "milk-bingqiling": { "name": "冰淇淋", "descript": "", "recipe": { "livestock-nainiu": 3, "milk-naiyou": 1, "candy-bingtang": 1 }, "unlock": 0 },
    "milk-naicha": { "name": "奶茶", "descript": "", "recipe": { "livestock-nainiu": 3, "tea-hongcha": 1, "candy-bingtang": 1 }, "unlock": 0 }
};

// 7.卤肉
handler.stewedmeat = {
    "stewedmeat-luzhurou": { "name": "卤猪肉", "descript": "", "recipe": { "livestock-zhu": 3 }, "unlock": 0 },
    "stewedmeat-huotui": { "name": "火腿", "descript": "", "recipe": { "livestock-zhu": 3 }, "unlock": 0 },
    "stewedmeat-xiangchang": { "name": "香肠", "descript": "", "recipe": { "livestock-zhu": 3 }, "unlock": 0 },
    "stewedmeat-larou": { "name": "腊肉", "descript": "", "recipe": { "livestock-zhu": 3 }, "unlock": 0 },
    "stewedmeat-wanzi": { "name": "丸子", "descript": "", "recipe": { "livestock-zhu": 2, "land-bailuobo": 1, "condiment-douyou": 1 }, "unlock": 0 },
    "stewedmeat-chashaorou": { "name": "叉烧肉", "descript": "", "recipe": { "livestock-zhu": 2, "condiment-chashaojiang": 1 }, "unlock": 0 },
    "stewedmeat-chashaoe": { "name": "叉烧鹅", "descript": "", "recipe": { "livestock-e": 3, "condiment-chashaojiang": 1 }, "unlock": 0 },
    "stewedmeat-yanshuiya": { "name": "盐水鸭", "descript": "", "recipe": { "livestock-ya": 2 }, "unlock": 0 },
    "stewedmeat-pidan": { "name": "皮蛋", "descript": "", "recipe": { "livestock-muji": 3 }, "unlock": 0 },
    "stewedmeat-ludan": { "name": "卤蛋", "descript": "", "recipe": { "livestock-muji": 3, "condiment-jiangyou": 1 }, "unlock": 0 },
    "stewedmeat-chayedan": { "name": "茶叶蛋", "descript": "", "recipe": { "livestock-muji": 3, "land-chaye": 1 }, "unlock": 0 },
    "stewedmeat-xianyadan": { "name": "咸鸭蛋", "descript": "", "recipe": { "livestock-muji": 3 }, "unlock": 0 }
};

// 8.茶
handler.tea = {
    "tea-lvcha": { "name": "绿茶", "descript": "", "recipe": { "land-chaye": 3 }, "unlock": 0 },
    "tea-hongcha": { "name": "红茶", "descript": "", "recipe": { "land-chaye": 3 }, "unlock": 0 },
    "tea-baicha": { "name": "白茶", "descript": "", "recipe": { "land-chaye": 3 }, "unlock": 0 },
    "tea-heicha": { "name": "黑茶", "descript": "", "recipe": { "land-chaye": 3 }, "unlock": 0 },
    "tea-wulongcha": { "name": "乌龙茶", "descript": "", "recipe": { "land-chaye": 3 }, "unlock": 0 },
    "tea-puercha": { "name": "普洱茶", "descript": "", "recipe": { "land-chaye": 3 }, "unlock": 0 },
    "tea-huacha": { "name": "花茶", "descript": "", "recipe": { "land-chaye": 3 }, "unlock": 0 },
    "tea-micha": { "name": "米茶", "descript": "", "recipe": { "paddy-shuidao": 3 }, "unlock": 0 },
    "tea-xingcha": { "name": "杏茶", "descript": "", "recipe": { "orchard-xingzi": 2, "candy-bingtang": 1, "land-chaye": 1 }, "unlock": 0 },
    "tea-sanpaotai": { "name": "三泡台", "descript": "", "recipe": { "orchard-zao": 2, "candy-bingtang": 1, "land-chaye": 1 }, "unlock": 0 },
    "tea-jiangcha": { "name": "姜茶", "descript": "", "recipe": { "land-shengjiang": 2, "candy-hongtang": 1, "land-chaye": 1 }, "unlock": 0 },
    "tea-liangcha": { "name": "凉茶", "descript": "", "recipe": { "pick-caoyao": 2, "candy-bingtang": 1, "land-chaye": 1 }, "unlock": 0 }
};

// 9.糕点
handler.cake = {
    "cake-lvdougao": { "name": "绿豆糕", "descript": "", "recipe": { "land-lvdou": 2, "land-xiaomai": 2 }, "unlock": 0 },
    "cake-yuebing": { "name": "月饼", "descript": "", "recipe": { "land-xiaomai": 3, "candy-bingtang": 1, "livestock-muji": 1 }, "unlock": 0 },
    "cake-laopobing": { "name": "老婆饼", "descript": "", "recipe": { "land-xiaomai": 3, "candy-maiyatang": 1, "land-zhima": 1 }, "unlock": 0 },
    "cake-tangou": { "name": "糖藕", "descript": "", "recipe": { "paddy-lianou": 2, "candy-bingtang": 1 }, "unlock": 0 },
    "cake-taosu": { "name": "桃酥", "descript": "", "recipe": { "land-xiaomai": 3, "livestock-muji": 1, "milk-naiyou": 1 }, "unlock": 0 },
    "cake-tangyuan": { "name": "汤圆", "descript": "", "recipe": { "paddy-nuomi": 3, "land-zhima": 1, "candy-bingtang": 1 }, "unlock": 0 },
    "cake-zongzi": { "name": "粽子", "descript": "", "recipe": { "paddy-nuomi": 3, "orchard-zao": 1 }, "unlock": 0 },
    "cake-dangao": { "name": "蛋糕", "descript": "", "recipe": { "land-xiaomai": 3, "livestock-muji": 1, "livestock-nainiu": 1 }, "unlock": 0 },
    "cake-mianbao": { "name": "面包", "descript": "", "recipe": { "land-xiaomai": 3, "livestock-nainiu": 1 }, "unlock": 0 },
    "cake-quqi": { "name": "曲奇", "descript": "", "recipe": { "land-xiaomai": 3, "milk-huangyou": 1, "livestock-muji": 1 }, "unlock": 0 },
    "cake-naiyoudangao": { "name": "奶油蛋糕", "descript": "", "recipe": { "cake-dangao": 2, "milk-naiyou": 1 }, "unlock": 0 },
};

// 10.果脯
handler.candiedfruit = {
    "candiedfruit-pingguozhi": { "name": "苹果汁", "descript": "", "recipe": { "orchard-pingguo": 3 }, "unlock": 0 },
    "candiedfruit-putaogan": { "name": "葡萄干", "descript": "", "recipe": { "orchard-putao": 3 }, "unlock": 0 },
    "candiedfruit-xingmijian": { "name": "杏蜜饯", "descript": "", "recipe": { "orchard-xingzi": 2, "pick-fengmi": 1 }, "unlock": 0 },
    "candiedfruit-shiliuzhi": { "name": "石榴汁", "descript": "", "recipe": { "orchard-shiliu": 3 }, "unlock": 0 },
    "candiedfruit-limijian": { "name": "梨蜜饯", "descript": "", "recipe": { "orchard-li": 2, "pick-fengmi": 1 }, "unlock": 0 },
    "candiedfruit-taoguantou": { "name": "桃罐头", "descript": "", "recipe": { "orchard-taozi": 1, "candy-bingtang": 1 }, "unlock": 0 },
    "candiedfruit-yingtaojiang": { "name": "樱桃酱", "descript": "", "recipe": { "orchard-yingtao": 2, "candy-bingtang": 1 }, "unlock": 0 },
    "candiedfruit-lizigan": { "name": "李子干", "descript": "", "recipe": { "orchard-lizi": 2, "candy-bingtang": 1 }, "unlock": 0 },
    "candiedfruit-juzijiang": { "name": "橘子酱", "descript": "", "recipe": { "orchard-juzi": 3, "candy-bingtang": 1 }, "unlock": 0 },
    "candiedfruit-mizao": { "name": "蜜枣", "descript": "", "recipe": { "orchard-zao": 2, "pick-fengmi": 1 }, "unlock": 0 },
    "candiedfruit-shizibing": { "name": "柿子饼", "descript": "", "recipe": { "orchard-shizi": 3 }, "unlock": 0 },
    "candiedfruit-tianjinbanli": { "name": "天津板栗", "descript": "", "recipe": { "orchard-liizi": 3, "candy-bingtang": 1 }, "unlock": 0 }
};

// 11.野味
handler.bushmeat = {
    "bushmeat-yansun": { "name": "烟笋", "descript": "", "recipe": { "pick-zhusun": 2 }, "unlock": 0 },
    "bushmeat-xiongzhang": { "name": "熊掌", "descript": "", "recipe": { "hunt-xiong": 1 }, "unlock": 0 },
    "bushmeat-lurou": { "name": "鹿肉", "descript": "", "recipe": { "hunt-lu": 1 }, "unlock": 0 },
    "bushmeat-yezhurou": { "name": "野猪肉", "descript": "", "recipe": { "hunt-yezhu": 1 }, "unlock": 0 },
    "bushmeat-yeturou": { "name": "野兔肉", "descript": "", "recipe": { "hunt-yetu": 1 }, "unlock": 0 },
    "bushmeat-sherou": { "name": "蛇肉", "descript": "", "recipe": { "hunt-she": 1 }, "unlock": 0 },
    "bushmeat-jiayurou": { "name": "甲鱼肉", "descript": "", "recipe": { "hunt-jiayu": 1 }, "unlock": 0 },
    "bushmeat-yanwogen": { "name": "燕窝羹", "descript": "", "recipe": { "pick-yanwo": 1, "pick-fengmi": 1 }, "unlock": 0 },
    "bushmeat-xianggugan": { "name": "香菇干", "descript": "", "recipe": { "pick-xianggu": 1 }, "unlock": 0 },
    "bushmeat-ganmuer": { "name": "干木耳", "descript": "", "recipe": { "pick-muer": 2 }, "unlock": 0 },
    "bushmeat-gansongrong": { "name": "干松茸", "descript": "", "recipe": { "pick-songrong": 2 }, "unlock": 0 },
    "bushmeat-gansonglu": { "name": "干松露", "descript": "", "recipe": { "pick-songlu": 2 }, "unlock": 0 }
};

// 12.海鲜
handler.seafood = {
    "seafood-xunyu": { "name": "熏鱼", "descript": "", "recipe": { "aquatic-liyu": 2 }, "unlock": 0 },
    "seafood-yudong": { "name": "鱼冻", "descript": "", "recipe": { "aquatic-liyu": 2 }, "unlock": 0 },
    "seafood-xiapian": { "name": "虾片", "descript": "", "recipe": { "catch-longxia": 2 }, "unlock": 0 },
    "seafood-jinqiangyuguantou": { "name": "金枪鱼罐头", "descript": "", "recipe": { "catch-jingqiangyu": 2 }, "unlock": 0 },
    "seafood-daiyuguantou": { "name": "带鱼罐头", "descript": "", "recipe": { "catch-daiyu": 2 }, "unlock": 0 },
    "seafood-manyugan": { "name": "鳗鱼干", "descript": "", "recipe": { "catch-manyu": 2 }, "unlock": 0 },
    "seafood-xueyupai": { "name": "鳕鱼排", "descript": "", "recipe": { "catch-xueyu": 2 }, "unlock": 0 },
    "seafood-youyugan": { "name": "鱿鱼干", "descript": "", "recipe": { "catch-youyu": 2 }, "unlock": 0 },
    "seafood-xiehuangjiang": { "name": "蟹黄酱", "descript": "", "recipe": { "aquatic-dazhaxie": 2 }, "unlock": 0 },
    "seafood-xiejiang": { "name": "蟹酱", "descript": "", "recipe": { "aquatic-dazhaxie": 2 }, "unlock": 0 },
    "seafood-xiajiang": { "name": "虾酱", "descript": "", "recipe": { "aquatic-duixia": 2 }, "unlock": 0 },
    "seafood-yaozhugan": { "name": "瑶柱干", "descript": "", "recipe": { "aquatic-geli": 2 }, "unlock": 0 }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 整合数据到map
handler.addGoodsToMap = function () {
    let check = function (goodsType) {
        let map = handler[goodsType];
        for (const key in map) {
            map[key].storeClass = goodsType;
            map[key].goodsType = goodsType;
            map[key].id = key;
            handler.entityHash[key] = map[key];

            if (outdoor.indexOf(goodsType) != -1) {
                map[key].storeClass = "outdoor";
            }

            if (makeRoom.indexOf(goodsType) != -1) {
                map[key].storeClass = "food";
            }
        }
    };

    for (let index = 0, len = handler.entityType.length; index < len; index++) {
        let goodsType = handler.entityType[index];
        check(goodsType);
    }
}();

// 计算价格
handler.caculatePrice = function (userInfo = null) {
    let getPrice = function (mastkey) {
        let recipe = handler.entityHash[mastkey].recipe;

        let price = 0;
        for (const key in recipe) {
            if (!handler.entityHash.hasOwnProperty(key)) {
                price += 0;
                continue;
            }

            if (handler.entityHash[key].price) {
                price += handler.entityHash[key].price * recipe[key];
                continue;
            }

            price += getPrice(key) * recipe[key];
        }
        return price;
    };

    let factoryAdd = function (goods) {
        let index = makeRoom.indexOf(goods.storeClass);
        if (index == -1) { return; }

        let level = userInfo[makeRoom[index]].level;
        if (level < 0) { return; }

        let radio = buildsConfig[makeRoom[index]][level].revenu_increase;
        goods.price = Math.ceil(goods.price * (1 + radio));
    };

    for (const key in handler.entityHash) {
        if (handler.entityHash[key].price) {
            factoryAdd(handler.entityHash[key]);
            continue;
        }

        let resultPrice = Math.ceil(getPrice(key));
        handler.entityHash[key].price = resultPrice;
        factoryAdd(handler.entityHash[key]);
    }
};
