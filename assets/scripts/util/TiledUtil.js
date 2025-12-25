const AStar = require("./AStarUtil");

module.exports = class TileUtil {

    constructor() {

    }

    static instance = null;
    static getInstance() {
        if (TileUtil.instance == null) {
            TileUtil.instance = new TileUtil();
        }

        return TileUtil.instance;
    }

    //获取地图数组
    getTiledMapArray(tiledMap) {
        let mapSize = tiledMap.getMapSize();
        let mapArray = [];

        for (let i = 0; i < mapSize.width; i++) {
            mapArray[i] = [];
            for (let j = 0; j < mapSize.height; j++) {
                mapArray[i][j] = cc.Global.gameConfig.normalConfig.CAN_RUN_FLAG;
            }
        }

        return mapArray;
    }

    //深拷贝二维数组
    deepCopy(mapArray) {
        let array = [];
        for (let i = 0; i < mapArray.length; i++) {
            array[i] = [];
            for (let j = 0; j < mapArray[i].length; j++) {
                array[i][j] = mapArray[i][j];
            }
        }
        return array;
    }

    //加入障碍到地图数组(图)
    addFenceToMapForTile(tiledMap, layerName, mapArray) {
        let layer = tiledMap.getLayer(layerName);
        let mapSize = tiledMap.getMapSize();
        for (let i = 0; i < mapSize.width; i++) {
            for (let j = 0; j < mapSize.height; j++) {
                let prop = this.getTileProp(tiledMap, layer, i, j);
                if (prop != null && prop["block"] != null) {
                    mapArray[i][j] += prop["block"];
                }
            }
        }
    }

    //加入障碍到地图数组(对象)
    addFenceToMapForObj(tiledMap, layerName, mapArray) {
        let modifyMap = function (blockInfo) {
            if (blockInfo.fence == false) { return; }
            for (let xIndex = 0; xIndex < blockInfo.width; xIndex++) {
                for (let yIndex = 0; yIndex < blockInfo.height; yIndex++) {
                    mapArray[blockInfo.x + xIndex][blockInfo.y + yIndex] += 1;
                }
            }
        };

        let group = tiledMap.getObjectGroup(layerName);
        if (group != undefined) {
            let objects = group.getObjects();
            for (let i = 0; i < objects.length; i++) {
                modifyMap(JSON.parse(objects[i].tiled))
            }
        }
    }

    //加入物件到地图中
    addBuildsToMap(tiledMap, buildList, callback) {
        let createBuild = function (buildInfo, prefabPath, layer, position, callback) {
            cc.Global.assertCenter.readLocalPrefab(prefabPath, function (err, prefab) {
                if (err != null) { return; }

                let sprite = cc.instantiate(prefab);
                sprite.getComponent("BuildView").initData(buildInfo);
                this.addNodeToLayer(layer, sprite, position);
                callback(sprite);
            }.bind(this));
        }.bind(this);

        //遍历物件
        let ergodicBuild = function (buildList, index) {
            if (index >= buildList.length) {
                callback();
                return;
            }

            let buildInfo = buildList[index];
            let layer = tiledMap.getLayer(buildInfo.layer);
            let prefabPath = "build/" + buildInfo.type;
            let position = this.getPosForTile(tiledMap, buildInfo.x, buildInfo.y);
            createBuild(buildInfo, prefabPath, layer, position, function (node) {
                buildInfo.node = node;
                index++;
                ergodicBuild(buildList, index);
            }.bind(this));
        }.bind(this);

        ergodicBuild(buildList, 0);
    }

    //显示网格
    showGird(tiledMap, layerName, mapArray, labelArray, labelProfab) {
        for (let i = 0; i < labelArray.length; i++) {
            labelArray[i].removeFromParent();
        };

        let rolesLayer = tiledMap.getLayer(layerName);
        for (let i = 0; i < mapArray.length; i++) {
            for (let j = 0; j < mapArray[i].length; j++) {
                let label = cc.instantiate(labelProfab);
                label.getComponent(cc.Label).string = mapArray[i][j];
                this.addNodeToLayer(rolesLayer, label, this.getPosForTile(tiledMap, i, j));
                labelArray.push(label);
            }
        }
    }

    //找到一个可以到达的地图点
    getCanReachPoint(mapArray) {
        if (mapArray != null && mapArray.length == 0) {
            return null;
        }

        let i = Math.floor(Math.random() * mapArray.length);
        let j = Math.floor(Math.random() * mapArray[0].length);
        for (; i < mapArray.length; i++) {
            for (; j < mapArray[i].length; j++) {
                if ((mapArray[i][j] === cc.Global.gameConfig.normalConfig.CAN_RUN_FLAG)) {
                    return { x: i, y: j };
                }
            }
        }

        return null;
    }

    //获取对象层信息
    getObjectGroup(tiledMap, groupName, callback) {
        let group = tiledMap.getObjectGroup(groupName);
        if (group != undefined) {
            let objects = group.getObjects();
            callback(objects);
        }
    }

    //获取图块属性
    getTileProp(tiledMap, layer, tileX, tileY) {
        let gid = layer.getTileGIDAt(tileX, tileY);
        let prop = tiledMap.getPropertiesForGID(gid);
        if (prop == undefined) {
            prop = null;
        }
        return prop;
    }

    //将像素坐标转化为瓦片坐标
    getTilePos(tiledMap, pos) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();

        pos.x += mapSize.width * tileSize.width / 2 - tileSize.width / 2;
        pos.y += mapSize.height * tileSize.height / 2 - tileSize.height / 2;

        let x = pos.x / tileSize.width;
        let y = mapSize.height - (pos.y / tileSize.height);

        return new cc.Vec2(Math.floor(x), Math.floor(y));
    }

    //网格转像素
    getPosForTile(tiledMap, tileX, tileY) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();

        let x = tileX * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - tileY) * tileSize.height + tileSize.height / 2;

        x = x - mapSize.width * tileSize.width / 2;
        y = y - mapSize.height * tileSize.height / 2

        return new cc.Vec2(Math.floor(x), Math.floor(y));
    }

    //寻路
    searchPath(mapArray, start, end) {
        let result = AStar.getInstance().findWay(mapArray.slice(0), start, end);
        return result;
    }

    //增加用户节点
    addNodeToLayer(layer, node, pos) {
        node.x = pos.x;
        node.y = pos.y;
        layer.addUserNode(node);
    }

    //移除用户节点
    removeNodeToLayer(layer, node) {
        layer.removeUserNode(node);
    }
}