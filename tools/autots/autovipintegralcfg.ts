import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoVIPIntegralCfg {
    _mapInfo: Map<number, AutoVIPIntegralCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoVIPIntegralCfgInfo>();
    }

    private static _instance: AutoVIPIntegralCfg;

    static async getInstance(): Promise<AutoVIPIntegralCfg> {
        if (!this._instance) {
            this._instance = new AutoVIPIntegralCfg();
            await this._instance.initialize('./conf/VIPIntegralCfg.xml');
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

    getAutoVIPIntegralCfgInfoItem(key: number): AutoVIPIntegralCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoVIPIntegralCfgInfo {
    VIPIntegral: number;
    M20001: number;
    M20002: string;
    M21001: number;
    M21002: number;
    M21003: number;
    M21004: number;
    M21005: number;
    M21006: number;
    M21007: number;
    M21008: number;
    M21009: number;
    M21010: number;
}

export { AutoVIPIntegralCfg, AutoVIPIntegralCfgInfo };
