"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysqlpool_1 = require("../common/mysqlpool");
const mylogger_1 = require("../common/mylogger");
class DBManager {
    static getInstance() {
        if (!this._instance) {
            this._instance = new DBManager();
        }
        return this._instance;
    }
    constructor() {
        this._mysql = {};
    }
    initialize(confFile) {
        this._mysql = new mysqlpool_1.MysqlPool(confFile);
        mylogger_1.myLogger.log('DBManager initialize finished ...');
    }
    executeSQL(sqlStr, sqlParam = []) {
        return this._mysql.query(sqlStr, sqlParam);
    }
}
exports.DBManager = DBManager;
//# sourceMappingURL=dbManager.js.map