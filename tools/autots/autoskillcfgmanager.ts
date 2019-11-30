import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgmanager {
    _mapInfo: Map<number, AutoSkillCfgmanagerInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgmanagerInfo>();
    }

    private static _instance: AutoSkillCfgmanager;

    static async getInstance(): Promise<AutoSkillCfgmanager> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgmanager();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_manager.xml');
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

    getAutoSkillCfgmanagerInfoItem(key: number): AutoSkillCfgmanagerInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgmanagerInfo {
    szName: string;
    CameraType: number;
    SkillType: string;
    bIsInstant: number;
    bIfNormalAttack: number;
    bIsConsumeSkill: number;
    eSummonEffect: string;
    eEffectiveAttackWay: number;
    eReleaseWay: number;
    n32UpgradeLevel: number;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    n32PrepareAction: string;
    n32PrepareTime: number;
    n32PrepareEffect: string;
    n32PrepareSound: string;
    n32ReleaseAction: string;
    n32ReleaseSound: number;
    n32ReleaseTime: number;
    n32CoolDown: number;
    n32SkillLastTime: number;
    n32ReleaseDistance: number;
    eUseWay: number;
    n32TriggerRate: number;
    bIfAffectBuilding: number;
    bIfAffectHero: number;
    bIfAffectMonster: number;
    eTargetType: number;
    bIsCheckTargetSta: number;
    SkillIcon: number;
    info: string;
    EventID: string;
}

export { AutoSkillCfgmanager, AutoSkillCfgmanagerInfo };
