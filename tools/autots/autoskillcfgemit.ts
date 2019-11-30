import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgemit {
    _mapInfo: Map<number, AutoSkillCfgemitInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgemitInfo>();
    }

    private static _instance: AutoSkillCfgemit;

    static async getInstance(): Promise<AutoSkillCfgemit> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgemit();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_emit.xml');
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

    getAutoSkillCfgemitInfoItem(key: number): AutoSkillCfgemitInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgemitInfo {
    szName: string;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    bIsCoolDown: number;
    bIsCanMove: number;
    bIsCanBreak: number;
    n32TriggerRate: number;
    bIfAffectBuilding: number;
    bIfAffectHero: number;
    bIfAffectMonster: number;
    EmitTarget: number;
    EmitType: number;
    FlySpeed: number;
    FlyPar1: number;
    FlyPar2: number;
    FlyPar3: number;
    n32ProjectileNum: number;
    n32ProjEmitInter: number;
    bIsPenetrate: number;
    eCollideRadius: number;
    eLifeTime: number;
    attackEffect: string;
    FlySound: string;
    EventID: string;
    BackPoint: number;
    BackArea: number;
    BackFlyType: number;
    BackIsPenetrate: number;
    BackEventID: number;
}

export { AutoSkillCfgemit, AutoSkillCfgemitInfo };
