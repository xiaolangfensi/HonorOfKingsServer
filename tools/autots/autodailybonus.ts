import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoDailyBonus {
    _mapInfo: Map<number, AutoDailyBonusInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoDailyBonusInfo>();
    }

    private static _instance: AutoDailyBonus;

    static async getInstance(): Promise<AutoDailyBonus> {
        if (!this._instance) {
            this._instance = new AutoDailyBonus();
            await this._instance.initialize('./conf/DailyBonus.xml');
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

    getAutoDailyBonusInfoItem(key: number): AutoDailyBonusInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoDailyBonusInfo {
    n32Type: number;
    n32ItemID: number;
    n32ItemNum: number;
}

export { AutoDailyBonus, AutoDailyBonusInfo };
