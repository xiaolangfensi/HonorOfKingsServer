"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mylogger_1 = require("../mylogger");
class SQLBuilder {
    constructor() {
        this._db = '';
        this._table = '';
        this._fields = {};
    }
    newBuilder(db, table) {
        this._db = db;
        this._table = table;
        this._fields = {};
        this._condition = undefined;
    }
    addField(key, value) {
        this._fields[key] = value;
    }
    setCondition(condition) {
        this._condition = condition;
    }
    toUpdateSQLString() {
        let fn = () => {
            let subSQL = '';
            let fieldNames = Object.keys(this._fields);
            for (let name of fieldNames) {
                if (subSQL !== '') {
                    subSQL += ',';
                }
                let dataType = typeof this._fields[name];
                if (dataType === 'string') {
                    subSQL = `${subSQL}${name}='${this._fields[name]}'`;
                }
                else if (dataType === 'number') {
                    subSQL = `${subSQL}${name}=${this._fields[name]}`;
                }
                else {
                    mylogger_1.myLogger.error(`不认识的数据类型在数据库的字段中 ${dataType}, ${name}:${this._fields[name]}`);
                    throw new TypeError("Unsupported type!");
                }
            }
            return subSQL;
        };
        let mySQL = '';
        try {
            mySQL = `update ${this._db}.${this._table} set ${fn()}`;
            if (this._condition) {
                mySQL = `${mySQL} where ${this._condition}`;
            }
            else {
                mylogger_1.myLogger.warn(`no condition, please check you are right!!!
                            ${mySQL}`);
            }
        }
        catch (e) {
            mySQL = '';
        }
        return mySQL;
    }
    toInsertSQLString() {
        let fn = () => {
            let subFields = '';
            let subValues = '';
            let fieldNames = Object.keys(this._fields);
            for (let name of fieldNames) {
                if (subFields === '') {
                    subFields = `(${name}`;
                    subValues = `(${this._fields[name]}`;
                    continue;
                }
                subFields = `${subFields}, ${name}`;
                let dataType = typeof this._fields[name];
                if (dataType === 'string') {
                    subValues = `${subValues}, '${this._fields[name]}'`;
                }
                else if (dataType === 'number') {
                    subValues = `${subValues}, ${this._fields[name]}`;
                }
                else {
                    mylogger_1.myLogger.error(`不认识的数据类型在数据库的字段中 ${dataType}, ${name}:${this._fields[name]}`);
                    throw new TypeError("Unsupported type!");
                }
            }
            return `${subFields}) values${subValues})`;
        };
        let mySQL = '';
        try {
            mySQL = `insert into ${this._db}.${this._table}${fn()}`;
        }
        catch (e) {
            mySQL = '';
        }
        return mySQL;
    }
}
exports.SQLBuilder = SQLBuilder;
//# sourceMappingURL=sqlbuilder.js.map