module.exports = class EventConfig {
    constructor() {
        this.init();
    }

    static instance = null;
    static getInstance() {
        if (EventConfig.instance == null) {
            EventConfig.instance = new EventConfig();
        }

        return EventConfig.instance;
    }

    init() {
        this.initUserEvent();
        this.initSysEvent();
    }

    initSysEvent() {
        //内部提示
        this.InnerTips = "InnerTips";
        //飞来的图标
        this.GameSky = "GameSky";

        //加载信息
        this.LoadInfo = "LoadInfo";

        //更换语言
        this.ChangeLanguage = "ChangeLanguage";
        //引导步数
        this.GuideStep = "GuideStep";
        //阻塞游戏操作
        this.GameBlock = "GameBlock";

        //页面创建与销毁
        this.OpenPage = "OpenPage";
        this.ClosePage = "ClosePage";

        //资源加载
        this.StartLoad = "StartLoad";

        //加载类型
        this.LoadType = {
            Page: "Page",
            Folder: "Folder",
            Obj: "Obj",
            Scene: "Scene",
        };

        //music
        this.PlayMusic = "PlayMusic";
        this.PlayEffect = "PlayEffect";
        this.MusicStateChange = "MusicStateChange";
        this.EffectStateChange = "EffectStateChange";

        //网络
        this.RequestNet = "RequestNet";
        this.ResponseNet = "ResponseNet";

        //数据变化
        this.ModifyData = "ModifyData";

        //输入
        this.DeviceMotion = "DeviceMotion";
        this.KeyCode = "KeyCode";

        this.AddUpdateEvent = "AddUpdateEvent";
        this.DelUpdateEvent = "DelUpdateEvent";

        //游戏状态
        this.GameOver = "GameOver";
        this.PauseGame = "PauseGame";

        //游戏前后台切换
        this.HideGame = "HideGame";
        this.ShowGame = "ShowGame";

        //保存重要节点
        this.RegisterImportantNode = "RegisterImportantNode";

        //节点所在窗口位置检测
        this.RegisterNodeRectCheck = "RegisterNodeRectCheck";
        this.RemoveNodeRectCheck = "RemoveNodeRectCheck";
    }

    initUserEvent() {
        //使用特定节日
        this.CanteenChange = "CanteenChange";
        //主房变化
        this.LordModify = "LordModify"
        //金币变化
        this.CashModify = "CashModify";
        //钻石变化
        this.GemModify = "GemModify";
        //日期变化
        this.DateModify = "DateModify";

        //装饰变化
        this.DecorateModify = "DecorateModify";
        //主题变化
        this.ThemeModify = "ThemeModify";

        //任务和成就
        this.MainTaskModify = "MainTaskModify";
        this.BrunchTaskModify = "BrunchTaskModify";
        this.DayTaskModify = "DayTaskModify";
        this.AchiveModify = "AchiveModify";

        //仓储发生变化
        this.StoreModify = "StoreModify";
        //货摊角色
        this.StallModify = "StallModify";
        //户外活动
        this.OutDoorModify = "OutDoorModify";
        //创建角色
        this.CreateRole = "CreateRole";

        //食客消息
        this.DinerArrive = "DinerArrive";
        this.DinerLeave = "DinerLeave";

        //露营变化
        this.LamperModify = "LamperModify";
        //显示屏风
        this.ShowScreen = "ShowScreen";

        //在作坊出售
        this.SaleInFactory = "SaleInFactory";
    }
}