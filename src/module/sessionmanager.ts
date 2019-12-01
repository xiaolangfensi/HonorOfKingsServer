import { IHOKTokenData } from './gameinterface';
import Utils from '../common/utils';

export class SessionManager {
    protected _checkTimeInterval: NodeJS.Timer;
    private _tokenDataMap: Map <string, IHOKTokenData>;
    
    private static _instance: SessionManager;
    public static getInstance(): SessionManager {
        if (!this._instance) {
            this._instance = new SessionManager();
        }
        return this._instance;
    } 
    
    private constructor (){
        this._tokenDataMap = new Map <string, IHOKTokenData>();
        this._checkTimeInterval = setInterval(()=>{
            let now = new Date().getTime();
            for (let [key, data] of this._tokenDataMap.entries()) {
                if (now - data.timestamp> 5 * 60 * 1000) {
                    this._tokenDataMap.delete(key);
                }
            }
        }, 1000 * 5 * 12);
    }

    public addData(cdKey: string ,token: string, ip: string, uid:number, timeStamp: number = 0) {
        this._tokenDataMap.set(cdKey, <IHOKTokenData>{
            uid: uid,
            token: token,
            ip: ip,
            timestamp: timeStamp            
        });
    }

    public verifyToken(cdKey: string ,token: string, ip: string):number {
        let data = this._tokenDataMap.get(cdKey);
        if (data) {
            let md5Str = Utils.md5(`${data.timestamp}:${token}`);
            if (data.token === md5Str ||  data.token===token) {// && data.ip === ip) {
                return data.uid;
            }
        }
        return 0;
    }

    public removeData(cdKey: string) {
        this._tokenDataMap.delete(cdKey);
    }

    public dispose() {
        this._tokenDataMap.clear();
    }

}