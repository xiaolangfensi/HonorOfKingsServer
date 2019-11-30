import { myLogger } from "../../src/common/mylogger";
import Utils from "../../src/common/utils";

class AutoMsgSettingCfg {
    _mapInfo: Map<number, AutoMsgSettingCfgInfo>;

    private constructor() {
        this._mapInfo = new Map<number, AutoMsgSettingCfgInfo>();
    }

    private static _instance: AutoMsgSettingCfg;

    static async getInstance(): Promise<AutoMsgSettingCfg> {
        if (!this._instance) {
            this._instance = new AutoMsgSettingCfg();
            await this._instance.initialize('./conf/MsgSettingCfg.xml');
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

    getAutoMsgSettingCfgInfoItem(key: number): AutoMsgSettingCfgInfo {
        return this._mapInfo.get(key);
    }
}

interface AutoMsgSettingCfgInfo {
    color: string;
    font_size: number;
    effect: number;
    effect_color: string;
    effect_distance: string;
    position_start_in: string;
    position_end_in: string;
    position_time_in: number;
    position_start_out: string;
    position_end_out: string;
    position_time_out: number;
    rotation_start_in: string;
    rotation_end_in: string;
    rotation_time_in: number;
    scale_start_in: string;
    scale_end_in: string;
    scale_time_in: number;
    scale_start_out: string;
    scale_end_out: string;
    scale_time_out: number;
    alpha_start_in: number;
    alpha_end_in: number;
    alpha_time_in: number;
    alpha_start_out: number;
    alpha_end_out: number;
    alpha_time_out: number;
    if_frame: number;
    staytime: number;
}

export { AutoMsgSettingCfg, AutoMsgSettingCfgInfo };
