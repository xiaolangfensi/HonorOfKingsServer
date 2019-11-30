import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSSuserHero {
    _mapInfo: Map<number, AutoSSuserHeroInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoSSuserHeroInfo>();
    }

    private static _instance: AutoSSuserHero;

    static async getInstance(): Promise<AutoSSuserHero> {
        if (!this._instance) {
            this._instance = new AutoSSuserHero();
            await this._instance.initialize('./conf/SSGuideCfg/SS_userHero.xml');
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

    getAutoSSuserHeroInfoItem(key: number): AutoSSuserHeroInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoSSuserHeroInfo {
    hero: string;
    id: number;
}

export { AutoSSuserHero, AutoSSuserHeroInfo };
