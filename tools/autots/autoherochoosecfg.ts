import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoHeroChooseCfg {
    _mapInfo: Map<number, AutoHeroChooseCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoHeroChooseCfgInfo>();
    }

    private static _instance: AutoHeroChooseCfg;

    static async getInstance(): Promise<AutoHeroChooseCfg> {
        if (!this._instance) {
            this._instance = new AutoHeroChooseCfg();
            await this._instance.initialize('./conf/HeroChooseCfg.xml');
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

    getAutoHeroChooseCfgInfoItem(key: number): AutoHeroChooseCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoHeroChooseCfgInfo {
    name_ID: string;
    name_ch: string;
    pic_thumb: number;
    hero_des: string;
    hero_des2: string;
    hero_desPassitive: string;
    buy_des: string;
    bac_des: string;
    pic_icon: number;
    sound_select: string;
    skill_icon1: number;
    skill_icon2: number;
    skill_iconPassitive: number;
    newsguidehero: number;
}

export { AutoHeroChooseCfg, AutoHeroChooseCfgInfo };
