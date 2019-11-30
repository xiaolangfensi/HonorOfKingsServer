import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSceneCfg {
    _mapInfo: Map<number, AutoSceneCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSceneCfgInfo>();
    }

    private static _instance: AutoSceneCfg;

    static async getInstance(): Promise<AutoSceneCfg> {
        if (!this._instance) {
            this._instance = new AutoSceneCfg();
            await this._instance.initialize('./conf/SceneCfg.xml');
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

    getAutoSceneCfgInfoItem(key: number): AutoSceneCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSceneCfgInfo {
    SceneName: string;
    un8Level: number;
    n32GoldCost: number;
}

export { AutoSceneCfg, AutoSceneCfgInfo };
