import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoInfiniteTask {
    _mapInfo: Map<number, AutoInfiniteTaskInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoInfiniteTaskInfo>();
    }

    private static _instance: AutoInfiniteTask;

    static async getInstance(): Promise<AutoInfiniteTask> {
        if (!this._instance) {
            this._instance = new AutoInfiniteTask();
            await this._instance.initialize('./conf/InfiniteTask.xml');
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

    getAutoInfiniteTaskInfoItem(key: number): AutoInfiniteTaskInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoInfiniteTaskInfo {
    TaskTimeType: number;
    TaskType: number;
    TaskMaxCount: number;
}

export { AutoInfiniteTask, AutoInfiniteTaskInfo };
