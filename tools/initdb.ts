import { MysqlPool } from "../src/common/mysqlpool";
import Utils from "../src/common/utils";
import { myLogger } from "../src/common/mylogger";

export class InitializeDatabase {
    private _mysqlPool: MysqlPool;
    private _insertUser: string;
    private _maxUserId: string;
    private _updateUser: string;
    private _findUserByKey: string;
    private _insertGameUser: string;
    constructor(pool: MysqlPool = null) {
        if (pool) {
            this._mysqlPool = pool;
        } else {
            let conFile = Utils.readConfig('hok');
            this._mysqlPool = new MysqlPool(<DBConfig>conFile.mysql);
        }
        this._insertUser = `insert into fball_accountdb.account_user(cs_id, sdk_id, cdkey, user_name) values(?, ?, ?, ?)`;
        this._maxUserId = `select id as maxUID from fball_accountdb.account_user where cdkey=?`;
        this._updateUser = `update fball_accountdb.account_user set user_name=? where id=?`;
        this._findUserByKey = `select count(*) as cnUser from fball_accountdb.account_user where cdkey=?`;
        this._insertGameUser = `insert into fball_gamedb_1.gameuser(obj_id, obj_cdkey, obj_name, obj_sex, obj_lv, obj_score, obj_headid, obj_diamond, obj_gold, obj_register_time, obj_game_inns, obj_game_winns, obj_kill_hero_num, obj_ass_kill_num, obj_dest_building_num, obj_dead_num, obj_first_win_time, obj_cur_lv_exp, obj_cldays, obj_friends, obj_last_loginreward_time, obj_vip_lv, obj_vip_score, obj_task_data) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    }

    async addUsers(count: number=10) {
        let testCount = 0;
        let addCount = 0;
        do {
            try {
                testCount++;
                let cdkey = testCount.toString();
                let checkUser = await this._mysqlPool.query(this._findUserByKey, [cdkey]);
                if (checkUser[0]['cnUser']>0) {
                    continue;
                }
                await this._mysqlPool.query(this._insertUser, [1, 0, cdkey, cdkey, '']);
                let lastAdd = await this._mysqlPool.query(this._maxUserId, [cdkey]);
                let uid = Number.parseInt(lastAdd[0]['maxUID']);
                let userName = `随机用户${++addCount}`;
                await this._mysqlPool.query(this._updateUser, [userName, Utils.md5(`${uid.toString()}:1`).toLowerCase(), uid]);
                let registerTime = Math.floor(new Date().getTime()/1000);
                let sex = Utils.randNumber(0, 1);
                let headId = Utils.randNumber(7, 20);
                await this._mysqlPool.query(this._insertGameUser, [uid, cdkey, userName, sex, 1, 0, headId, 100, 1000, registerTime, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '0000000000000000', 1, 0, '']);
                if (addCount>count) {
                    process.exit();
                }
            } catch (e) {
                myLogger.log(e.message)
                process.exit();
            }
        } while(testCount<10000);
    }

    async addUser(cdkey: string, sdkplat: number) {
            try {
                let checkUser = await this._mysqlPool.query(this._findUserByKey, [cdkey]);
                if (checkUser[0]['cnUser']>0) {
                    return;
                }
                await this._mysqlPool.query(this._insertUser, [1, sdkplat, cdkey, cdkey]);
                let lastAdd = await this._mysqlPool.query(this._maxUserId, [cdkey]);
                let uid = Number.parseInt(lastAdd[0]['maxUID']);
                let userName = `随机用户${uid}`;
                await this._mysqlPool.query(this._updateUser, [userName, uid]);
                let registerTime = Math.floor(new Date().getTime()/1000);
                let sex = Utils.randNumber(0, 1);
                let headId = Utils.randNumber(7, 20);
                await this._mysqlPool.query(this._insertGameUser, [uid, cdkey, userName, sex, 1, 0, headId, 100, 1000, registerTime, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '0000000000000000', 1, 0, '']);
            } catch (e) {
                myLogger.log(e.message)
                process.exit();
            }
    }    
}