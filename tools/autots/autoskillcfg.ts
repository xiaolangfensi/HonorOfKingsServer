import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfg {
    _mapInfo: Map<number, AutoSkillCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgInfo>();
    }

    private static _instance: AutoSkillCfg;

    static async getInstance(): Promise<AutoSkillCfg> {
        if (!this._instance) {
            this._instance = new AutoSkillCfg();
            await this._instance.initialize('./conf/SkillCfg.xml');
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

    getAutoSkillCfgInfoItem(key: number): AutoSkillCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgInfo {
    szName: string;
    bIfNormal: number;
    eCountdownCate: number;
    bIsConsumeSkill: number;
    eReleaseWay: number;
    n32Level: number;
    n32UpgradeLevel: number;
    n32IsAffectBySilent: number;
    n32IsAffectByDisarm: number;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    n32PrepareAction: string;
    n32PrepareTime: number;
    n32ReleaseTime: number;
    n32ControlTime: number;
    n32CoolDown: number;
    n32ReleaseDistance: number;
    bIfCallScriptWhilePrepare: number;
    bIfCallScriptWhileRelease: number;
    bIfCallScriptWhileHitTarget: number;
    eUseWay: number;
    n32TriggerRate: number;
    bIfAffectBuilding: number;
    bIfAffectHero: number;
    bIfAffectMonster: number;
    eTargetType: number;
    n32Range: number;
    n32RangePar1: number;
    n32RangePar2: number;
    n32RangeInterval: number;
    n32RangeTimes: number;
    n32EffectObjNum: number;
    eAoeType: number;
    n32Effect0ID: number;
    n32Effect0Delay: number;
    eEffect0BuffID: number;
    eBuff0Target: number;
    eEffect0Trigger: number;
    bEffect0IsCritical: number;
    eEffect0CriticalPosb: number;
    eEffect0CriticalPercent: number;
    eEffect0Target: number;
    eEffect0Value: number;
    eEffect0Rate: number;
    bEffect0ClearWhenDie: number;
    n32Effect1ID: number;
    n32Effect1Delay: number;
    eEffect1BuffID: number;
    eBuff1Target: number;
    eEffect1Trigger: number;
    bEffect1IsCritical: number;
    eEffect1CriticalPosb: number;
    eEffect1CriticalPercent: number;
    eEffect1Target: number;
    eEffect1Value: number;
    eEffect1Rate: number;
    bEffect1ClearWhenDie: number;
    n32Effect2ID: number;
    n32Effect2Delay: number;
    eEffect2BuffID: number;
    eBuff2Target: number;
    eEffect2Trigger: number;
    bEffect2IsCritical: number;
    eEffect2CriticalPosb: number;
    eEffect2CriticalPercent: number;
    eEffect2Target: number;
    eEffect2Value: number;
    eEffect2Rate: number;
    bEffect2ClearWhenDie: number;
    buffIcon: number;
    SkillType: number;
    FlySpeed: number;
    n32ProjectileNum: number;
    n32ProjEmitInter: number;
    bIsPenetrate: number;
    eCollideRadius: number;
    eLifeTime: number;
    eSummonEffect: string;
    attackEffect: string;
    AEffectTime: number;
    woundEffect: string;
    WEffectTime: number;
    HitSound: string;
    info: string;
    FlySound: string;
    SummonID: number;
}

export { AutoSkillCfg, AutoSkillCfgInfo };
