import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoMapLoadCfg {
    _mapInfo: Map<number, AutoMapLoadCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoMapLoadCfgInfo>();
    }

    private static _instance: AutoMapLoadCfg;

    static async getInstance(): Promise<AutoMapLoadCfg> {
        if (!this._instance) {
            this._instance = new AutoMapLoadCfg();
            await this._instance.initialize('./conf/MapLoadCfg.xml');
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

    getAutoMapLoadCfgInfoItem(key: number): AutoMapLoadCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoMapLoadCfgInfo {
    LoadScene: string;
    MiniMap: string;
    NameCn: string;
    ACameraPos: number;
    BCameraPos: number;
    ShowPic: number;
    PlayerNum: number;
    PlayerMode: string;
    ShopID: number;
    CameraType: number;
    IsAI: number;
    IsNormal: number;
    IsRank: number;
    IsTrain: number;
    IsDungeon: number;
}

export { AutoMapLoadCfg, AutoMapLoadCfgInfo };
