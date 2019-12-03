import { IGameUserHero, IGameUserSNS, IHOKData } from "./gameinterface";


export class HOKUser {
    private _userDBData: IHOKData;//UserDBData;
    private _tGCLastPing: number;
    private _cAddFVecMap: Map<number, IGameUserSNS>;
    private _runePageMaxEquipNum: Array<number>;
    private _equipRuneArrayMap: Map<number, Array<number>>;//key: 符文页 value: 符文数组
    private _runeBagStream: string;
	private _runeSlotStream: string;
	private _lastPingTime: number;
	private _timerID: number;
	private _connectSate: boolean;
	private _nickName: string;
	private _diamondNumber: number;
	private _goldNumber: number;
	private _diamondUsed: number;
	private _goldUsed: number;
	private _vipLv: number;
	private _canUseHeroList: Array<number>;
	private _battleID: number;

    constructor() {
		this._cAddFVecMap = new Map<number, IGameUserSNS>();
        this._timerID = 0;
        this._runePageMaxEquipNum = new Array<number>();
        this._equipRuneArrayMap = new Map<number, Array<any>>();//key: 符文页 value: 符文数组
        this._runeBagStream = '';
        this._runeSlotStream = '';
		this._tGCLastPing = 0;
		this._timerID = 0;
		this._runePageMaxEquipNum.push(0);
		this._lastPingTime = Date.now();
		this._connectSate = true;
		this._nickName = '';
		this._diamondNumber = 0;
		this._goldUsed = 0;
		this._diamondUsed = 0;
		this._canUseHeroList = new Array<number>();
    }
    
    setUserDBData(userData: IHOKData):boolean {
		if (userData && userData.account) {
			this._userDBData = userData;
			return true;
		}
		return false;
	}
}
