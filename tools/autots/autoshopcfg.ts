import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoShopCfg {
    _mapInfo: Map<number, AutoShopCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoShopCfgInfo>();
    }

    private static _instance: AutoShopCfg;

    static async getInstance(): Promise<AutoShopCfg> {
        if (!this._instance) {
            this._instance = new AutoShopCfg();
            await this._instance.initialize('./conf/ShopCfg.xml');
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

    getAutoShopCfgInfoItem(key: number): AutoShopCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoShopCfgInfo {
    un32ItemIDPage1: string;
    un8CostTypePage1: number;
    n32CPCostPage1: number;
    un32ItemIDPage2: string;
    un8CostTypePage2: number;
    n32CPCostPage2: number;
    un32ItemIDPage3: string;
    un8CostTypePage3: number;
    n32CPCostPage3: number;
    un32ItemIDPage4: string;
    un8CostTypePage4: number;
    n32CPCostPage4: number;
    un32ItemIDPage5: string;
    un8CostTypePage5: number;
    n32CPCostPage5: number;
}

export { AutoShopCfg, AutoShopCfgInfo };
