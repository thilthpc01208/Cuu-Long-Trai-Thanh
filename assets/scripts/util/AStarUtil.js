/**
 * 作者:梁旭东
 **/
module.exports = class AStar {
    constructor() {
        //0可以通过
        this.CAN_RUN_FLAG = 0;
        this.NOT_RUN_FLAG = 1;
    }

    static instance = null;
    static getInstance() {
        if (AStar.instance == null) {
            AStar.instance = new AStar();
        }
        return AStar.instance;
    }

	// 整合寻路数据
	modifyData(points, start, end) {
		start = {row: start.x, col: start.y};
		end = {row: end.x, col: end.y};

		for (let i = 0; i < points.length; i++) {
			for (let j = 0; j < points[i].length; j++) {
				points[i][j] = {
					val: points[i][j],
					row: i,
					col: j,
				};
			}
		}

		return {start: start, end: end, points: points};
	}

    // 获取周围点
    getRounds(points, current) {
        let rounds = [];

        // 上
        if (current.row + 1 < points.length) {
            let point = points[current.row + 1][current.col];
            rounds.push(point);
        }

        // 下
        if (current.row - 1 >= 0) {
            let point = points[current.row - 1][current.col];
            rounds.push(point);
        }

        // 左
        if (current.col - 1 >= 0) {
            let point = points[current.row][current.col - 1];
            rounds.push(point);
        }

        // 右
        if (current.col + 1 < points[0].length) {
            let point = points[current.row][current.col + 1];
            rounds.push(point);
        }

        return rounds;
    }

    // 监测是否在列表中
    inList(list, current) {
        for (let i = 0, len = list.length; i < len; i++) {
            if ((current.row === list[i].row
                && current.col === list[i].col)
                || (current === list[i]))
                return true;
        }
        return false;
    }

	// 从遍历过的点中获取最终路径
	getResultPath(closes) {
		if (closes.length > 0) {
			// 从结尾开始往前找
			let dotCur = closes[closes.length - 1];
			let path = [];  // 存放最终路径
			let i = 0;
			while (dotCur) {
				path.unshift({x: dotCur.row, y: dotCur.col});
				dotCur = dotCur.P;  // 设置当前点指向父级
				if (!dotCur.P) {
					dotCur = null;
				}
			}
			return path;
		}
		return false;
	}

	//寻找路径（AStar算法）-地图、起点、终点
	findway(points, start, end) {
		let data = this.modifyData(points, start, end);
		points = data.points;
		end = data.end;
		start = data.start;

		let opens = [];   // 存放可检索的方块(开启列表)
		let closes = [];  // 存放已检索的方块（关闭列表）
		let cur = null;   // 当前指针
		let bFind = true; // 是否检索

		// 设置开始点的F、G为0并放入opens列表（F=G+H）
		start.F = 0;
		start.G = 0;
		start.H = 0;

		// 将起点压入closes数组，并设置cur指向起始点
		closes.push(start);
		cur = start;

		// 如果起始点紧邻结束点则不计算路径直接将起始点和结束点压入closes数组
		if (Math.abs(start.row - end.row) + Math.abs(start.col - end.col) === 1) {
			end.P = start;
			closes.push(end);
			bFind = false;
		}

		let iterator = function () {
			if (cur && bFind) {
				return this.getResultPath(closes);
			}

			//如果当前元素cur不在closes列表中，则将其压入closes列表中
			if (!this.inList(closes, cur)) {
				closes.push(cur);
			}

			// 然后获取当前点周围点
			let rounds = this.getRounds(points, cur);
			// 当四周点不在opens数组中并且可移动，设置G、H、F和父级P，并压入opens数组
			for (let i = 0; i < rounds.length; i++) {
				if ((rounds[i].val !== CAN_RUN_FLAG) || this.inList(closes, rounds[i]) || this.inList(opens, rounds[i])) {

				} else if (!this.inList(opens, rounds[i]) && rounds[i].val !== NOT_RUN_FLAG) {
					//不算斜的，只算横竖，设每格距离为1
					rounds[i].G = cur.G + 1;
					rounds[i].H = Math.abs(rounds[i].col - end.col) + Math.abs(rounds[i].row - end.row);
					rounds[i].F = rounds[i].G + rounds[i].H;

					//cur为.P的父指针
					rounds[i].P = cur;
					opens.push(rounds[i]);
				}
			}

			// 如果获取完四周点后opens列表为空，则代表无路可走，此时退出循环
			if (!opens.length) {
				cur = null;
				opens = [];
				closes = [];
				return this.getResultPath(closes);
			}

			// 按照F值由小到大将opens数组排序
			opens.sort(function (a, b) {
				return a.F - b.F;
			});

			// 取出opens数组中F值最小的元素，即opens数组中的第一个元素
			let oMinF = opens[0];
			// 存放opens数组中F值最小的元素集合
			let aMinF = [];

			// 循环opens数组，查找F值和cur的F值一样的元素，并压入aMinF数组。即找出和最小F值相同的元素有多少
			for (let i = 0; i < opens.length; i++) {
				if (opens[i].F !== oMinF.F) {
					continue;
				}
				aMinF.push(opens[i]);
			}

			// 如果最小F值有多个元素
			if (aMinF.length > 1) {
				// 计算元素与cur的曼哈顿距离
				for (let i = 0; i < aMinF.length; i++) {
					aMinF[i].D = Math.abs(aMinF[i].row - cur.row) + Math.abs(aMinF[i].col - cur.col);
				}

				// 将aMinF按照D曼哈顿距离由小到大排序（按照数值的大小对数字进行排序）
				aMinF.sort(function (a, b) {
					return a.D - b.D;
				});
				oMinF = aMinF[0];
			}

			// 将cur指向D值最小的元素
			cur = oMinF;

			// 将cur压入closes数组
			if (!this.inList(closes, cur)) {
				closes.push(cur);
			}

			// 将cur从opens数组中删除
			for (let i = 0; i < opens.length; i++) {
				if (opens[i] === cur) {
					opens.splice(i, 1);//将第i个值删除
					break;
				}
			}

			// 找到最后一点，并将结束点压入closes数组
			if (cur.H === 1) {
				end.P = cur;
				closes.push(end);
				cur = null;
			}
		}.bind(this);
		
		return iterator;
	}
}
