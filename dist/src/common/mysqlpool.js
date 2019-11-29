"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mysql = require("mysql");
const mylogger_1 = require("./mylogger");
class MysqlPool {
    constructor(config) {
        this._mysqlPool = null;
        this._config = {};
        this.initialize(config);
    }
    initialize(config) {
        this._config = config;
        if (this._config.database == undefined) {
            mylogger_1.myLogger.log('no config parse to json right.');
            return false;
        }
        if (!this._config.host) {
            this._config.host = '127.0.0.1';
        }
        if (!this._config.port) {
            this._config.port = 3306;
        }
        if (!this._config.connectionLimit) {
            this._config.connectionLimit = 10;
        }
        this._mysqlPool = Mysql.createPool(this._config);
        return true;
    }
    getPool() {
        return this._mysqlPool;
    }
    query(querystr, queryparams) {
        // 返回一个 Promise
        return new Promise((resolve, reject) => {
            this._mysqlPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                else {
                    connection.query(querystr, queryparams, (err, rows) => {
                        connection.release();
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    }
    cbquery(querystr, queryparam, cb) {
        this._mysqlPool.getConnection((err, connection) => {
            if (!err) {
                var sql = querystr;
                connection.query(querystr, queryparam, (err, rows) => {
                    connection.release();
                    if (err) {
                        cb(err);
                    }
                    else {
                        cb(null, rows);
                    }
                });
            }
            else {
                cb(err);
            }
        });
    }
}
exports.MysqlPool = MysqlPool;
//# sourceMappingURL=mysqlpool.js.map