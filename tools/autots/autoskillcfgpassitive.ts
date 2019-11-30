import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgpassitive {
    _mapInfo: Map<number, AutoSkillCfgpassitiveInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgpassitiveInfo>();
    }

    private static _instance: AutoSkillCfgpassitive;

    static async getInstance(): Promise<AutoSkillCfgpassitive> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgpassitive();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_passitive.xml');
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

    getAutoSkillCfgpassitiveInfoItem(key: number): AutoSkillCfgpassitiveInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgpassitiveInfo {
    szName: string;
    eEffectiveAttackWay: number;
    eReleaseWay: number;
    n32UpgradeLevel: number;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    n32ReleaseAction: string;
    n32ReleaseSound: number;
    ReleaseEffect: string;
    StartEffect: string;
    n32CoolDown: number;
    bIsShowColdDown: number;
    eTriggerWay: string;
    n32TriggerRate: number;
    n32TriggerInterval: number;
    bIfTriggerByBuilding: number;
    bIfTriggerByHero: number;
    bIfTriggerByMonster: number;
    eTargetType: number;
    bIfRemoveWhenDie: number;
    SkillIcon: number;
    info: string;
    StartEventID: number;
    EventID: string;
    EndEventID: number;
    PassitiveEventID: number;
}

export { AutoSkillCfgpassitive, AutoSkillCfgpassitiveInfo };
