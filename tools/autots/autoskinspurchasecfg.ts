import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSkinsPurchaseCfg {
    _mapInfo: Map<number, AutoSkinsPurchaseCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSkinsPurchaseCfgInfo>();
    }

    private static _instance: AutoSkinsPurchaseCfg;

    static async getInstance(): Promise<AutoSkinsPurchaseCfg> {
        if (!this._instance) {
            this._instance = new AutoSkinsPurchaseCfg();
            await this._instance.initialize('./conf/SkinsPurchaseCfg.xml');
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

    getAutoSkinsPurchaseCfgInfoItem(key: number): AutoSkinsPurchaseCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSkinsPurchaseCfgInfo {
    UnlockHeroID: number;
    HalfPhotoIcon: number;
    ConsumeType: string;
    n32Price: string;
    n32Time: number;
    TexturePick: string;
    DefaultSkin: number;
}

export { AutoSkinsPurchaseCfg, AutoSkinsPurchaseCfgInfo };
