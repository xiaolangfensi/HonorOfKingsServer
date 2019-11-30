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
const FileSystem = require("fs");
const XML2JS = require("xml2js");
class Utils {
    static readConfig(name, ext = '.conf') {
        let conFile = FileSystem.readFileSync(`./conf/${name}${ext}`, 'utf8');
        if (conFile == null) {
            return null;
        }
        return JSON.parse(conFile);
    }
    static reverseMap(mapData) {
        let reverseData = new Map();
        mapData.forEach((value, key) => {
            reverseData.set(value, key);
        }, this);
        return reverseData;
    }
    ;
    static getJSObject(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let xmlData = FileSystem.readFileSync(file, "utf-8");
            return new Promise((resolve, reject) => {
                XML2JS.parseString(xmlData, (err, jsonData) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        return resolve(jsonData);
                    }
                });
            });
        });
    }
    static checkNumber(strObj) {
        return !isNaN(Number(strObj));
    }
    static readDir(filepath, extName = 'xml', fileList = null) {
        let pa = FileSystem.readdirSync(filepath);
        if (fileList == null) {
            fileList = new Array();
        }
        pa.forEach((element, index) => {
            let info = FileSystem.statSync(`${filepath}/${element}`);
            if (info.isDirectory()) {
                this.readDir(`${filepath}/${element}`, extName, fileList);
            }
            else {
                if (element.toLowerCase().endsWith(extName)) {
                    fileList.push(`${filepath}/${element}`);
                }
            }
        });
        return fileList;
    }
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map