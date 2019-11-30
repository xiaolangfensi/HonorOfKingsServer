import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgoverlap {
    _mapInfo: Map<number, AutoSkillCfgoverlapInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgoverlapInfo>();
    }

    private static _instance: AutoSkillCfgoverlap;

    static async getInstance(): Promise<AutoSkillCfgoverlap> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgoverlap();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_overlap.xml');
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

    getAutoSkillCfgoverlapInfoItem(key: number): AutoSkillCfgoverlapInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgoverlapInfo {
    szName: string;
    n32InitialLayer: number;
    n32MaxLayer: number;
    eTriggerWayOfAdd: number;
    n32AddLayerValue: number;
    eTriggerWayOfReduce: number;
    n32ReduceLayerValue: number;
    n32ReduceLayerPer: number;
    n32EffectID: number;
    eEffectValue: number;
    eEffectRate: number;
}

export { AutoSkillCfgoverlap, AutoSkillCfgoverlapInfo };
