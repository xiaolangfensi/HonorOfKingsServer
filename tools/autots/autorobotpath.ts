import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoRobotPath {
    _mapInfo: Map<number, AutoRobotPathInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoRobotPathInfo>();
    }

    private static _instance: AutoRobotPath;

    static async getInstance(): Promise<AutoRobotPath> {
        if (!this._instance) {
            this._instance = new AutoRobotPath();
            await this._instance.initialize('./conf/RobotPath.xml');
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

    getAutoRobotPathInfoItem(key: number): AutoRobotPathInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoRobotPathInfo {
    n32MapID: number;
    n32CampID: number;
    n32NodeID: number;
    n32NodeX: number;
    n32NodeY: number;
    n32NodeZ: number;
}

export { AutoRobotPath, AutoRobotPathInfo };
