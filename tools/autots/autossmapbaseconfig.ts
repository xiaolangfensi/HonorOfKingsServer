import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSSMapBaseConfig {
    _mapInfo: Map<number, Array<AutoSSMapBaseConfigInfo>>;

    private constructor() {
        this._mapInfo = new Map<number, Array<AutoSSMapBaseConfigInfo>>();
    }

    private static _instance: AutoSSMapBaseConfig;

    static async getInstance(): Promise<AutoSSMapBaseConfig> {
        if (!this._instance) {
            this._instance = new AutoSSMapBaseConfig();
            await this._instance.initialize('./conf/MapConfig/SS_MapBaseConfig.xml');
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
                    let dataInfo = this._mapInfo.get(Number.parseInt(dataKey));
                    if (dataInfo) {
                        dataInfo.push(data);
                    } else {
                        let dataList = new Array<AutoSSMapBaseConfigInfo>();
                        dataList.push(data);
                        this._mapInfo.set(Number.parseInt(dataKey), dataList);
                    }
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

    getAutoSSMapBaseConfigInfoItem(key: number): Array<AutoSSMapBaseConfigInfo> {
        return this._mapInfo.get(key);
    }
}

interface AutoSSMapBaseConfigInfo {
    WayID: number;
    BaseID: number;
    BatmanTotal: number;
    BatchBatmanInterval: number;
    SingleBatmanInterval: number;
    SiegeVehicles: number;
    BatmanID: string;
    SiegeVehiclesID: number;
    SuperBatmanID: string;
    BatmanOrientation: string;
    SuperBatmanAltar: string;
    SuperBatmanWay: number;
    SoliderBornPoint: string;
}

export { AutoSSMapBaseConfig, AutoSSMapBaseConfigInfo };
