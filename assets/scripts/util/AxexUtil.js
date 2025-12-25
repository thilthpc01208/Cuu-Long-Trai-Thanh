/**
* 作者:梁旭东 
**/
module.exports = class AxexUtil {

    constructor() {

    }

    static instance = null;
    static getInstance() {
        if (AxexUtil.instance == null) {
            AxexUtil.instance = new AxexUtil();
        }

        return AxexUtil.instance;
    }

    /**
     * 得到一个节点的世界坐标
     * node的原点在中心
     * @param {*} node 
     */
    localConvertWorldPointAR(node) {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    }

    /**
     * 得到一个节点的世界坐标
     * node的原点在左下边
     * @param {*} node 
     */
    localConvertWorldPoint(node) {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    }

    /**
     * 把一个世界坐标的点，转换到某个节点下的坐标
     * 原点在node中心
     * @param {*} node
     * @param {*} worldPoint 
     */
    worldConvertLocalPointAR(node, worldPoint) {
        if (node) {
            return node.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    }

    /**
     * 把一个世界坐标的点，转换到某个节点下的坐标
     * 原点在node左下角
     * @param {*} node 
     * @param {*} worldPoint 
     */
    worldConvertLocalPoint(node, worldPoint) {
        if (node) {

            return node.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    }

    /**
     *  * 把一个节点的本地坐标转到另一个节点的本地坐标下
     * @param {*} node 
     * @param {*} targetNode 
     */
    convetOtherNodeSpace(node, targetNode) {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint = this.localConvertWorldPoint(node);
        return this.worldConvertLocalPoint(targetNode, worldPoint);
    }

    /**
     *  * 把一个节点的本地坐标转到另一个节点的本地坐标下
     * @param {*} node 
     * @param {*} targetNode 
     */
    convetOtherNodeSpaceAR(node, targetNode) {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint = this.localConvertWorldPointAR(node);
        return this.worldConvertLocalPointAR(targetNode, worldPoint);
    }

    /**
     * 生成box
     * @param {*} node 
     * @returns 
     */
    nodeWorldBox(node) {
        let worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        worldPos.x -= node.width / 2;
        worldPos.y -= node.height / 2;
        let box = cc.Rect.fromMinMax(cc.v2(worldPos.x, worldPos.y),
            cc.v2(worldPos.x + node.width, worldPos.y + node.height));
        return box;
    }
}