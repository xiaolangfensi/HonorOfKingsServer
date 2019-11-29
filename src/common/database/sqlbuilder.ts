import { myLogger } from '../mylogger';

export class SQLBuilder {
    private _db: string;
    private _table: string;
    private _fields: { [fieldname: string]: any };//{}表示对象，包含了很多字符串类型的key值
    private _condition?: string;
    constructor() {
        this._db = '';
        this._table = '';
        this._fields = {};
    }

    newBuilder(db:string, table:string) {
        this._db = db;
        this._table = table;
        this._fields = {};
        this._condition = undefined;
    }

    addField(key:string, value:any) {
        this._fields[key] = value;
    }

    setCondition(condition:string) {
        this._condition = condition;
    }
    
    toUpdateSQLString(): string {
        let fn: Function = () => {
            let subSQL: string = '';
            let fieldNames = Object.keys(this._fields);
            for (let name of fieldNames) {
                if (subSQL !== '') {
                    subSQL += ',';
                }
                let dataType = typeof this._fields[name];
                if (dataType === 'string') {
                    subSQL = `${subSQL}${name}='${this._fields[name]}'`;
                } else if (dataType === 'number') {
                    subSQL = `${subSQL}${name}=${this._fields[name]}`;
                } else {
                    myLogger.error(`不认识的数据类型在数据库的字段中 ${dataType}, ${name}:${this._fields[name]}`);
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
            } else {
                myLogger.warn(`no condition, please check you are right!!!
                            ${mySQL}`)
            }
        } catch (e) {
            mySQL = '';
        }
        return mySQL;
    }

    toInsertSQLString(): string {
        let fn: Function = () => {
            let subFields: string = '';
            let subValues: string = '';
            
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
                } else if (dataType === 'number') {
                    subValues = `${subValues}, ${this._fields[name]}`;
                } else {
                    myLogger.error(`不认识的数据类型在数据库的字段中 ${dataType}, ${name}:${this._fields[name]}`);
                    throw new TypeError("Unsupported type!");
                }
            }
            return `${subFields}) values${subValues})`;
        };

        let mySQL = '';
        try {
            mySQL = `insert into ${this._db}.${this._table}${fn()}`;
        } catch (e) {
            mySQL = '';
        }
        return mySQL;
    }    
}