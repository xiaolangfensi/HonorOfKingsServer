import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkillCfgswitch {
    _mapInfo: Map<number, AutoSkillCfgswitchInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkillCfgswitchInfo>();
    }

    private static _instance: AutoSkillCfgswitch;

    static async getInstance(): Promise<AutoSkillCfgswitch> {
        if (!this._instance) {
            this._instance = new AutoSkillCfgswitch();
            await this._instance.initialize('./conf/NewSkill/SkillCfg_switch.xml');
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

    getAutoSkillCfgswitchInfoItem(key: number): AutoSkillCfgswitchInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkillCfgswitchInfo {
    szName: string;
    n32UseMP: number;
    n32UseHP: number;
    n32UseCP: number;
    bIsCoolDown: number;
    n32TriggerRate: number;
    StartIcon: number;
    StartEffect: number;
    PassEventID: number;
}

export { AutoSkillCfgswitch, AutoSkillCfgswitchInfo };
