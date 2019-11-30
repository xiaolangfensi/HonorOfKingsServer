import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgbuff {
    _mapInfo: Map<number, AutoSkillCfgbuffInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgbuffInfo>();
    }

    private static _instance: AutoSkillCfgbuff;

    static async getInstance(): Promise<AutoSkillCfgbuff> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgbuff();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_buff.xml');
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

    getAutoSkillCfgbuffInfoItem(key: number): AutoSkillCfgbuffInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgbuffInfo {
    szName: string;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    bIsCoolDown: number;
    n32TriggerRate: number;
    bIfAffectBuilding: number;
    bIfAffectHero: number;
    bIfAffectMonster: number;
    eBuffType: number;
    eBuffTarget: number;
    eTargetType: number;
    eEffect0LastTick: number;
    eEffect0EffectInterval: number;
    n32ReplaceType: number;
    n32RepeatTimes: number;
    n32RejectID: number;
    n32ReplaceID: number;
    bEffect0ClearWhenDie: number;
    szEffectIcon: number;
    szEffectSound: string;
    szEffectDes: number;
    szEffection: string;
    n32EffectID: number;
    eEffectValue: number;
    eEffectRate: number;
    eFlyEffectID: number;
    StartEventID: number;
    IntervalEventID: string;
    EndEventID: number;
}

export { AutoSkillCfgbuff, AutoSkillCfgbuffInfo };
