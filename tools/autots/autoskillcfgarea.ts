import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgarea {
    _mapInfo: Map<number, AutoSkillCfgareaInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgareaInfo>();
    }

    private static _instance: AutoSkillCfgarea;

    static async getInstance(): Promise<AutoSkillCfgarea> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgarea();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_area.xml');
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

    getAutoSkillCfgareaInfoItem(key: number): AutoSkillCfgareaInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgareaInfo {
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
    eAoeType: number;
    n32ReleaseDistance: number;
    n32ReleaseTimeDelay: number;
    n32RangeInterval: number;
    n32RangeTimes: number;
    n32Range: number;
    n32RangePar1: number;
    n32RangePar2: number;
    n32EffectObjNum: number;
    eLifeTime: number;
    attackEffect: string;
    EventID: string;
    FlySound: string;
}

export { AutoSkillCfgarea, AutoSkillCfgareaInfo };
