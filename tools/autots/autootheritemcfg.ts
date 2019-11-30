import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoOtherItemCfg {
    _mapInfo: Map<number, AutoOtherItemCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoOtherItemCfgInfo>();
    }

    private static _instance: AutoOtherItemCfg;

    static async getInstance(): Promise<AutoOtherItemCfg> {
        if (!this._instance) {
            this._instance = new AutoOtherItemCfg();
            await this._instance.initialize('./conf/OtherItemCfg.xml');
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

    getAutoOtherItemCfgInfoItem(key: number): AutoOtherItemCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoOtherItemCfgInfo {
    Name: string;
    EffectID: number;
    EffectValue: number;
    ConsumeType: number;
    PriceSeries: number;
    bIsGetUse: number;
    bIsShowInShop: number;
    Time: number;
    Icon: number;
}

export { AutoOtherItemCfg, AutoOtherItemCfgInfo };
