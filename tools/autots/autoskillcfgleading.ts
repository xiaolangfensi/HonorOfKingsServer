import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgleading {
    _mapInfo: Map<number, AutoSkillCfgleadingInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgleadingInfo>();
    }

    private static _instance: AutoSkillCfgleading;

    static async getInstance(): Promise<AutoSkillCfgleading> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgleading();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_leading.xml');
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

    getAutoSkillCfgleadingInfoItem(key: number): AutoSkillCfgleadingInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgleadingInfo {
    szName: string;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    bIsCoolDown: number;
    n32TriggerRate: number;
    bIfAffectBuilding: number;
    bIfAffectHero: number;
    bIfAffectMonster: number;
    eTargetType: number;
    eLeadingTime: number;
    eLeadingAction: string;
    eLeadingEffect: number;
    eLeadingSound: string;
    bIsCanMove: number;
    bIsCheckTargetSta: number;
    EventID: number;
}

export { AutoSkillCfgleading, AutoSkillCfgleadingInfo };
