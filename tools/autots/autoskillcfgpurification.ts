import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgpurification {
    _mapInfo: Map<number, AutoSkillCfgpurificationInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgpurificationInfo>();
    }

    private static _instance: AutoSkillCfgpurification;

    static async getInstance(): Promise<AutoSkillCfgpurification> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgpurification();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_purification.xml');
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

    getAutoSkillCfgpurificationInfoItem(key: number): AutoSkillCfgpurificationInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgpurificationInfo {
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
    ePurifyWay: number;
    ParameterList: string;
    n32PurifyMaxCount: number;
    EventID: number;
}

export { AutoSkillCfgpurification, AutoSkillCfgpurificationInfo };
