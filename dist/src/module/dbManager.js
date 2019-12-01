"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqlpool_1 = require("../common/mysqlpool");
const mylogger_1 = require("../common/mylogger");
const const_1 = require("../common/const");
const initdb_1 = require("../../tools/initdb");
class DBManager {
    constructor() {
        this._sqlQueryAcountUser = 'select id,cdkey cdKey,user_name userName,cs_id csId,sdk_is sdkId from fball_accountdb.account_user where cdkey = ?';
        this._sqlQueryGameUser = 'select id,obj_id objId,sdk_id sdkId,obj_cdkey objCDKey,obj_name objName,obj_sex objSex,obj_lv objLV,obj_score objScore,obj_headid objHeadId,obj_diamond \
    objDiamond,obj_gold objGold,obj_register_time objRegisterTime,obj_last_login_time objLastLoginTime,obj_game_inns objGameInns,obj_game_winns objGameWinns, \
    obj_kill_hero_num objKillHeroNum,obj_ass_kill_num objASSKillNum,obj_dest_building_num objDestBuildingNum,obj_dead_num objDeadNum,obj_first_win_time objFirstWinTime, \
    obj_cur_lv_exp objCurLevelExp,obj_cldays objCLDays,obj_friends objFriends,obj_last_loginreward_time objLastLoginRewardTime,obj_vip_lv objVIPLevel,obj_vip_score objVIPScore, \
    obj_task_data objTaskData from fball_gamedb_1.gameuser where obj_id = ?';
        this._sqlQueryUser = 'SELECT * from gameuser, gameuser_runne,gameuser_guide where gameuser.obj_id = ? and gameuser_runne.user_id =? and  gameuser_guide.obj_id = ?';
        this._sqlGetUserHeros = 'select id ,user_id userId,hero_id heroId,hero_end_time heroEndTiem,hero_buy_time heroBuyTime,del_state delState from gameuser_hero where user_id = ?';
        this._sqlGetUserMoney = 'select id ,obj_id objId,obj_diamond objDiamond,obj_gold objGold from gameuser_money where obj_id = ?';
        this._sqlGetUserRune = 'select id,user_id userId,runnebag_json runneBagJson,runeslot_json runneSlotJgon from gameuser_runne where user_id = ?';
        this._sqlQueryUserSNSList = 'select user_id,related_id,relation from gameuser_sns where user_id = ?';
        this._sqlQueryUserHeaderAndNickname = 'select obj_name,obj_headid,obj_vip_lv from gameuser where obj_id = ?';
        this._sqlQueryUserItems = 'select user_id userId,item_id itemId,item_num itemNum,buy_time buyTime,end_time endTime from gameuser_item where user_id = ?';
        this._sqlAddNewGameUserInfo = 'INSERT gameuser(obj_id,sdk_id,obj_cdkey) values(?,?,?);INSERT gameuser_runne(user_id)VALUES(?);';
        this._sqlQueryNotices = 'select id ,platform_id platformId,title ,eflag ,estate ,priority ,notice ,star_time starTime,end_time endTime from notice';
        this._sqlGetMaxMailId = 'select mail_id mailId,mail_sdk mailSdk,mail_type mailType,mail_user_id mailUserId,mail_title mailTitle,mail_content mailContent,mail_gift mailGift,mail_send mailSend,mail_create_time mailCreateTime,mail_over_time mailOverTime,mail_del_state mailDelState from game_mail where mail_id';
        this._sqlDeleteUserDbHeros = 'delete from gameuser_hero where hero_id = ? and user_id = ?';
        this._sqlNewUserAccount = 'INSERT account_user(id, cs_id, sdk_id, cdkey) values(?,?,?,?)';
        this._sqlNewUserGameUser = 'INSERT gameuser(obj_id, sdk_id, obj_cdkey, obj_register_time) values(?,?,?,?)';
        this._sqlNewUserGameUserRunne = 'INSERT gameuser_runne(user_id) VALUES(?)';
        this._sqlNewUserGameUserGuide = 'INSERT gameuser_guide(obj_id) values(?)';
        this._sqlInsertNotice = 'insert into notice(platform_id, title, eflag, estate, priority, notice, star_time, end_time) value(?, ?, ?, ?, ?, ?, ?, ?)';
        this._sqlInserCDKey = 'insert into cdkey_info(cdkey, event_id, use_state, server_id) value(?,?,0,0)';
        this._sqlUpdateCDKey = 'update cdkey_info set use_state=?,user_time=?,server_id=?,user_name=? where cdkey=?';
        this._sqlNewUserHeros = 'insert INTO gameuser_hero(user_id,hero_id,hero_end_time,hero_buy_time) values(?,?,?,?)';
        this._sqlInsertOrUpdateRunesBagData = 'update gameuser_runne set runnebag_json=? where user_id=?';
        this._sqlInsertOrUpdateRunesSlotData = 'update gameuser_runne set runneslot_json=? where user_id=?';
        this._sqlInsertOrUpdateAllRunesData = 'update gameuser_runne set runnebag_json=?, runeslot_json=? where user_id=?';
        this._sqlUpdateHeroData = 'update gameuser_hero set hero_end_time=? where user_id=? and hero_id=?';
        this._sqlChangeNickName = 'update account_user set user_name=? where id=?';
        this._mysql = {};
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new DBManager();
        }
        return this._instance;
    }
    initialize(confFile) {
        this._mysql = new mysqlpool_1.MysqlPool(confFile);
        mylogger_1.myLogger.log('DBManager initialize finished ...');
    }
    executeSQL(sqlStr, sqlParam = []) {
        return this._mysql.query(sqlStr, sqlParam);
    }
    readUser(cdKey) {
        return this._mysql.query(this._sqlQueryAcountUser, [cdKey]);
    }
    readGameData(csKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = this._keyIdMap.get(csKey);
            if (!userId) {
                let accounts = yield this.readUser(csKey).catch(e => {
                    return Promise.reject(e);
                });
                if (accounts.length > 0) {
                    this._idDataMap.set(accounts[0].id, {
                        account: accounts[0]
                    });
                    this._keyIdMap.set(csKey, accounts[0].id);
                    userId = accounts[0].id;
                }
                else {
                    return Promise.reject(const_1.HOKError.NOT_REGISTERED);
                }
            }
            let gameDatas = yield Promise.all([this.readGameUser(userId), this.readGameUserHero(userId),
                this.readGameUserMoney(userId), this.readGameUserRunne(userId), this.readGameUserItem(userId),
                this.readGameMail(userId), this.readNotice(), this.readSNS(userId)]);
            let userData = this._idDataMap.get(userId);
            userData.game = {
                user: gameDatas[0][0],
                userHeros: gameDatas[1],
                userMoney: gameDatas[2][0],
                userRunnes: gameDatas[3],
                userItems: gameDatas[4],
                userMails: gameDatas[5],
                userNotices: gameDatas[6],
                userSNS: gameDatas[7]
            };
            return Promise.resolve(userData.game);
        });
    }
    getUserData(uid) {
        return this._idDataMap.get(uid);
    }
    readGameUser(obj_id) {
        return this._mysql.query(this._sqlQueryGameUser, [obj_id]);
    }
    readGameUserHero(user_id) {
        return this._mysql.query(this._sqlGetUserHeros, [user_id]);
    }
    readGameUserMoney(obj_id) {
        return this._mysql.query(this._sqlGetUserMoney, [obj_id]);
    }
    readGameUserRunne(user_id) {
        return this._mysql.query(this._sqlGetUserRune, [user_id]);
    }
    readGameUserItem(user_id) {
        return this._mysql.query(this._sqlQueryUserItems, [user_id]);
    }
    readGameMail(mail_id) {
        return this._mysql.query(this._sqlGetMaxMailId, [mail_id]);
    }
    readNotice() {
        return this._mysql.query(this._sqlQueryNotices, []);
    }
    readSNS(user_id) {
        return this._mysql.query(this._sqlQueryUserSNSList, [user_id]);
    }
    readAccount(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let accountData = null;
            let accounts = yield this.readUser(userName).catch(e => {
                return Promise.reject(undefined);
            });
            if (accounts.length > 0) {
                if (!this._keyIdMap.get(userName)) {
                    this._idDataMap.set(accounts[0].id, {
                        account: accounts[0]
                    });
                    this._keyIdMap.set(userName, accounts[0].id);
                }
                return Promise.resolve(accounts[0]);
            }
            return Promise.reject(undefined);
        });
    }
    checkUser(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let platform = message.plat;
            let userName = message.uin;
            let password = message.sessionid;
            let userId = this._keyIdMap.get(userName);
            let accountData = null;
            if (!userId) {
                try {
                    accountData = yield this.readAccount(userName);
                }
                catch (e) {
                    mylogger_1.myLogger.log('new user');
                }
                if (!accountData) {
                    let newUser = new initdb_1.InitializeDatabase(this._mysql);
                    yield newUser.addUser(userName, platform);
                    accountData = yield this.readAccount(userName).catch(e => {
                        return Promise.reject(e);
                    });
                }
            }
            else {
                let account = this._idDataMap.get(userId);
                if (!account.account) {
                    try {
                        accountData = yield this.readAccount(userName);
                    }
                    catch (e) {
                        mylogger_1.myLogger.log('new user');
                    }
                }
                else {
                    accountData = account.account;
                }
            }
            let newUser = new initdb_1.InitializeDatabase(this._mysql);
            yield newUser.addUser(userName, platform);
            accountData = yield this.readAccount(userName).catch(e => {
                return Promise.reject(e);
            });
            return Promise.resolve(accountData);
        });
    }
}
exports.DBManager = DBManager;
//# sourceMappingURL=dbManager.js.map