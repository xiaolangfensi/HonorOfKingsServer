import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoUserCfg {
    _mapInfo: Map<number, AutoUserCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoUserCfgInfo>();
    }

    private static _instance: AutoUserCfg;

    static async getInstance(): Promise<AutoUserCfg> {
        if (!this._instance) {
            this._instance = new AutoUserCfg();
            await this._instance.initialize('./conf/UserCfg.xml');
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

    getAutoUserCfgInfoItem(key: number): AutoUserCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoUserCfgInfo {
    LevelUpExp: number;
}

export { AutoUserCfg, AutoUserCfgInfo };
