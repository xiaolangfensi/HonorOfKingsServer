import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoItemCfg {
    _mapInfo: Map<number, AutoItemCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoItemCfgInfo>();
    }

    private static _instance: AutoItemCfg;

    static async getInstance(): Promise<AutoItemCfg> {
        if (!this._instance) {
            this._instance = new AutoItemCfg();
            await this._instance.initialize('./conf/ItemCfg.xml');
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

    getAutoItemCfgInfoItem(key: number): AutoItemCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoItemCfgInfo {
    sNameID: string;
    sNameCh: string;
    un8TypeID: number;
    attributeKeyList: string;
    attributeValList: string;
    attributePerList: string;
    un8UseTimes: number;
    bDestroyAfterUsed: number;
    un32SkillID: number;
    un32PassSkillID: string;
    bIsCanDeathToBuy: number;
    bUsedAfterBuyed: number;
    sIcon: string;
    un32CdTime: number;
    bUniqueID: number;
    un8OverlapTimes: number;
    un8CPCostType: number;
    n32CPCost: number;
    n32CombineCPCost: number;
    un8FunctionType: number;
    un32UniqueTypeID: number;
    sDescribe: string;
    un32UseSoundID: string;
}

export { AutoItemCfg, AutoItemCfgInfo };
