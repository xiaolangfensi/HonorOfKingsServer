import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgmove {
    _mapInfo: Map<number, AutoSkillCfgmoveInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgmoveInfo>();
    }

    private static _instance: AutoSkillCfgmove;

    static async getInstance(): Promise<AutoSkillCfgmove> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgmove();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_move.xml');
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

    getAutoSkillCfgmoveInfoItem(key: number): AutoSkillCfgmoveInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgmoveInfo {
    szName: string;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    bIsCoolDown: number;
    bIsCanBreak: number;
    bIsCanMove: number;
    n32TriggerRate: number;
    bIfAffectBuilding: number;
    bIfAffectHero: number;
    bIfAffectMonster: number;
    eMoveType: number;
    eMovedTarget: number;
    eMoveToTarget: number;
    n32Angle: number;
    n32Distance: number;
    n32Speed: number;
    n32FlyEffect: number;
    n32MoveSound: string;
    MoveBeginEffect: string;
    MoveEndEffect: string;
    MoveAction: string;
    EventID: number;
}

export { AutoSkillCfgmove, AutoSkillCfgmoveInfo };
