import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoHeroCfg {
    _mapInfo: Map<string, AutoHeroCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<string, AutoHeroCfgInfo>();
    }

    private static _instance: AutoHeroCfg;

    static async getInstance(): Promise<AutoHeroCfg> {
        if (!this._instance) {
            this._instance = new AutoHeroCfg();
            await this._instance.initialize('./conf/HeroCfg.xml');
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
                    this._mapInfo.set(dataKey, data);
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

    getAutoHeroCfgInfoItem(key: string): AutoHeroCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoHeroCfgInfo {
    szNOStr: number;
    HeroKind: number;
    eMagicCate: number;
    XuetiaoHeight: number;
    eAttackWay: number;
    n32AttackDist: number;
    n32BaseExp: number;
    n32BasePhyAttPower: number;
    n32BaseMagAttPower: number;
    n32BasePhyDef: number;
    n32BaseMagDef: number;
    n32BaseMoveSpeed: number;
    n32BaseMoveSpeedScaling: number;
    n32BaseAttackSpeed: number;
    n32BaseMaxHP: number;
    n32BaseMaxMP: number;
    n32BaseHPRecover: number;
    n32BaseMPRecover: number;
    n32BaseReliveTime: number;
    n32ExpGrowth: number;
    n32PhyAttGrowth: number;
    n32MagAttGrowth: number;
    n32PhyDefGrowth: number;
    n32MagDefGrowth: number;
    n32MoveSpeedGrowth: number;
    n32AttackSpeedGrowth: number;
    n32MaxHPGrowth: number;
    n32MaxMPGrowth: number;
    n32HPRecoverGrowth: number;
    n32MPRecoverGrowth: number;
    n32ReliveGrowth: number;
    n32CPRecover: number;
    n32CollideRadious: number;
    EmitPos: string;
    HitPos: string;
    n32LockRadious: number;
    n32RandomAttack: string;
    un32WalkSound: number;
    un32DeathSould: string;
    un32Script1: string;
    n32Script1Rate: string;
    un32SkillType1: number;
    un32SkillType2: number;
    un32SkillType3: number;
    un32SkillType4: number;
    un32SkillType5: number;
    un32SkillType6: number;
    un32SkillTypeP: number;
    un32PreItem: string;
    un32MidItem: string;
    un32ProItem: string;
}

export { AutoHeroCfg, AutoHeroCfgInfo };
