import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoWildMonsterCfg {
    _mapInfo: Map<number, AutoWildMonsterCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoWildMonsterCfgInfo>();
    }

    private static _instance: AutoWildMonsterCfg;

    static async getInstance(): Promise<AutoWildMonsterCfg> {
        if (!this._instance) {
            this._instance = new AutoWildMonsterCfg();
            await this._instance.initialize('./conf/WildMonsterCfg.xml');
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

    getAutoWildMonsterCfgInfoItem(key: number): AutoWildMonsterCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoWildMonsterCfgInfo {
    SceneID: number;
    PointID: number;
    n32Camp: number;
    un32RefreshTime: number;
    un32RefreshMon: string;
    un32RefreshPos: string;
    cBornDir: string;
    bIsPatrol: string;
    n32PatrolPoint: string;
    n32ActiveRadius: string;
    n32GroupID: number;
    n32BuffID: string;
    n32RefreshMsgType: number;
    sRefreshMsg: string;
}

export { AutoWildMonsterCfg, AutoWildMonsterCfgInfo };
