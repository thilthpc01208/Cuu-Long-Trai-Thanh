const handler = module.exports

const N = false;
// 1. 等级解锁内容
handler.unlock = [
    { "floor": N, "factory": 0, "canteen": N, "hotel": N, "land": 3, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 0 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 4, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 1 },
    { "floor": N, "factory": 1, "canteen": N, "hotel": N, "land": 5, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 2 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 6, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 3 },
    { "floor": 2, "factory": 2, "canteen": N, "hotel": N, "land": 7, "livestock": 0, "orchard": N, "aquatic": N, "paddy": N, "store": 4 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 8, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 5 },
    { "floor": N, "factory": 3, "canteen": N, "hotel": N, "land": 9, "livestock": 1, "orchard": 0, "aquatic": N, "paddy": N, "store": 6 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 10, "livestock": N, "orchard": 1, "aquatic": N, "paddy": N, "store": 7 },
    { "floor": 3, "factory": 4, "canteen": N, "hotel": N, "land": 11, "livestock": 2, "orchard": 2, "aquatic": N, "paddy": N, "store": 8 },
    { "floor": N, "factory": N, "canteen": 0, "hotel": N, "land": 12, "livestock": N, "orchard": 3, "aquatic": N, "paddy": 0, "store": 9 },
    { "floor": N, "factory": 5, "canteen": 1, "hotel": N, "land": 13, "livestock": 3, "orchard": 4, "aquatic": N, "paddy": 1, "store": 10 },
    { "floor": N, "factory": N, "canteen": 2, "hotel": N, "land": 14, "livestock": N, "orchard": 5, "aquatic": 0, "paddy": 2, "store": 11 },
    { "floor": 4, "factory": 6, "canteen": 3, "hotel": N, "land": 15, "livestock": 4, "orchard": 6, "aquatic": N, "paddy": 3, "store": 12 },
    { "floor": N, "factory": N, "canteen": 4, "hotel": N, "land": 16, "livestock": N, "orchard": 7, "aquatic": 1, "paddy": 4, "store": 13 },
    { "floor": N, "factory": 7, "canteen": 5, "hotel": 0, "land": 17, "livestock": 5, "orchard": 8, "aquatic": N, "paddy": 5, "store": 14 },
    { "floor": N, "factory": N, "canteen": 6, "hotel": 1, "land": 18, "livestock": N, "orchard": 9, "aquatic": 2, "paddy": 6, "store": 15 },
    { "floor": 5, "factory": 8, "canteen": 7, "hotel": 2, "land": 19, "livestock": 6, "orchard": 10, "aquatic": N, "paddy": 7, "store": 16 },
    { "floor": N, "factory": N, "canteen": 8, "hotel": 3, "land": 20, "livestock": N, "orchard": 11, "aquatic": 3, "paddy": N, "store": 17 },
    { "floor": N, "factory": 9, "canteen": 9, "hotel": 4, "land": 21, "livestock": 7, "orchard": 12, "aquatic": N, "paddy": N, "store": 18 },
    { "floor": N, "factory": N, "canteen": 10, "hotel": 5, "land": 22, "livestock": N, "orchard": 13, "aquatic": N, "paddy": N, "store": 19 },
    { "floor": 6, "factory": 10, "canteen": 11, "hotel": 6, "land": 23, "livestock": N, "orchard": 14, "aquatic": N, "paddy": N, "store": 20 },
    { "floor": N, "factory": N, "canteen": 12, "hotel": 7, "land": 24, "livestock": N, "orchard": 15, "aquatic": N, "paddy": N, "store": 21 },
    { "floor": N, "factory": 11, "canteen": 13, "hotel": 8, "land": 25, "livestock": N, "orchard": 16, "aquatic": N, "paddy": N, "store": 22 },
    { "floor": N, "factory": N, "canteen": 14, "hotel": 9, "land": 26, "livestock": N, "orchard": 17, "aquatic": N, "paddy": N, "store": 23 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 27, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 24 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 28, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 25 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 29, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 26 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 30, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 27 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 31, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 28 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 32, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 29 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 33, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 30 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 34, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 31 },
    { "floor": N, "factory": N, "canteen": N, "hotel": N, "land": 35, "livestock": N, "orchard": N, "aquatic": N, "paddy": N, "store": 32 }
];

// 1. 主房
handler.lord = [
    { "precondition": { "route": 0, "harbour": -1 }, "price": 0, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 } },
    { "precondition": { "route": 0, "harbour": -1 }, "price": 2400, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 } },
    { "precondition": { "route": 0, "harbour": -1 }, "price": 4800, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 } },
    { "precondition": { "route": 0, "harbour": -1 }, "price": 8000, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 } },
    { "precondition": { "route": 0, "harbour": -1 }, "price": 12000, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 } },
    { "precondition": { "route": 1, "harbour": -1 }, "price": 16800, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 } },
    { "precondition": { "route": 2, "harbour": -1 }, "price": 22400, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 } },
    { "precondition": { "route": 3, "harbour": -1 }, "price": 28800, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 } },
    { "precondition": { "route": 4, "harbour": -1 }, "price": 36000, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 } },
    { "precondition": { "route": 5, "harbour": 0 }, "price": 44000, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 } },
    { "precondition": { "route": 6, "harbour": 1 }, "price": 52800, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 } },
    { "precondition": { "route": 7, "harbour": 2 }, "price": 62400, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 } },
    { "precondition": { "route": 8, "harbour": 3 }, "price": 72800, "material": { "mineral-mutou": 13, "mineral-shitou": 13, "mineral-niantu": 13 } },
    { "precondition": { "route": 9, "harbour": 4 }, "price": 84000, "material": { "mineral-mutou": 14, "mineral-shitou": 14, "mineral-niantu": 14 } },
    { "precondition": { "route": 10, "harbour": 5 }, "price": 96000, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 } },
    { "precondition": { "route": 11, "harbour": 6 }, "price": 108800, "material": { "mineral-mutou": 16, "mineral-shitou": 16, "mineral-niantu": 16 } },
    { "precondition": { "route": 12, "harbour": 7 }, "price": 122400, "material": { "mineral-mutou": 17, "mineral-shitou": 17, "mineral-niantu": 17 } },
    { "precondition": { "route": 13, "harbour": 8 }, "price": 136800, "material": { "mineral-mutou": 18, "mineral-shitou": 18, "mineral-niantu": 18 } },
    { "precondition": { "route": 14, "harbour": 9 }, "price": 152000, "material": { "mineral-mutou": 19, "mineral-shitou": 19, "mineral-niantu": 19 } },
    { "precondition": { "route": 15, "harbour": 10 }, "price": 168000, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 } },
    { "precondition": { "route": 16, "harbour": 11 }, "price": 184800, "material": { "mineral-mutou": 21, "mineral-shitou": 21, "mineral-niantu": 21 } },
    { "precondition": { "route": 17, "harbour": 12 }, "price": 202400, "material": { "mineral-mutou": 22, "mineral-shitou": 22, "mineral-niantu": 22 } },
    { "precondition": { "route": 18, "harbour": 13 }, "price": 220800, "material": { "mineral-mutou": 23, "mineral-shitou": 23, "mineral-niantu": 23 } },
    { "precondition": { "route": 19, "harbour": 14 }, "price": 240000, "material": { "mineral-mutou": 24, "mineral-shitou": 24, "mineral-niantu": 24 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 260000, "material": { "mineral-mutou": 25, "mineral-shitou": 25, "mineral-niantu": 25 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 280800, "material": { "mineral-mutou": 26, "mineral-shitou": 26, "mineral-niantu": 26 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 302400, "material": { "mineral-mutou": 27, "mineral-shitou": 27, "mineral-niantu": 27 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 324800, "material": { "mineral-mutou": 28, "mineral-shitou": 28, "mineral-niantu": 28 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 348000, "material": { "mineral-mutou": 29, "mineral-shitou": 29, "mineral-niantu": 29 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 372000, "material": { "mineral-mutou": 30, "mineral-shitou": 30, "mineral-niantu": 30 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 396800, "material": { "mineral-mutou": 31, "mineral-shitou": 31, "mineral-niantu": 31 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 422400, "material": { "mineral-mutou": 32, "mineral-shitou": 32, "mineral-niantu": 32 } },
    { "precondition": { "route": -1, "harbour": -1 }, "price": 448800, "material": { "mineral-mutou": 33, "mineral-shitou": 33, "mineral-niantu": 33 } }
];

// 2. 仓库
handler.store = [
    { "name": "", "descript": "", "price": 0, "capacity": 100, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 } },
    { "name": "", "descript": "", "price": 900, "capacity": 120, "material": { "mineral-mutou": 1, "mineral-shitou": 1, "mineral-niantu": 1 } },
    { "name": "", "descript": "", "price": 1800, "capacity": 140, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 } },
    { "name": "", "descript": "", "price": 3000, "capacity": 160, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 } },
    { "name": "", "descript": "", "price": 4500, "capacity": 180, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 } },
    { "name": "", "descript": "", "price": 6300, "capacity": 200, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 } },
    { "name": "", "descript": "", "price": 8400, "capacity": 220, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 } },
    { "name": "", "descript": "", "price": 10800, "capacity": 240, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 } },
    { "name": "", "descript": "", "price": 13500, "capacity": 260, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 } },
    { "name": "", "descript": "", "price": 16500, "capacity": 280, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 } },
    { "name": "", "descript": "", "price": 19800, "capacity": 300, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 } },
    { "name": "", "descript": "", "price": 23400, "capacity": 330, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 } },
    { "name": "", "descript": "", "price": 27300, "capacity": 360, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 } },
    { "name": "", "descript": "", "price": 31500, "capacity": 390, "material": { "mineral-mutou": 13, "mineral-shitou": 13, "mineral-niantu": 13 } },
    { "name": "", "descript": "", "price": 36000, "capacity": 420, "material": { "mineral-mutou": 14, "mineral-shitou": 14, "mineral-niantu": 14 } },
    { "name": "", "descript": "", "price": 40800, "capacity": 450, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 } },
    { "name": "", "descript": "", "price": 45900, "capacity": 480, "material": { "mineral-mutou": 16, "mineral-shitou": 16, "mineral-niantu": 16 } },
    { "name": "", "descript": "", "price": 51300, "capacity": 510, "material": { "mineral-mutou": 17, "mineral-shitou": 17, "mineral-niantu": 17 } },
    { "name": "", "descript": "", "price": 57000, "capacity": 540, "material": { "mineral-mutou": 18, "mineral-shitou": 18, "mineral-niantu": 18 } },
    { "name": "", "descript": "", "price": 63000, "capacity": 570, "material": { "mineral-mutou": 29, "mineral-shitou": 19, "mineral-niantu": 19 } },
    { "name": "", "descript": "", "price": 69300, "capacity": 600, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 } },
    { "name": "", "descript": "", "price": 75900, "capacity": 640, "material": { "mineral-mutou": 21, "mineral-shitou": 21, "mineral-niantu": 21 } },
    { "name": "", "descript": "", "price": 82800, "capacity": 680, "material": { "mineral-mutou": 22, "mineral-shitou": 22, "mineral-niantu": 22 } },
    { "name": "", "descript": "", "price": 90000, "capacity": 720, "material": { "mineral-mutou": 23, "mineral-shitou": 23, "mineral-niantu": 23 } },
    { "name": "", "descript": "", "price": 97500, "capacity": 760, "material": { "mineral-mutou": 24, "mineral-shitou": 24, "mineral-niantu": 24 } },
    { "name": "", "descript": "", "price": 105300, "capacity": 800, "material": { "mineral-mutou": 25, "mineral-shitou": 25, "mineral-niantu": 25 } },
    { "name": "", "descript": "", "price": 113400, "capacity": 840, "material": { "mineral-mutou": 26, "mineral-shitou": 26, "mineral-niantu": 26 } },
    { "name": "", "descript": "", "price": 121800, "capacity": 880, "material": { "mineral-mutou": 27, "mineral-shitou": 27, "mineral-niantu": 27 } },
    { "name": "", "descript": "", "price": 130500, "capacity": 920, "material": { "mineral-mutou": 28, "mineral-shitou": 28, "mineral-niantu": 28 } },
    { "name": "", "descript": "", "price": 139500, "capacity": 960, "material": { "mineral-mutou": 29, "mineral-shitou": 29, "mineral-niantu": 29 } },
    { "name": "", "descript": "", "price": 148800, "capacity": 1000, "material": { "mineral-mutou": 30, "mineral-shitou": 30, "mineral-niantu": 30 } },
    { "name": "", "descript": "", "price": 158400, "capacity": 1050, "material": { "mineral-mutou": 31, "mineral-shitou": 31, "mineral-niantu": 31 } },
    { "name": "", "descript": "", "price": 168300, "capacity": 1100, "material": { "mineral-mutou": 32, "mineral-shitou": 32, "mineral-niantu": 32 } },
    { "name": "", "descript": "", "price": 178500, "capacity": 1150, "material": { "mineral-mutou": 33, "mineral-shitou": 33, "mineral-niantu": 33 } },
    { "name": "", "descript": "", "price": 189000, "capacity": 1200, "material": { "mineral-mutou": 34, "mineral-shitou": 34, "mineral-niantu": 34 } },
    { "name": "", "descript": "", "price": 199800, "capacity": 1250, "material": { "mineral-mutou": 35, "mineral-shitou": 35, "mineral-niantu": 35 } },
    { "name": "", "descript": "", "price": 210900, "capacity": 1300, "material": { "mineral-mutou": 36, "mineral-shitou": 36, "mineral-niantu": 36 } },
    { "name": "", "descript": "", "price": 222300, "capacity": 1350, "material": { "mineral-mutou": 37, "mineral-shitou": 37, "mineral-niantu": 37 } },
    { "name": "", "descript": "", "price": 234000, "capacity": 1400, "material": { "mineral-mutou": 38, "mineral-shitou": 38, "mineral-niantu": 38 } },
    { "name": "", "descript": "", "price": 246000, "capacity": 1450, "material": { "mineral-mutou": 39, "mineral-shitou": 39, "mineral-niantu": 39 } },
    { "name": "", "descript": "", "price": 258300, "capacity": 1500, "material": { "mineral-mutou": 40, "mineral-shitou": 40, "mineral-niantu": 40 } },
    { "name": "", "descript": "", "price": 270900, "capacity": 1560, "material": { "mineral-mutou": 41, "mineral-shitou": 41, "mineral-niantu": 41 } },
    { "name": "", "descript": "", "price": 283800, "capacity": 1620, "material": { "mineral-mutou": 42, "mineral-shitou": 42, "mineral-niantu": 42 } },
    { "name": "", "descript": "", "price": 297000, "capacity": 1680, "material": { "mineral-mutou": 43, "mineral-shitou": 43, "mineral-niantu": 43 } },
    { "name": "", "descript": "", "price": 310500, "capacity": 1740, "material": { "mineral-mutou": 44, "mineral-shitou": 44, "mineral-niantu": 44 } },
    { "name": "", "descript": "", "price": 324300, "capacity": 1800, "material": { "mineral-mutou": 45, "mineral-shitou": 45, "mineral-niantu": 45 } },
    { "name": "", "descript": "", "price": 338400, "capacity": 1860, "material": { "mineral-mutou": 46, "mineral-shitou": 46, "mineral-niantu": 46 } },
    { "name": "", "descript": "", "price": 352800, "capacity": 1920, "material": { "mineral-mutou": 47, "mineral-shitou": 47, "mineral-niantu": 47 } },
    { "name": "", "descript": "", "price": 367500, "capacity": 1980, "material": { "mineral-mutou": 48, "mineral-shitou": 48, "mineral-niantu": 48 } },
    { "name": "", "descript": "", "price": 382500, "capacity": 2040, "material": { "mineral-mutou": 49, "mineral-shitou": 49, "mineral-niantu": 49 } },
    { "name": "", "descript": "", "price": 397800, "capacity": 2120, "material": { "mineral-mutou": 50, "mineral-shitou": 50, "mineral-niantu": 50 } },
    { "name": "", "descript": "", "price": 413400, "capacity": 2200, "material": { "mineral-mutou": 51, "mineral-shitou": 51, "mineral-niantu": 51 } },
    { "name": "", "descript": "", "price": 429300, "capacity": 2280, "material": { "mineral-mutou": 52, "mineral-shitou": 52, "mineral-niantu": 52 } },
    { "name": "", "descript": "", "price": 445500, "capacity": 2360, "material": { "mineral-mutou": 53, "mineral-shitou": 53, "mineral-niantu": 53 } },
    { "name": "", "descript": "", "price": 462000, "capacity": 2440, "material": { "mineral-mutou": 54, "mineral-shitou": 54, "mineral-niantu": 54 } },
    { "name": "", "descript": "", "price": 478800, "capacity": 2520, "material": { "mineral-mutou": 55, "mineral-shitou": 55, "mineral-niantu": 55 } },
    { "name": "", "descript": "", "price": 495900, "capacity": 2600, "material": { "mineral-mutou": 56, "mineral-shitou": 56, "mineral-niantu": 56 } },
    { "name": "", "descript": "", "price": 513300, "capacity": 2680, "material": { "mineral-mutou": 57, "mineral-shitou": 57, "mineral-niantu": 57 } },
    { "name": "", "descript": "", "price": 531000, "capacity": 2760, "material": { "mineral-mutou": 58, "mineral-shitou": 58, "mineral-niantu": 58 } },
    { "name": "", "descript": "", "price": 549000, "capacity": 2840, "material": { "mineral-mutou": 59, "mineral-shitou": 59, "mineral-niantu": 59 } },
    { "name": "", "descript": "", "price": 567300, "capacity": 2920, "material": { "mineral-mutou": 60, "mineral-shitou": 60, "mineral-niantu": 60 } },
    { "name": "", "descript": "", "price": 585900, "capacity": 3000, "material": { "mineral-mutou": 61, "mineral-shitou": 61, "mineral-niantu": 61 } },
    { "name": "", "descript": "", "price": 604800, "capacity": 3100, "material": { "mineral-mutou": 62, "mineral-shitou": 62, "mineral-niantu": 62 } },
    { "name": "", "descript": "", "price": 642000, "capacity": 3200, "material": { "mineral-mutou": 63, "mineral-shitou": 63, "mineral-niantu": 63 } },
    { "name": "", "descript": "", "price": 643500, "capacity": 3300, "material": { "mineral-mutou": 64, "mineral-shitou": 64, "mineral-niantu": 64 } },
    { "name": "", "descript": "", "price": 663300, "capacity": 3400, "material": { "mineral-mutou": 65, "mineral-shitou": 65, "mineral-niantu": 65 } },
    { "name": "", "descript": "", "price": 683400, "capacity": 3500, "material": { "mineral-mutou": 66, "mineral-shitou": 66, "mineral-niantu": 66 } },
    { "name": "", "descript": "", "price": 703800, "capacity": 3600, "material": { "mineral-mutou": 67, "mineral-shitou": 67, "mineral-niantu": 67 } },
    { "name": "", "descript": "", "price": 724500, "capacity": 3700, "material": { "mineral-mutou": 68, "mineral-shitou": 68, "mineral-niantu": 68 } },
    { "name": "", "descript": "", "price": 745500, "capacity": 3800, "material": { "mineral-mutou": 69, "mineral-shitou": 69, "mineral-niantu": 69 } },
    { "name": "", "descript": "", "price": 766800, "capacity": 3900, "material": { "mineral-mutou": 70, "mineral-shitou": 70, "mineral-niantu": 70 } },
    { "name": "", "descript": "", "price": 788400, "capacity": 4000, "material": { "mineral-mutou": 71, "mineral-shitou": 71, "mineral-niantu": 71 } }
];

// 3. 食堂
handler.canteen = [
    { "name": "", "descript": "", "price": 0, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 },"produce_cycle": 20, "unlock": 9 },
    { "name": "", "descript": "", "price": 15000, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 },"produce_cycle": 20, "unlock": 10 },
    { "name": "", "descript": "", "price": 30000, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 },"produce_cycle": 20, "unlock": 11 },
    { "name": "", "descript": "", "price": 50000, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 },"produce_cycle": 20, "unlock": 12 },
    { "name": "", "descript": "", "price": 75000, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 },"produce_cycle": 20, "unlock": 13 },
    { "name": "", "descript": "", "price": 105000, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 },"produce_cycle": 20, "unlock": 14 },
    { "name": "", "descript": "", "price": 140000, "material": { "mineral-mutou": 14, "mineral-shitou": 14, "mineral-niantu": 14 },"produce_cycle": 20, "unlock": 15 },
    { "name": "", "descript": "", "price": 180000, "material": { "mineral-mutou": 16, "mineral-shitou": 16, "mineral-niantu": 16 },"produce_cycle": 20, "unlock": 16 },
    { "name": "", "descript": "", "price": 225000, "material": { "mineral-mutou": 18, "mineral-shitou": 18, "mineral-niantu": 18 },"produce_cycle": 20, "unlock": 17 },
    { "name": "", "descript": "", "price": 275000, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 },"produce_cycle": 20, "unlock": 18 },
    { "name": "", "descript": "", "price": 330000, "material": { "mineral-mutou": 22, "mineral-shitou": 22, "mineral-niantu": 22 },"produce_cycle": 20, "unlock": 19 },
    { "name": "", "descript": "", "price": 390000, "material": { "mineral-mutou": 24, "mineral-shitou": 24, "mineral-niantu": 24 },"produce_cycle": 20, "unlock": 20 },
    { "name": "", "descript": "", "price": 455000, "material": { "mineral-mutou": 26, "mineral-shitou": 26, "mineral-niantu": 26 },"produce_cycle": 20, "unlock": 21 },
    { "name": "", "descript": "", "price": 525000, "material": { "mineral-mutou": 28, "mineral-shitou": 28, "mineral-niantu": 28 },"produce_cycle": 20, "unlock": 22 },
    { "name": "", "descript": "", "price": 600000, "material": { "mineral-mutou": 30, "mineral-shitou": 30, "mineral-niantu": 30 },"produce_cycle": 20, "unlock": 23 }
];

// 4. 宾馆
handler.hotel = [
    { "name": "宾馆", "descript": "", "price": 10000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 3, "profit": 100, "sleep": 60, "circle_time": 12, "unlock": 14 },
    { "name": "宾馆", "descript": "", "price": 30000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 4, "profit": 110, "sleep": 57, "circle_time": 11, "unlock": 15 },
    { "name": "宾馆", "descript": "", "price": 60000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 5, "profit": 120, "sleep": 54, "circle_time": 10, "unlock": 16 },
    { "name": "宾馆", "descript": "", "price": 100000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 6, "profit": 130, "sleep": 51, "circle_time": 9, "unlock": 17 },
    { "name": "宾馆", "descript": "", "price": 150000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 7, "profit": 140, "sleep": 48, "circle_time": 8, "unlock": 18 },
    { "name": "宾馆", "descript": "", "price": 210000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 8, "profit": 150, "sleep": 45, "circle_time": 7, "unlock": 19 },
    { "name": "宾馆", "descript": "", "price": 280000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 9, "profit": 160, "sleep": 42, "circle_time": 6, "unlock": 20 },
    { "name": "宾馆", "descript": "", "price": 360000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 10, "profit": 170, "sleep": 39, "circle_time": 5, "unlock": 21 },
    { "name": "宾馆", "descript": "", "price": 450000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 11, "profit": 180, "sleep": 36, "circle_time": 4, "unlock": 22 },
    { "name": "宾馆", "descript": "", "price": 550000, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "capacity": 12, "profit": 190, "sleep": 33, "circle_time": 3, "unlock": 23 }
];

// 5. 马路
handler.route = [
    { "name": "公路", "price": 2000, "material": { "mineral-mutou": 1, "mineral-shitou": 1, "mineral-niantu": 1 }, "revenu_increase": 0.05, "descript": "" },
    { "name": "公路", "price": 6000, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 }, "revenu_increase": 0.10, "descript": "" },
    { "name": "公路", "price": 12000, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 }, "revenu_increase": 0.15, "descript": "" },
    { "name": "公路", "price": 20000, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "revenu_increase": 0.20, "descript": "" },
    { "name": "公路", "price": 30000, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 }, "revenu_increase": 0.25, "descript": "" },
    { "name": "公路", "price": 42000, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "revenu_increase": 0.30, "descript": "" },
    { "name": "公路", "price": 56000, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "revenu_increase": 0.35, "descript": "" },
    { "name": "公路", "price": 72000, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "revenu_increase": 0.40, "descript": "" },
    { "name": "公路", "price": 90000, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "revenu_increase": 0.45, "descript": "" },
    { "name": "公路", "price": 110000, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "revenu_increase": 0.50, "descript": "" },
    { "name": "公路", "price": 132000, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "revenu_increase": 0.55, "descript": "" },
    { "name": "公路", "price": 156000, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "revenu_increase": 0.60, "descript": "" },
    { "name": "公路", "price": 182000, "material": { "mineral-mutou": 13, "mineral-shitou": 13, "mineral-niantu": 13 }, "revenu_increase": 0.65, "descript": "" },
    { "name": "公路", "price": 210000, "material": { "mineral-mutou": 14, "mineral-shitou": 14, "mineral-niantu": 14 }, "revenu_increase": 0.70, "descript": "" },
    { "name": "公路", "price": 240000, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 }, "revenu_increase": 0.75, "descript": "" },
    { "name": "公路", "price": 272000, "material": { "mineral-mutou": 16, "mineral-shitou": 16, "mineral-niantu": 16 }, "revenu_increase": 0.80, "descript": "" },
    { "name": "公路", "price": 306000, "material": { "mineral-mutou": 17, "mineral-shitou": 17, "mineral-niantu": 17 }, "revenu_increase": 0.85, "descript": "" },
    { "name": "公路", "price": 342000, "material": { "mineral-mutou": 18, "mineral-shitou": 18, "mineral-niantu": 18 }, "revenu_increase": 0.90, "descript": "" },
    { "name": "公路", "price": 380000, "material": { "mineral-mutou": 19, "mineral-shitou": 19, "mineral-niantu": 19 }, "revenu_increase": 0.95, "descript": "" },
    { "name": "公路", "price": 420000, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 }, "revenu_increase": 1.00, "descript": "" }
];

// 6. 码头
handler.harbour = [
    { "name": "码头", "price": 4000, "transport_time": 900, "order_count": 1, "revenu_increase": 0, "material": { "mineral-mutou": 1, "mineral-shitou": 1, "mineral-niantu": 1 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 12000, "transport_time": 870, "order_count": 1, "revenu_increase": 0.05, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 24000, "transport_time": 840, "order_count": 1, "revenu_increase": 0.10, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 40000, "transport_time": 810, "order_count": 2, "revenu_increase": 0.15, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 60000, "transport_time": 780, "order_count": 2, "revenu_increase": 0.20, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 84000, "transport_time": 750, "order_count": 2, "revenu_increase": 0.25, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 112000, "transport_time": 720, "order_count": 3, "revenu_increase": 0.30, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 144000, "transport_time": 690, "order_count": 3, "revenu_increase": 0.35, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 180000, "transport_time": 660, "order_count": 3, "revenu_increase": 0.40, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 220000, "transport_time": 630, "order_count": 4, "revenu_increase": 0.45, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 264000, "transport_time": 600, "order_count": 4, "revenu_increase": 0.50, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 312000, "transport_time": 570, "order_count": 4, "revenu_increase": 0.55, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 364000, "transport_time": 540, "order_count": 5, "revenu_increase": 0.60, "material": { "mineral-mutou": 13, "mineral-shitou": 13, "mineral-niantu": 13 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 420000, "transport_time": 510, "order_count": 5, "revenu_increase": 0.65, "material": { "mineral-mutou": 14, "mineral-shitou": 14, "mineral-niantu": 14 }, "materialNum": 1, "unlock": 0, "descript": "" },
    { "name": "码头", "price": 480000, "transport_time": 480, "order_count": 5, "revenu_increase": 0.70, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 }, "materialNum": 1, "unlock": 0, "descript": "" }
];

// 7. 货摊
handler.stall = [
    { "name": "货摊", "price": 5000, "unlock": 4, "guest_cycle": 5, "wait_time": 2, "buy_count": 1, "revenu_increase": 0,"descript": "" },
    { "name": "货摊", "price": 10000, "unlock": 6, "guest_cycle": 4.5, "wait_time": 2, "buy_count": 1, "revenu_increase": 0.2,"descript": "" },
    { "name": "货摊", "price": 20000, "unlock": 8, "guest_cycle": 4, "wait_time": 2, "buy_count": 2, "revenu_increase": 0.4,"descript": "" },
    { "name": "货摊", "price": 30000, "unlock": 10, "guest_cycle": 3.5, "wait_time": 2, "buy_count": 2, "revenu_increase": 0.6,"descript": "" },
    { "name": "货摊", "price": 40000, "unlock": 12, "guest_cycle": 3, "wait_time": 2, "buy_count": 3, "revenu_increase": 0.8,"descript": "" },
    { "name": "货摊", "price": 50000, "unlock": 14, "guest_cycle": 2.5, "wait_time": 2, "buy_count": 3, "revenu_increase": 1,"descript": "" }
];

// 8. 货运站
handler.depot = [
    { "name": "货运站", "price": 0, "unlock": 0, "order_count": 5, "order_cycle": 90, "revenu_increase": 0, "descript": "" },
    { "name": "货运站", "price": 15000, "unlock": 2, "order_count": 6, "order_cycle": 80, "revenu_increase": 0.2, "descript": "" },
    { "name": "货运站", "price": 30000, "unlock": 4, "order_count": 7, "order_cycle": 70, "revenu_increase": 0.4, "descript": "" },
    { "name": "货运站", "price": 50000, "unlock": 6, "order_count": 8, "order_cycle": 60, "revenu_increase": 0.6, "descript": "" },
    { "name": "货运站", "price": 75000, "unlock": 8, "order_count": 9, "order_cycle": 50, "revenu_increase": 0.8, "descript": "" },
    { "name": "货运站", "price": 105000, "unlock": 10, "order_count": 10, "order_cycle": 40, "revenu_increase": 1, "descript": "" }
];

// 9.楼层
handler.floor = [
    { "name": "", "descript": "", "price": 0, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "unlock": 0 },
    { "name": "", "descript": "", "price": 0, "material": { "mineral-mutou": 0, "mineral-shitou": 0, "mineral-niantu": 0 }, "unlock": 0 },
    { "name": "", "descript": "", "price": 10000, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "unlock": 4 },
    { "name": "", "descript": "", "price": 40000, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 }, "unlock": 8 },
    { "name": "", "descript": "", "price": 90000, "material": { "mineral-mutou": 30, "mineral-shitou": 30, "mineral-niantu": 30 }, "unlock": 12 },
    { "name": "", "descript": "", "price": 160000, "material": { "mineral-mutou": 40, "mineral-shitou": 40, "mineral-niantu": 40 }, "unlock": 16 },
    { "name": "", "descript": "", "price": 250000, "material": { "mineral-mutou": 50, "mineral-shitou": 50, "mineral-niantu": 50 }, "unlock": 20 }
];

// 10.出租房
handler.rental = [
    { rent: 50, disTime: 60, maxAccrual: 15 },
    { rent: 100, disTime: 60, maxAccrual: 15 },
    { rent: 150, disTime: 60, maxAccrual: 15 },
    { rent: 200, disTime: 60, maxAccrual: 15 },
    { rent: 250, disTime: 60, maxAccrual: 15 },
    { rent: 300, disTime: 60, maxAccrual: 15 },
    { rent: 350, disTime: 60, maxAccrual: 15 },
    { rent: 400, disTime: 60, maxAccrual: 15 },
    { rent: 450, disTime: 60, maxAccrual: 15 },
    { rent: 500, disTime: 60, maxAccrual: 15 },
    { rent: 550, disTime: 60, maxAccrual: 15 },
    { rent: 600, disTime: 60, maxAccrual: 15 }
];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. 地面
handler.ground = [
    { "name": "地板", "descript": "", "price": 0, "unlock": 0 },
    { "name": "地板", "descript": "", "price": 100000, "unlock": 1 },
    { "name": "地板", "descript": "", "price": 150000, "unlock": 2 },
    { "name": "地板", "descript": "", "price": 200000, "unlock": 3 },
    { "name": "地板", "descript": "", "price": 250000, "unlock": 4 },
    { "name": "地板", "descript": "", "price": 300000, "unlock": 5 },
    { "name": "地板", "descript": "", "price": 350000, "unlock": 6 },
    { "name": "地板", "descript": "", "price": 400000, "unlock": 7 },
    { "name": "地板", "descript": "", "price": 450000, "unlock": 8 },
    { "name": "地板", "descript": "", "price": 500000, "unlock": 9 }
];

// 2. 墙
handler.wall = [
    { "name": "院墙", "descript": "", "price": 0, "unlock": 0 },
    { "name": "院墙", "descript": "", "price": 100000, "unlock": 1 },
    { "name": "院墙", "descript": "", "price": 150000, "unlock": 2 },
    { "name": "院墙", "descript": "", "price": 200000, "unlock": 3 },
    { "name": "院墙", "descript": "", "price": 250000, "unlock": 4 },
    { "name": "院墙", "descript": "", "price": 300000, "unlock": 5 },
    { "name": "院墙", "descript": "", "price": 350000, "unlock": 6 },
    { "name": "院墙", "descript": "", "price": 400000, "unlock": 7 },
    { "name": "院墙", "descript": "", "price": 450000, "unlock": 8 },
    { "name": "院墙", "descript": "", "price": 500000, "unlock": 9 }
];

// 3.中央装饰
handler.garden = [
    { "name": "花坛", "descript": "", "price": 0, "unlock": 0 },
    { "name": "花坛", "descript": "", "price": 10000, "unlock": 1 },
    { "name": "花坛", "descript": "", "price": 15000, "unlock": 2 },
    { "name": "花坛", "descript": "", "price": 20000, "unlock": 3 },
    { "name": "花坛", "descript": "", "price": 25000, "unlock": 4 },
    { "name": "花坛", "descript": "", "price": 30000, "unlock": 5 }
];

// 4.货车
handler.truck = [
    { "name": "货车", "descript": "", "price": 0, "capacity": 20, "transport_time": 90, "route": 0 },
    { "name": "货车", "descript": "", "price": 15000, "capacity": 40, "transport_time": 80, "route": 3 },
    { "name": "货车", "descript": "", "price": 30000, "capacity": 60, "transport_time": 70, "route": 6 },
    { "name": "货车", "descript": "", "price": 50000, "capacity": 80, "transport_time": 60, "route": 9 },
    { "name": "货车", "descript": "", "price": 75000, "capacity": 100, "transport_time": 50, "route": 12 },
    { "name": "货车", "descript": "", "price": 105000, "capacity": 120, "transport_time": 40, "route": 15 }
];

// 5.船
handler.catch = [
    { "name": "渔船", "descript": "", "price": 10000, "capacity": 3, "transport_time": 600, "harbour": 0, "unlock": 0 },
    { "name": "渔船", "descript": "", "price": 30000, "capacity": 4, "transport_time": 540, "harbour": 2, "unlock": 0 },
    { "name": "渔船", "descript": "", "price": 60000, "capacity": 5, "transport_time": 480, "harbour": 4, "unlock": 0 },
    { "name": "渔船", "descript": "", "price": 100000, "capacity": 6, "transport_time": 420, "harbour": 6, "unlock": 0 },
    { "name": "渔船", "descript": "", "price": 150000, "capacity": 7, "transport_time": 360, "harbour": 8, "unlock": 0 },
    { "name": "渔船", "descript": "", "price": 210000, "capacity": 8, "transport_time": 300, "harbour": 10, "unlock": 0 }
];

// 6.饭桌
handler.desk = [
    { "name": "餐桌", "descript": "", "price": 0, "dishes_num": 1, "guest_cycle": 10, "wait_time": 5, "eat_time": 10, "revenu_increase": 0, "canteen": 0, "unlock": 0 },
    { "name": "餐桌", "descript": "", "price": 15000, "dishes_num": 1, "guest_cycle": 10, "wait_time": 4.5, "eat_time": 9, "revenu_increase": 0.2, "canteen": 2, "unlock": 0 },
    { "name": "餐桌", "descript": "", "price": 30000, "dishes_num": 2, "guest_cycle": 10, "wait_time": 4, "eat_time": 8, "revenu_increase": 0.4, "canteen": 4, "unlock": 0 },
    { "name": "餐桌", "descript": "", "price": 50000, "dishes_num": 2, "guest_cycle": 10, "wait_time": 3.5, "eat_time": 7, "revenu_increase": 0.6, "canteen": 6, "unlock": 0 },
    { "name": "餐桌", "descript": "", "price": 75000, "dishes_num": 3, "guest_cycle": 10, "wait_time": 3, "eat_time": 6, "revenu_increase": 0.8, "canteen": 8, "unlock": 0 },
    { "name": "餐桌", "descript": "", "price": 105000, "dishes_num": 3, "guest_cycle": 10, "wait_time": 2.5, "eat_time": 5, "revenu_increase": 1, "canteen": 10, "unlock": 0 }
];

// 7. 地砖
handler.floortile = [
    { "name": "地砖", "descript": "", "price": 50000, "unlock": 0 },
    { "name": "地砖", "descript": "", "price": 100000, "unlock": 1 },
    { "name": "地砖", "descript": "", "price": 150000, "unlock": 2 },
    { "name": "地砖", "descript": "", "price": 200000, "unlock": 3 },
    { "name": "地砖", "descript": "", "price": 250000, "unlock": 4 },
    { "name": "地砖", "descript": "", "price": 300000, "unlock": 5 },
    { "name": "地砖", "descript": "", "price": 350000, "unlock": 6 },
    { "name": "地砖", "descript": "", "price": 400000, "unlock": 7 },
    { "name": "地砖", "descript": "", "price": 450000, "unlock": 8 },
    { "name": "地砖", "descript": "", "price": 500000, "unlock": 9 }
];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1.面食店
handler.noddle = [
    { "name": "面食店", "descript": "", "price": 2000, "material": { "mineral-mutou": 1, "mineral-shitou": 1, "mineral-niantu": 1 }, "make_time": 60, "revenu_increase": 0, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 }, "make_time": 57, "revenu_increase": 0.1, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 }, "make_time": 54, "revenu_increase": 0.2, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "make_time": 51, "revenu_increase": 0.2, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 }, "make_time": 48, "revenu_increase": 0.4, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 0, "saleTime": 10 },
    { "name": "面食店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 0, "saleTime": 10 }
];

// 2.豆腐店
handler.tofu = [
    { "name": "豆腐店", "descript": "", "price": 6000, "material": { "mineral-mutou": 1, "mineral-shitou": 1, "mineral-niantu": 1 }, "make_time": 60, "revenu_increase": 0, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 2, "saleTime": 10 },
    { "name": "豆腐店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 2, "saleTime": 10 }

];

// 3.调料店
handler.condiment = [
    { "name": "调料店", "descript": "", "price": 12000, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 }, "make_time": 60, "revenu_increase": 0, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 4, "saleTime": 10 },
    { "name": "调料店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 4, "saleTime": 10 }
];

// 4.酒馆
handler.tavern = [
    { "name": "酒馆", "descript": "", "price": 20000, "material": { "mineral-mutou": 2, "mineral-shitou": 2, "mineral-niantu": 2 }, "make_time": 60, "revenu_increase": 0, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 45, "revenu_increase": 0.2, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 14, "saleTime": 10 },
    { "name": "酒馆", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 14, "saleTime": 10 }
];

// 5.糖果
handler.candy = [
    { "name": "糖果", "descript": "", "price": 30000, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 }, "make_time": 60, "revenu_increase": 0, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock":6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 6, "saleTime": 10 },
    { "name": "糖果", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 6, "saleTime": 10 }
];

// 6.牛奶
handler.milk = [
    { "name": "牛奶", "descript": "", "price": 42000, "material": { "mineral-mutou": 3, "mineral-shitou": 3, "mineral-niantu": 3 }, "make_time": 60, "revenu_increase": 0, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 8, "saleTime": 10 },
    { "name": "牛奶", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 8, "saleTime": 10 }
];

// 7.卤肉
handler.stewedmeat = [
    { "name": "卤肉", "descript": "", "price": 56000, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "make_time": 60, "revenu_increase": 0, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 16, "mineral-shitou": 16, "mineral-niantu": 16 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 12, "saleTime": 10 },
    { "name": "卤肉", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 12, "saleTime": 10 }
];

// 8.茶叶店
handler.tea = [
    { "name": "茶叶店", "descript": "", "price": 72000, "material": { "mineral-mutou": 4, "mineral-shitou": 4, "mineral-niantu": 4 }, "make_time": 60, "revenu_increase": 0, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 16, "mineral-shitou": 16, "mineral-niantu": 16 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 10, "saleTime": 10 },
    { "name": "茶叶店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 10, "saleTime": 10 }
];

// 9.糕点店
handler.cake = [
    { "name": "糕点店", "descript": "", "price": 90000, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 }, "make_time": 60, "revenu_increase": 0, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 }, "make_time": 45, "revenu_increase": 0.2, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 25, "mineral-shitou": 25, "mineral-niantu": 25 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 16, "saleTime": 10 },
    { "name": "糕点店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 16, "saleTime": 10 }
];

// 10.果脯店
handler.candiedfruit = [
    { "name": "果脯店", "descript": "", "price": 110000, "material": { "mineral-mutou": 5, "mineral-shitou": 5, "mineral-niantu": 5 }, "make_time": 60, "revenu_increase": 0, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 15, "mineral-shitou": 15, "mineral-niantu": 15 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 20, "mineral-shitou": 20, "mineral-niantu": 20 }, "make_time": 45, "revenu_increase": 0.2, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 25, "mineral-shitou": 25, "mineral-niantu": 25 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 18, "saleTime": 10 },
    { "name": "果脯店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 18, "saleTime": 10 }
];

// 11.野味店
handler.bushmeat = [
    { "name": "野味店", "descript": "", "price": 132000, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 60, "revenu_increase": 0, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 18, "mineral-shitou": 18, "mineral-niantu": 18 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 24, "mineral-shitou": 24, "mineral-niantu": 24 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 30, "mineral-shitou": 30, "mineral-niantu": 30 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 20, "saleTime": 10 },
    { "name": "野味店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 20, "saleTime": 10 }
];

// 12.海鲜店
handler.seafood = [
    { "name": "海鲜店", "descript": "", "price": 156000, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 60, "revenu_increase": 0, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 12, "mineral-shitou": 12, "mineral-niantu": 12 }, "make_time": 55, "revenu_increase": 0.1, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 18, "mineral-shitou": 18, "mineral-niantu": 18 }, "make_time": 50, "revenu_increase": 0.2, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 24, "mineral-shitou": 24, "mineral-niantu": 24 }, "make_time": 45, "revenu_increase": 0.3, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 30, "mineral-shitou": 30, "mineral-niantu": 30 }, "make_time": 40, "revenu_increase": 0.4, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 6, "mineral-shitou": 6, "mineral-niantu": 6 }, "make_time": 45, "revenu_increase": 0.5, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 7, "mineral-shitou": 7, "mineral-niantu": 7 }, "make_time": 42, "revenu_increase": 0.6, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 8, "mineral-shitou": 8, "mineral-niantu": 8 }, "make_time": 39, "revenu_increase": 0.7, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 9, "mineral-shitou": 9, "mineral-niantu": 9 }, "make_time": 36, "revenu_increase": 0.8, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 10, "mineral-shitou": 10, "mineral-niantu": 10 }, "make_time": 33, "revenu_increase": 0.9, "unlock": 22, "saleTime": 10 },
    { "name": "海鲜店", "descript": "", "price": 0, "material": { "mineral-mutou": 11, "mineral-shitou": 11, "mineral-niantu": 11 }, "make_time": 30, "revenu_increase": 1.0, "unlock": 22, "saleTime": 10 }
];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 1. 耕地设施配置
handler.land = {
    "price": [
        100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
        1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400,
        3500, 3600
    ],

    "unlock": [
        0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31, 32
    ]
};

// 2. 果树设施配置
handler.orchard = [
    // 名称/描述/价格/产出物品/解锁等级/收获周期/可收获季节
    { "name": "", "descript": "", "price": 1000, "unlock": 6 },
    { "name": "", "descript": "", "price": 2000, "unlock": 7 },
    { "name": "", "descript": "", "price": 3000, "unlock": 8 },
    { "name": "", "descript": "", "price": 4000, "unlock": 9 },
    { "name": "", "descript": "", "price": 5000, "unlock": 10 },
    { "name": "", "descript": "", "price": 6000, "unlock": 11 },
    { "name": "", "descript": "", "price": 7000, "unlock": 12 },
    { "name": "", "descript": "", "price": 8000, "unlock": 13 },
    { "name": "", "descript": "", "price": 9000, "unlock": 14 },
    { "name": "", "descript": "", "price": 10000, "unlock": 15 },
    { "name": "", "descript": "", "price": 11000, "unlock": 16 },
    { "name": "", "descript": "", "price": 12000, "unlock": 17 },
    { "name": "", "descript": "", "price": 13000, "unlock": 18 },
    { "name": "", "descript": "", "price": 14000, "unlock": 19 },
    { "name": "", "descript": "", "price": 15000, "unlock": 20 },
    { "name": "", "descript": "", "price": 16000, "unlock": 21 },
    { "name": "", "descript": "", "price": 17000, "unlock": 22 },
    { "name": "", "descript": "", "price": 18000, "unlock": 23 }
];

// 3. 养殖设施配置
handler.livestock = [
    { "name": "猪圈", "product": "livestock-zhu", "descript": "", "price": 5000, "extend_price": [50, 100, 150, 200], "unlock": 4 },
    { "name": "奶牛场", "product": "livestock-nainiu", "descript": "", "price": 10000, "extend_price": [50, 100, 150, 200], "unlock": 6 },
    { "name": "羊圈", "product": "livestock-yang", "descript": "", "price": 15000, "extend_price": [50, 100, 150, 200], "unlock": 8 },
    { "name": "养鸡场", "product": "livestock-muji", "descript": "", "price": 20000, "extend_price": [50, 100, 150, 200], "unlock": 10 },
    { "name": "肉牛场", "product": "livestock-rouniu", "descript": "", "price": 25000, "extend_price": [50, 100, 150, 200], "unlock": 12 },
    { "name": "肉鸡场", "product": "livestock-gongji", "descript": "", "price": 30000, "extend_price": [50, 100, 150, 200], "unlock": 14 },
    { "name": "鸭场", "product": "livestock-ya", "descript": "", "price": 35000, "extend_price": [50, 100, 150, 200], "unlock": 16 },
    { "name": "鹅圈", "product": "livestock-e", "descript": "", "price": 40000, "extend_price": [50, 100, 150, 200], "unlock": 18 }
];

// 4. 水产设施配置
handler.aquatic = [
    { "name": "鲤鱼塘", "descript": "", "price": 10000, "extend_price": [50, 100, 150, 200], "unlock": 11 },
    { "name": "对虾塘", "descript": "", "price": 20000, "extend_price": [50, 100, 150, 200], "unlock": 13 },
    { "name": "蟹塘", "descript": "", "price": 30000, "extend_price": [50, 100, 150, 200], "unlock": 15 },
    { "name": "蛤蜊塘", "descript": "", "price": 40000, "extend_price": [50, 100, 150, 200], "unlock": 17 }
];

// 5. 水田配置
handler.paddy = [
    { "name": "", "descript": "", "price": 2000, "unlock": 9 },
    { "name": "", "descript": "", "price": 4000, "unlock": 10 },
    { "name": "", "descript": "", "price": 6000, "unlock": 11 },
    { "name": "", "descript": "", "price": 8000, "unlock": 12 },
    { "name": "", "descript": "", "price": 10000, "unlock": 13 },
    { "name": "", "descript": "", "price": 12000, "unlock": 14 },
    { "name": "", "descript": "", "price": 14000, "unlock": 15 },
    { "name": "", "descript": "", "price": 16000, "unlock": 16 }
];

// 6.外出
handler.outdoor = {
    "hunt": { "name": "hunt", "transport_time": 5 * 60, "product_num": 8, "unlock": 4 },
    "pick": { "name": "pick", "transport_time": 10 * 60, "product_num": 8, "unlock": 9 },
    "catch": { "name": "catch", "transport_time": 14 * 60, "product_num": 8, "unlock": 14 }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 0.商铺顺序
handler.factorys = {
    "noddle": "面食店", "tofu": "豆腐店", "condiment": "酱醋店", "candy": "糖果店", "milk": "乳制品店", "tea": "茶叶店", "stewedmeat": "肉制品店", "tavern": "酒馆",
    "cake": "蛋糕店", "candiedfruit": "果铺店", "bushmeat": "野味店", "seafood": "海鲜店"
};

// 1.仓库类别
handler.storeClass = {
    "land": "耕地", "livestock": "养殖", "orchard": "果树", "aquatic": "水产", "paddy": "水田", "mineral": "采矿",
    "outdoor": "外出", "food": "厨房加工"
};

// 2.货摊类别
handler.stallClass = {
    "land": "耕地", "livestock": "养殖", "orchard": "果树", "aquatic": "水产", "paddy": "水田",
    "outdoor": "外出", "food": "厨房加工"
};
