import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoRuneCfg {
    _mapInfo: Map<number, AutoRuneCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoRuneCfgInfo>();
    }

    private static _instance: AutoRuneCfg;

    static async getInstance(): Promise<AutoRuneCfg> {
        if (!this._instance) {
            this._instance = new AutoRuneCfg();
            await this._instance.initialize('./conf/RuneCfg.xml');
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

    getAutoRuneCfgInfoItem(key: number): AutoRuneCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoRuneCfgInfo {
    RuneName: string;
    un8Level: number;
    un8EffectID: number;
    n32EffectVal: number;
    fEffectPer: number;
    un8ConsumeType: string;
    n32PriceSeries: string;
    bIsShowInShop: number;
    bIsCanRandomComposed: number;
    n32ComposedSubID: number;
    Description: string;
    Icon: number;
}

export { AutoRuneCfg, AutoRuneCfgInfo };
