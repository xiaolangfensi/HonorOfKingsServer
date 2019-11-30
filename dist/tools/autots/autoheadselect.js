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
const mylogger_1 = require("../../src/common/mylogger");
const utils_1 = require("../../src/common/utils");
class AutoHeadSelect {
    constructor() {
        this._mapInfo = new Map();
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._instance) {
                this._instance = new AutoHeadSelect();
                yield this._instance.initialize('./conf/HeadSelect.xml');
            }
            return Promise.resolve(this._instance);
        });
    }
    initialize(xmlFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jsonData = yield utils_1.default.getJSObject(xmlFile);
                let root = jsonData[Object.keys(jsonData)[0]];
                if (root && root.info && root.info.length > 0) {
                    for (let infoItem of root.info) {
                        let infoKeys = Object.keys(infoItem);
                        let data = {};
                        let dataKey = '';
                        for (let infokey of infoKeys) {
                            if (infoItem[infokey] instanceof Array) {
                                data[infokey] = infoItem[infokey][0];
                            }
                            else {
                                dataKey = infoItem[infokey][Object.keys(infoItem[infokey])[0]];
                            }
                        }
                        this._mapInfo.set(Number.parseInt(dataKey), data);
                    }
                    return Promise.resolve;
                }
            }
            catch (e) {
                mylogger_1.myLogger.error(e.message);
                return Promise.reject;
            }
        });
    }
    printAll() {
        for (let [key, value] of this._mapInfo.entries()) {
            mylogger_1.myLogger.log(`${key} : ${JSON.stringify(value)}`);
        }
    }
    getAutoHeadSelectInfoItem(key) {
        return this._mapInfo.get(key);
    }
}
exports.AutoHeadSelect = AutoHeadSelect;
//# sourceMappingURL=autoheadselect.js.map