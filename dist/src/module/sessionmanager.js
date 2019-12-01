"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../common/utils");
class SessionManager {
    static getInstance() {
        if (!this._instance) {
            this._instance = new SessionManager();
        }
        return this._instance;
    }
    constructor() {
        this._tokenDataMap = new Map();
        this._checkTimeInterval = setInterval(() => {
            let now = new Date().getTime();
            for (let [key, data] of this._tokenDataMap.entries()) {
                if (now - data.timestamp > 5 * 60 * 1000) {
                    this._tokenDataMap.delete(key);
                }
            }
        }, 1000 * 5 * 12);
    }
    addData(cdKey, token, ip, uid, timeStamp = 0) {
        this._tokenDataMap.set(cdKey, {
            uid: uid,
            token: token,
            ip: ip,
            timestamp: timeStamp
        });
    }
    verifyToken(cdKey, token, ip) {
        let data = this._tokenDataMap.get(cdKey);
        if (data) {
            let md5Str = utils_1.default.md5(`${data.timestamp}:${token}`);
            if (data.token === md5Str || data.token === token) { // && data.ip === ip) {
                return data.uid;
            }
        }
        return 0;
    }
    removeData(cdKey) {
        this._tokenDataMap.delete(cdKey);
    }
    dispose() {
        this._tokenDataMap.clear();
    }
}
exports.SessionManager = SessionManager;
//# sourceMappingURL=sessionmanager.js.map