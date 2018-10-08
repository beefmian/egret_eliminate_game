class BattleModel extends BaseModel {

	/** 总地图数量 */
	public maxMapCount: number = 15;
	/** 开放的地图数量 */
	public openMapCount: number = 2;
	/** 当前关卡 */
	public currMission: number = 1;
	/** 通关的关卡 */
	public passMission: number = 2;

	public constructor($controller: BaseController) {
		super($controller)
		let self = this;
		self.init();
	}
	/** 初始化 */
	private init(): void {
		let self = this;
		self.maxMapCount = parseInt(GlobleVOData.getDataByFilter(GlobleVOData.ServerConfigVO, "id", "MAX_MAP_COUNT")[0].value);
	}
}
