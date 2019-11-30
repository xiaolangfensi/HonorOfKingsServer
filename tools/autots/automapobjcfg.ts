import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoMapObjCfg {
    _mapInfo: Map<number, AutoMapObjCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoMapObjCfgInfo>();
    }

    private static _instance: AutoMapObjCfg;

    static async getInstance(): Promise<AutoMapObjCfg> {
        if (!this._instance) {
            this._instance = new AutoMapObjCfg();
            await this._instance.initialize('./conf/MapObjCfg.xml');
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

    getAutoMapObjCfgInfoItem(key: number): AutoMapObjCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoMapObjCfgInfo {
    un32MapID: number;
    eObjectTypeID: number;
    un32ObjIdx: number;
    n32Camp: number;
    cBornPos: string;
    cBornDir: string;
    ReplaceID: string;
    n32Visibility: number;
    eAttackMode: number;
}

export { AutoMapObjCfg, AutoMapObjCfgInfo };
