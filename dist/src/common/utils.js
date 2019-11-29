"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem = require("fs");
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
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map