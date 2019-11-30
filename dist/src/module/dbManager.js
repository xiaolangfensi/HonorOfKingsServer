"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysqlpool_1 = require("../common/mysqlpool");
const mylogger_1 = require("../common/mylogger");
class DBManager {
    constructor() {
        this._sqlQueryAcountUser = 'select id,cdkey cdKey,user_name userName,cs_id csId,sdk_is sdkId,password from fball_accountdb.account_user where cdkey = ?';
        this._mysql = {};
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new DBManager();
        }
        return this._instance;
    }
    initialize(confFile) {
        this._mysql = new mysqlpool_1.MysqlPool(confFile);
        mylogger_1.myLogger.log('DBManager initialize finished ...');
    }
    executeSQL(sqlStr, sqlParam = []) {
        return this._mysql.query(sqlStr, sqlParam);
    }
    readUser(cdKey) {
        return this._mysql.query(this._sqlQueryAcountUser, [cdKey]);
    }
}
exports.DBManager = DBManager;
//# sourceMappingURL=dbManager.js.map