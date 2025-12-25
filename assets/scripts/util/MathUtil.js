const Logic = require('../game/logic/logic');

module.exports = class MathUtil {
    constructor() {

    }

    static instance = null;
    static getInstance() {
        if (MathUtil.instance == null) {
            MathUtil.instance = new MathUtil();
        }
        return MathUtil.instance;
    }

    /**
     * 数字转换为金额格式99999999 -- 99,999,999
     */
    formatNumber(num) {
        num = Math.floor(num);
        let ele = num ? new Number(num).toFixed(2) + '' : '0.00';
        return ele.toString().replace(/\d+/, function (n) {
            // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                // 对整数部分添加分隔符
                return $1 + ",";
            });
        });
    }

    //向量转角度
    vectorsToDegress(dirVec) {
        // 水平向右的对比向量
        let comVec = cc.v2(0, 1);
        // 求方向向量与对比向量间的弧度
        let radian = dirVec.signAngle(comVec);
        // 将弧度转换为角度
        let degree = cc.misc.radiansToDegrees(radian);
        return degree;
    }

    //角度转向量
    degreesToVectors(degree) {
        // 将角度转换为弧度
        let radian = cc.misc.degreesToRadians(degree);
        // 一个水平向右的对比向量
        let comVec = cc.v2(0, 1);
        // 将对比向量旋转给定的弧度返回一个新的向量
        let dirVec = comVec.rotate(-radian);
        return dirVec;
    }

    /**
    * 时间信息
    */
    getDateInfo() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let currentMonth = new Date(year, month, 0);
        return {
            num: currentMonth.getDate(),//当月天数
            day: day,
            dayFlag: year + '-' + month + '-' + day,
            monthFlag: year + '-' + month
        };
    }

    /**
     * 计算差别多少天
     * @param sDate1 2006-12-18格式
     * @param sDate2 2006-12-18格式
     * @returns {number}
     */
    dateDis(sDate1, sDate2) {
        let dateSpan, tempDate, iDays;
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays;
    }

    /**
     * 获取深拷贝数据
     */
    deepCopyData(data) {
        return JSON.parse(JSON.stringify(data));
    }

    /**
     * 秒数格式化
     */
    secondFormart(second) {
        if (second < 0) { second = 0; }
        let minite = Math.floor(second / 60);
        second = second % 60;
        let str = minite + ":" + second;
        return str;
    }

    /**
    * 获取特征码
    */
    getStrHashCode(info) {
        let hash = 1315423911, i, ch;
        for (i = info.length - 1; i >= 0; i--) {
            ch = info.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }
        return (hash & 0x7FFFFFFF);
    }

    //获取一个随机用户账号
    getUserId() {
        let codes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
            "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
            "y", "z"];
        let userId = "";
        for (let index = 0; index < 8; index++) {
            let index = Math.floor(Math.random() * 1000) % codes.length;
            userId += codes[index];
        }

        return userId;
    }
}