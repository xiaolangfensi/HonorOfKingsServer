import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoBuffCfg {
    _mapInfo: Map<number, AutoBuffCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoBuffCfgInfo>();
    }

    private static _instance: AutoBuffCfg;

    static async getInstance(): Promise<AutoBuffCfg> {
        if (!this._instance) {
            this._instance = new AutoBuffCfg();
            await this._instance.initialize('./conf/BuffCfg.xml');
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

    getAutoBuffCfgInfoItem(key: number): AutoBuffCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoBuffCfgInfo {
    szName: string;
    bIsSendMsg: number;
    n32RepeatTimes: number;
    n32ReplaceID: number;
    n32Effect0ID: number;
    eEffect0LastTick: number;
    eEffect0Trigger: number;
    bEffect0ClearWhenDie: number;
    eEffect0EffectTimes: number;
    eEffect0EffectInterval: number;
    eEffect0Value: number;
    eEffect0Rate: number;
    szEffectIcon: number;
    szEffectSound: string;
    szEffectDes: string;
    szEffection: string;
}

export { AutoBuffCfg, AutoBuffCfgInfo };
