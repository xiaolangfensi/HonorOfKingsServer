import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSSbornnpc {
    _mapInfo: Map<number, Array<AutoSSbornnpcInfo>>;

    private constructor() {
        this._mapInfo = new Map<number, Array<AutoSSbornnpcInfo>>();
    }

    private static _instance: AutoSSbornnpc;

    static async getInstance(): Promise<AutoSSbornnpc> {
        if (!this._instance) {
            this._instance = new AutoSSbornnpc();
            await this._instance.initialize('./conf/SSGuideCfg/SS_bornnpc.xml');
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
                        let dataList = new Array<AutoSSbornnpcInfo>();
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

    getAutoSSbornnpcInfoItem(key: number): Array<AutoSSbornnpcInfo> {
        return this._mapInfo.get(key);
    }
}

interface AutoSSbornnpcInfo {
    taskid: number;
    post: string;
    way: string;
    timespace: number;
    bornnumberspace: number;
    ID: string;
    dir: string;
    closeborn: number;
    camp: number;
    altarid: string;
}

export { AutoSSbornnpc, AutoSSbornnpcInfo };
