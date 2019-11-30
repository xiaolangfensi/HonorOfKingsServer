import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoHotAndNewCfg {
    _mapInfo: Map<string, AutoHotAndNewCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<string, AutoHotAndNewCfgInfo>();
    }

    private static _instance: AutoHotAndNewCfg;

    static async getInstance(): Promise<AutoHotAndNewCfg> {
        if (!this._instance) {
            this._instance = new AutoHotAndNewCfg();
            await this._instance.initialize('./conf/HotAndNewCfg.xml');
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
                    this._mapInfo.set(dataKey, data);
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

    getAutoHotAndNewCfgInfoItem(key: string): AutoHotAndNewCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoHotAndNewCfgInfo {
    un32HeroGoodsID: number;
    un32SkinGoodsID: number;
    un32RuneGoodsID: number;
}

export { AutoHotAndNewCfg, AutoHotAndNewCfgInfo };
