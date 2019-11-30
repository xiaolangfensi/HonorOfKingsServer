import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoSSbornhero {
    _mapInfo: Map<number, Array<AutoSSbornheroInfo>>;

    private constructor() {
        this._mapInfo = new Map<number, Array<AutoSSbornheroInfo>>();
    }

    private static _instance: AutoSSbornhero;

    static async getInstance(): Promise<AutoSSbornhero> {
        if (!this._instance) {
            this._instance = new AutoSSbornhero();
            await this._instance.initialize('./conf/SSGuideCfg/SS_bornhero.xml');
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
                        let dataList = new Array<AutoSSbornheroInfo>();
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

    getAutoSSbornheroInfoItem(key: number): Array<AutoSSbornheroInfo> {
        return this._mapInfo.get(key);
    }
}

interface AutoSSbornheroInfo {
    taskid: number;
    pointform: number;
    ID: number;
    camp: number;
    spawnpoint: string;
    Increasinganger: number;
    time: number;
}

export { AutoSSbornhero, AutoSSbornheroInfo };
