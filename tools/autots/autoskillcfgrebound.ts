import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgrebound {
    _mapInfo: Map<number, AutoSkillCfgreboundInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgreboundInfo>();
    }

    private static _instance: AutoSkillCfgrebound;

    static async getInstance(): Promise<AutoSkillCfgrebound> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgrebound();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_rebound.xml');
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

    getAutoSkillCfgreboundInfoItem(key: number): AutoSkillCfgreboundInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgreboundInfo {
    szName: string;
    n32BaseValue: number;
    n32HarmRate: number;
    n32TargetLifeRate: number;
    n32SelfLifeRate: number;
}

export { AutoSkillCfgrebound, AutoSkillCfgreboundInfo };
