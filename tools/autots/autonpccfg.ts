import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoNPCCfg {
    _mapInfo: Map<number, AutoNPCCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoNPCCfgInfo>();
    }

    private static _instance: AutoNPCCfg;

    static async getInstance(): Promise<AutoNPCCfg> {
        if (!this._instance) {
            this._instance = new AutoNPCCfg();
            await this._instance.initialize('./conf/NPCCfg.xml');
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

    getAutoNPCCfgInfoItem(key: number): AutoNPCCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoNPCCfgInfo {
    szNOStr: string;
    eNpcType: number;
    eNpcChildType: number;
    XuetiaoHeight: number;
    EmitPos: string;
    HitPos: string;
    eRace: number;
    eAttendantCate: number;
    eMagicCate: number;
    eAttackWay: number;
    n32AttackDist: number;
    eAICate: number;
    un32AITarID: number;
    n32PursueDist: number;
    n32GuardDist: number;
    eAttackMode: number;
    n32AttackPower: number;
    n32MagAttackPower: number;
    n32DefenseAbility: number;
    n32MagDefenseAbility: number;
    n32MoveSpeed: number;
    n32BaseMoveSpeedScaling: number;
    n32AttackSpeed: number;
    n32MaxHP: number;
    n32MaxMP: number;
    n32GotExp: number;
    n32ConsumeCP: number;
    n32KillCP: number;
    bIfCanControl: number;
    eConsumeAtt: number;
    n32ConsumeValue: number;
    n32ConsumePer: number;
    n32HPRecover: number;
    n32MPRecover: number;
    n32GroupID: number;
    n32CollideRadius: number;
    n32IsLocked: number;
    n32LockRadius: number;
    n32RandomAttack: string;
    un32DeathSould: string;
    un32FreeSound: number;
    un32SkillType1: number;
    un32SkillType2: number;
    un32SkillType3: number;
    un32SkillType4: number;
    un32SkillType5: number;
    un32PassSkillID: string;
    HeadPhoto: number;
    eCamp: number;
    un32ShopID: number;
    EffectID: string;
    un32Script1: string;
    n32Script1Rate: string;
    un32WalkSound: number;
    BuildsDeathEffID: string;
}

export { AutoNPCCfg, AutoNPCCfgInfo };
