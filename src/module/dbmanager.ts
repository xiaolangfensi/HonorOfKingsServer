import { MysqlPool } from '../common/mysqlpool';
import { myLogger } from '../common/mylogger';
import Utils from '../common/utils';
import { HOKError } from '../common/const';
import { IHOKData, IHOKGameData, IHOKAcount } from './gameinterface';
import { GCToBS } from './hokprotobuf';
import { InitializeDatabase } from '../../tools/initdb';

class DBManager {
    private _mysql: MysqlPool;
    private _sqlQueryGameUser = 'select id,obj_id objId,sdk_id sdkId,obj_cdkey objCDKey,obj_name objName,obj_sex objSex,obj_lv objLV,obj_score objScore,obj_headid objHeadId,obj_diamond \
                                objDiamond,obj_gold objGold,obj_register_time objRegisterTime,obj_last_login_time objLastLoginTime,obj_game_inns objGameInns,obj_game_winns objGameWinns, \
                                obj_kill_hero_num objKillHeroNum,obj_ass_kill_num objASSKillNum,obj_dest_building_num objDestBuildingNum,obj_dead_num objDeadNum,obj_first_win_time objFirstWinTime, \
                                obj_cur_lv_exp objCurLevelExp,obj_cldays objCLDays,obj_friends objFriends,obj_last_loginreward_time objLastLoginRewardTime,obj_vip_lv objVIPLevel,obj_vip_score objVIPScore, \
                                obj_task_data objTaskData from fball_gamedb_1.gameuser where obj_id = ?';
    private _sqlQueryUser = 'SELECT * from gameuser, gameuser_runne,gameuser_guide where gameuser.obj_id = ? and gameuser_runne.user_id =? and  gameuser_guide.obj_id = ?';
    private _sqlGetUserHeros = 'select id ,user_id userId,hero_id heroId,hero_end_time heroEndTiem,hero_buy_time heroBuyTime,del_state delState from gameuser_hero where user_id = ?';
    private _sqlGetUserMoney = 'select id ,obj_id objId,obj_diamond objDiamond,obj_gold objGold from gameuser_money where obj_id = ?';
    private _sqlGetUserRune = 'select id,user_id userId,runnebag_json runneBagJson,runeslot_json runneSlotJgon from gameuser_runne where user_id = ?';
    private _sqlQueryUserSNSList = 'select user_id,related_id,relation from gameuser_sns where user_id = ?';
    private _sqlQueryUserHeaderAndNickname = 'select obj_name,obj_headid,obj_vip_lv from gameuser where obj_id = ?';
    private _sqlQueryUserItems = 'select user_id userId,item_id itemId,item_num itemNum,buy_time buyTime,end_time endTime from gameuser_item where user_id = ?';
    private _sqlAddNewGameUserInfo = 'INSERT gameuser(obj_id,sdk_id,obj_cdkey) values(?,?,?);INSERT gameuser_runne(user_id)VALUES(?);';
    private _sqlQueryNotices = 'select id ,platform_id platformId,title ,eflag ,estate ,priority ,notice ,star_time starTime,end_time endTime from notice';
    private _sqlGetMaxMailId = 'select mail_id mailId,mail_sdk mailSdk,mail_type mailType,mail_user_id mailUserId,mail_title mailTitle,mail_content mailContent,mail_gift mailGift,mail_send mailSend,mail_create_time mailCreateTime,mail_over_time mailOverTime,mail_del_state mailDelState from game_mail where mail_id';
    private _sqlQueryAcountUser = 'select id,cdkey cdKey,user_name userName,cs_id csId,sdk_id sdkId from fball_accountdb.account_user where cdkey = ?';
    private _sqlDeleteUserDbHeros = 'delete from gameuser_hero where hero_id = ? and user_id = ?';

    private _sqlNewUserAccount = 'INSERT account_user(id, cs_id, sdk_id, cdkey) values(?,?,?,?)';
    private _sqlNewUserGameUser = 'INSERT gameuser(obj_id, sdk_id, obj_cdkey, obj_register_time) values(?,?,?,?)';
    private _sqlNewUserGameUserRunne = 'INSERT gameuser_runne(user_id) VALUES(?)';
    private _sqlNewUserGameUserGuide = 'INSERT gameuser_guide(obj_id) values(?)';
    
    private _sqlInsertNotice = 'insert into notice(platform_id, title, eflag, estate, priority, notice, star_time, end_time) value(?, ?, ?, ?, ?, ?, ?, ?)';

    private _sqlInserCDKey = 'insert into cdkey_info(cdkey, event_id, use_state, server_id) value(?,?,0,0)';
    private _sqlUpdateCDKey = 'update cdkey_info set use_state=?,user_time=?,server_id=?,user_name=? where cdkey=?';

    private _sqlNewUserHeros = 'insert INTO gameuser_hero(user_id,hero_id,hero_end_time,hero_buy_time) values(?,?,?,?)';

    private _sqlInsertOrUpdateRunesBagData = 'update gameuser_runne set runnebag_json=? where user_id=?';
    private _sqlInsertOrUpdateRunesSlotData = 'update gameuser_runne set runneslot_json=? where user_id=?';
    private _sqlInsertOrUpdateAllRunesData = 'update gameuser_runne set runnebag_json=?, runeslot_json=? where user_id=?';

    private _sqlUpdateHeroData = 'update gameuser_hero set hero_end_time=? where user_id=? and hero_id=?';
    private _sqlChangeNickName = 'update account_user set user_name=? where id=?';

    private _idDataMap:Map<number, IHOKData>;
    private _keyIdMap:Map<string, number>;
    private static _instance: DBManager;
    public static getInstance(): DBManager {
        if (!this._instance) {
            this._instance = new DBManager();
        }
        return this._instance;
    }    

    private constructor () {
        this._mysql = <MysqlPool>{};
        this._idDataMap = new Map<number, IHOKData>();
        this._keyIdMap = new Map<string, number>();
    }

    public initialize(confFile:DBConfig) {
        this._mysql = new MysqlPool(confFile);
        myLogger.log('DBManager initialize finished ...');
    }

    async readGameData(csKey: string) {
        let userId = <number>this._keyIdMap.get(csKey);
        if (!userId) {
            let accounts = await this.readUser(csKey).catch(e=>{
                return Promise.reject(e);
            });
            if (accounts.length>0) {
                this._idDataMap.set(accounts[0].id, <IHOKData>{
                    account: accounts[0]
                });
                this._keyIdMap.set(csKey, accounts[0].id);
                userId = accounts[0].id;
            } else {
                return Promise.reject(HOKError.NOT_REGISTERED);
            }
        }
        let gameDatas = await Promise.all([this.readGameUser(userId),this.readGameUserHero(userId),
            this.readGameUserMoney(userId),this.readGameUserRunne(userId),this.readGameUserItem(userId),
            this.readGameMail(userId),this.readNotice(),this.readSNS(userId)]);
        let userData = <IHOKData>this._idDataMap.get(userId);
        userData.game = <IHOKGameData>{
            user: gameDatas[0][0],
            userHeros: gameDatas[1],
            userMoney: gameDatas[2][0],
            userRunnes: gameDatas[3],
            userItems: gameDatas[4],
            userMails: gameDatas[5],
            userNotices: gameDatas[6],
            userSNS: gameDatas[7]
        }

        return Promise.resolve(userData.game);
    }

    public getUserData(uid : number){
        return <IHOKData>this._idDataMap.get(uid);
    }

    private readUser(csKey: string): Promise<any> {
        return this._mysql.query(this._sqlQueryAcountUser, [csKey]);
    }

    private readGameUser(obj_id: number): Promise<any> {
        return this._mysql.query(this._sqlQueryGameUser, [obj_id]);
    }

    private readGameUserHero(user_id: number): Promise<any> {
        return this._mysql.query(this._sqlGetUserHeros, [user_id]);
    }

    private readGameUserMoney(obj_id: number): Promise<any> {
        return this._mysql.query(this._sqlGetUserMoney, [obj_id]);
    }

    private readGameUserRunne(user_id: number): Promise<any> {
        return this._mysql.query(this._sqlGetUserRune, [user_id]);
    }

    private readGameUserItem(user_id: number): Promise<any> {
        return this._mysql.query(this._sqlQueryUserItems, [user_id]);
    }

    private readGameMail(mail_id: number): Promise<any> {
        return this._mysql.query(this._sqlGetMaxMailId, [mail_id]);
    }

    private readNotice(): Promise<any> {
        return this._mysql.query(this._sqlQueryNotices, []);
    }

    private readSNS(user_id: number): Promise<any> {
        return this._mysql.query(this._sqlQueryUserSNSList, [user_id]);
    }

    async readAccount(userName: string): Promise<IHOKAcount> {
        let accountData:any = null;
        let accounts = await this.readUser(userName).catch(e=>{
            return Promise.reject(undefined);
        }) as Array<IHOKAcount>;
        if (accounts.length>0) {
            if (!this._keyIdMap.get(userName)) {
                this._idDataMap.set(accounts[0].id, <IHOKData>{
                    account: accounts[0]
                });
                this._keyIdMap.set(userName, accounts[0].id);
            }
            return Promise.resolve(accounts[0]);
        } 
        return Promise.reject(undefined);
    }

    public async checkUser(message: GCToBS.OneClientLogin) {
        let platform: number = message.plat;
        let userName:string = message.uin;
        let password:string = message.sessionid;
        let userId = this._keyIdMap.get(userName);

        let accountData:any = null;

        if (!userId) {
            try {
                accountData = await this.readAccount(userName);
            } catch(e) {
                myLogger.log('new user');
            }
            if (!accountData) {
                let newUser = new InitializeDatabase(this._mysql);
                await newUser.addUser(userName, platform);
                accountData = await this.readAccount(userName).catch(e=>{
                    return Promise.reject(e);
                });                   
            }
        } else {
            let account = <IHOKData>this._idDataMap.get(userId);
            if (!account.account) {
                try {
                    accountData = await this.readAccount(userName);
                } catch(e) {
                    myLogger.log('new user');
                }
            } else {
                accountData = account.account;
            }
        }
        let newUser = new InitializeDatabase(this._mysql);
        await newUser.addUser(userName, platform);
        accountData = await this.readAccount(userName).catch(e=>{
            return Promise.reject(e);
        });
        // let md5Pwd = Utils.md5(`${accountData.id}:${password}`);
        // if(md5Pwd!==accountData.password) {
        //     return Promise.reject(HOKError.PASSWORD_WRONG);
        // } else {
        //     return Promise.resolve(accountData);
        // }
        return Promise.resolve(accountData);
    }

    async newUser(message: GCToBS.OneClientLogin) {
        // let sqlIntert = `insert into fball_accountdb.account_user(cs_id,sdk_id,cdkey,user_name,password) values(0, ${message.plat}, '${message.uin}','${message.uin}', '暴风', '')`;
        // let sqlGameUser = `insert into fball_gamedb_1.gameuser(obj_id, obj_cdkey, obj_register_time) values(${}, '${cdkey}', ${regiterTime})`;
        // let sqlUpdate = `update fball_gamedb_1.gameuser set obj_lv = ${lv}, obj_headid=${headid}, obj_gold=${gold}, obj_last_loginreward_time = '${loginTime}'`;
    }

    executeSQL(sqlStr:string, sqlParam = []): Promise<any> {
        return this._mysql.query(sqlStr, sqlParam);
    }
}

export default DBManager;