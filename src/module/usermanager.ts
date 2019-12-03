import { HOKClient } from "./hokclient";
import { AllErrorCodeEnum } from "./gameenum";
import { HOKUser } from './hokuser';
import { myLogger } from "../common/mylogger";
import { SQLBuilder } from '../common/database/sqlbuilder';
import { IHOKData } from "./gameInterface";
import DBManager from "./dbManager";

export class UserCombineKey {
    private _username: string;
    private _sdkId: number;
    constructor(username: string, sdkid: number) {
        this._username = username;
        this._sdkId = sdkid;
    }

    less(combineKey: UserCombineKey): boolean {
        let res = this._username.localeCompare(combineKey._username);
        if (res == 0) {
            return this._sdkId < combineKey._sdkId;
        } else {
            return res < 1;
        }
    }

    getUniqueName() {
        return `${this._sdkId}:${this._username}`;
    }
}

export class UserManager {
    private _mapAllUserName2GUID: Map<string, number>;
    private _mapGUIDUser: Map<number, HOKUser>;

    private static _instance: UserManager;
    static getInstance(): UserManager {
        if (!this._instance) {
            this._instance = new UserManager();
        }
        return this._instance;
    }

    constructor() {
        this._mapAllUserName2GUID = new Map<string, number>();
        this._mapGUIDUser = new Map<number, HOKUser>();
    }

    getUserByGUID(guid: number): HOKUser {
        return this._mapGUIDUser.get(guid);
    }

    private async insertNewUserToMysql(loginData: any) {
        let builder = new SQLBuilder();
        if (builder) {
            builder.newBuilder('fball_accountdb', 'account_user');
            builder.addField('cs_id', loginData.name);
            builder.addField('sdk_id', loginData.platform);
            builder.addField('user_name', '');
            builder.addField('cdkey', loginData.name);
            builder.addField('password', loginData.passwd);

            await DBManager.getInstance().executeSQL(builder.toInsertSQLString()).catch(e=> {
                myLogger.error(e.message);
                return Promise.reject;
            });

            await DBManager.getInstance().readGameData(loginData.name).catch(e=> {
                myLogger.error(e.message);
                return Promise.reject;
            });

            return Promise.resolve;
        }
    }

    async userAskLogin(messageData: any, client: HOKClient): Promise<number> {
        if (messageData.name==='' || messageData.name.length>30) {
            return AllErrorCodeEnum.eEC_InvalidUserName;
        }
        let combineKey = new UserCombineKey(messageData.name, messageData.sdk).getUniqueName();
        let guid = this._mapAllUserName2GUID.get(combineKey);
        //如果数据已经存在了
        if (guid) {
            let user = this.getUserByGUID(guid);
            let userData = DBManager.getInstance().getUserData(client.getuId());
        } else {
            let accountData = await DBManager.getInstance().readAccount(messageData.name);
            if (!accountData) {
                await this.insertNewUserToMysql(messageData).catch((e)=>{
                    myLogger.error(e.message);
                });
                accountData = await DBManager.getInstance().readAccount(messageData.name);
            }
            if (accountData) {
                let user = new HOKUser();
                guid = accountData.id;
                this._mapGUIDUser.set(guid, user);
                this._mapAllUserName2GUID.set(combineKey, guid);
                user.setUserDBData(DBManager.getInstance().getUserData(guid));
                return Promise.resolve(0);
            }
            return Promise.resolve(-1);
        }

        return Promise.resolve(0);
    }
}