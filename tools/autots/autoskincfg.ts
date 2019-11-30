import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkinCfg {
    _mapInfo: Map<number, AutoSkinCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkinCfgInfo>();
    }

    private static _instance: AutoSkinCfg;

    static async getInstance(): Promise<AutoSkinCfg> {
        if (!this._instance) {
            this._instance = new AutoSkinCfg();
            await this._instance.initialize('./conf/SkinCfg.xml');
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

    getAutoSkinCfgInfoItem(key: number): AutoSkinCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkinCfgInfo {
    SkinName: string;
    n32Level: number;
    un8ConsumeType: number;
    n32Price: number;
    Time: number;
    Description: number;
    Icon: number;
    ResourcesID: number;
    Skill1Effect: number;
    Skill2Effect: number;
}

export { AutoSkinCfg, AutoSkinCfgInfo };
