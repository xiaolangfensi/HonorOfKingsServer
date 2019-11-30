import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgaccount {
    _mapInfo: Map<number, AutoSkillCfgaccountInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgaccountInfo>();
    }

    private static _instance: AutoSkillCfgaccount;

    static async getInstance(): Promise<AutoSkillCfgaccount> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgaccount();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_account.xml');
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

    getAutoSkillCfgaccountInfoItem(key: number): AutoSkillCfgaccountInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgaccountInfo {
    szName: string;
    bIsCoolDown: number;
    n32TriggerRate: number;
    bIfAffectBuilding: number;
    bIfAffectHero: number;
    bIfAffectMonster: number;
    eTargetType: number;
    bIsHarmful: number;
    n32EffectID: number;
    eEffectValue: number;
    eEffectRate: number;
    eEffectPlusRate: string;
    eEffectMultiplyRate: number;
    bEffectIsCritical: number;
    eEffectCriticalPosb: number;
    eEffectCriticalPercent: number;
    HitSound: string;
    woundEffect: string;
    WEffectTime: number;
    CameraID: number;
    CameraTarget: number;
    n32EventID: number;
}

export { AutoSkillCfgaccount, AutoSkillCfgaccountInfo };
