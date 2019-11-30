import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSSDelayConfig {
    _mapInfo: Map<number, AutoSSDelayConfigInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSSDelayConfigInfo>();
    }

    private static _instance: AutoSSDelayConfig;

    static async getInstance(): Promise<AutoSSDelayConfig> {
        if (!this._instance) {
            this._instance = new AutoSSDelayConfig();
            await this._instance.initialize('./conf/MapConfig/SS_DelayConfig.xml');
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

    getAutoSSDelayConfigInfoItem(key: number): AutoSSDelayConfigInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSSDelayConfigInfo {
    BatmanDelay: number;
    MonsterDelay: number;
    AdvancedmonsterDelay: number;
    AltarDelay: number;
}

export { AutoSSDelayConfig, AutoSSDelayConfigInfo };
