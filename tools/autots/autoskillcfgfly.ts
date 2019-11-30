import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgfly {
    _mapInfo: Map<number, AutoSkillCfgflyInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgflyInfo>();
    }

    private static _instance: AutoSkillCfgfly;

    static async getInstance(): Promise<AutoSkillCfgfly> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgfly();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_fly.xml');
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

    getAutoSkillCfgflyInfoItem(key: number): AutoSkillCfgflyInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgflyInfo {
    szName: string;
    n32RaiseSpeed: number;
    n32AccSpeed: number;
    n32FallSpeed: number;
    n32FallAccSpeed: number;
    n32StayTime: number;
    bIsCanBeRecover: number;
    n32MoveEffect: number;
    n32StartMoveEffect: number;
    n32EndMoveEffect: number;
    n32MoveAction: number;
}

export { AutoSkillCfgfly, AutoSkillCfgflyInfo };
