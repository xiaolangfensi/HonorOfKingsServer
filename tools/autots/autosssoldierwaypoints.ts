import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSSSoldierWaypoints {
    _mapInfo: Map<number, Array<AutoSSSoldierWaypointsInfo>>;

    private constructor() {
        this._mapInfo = new Map<number, Array<AutoSSSoldierWaypointsInfo>>();
    }

    private static _instance: AutoSSSoldierWaypoints;

    static async getInstance(): Promise<AutoSSSoldierWaypoints> {
        if (!this._instance) {
            this._instance = new AutoSSSoldierWaypoints();
            await this._instance.initialize('./conf/MapConfig/SS_SoldierWaypoints.xml');
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
                        let dataList = new Array<AutoSSSoldierWaypointsInfo>();
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

    getAutoSSSoldierWaypointsInfoItem(key: number): Array<AutoSSSoldierWaypointsInfo> {
        return this._mapInfo.get(key);
    }
}

interface AutoSSSoldierWaypointsInfo {
    WayID: number;
    Camp: number;
    Coordinate: string;
}

export { AutoSSSoldierWaypoints, AutoSSSoldierWaypointsInfo };
