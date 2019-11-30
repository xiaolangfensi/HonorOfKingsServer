import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoCombineCfg {
    _mapInfo: Map<number, AutoCombineCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoCombineCfgInfo>();
    }

    private static _instance: AutoCombineCfg;

    static async getInstance(): Promise<AutoCombineCfg> {
        if (!this._instance) {
            this._instance = new AutoCombineCfg();
            await this._instance.initialize('./conf/CombineCfg.xml');
        }
        return Promise.resolve(this._instance);
    }

    private async initialize(xmlFile: string) {
        try {
            let jsonData = await Utils.getJSObject(xmlFile);
            let root = jsonData[Object.keys(jsonData)[0]];
            if (root && root.info && root.info.length > 0) {
                for (let infoItem of root.info) {
                    let infoKeys = Object.keys(infoItem);
                    let data = <any>{};
                    let dataKey = '';
                    for (let infokey of infoKeys) {
                        if (infoItem[infokey] instanceof Array) {
                            data[infokey] = infoItem[infokey][0];
                        } else {
                            dataKey = infoItem[infokey][Object.keys(infoItem[infokey])[0]];
                        }
                    }
                    this._mapInfo.set(Number.parseInt(dataKey), data);
                }
                return Promise.resolve;
            }
        } catch (e) {
            myLogger.error(e.message);
            return Promise.reject;
        }
    }

    printAll() {
        for (let [key, value] of this._mapInfo.entries()) {
            myLogger.log(`${key} : ${JSON.stringify(value)}`);
        }
    }

    getAutoCombineCfgInfoItem(key: number): AutoCombineCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoCombineCfgInfo {
    un32ChildID1: number;
    un32ChildID2: number;
}

export { AutoCombineCfg, AutoCombineCfgInfo };
