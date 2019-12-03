"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HOKUser {
    constructor() {
        this._cAddFVecMap = new Map();
        this._timerID = 0;
        this._runePageMaxEquipNum = new Array();
        this._equipRuneArrayMap = new Map(); //key: 符文页 value: 符文数组
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
        this._canUseHeroList = new Array();
    }
    setUserDBData(userData) {
        if (userData && userData.account) {
            this._userDBData = userData;
            return true;
        }
        return false;
    }
}
exports.HOKUser = HOKUser;
//# sourceMappingURL=hokuser.js.map