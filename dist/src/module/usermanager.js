"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameenum_1 = require("./gameenum");
const hokuser_1 = require("./hokuser");
const mylogger_1 = require("../common/mylogger");
const sqlbuilder_1 = require("../common/database/sqlbuilder");
const dbManager_1 = require("./dbManager");
class UserCombineKey {
    constructor(username, sdkid) {
        this._username = username;
        this._sdkId = sdkid;
    }
    less(combineKey) {
        let res = this._username.localeCompare(combineKey._username);
        if (res == 0) {
            return this._sdkId < combineKey._sdkId;
        }
        else {
            return res < 1;
        }
    }
    getUniqueName() {
        return `${this._sdkId}:${this._username}`;
    }
}
exports.UserCombineKey = UserCombineKey;
class UserManager {
    static getInstance() {
        if (!this._instance) {
            this._instance = new UserManager();
        }
        return this._instance;
    }
    constructor() {
        this._mapAllUserName2GUID = new Map();
        this._mapGUIDUser = new Map();
    }
    getUserByGUID(guid) {
        return this._mapGUIDUser.get(guid);
    }
    insertNewUserToMysql(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            let builder = new sqlbuilder_1.SQLBuilder();
            if (builder) {
                builder.newBuilder('fball_accountdb', 'account_user');
                builder.addField('cs_id', loginData.name);
                builder.addField('sdk_id', loginData.platform);
                builder.addField('user_name', '');
                builder.addField('cdkey', loginData.name);
                builder.addField('password', loginData.passwd);
                yield dbManager_1.default.getInstance().executeSQL(builder.toInsertSQLString()).catch(e => {
                    mylogger_1.myLogger.error(e.message);
                    return Promise.reject;
                });
                yield dbManager_1.default.getInstance().readGameData(loginData.name).catch(e => {
                    mylogger_1.myLogger.error(e.message);
                    return Promise.reject;
                });
                return Promise.resolve;
            }
        });
    }
    userAskLogin(messageData, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (messageData.name === '' /*|| messageData.name.length>30*/) {
                return gameenum_1.AllErrorCodeEnum.eEC_InvalidUserName;
            }
            let combineKey = new UserCombineKey(messageData.name, messageData.sdk).getUniqueName();
            let guid = this._mapAllUserName2GUID.get(combineKey);
            //如果数据已经存在了
            if (guid) {
                let user = this.getUserByGUID(guid);
                let userData = dbManager_1.default.getInstance().getUserData(client.getuId());
            }
            else {
                let accountData = yield dbManager_1.default.getInstance().readAccount(messageData.name);
                if (!accountData) {
                    yield this.insertNewUserToMysql(messageData).catch((e) => {
                        mylogger_1.myLogger.error(e.message);
                    });
                    accountData = yield dbManager_1.default.getInstance().readAccount(messageData.name);
                }
                if (accountData) {
                    let user = new hokuser_1.HOKUser();
                    guid = accountData.id;
                    this._mapGUIDUser.set(guid, user);
                    this._mapAllUserName2GUID.set(combineKey, guid);
                    user.setUserDBData(dbManager_1.default.getInstance().getUserData(guid));
                    return Promise.resolve(0);
                }
                return Promise.resolve(-1);
            }
            return Promise.resolve(0);
        });
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=usermanager.js.map