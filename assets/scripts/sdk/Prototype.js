// 所有渲染的节点 创建
cc.RenderComponent.prototype.__preload = function () {
    //console.log("Render节点加载", this.node.uuid)

    this._resetAssembler();
    this._activateMaterial();
}

// 所有渲染的节点 销毁
cc.RenderComponent.prototype.onDestroy = function () {
    //console.log("Render节点销毁", this.node.uuid);

    let materials = this._materials;
    for (let i = 0; i < materials.length; i++) {
        cc.pool.material.put(materials[i]);
    }
    materials.length = 0;
    cc.pool.assembler.put(this._assembler);
    this.disableRender();

    if (cc.Global) {
        cc.Global.assertCenter.releaseSpriteFrame(this.node);
    }
}

// 所有渲染的节点 显示
cc.RenderComponent.prototype.onEnable = function () {
    //console.log("显示");

    if (this.node._renderComponent) {
        this.node._renderComponent.enabled = false;
    }
    this.node._renderComponent = this;
    this.node._renderFlag |= cc.RenderFlow.FLAG_OPACITY_COLOR;

    this.setVertsDirty();
}

// 所有渲染的节点 消失
cc.RenderComponent.prototype.onDisable = function () {
    //console.log("关闭");

    this.node._renderComponent = null;
    this.disableRender();
}

// 按钮点击处理
cc.Button.prototype._onTouchBegan = function (event) {
    //console.log("点击按钮!");

    cc.Global.listenCenter.fire(cc.Global.eventConfig.PlayEffect, "click");

    if (!this.interactable || !this.enabledInHierarchy) return;
    this._pressed = true;
    this._updateState();
    event.stopPropagation();
}