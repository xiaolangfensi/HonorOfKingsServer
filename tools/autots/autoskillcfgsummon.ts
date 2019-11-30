import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgsummon {
    _mapInfo: Map<number, AutoSkillCfgsummonInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgsummonInfo>();
    }

    private static _instance: AutoSkillCfgsummon;

    static async getInstance(): Promise<AutoSkillCfgsummon> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgsummon();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_summon.xml');
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

    getAutoSkillCfgsummonInfoItem(key: number): AutoSkillCfgsummonInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgsummonInfo {
    szName: string;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    bIsCoolDown: number;
    n32TriggerRate: number;
    eSummonType: number;
    eSummonWayType: number;
    summonID: number;
    n32SummonNum: number;
    n32Distance: number;
    eLifeTime: number;
    summonAction: number;
    summonEffect: number;
    summonSound: string;
    EventID: number;
}

export { AutoSkillCfgsummon, AutoSkillCfgsummonInfo };
