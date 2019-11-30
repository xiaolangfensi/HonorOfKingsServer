import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgrelive {
    _mapInfo: Map<number, AutoSkillCfgreliveInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgreliveInfo>();
    }

    private static _instance: AutoSkillCfgrelive;

    static async getInstance(): Promise<AutoSkillCfgrelive> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgrelive();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_relive.xml');
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

    getAutoSkillCfgreliveInfoItem(key: number): AutoSkillCfgreliveInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgreliveInfo {
    szName: string;
    n32WaitMilSec: number;
    n32BaseHP: number;
    n32PercentHP: number;
    n32BaseMP: number;
    n32PercentMP: number;
}

export { AutoSkillCfgrelive, AutoSkillCfgreliveInfo };
