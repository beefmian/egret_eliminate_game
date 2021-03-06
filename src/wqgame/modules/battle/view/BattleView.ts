/**
 * 战斗界面
 */
class BattleView extends BaseEuiView {

	public scroller: eui.Scroller;
	public currency: CurrencyCom; // 货币组件
	public btn_hall: eui.Button;

	public map: BattleMap;	// 地图
	private _model: BattleModel;

	public constructor($controller: BaseController, $layer: number) {
		super($controller, $layer);
		let self = this;
		self.skinName = SkinName.BattleViewSkin;
		self.setResources(["battle"]);
	}

	/** 对面板进行显示初始化，用于子类继承 */
	public initUI(): void {
		super.initUI();
		let self = this;
		self.currency.initUI();
		self.map = new BattleMap(self.controller, LayerManager.GAME_MAP_LAYER);
		self.scroller.viewport = self.map.container;
		self.map.addToParent();
	}

	/** 对面板数据的初始化，用于子类继承 */
	public initData(): void {
		super.initData();
	}

	/** 面板开启执行函数，用于子类继承 */
	public open(...param: any[]): void {
		super.open(param);
		let self = this;
		self._model = <BattleModel>self.controller.getModel();
		//初始化地图数据
		self.map.open(self.controller);
		self.scroller.validateNow();
		self.scroller.viewport.scrollV = self.scroller.viewport.contentHeight - self.scroller.viewport.height;
	}

	public addEvents(): void {
		super.addEvents();
		let self = this;
		// self.scroller.addEventListener(egret.Event.CHANGE, self.onMapChange, self);
		self.btn_hall.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onGotoHall, self);
		self.setBtnEffect(["btn_hall"]);
		self.registerFunc(BattleConst.MAP_ITEM_UPDATE, self.onUpdateMapItem, self);
	}

	public removeEvents(): void {
		super.removeEvents();
		let self = this;
		self.btn_hall.removeEventListener(egret.TouchEvent.TOUCH_TAP, self.onGotoHall, self);
		// self.scroller.removeEventListener(egret.Event.CHANGE, self.onMapChange, self);
	}

	// private onMapChange(): void {
	// 	let self = this;
	// 	//已经滑动到顶部
	// 	if (self.scroller.viewport.scrollV == 0) {
	// 		let maxMission: number = self._model.getMapIndex(App.PlayerInfoManager.Info.data.topMission) * 2 * 10;
	// 		if (self._model.mapItemDic.ContainsKey(maxMission)) {
	// 			if ((<MapBtnItem>self._model.mapItemDic.TryGetValue(maxMission)).isListener) {
	// 				self.map.addMap();
	// 				self.scroller.viewport.validateNow();
	// 			}
	// 		}
	// 	}
	// }

	/** 更新地图Item数据 */
	private onUpdateMapItem(): void {
		let self = this;
		let oldItem: MapBtnItem = (<MapBtnItem>self._model.mapItemDic.TryGetValue(App.PlayerInfoManager.Info.data.topMission - 1));
		oldItem.headState(false, () => {
			oldItem.initState();
			let newItem: MapBtnItem = (<MapBtnItem>self._model.mapItemDic.TryGetValue(App.PlayerInfoManager.Info.data.topMission));
			newItem.parent.setChildIndex(newItem, newItem.parent.numChildren);
			newItem.headState(true, () => {
				newItem.initState();
			})
		})
		if (self.checkIsEnterNextMap()) {
			self.map.addMap();
			self.scroller.viewport.validateNow();
		}
	}

	/** 检查是否进入下一张地图 */
	private checkIsEnterNextMap(): boolean {
		let self = this;
		let maxMission: number = self._model.getMapIndex(App.PlayerInfoManager.Info.data.topMission) * 2 * 10;
		if (self._model.mapItemDic.ContainsKey(maxMission)) {
			if ((<MapBtnItem>self._model.mapItemDic.TryGetValue(maxMission)).isPass) {
				return true;
			}
		}
		return false;
	}

	/** 回到大厅 */
	private onGotoHall(): void {
		App.SceneManager.runScene(SceneConsts.HALL);
	}
}