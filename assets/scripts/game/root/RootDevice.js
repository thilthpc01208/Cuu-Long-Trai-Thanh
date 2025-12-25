cc.Class( {
    extends: cc.Component,
    onLoad ()
    {
        cc.systemEvent.setAccelerometerEnabled( true );
        cc.systemEvent.on( cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this );
    },

    onDestroy ()
    {
        cc.systemEvent.off( cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this );
    },

    onDeviceMotionEvent ( event )
    {
        let deviceData = { x: event.acc.x, y: event.acc.y };
        cc.Global.listenCenter.fire(
            cc.Global.eventConfig.DeviceMotion,
            deviceData );
    },
} );