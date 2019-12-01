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
const mysqlpool_1 = require("../src/common/mysqlpool");
const utils_1 = require("../src/common/utils");
const mylogger_1 = require("../src/common/mylogger");
class InitializeDatabase {
    constructor(pool = null) {
        if (pool) {
            this._mysqlPool = pool;
        }
        else {
            let conFile = utils_1.default.readConfig('hok');
            this._mysqlPool = new mysqlpool_1.MysqlPool(conFile.mysql);
        }
        this._insertUser = `insert into fball_accountdb.account_user(cs_id, sdk_id, cdkey, user_name) values(?, ?, ?, ?)`;
        this._maxUserId = `select id as maxUID from fball_accountdb.account_user where cdkey=?`;
        this._updateUser = `update fball_accountdb.account_user set user_name=? where id=?`;
        this._findUserByKey = `select count(*) as cnUser from fball_accountdb.account_user where cdkey=?`;
        this._insertGameUser = `insert into fball_gamedb_1.gameuser(obj_id, obj_cdkey, obj_name, obj_sex, obj_lv, obj_score, obj_headid, obj_diamond, obj_gold, obj_register_time, obj_game_inns, obj_game_winns, obj_kill_hero_num, obj_ass_kill_num, obj_dest_building_num, obj_dead_num, obj_first_win_time, obj_cur_lv_exp, obj_cldays, obj_friends, obj_last_loginreward_time, obj_vip_lv, obj_vip_score, obj_task_data) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    }
    addUsers(count = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            let testCount = 0;
            let addCount = 0;
            do {
                try {
                    testCount++;
                    let cdkey = testCount.toString();
                    let checkUser = yield this._mysqlPool.query(this._findUserByKey, [cdkey]);
                    if (checkUser[0]['cnUser'] > 0) {
                        continue;
                    }
                    yield this._mysqlPool.query(this._insertUser, [1, 0, cdkey, cdkey, '']);
                    let lastAdd = yield this._mysqlPool.query(this._maxUserId, [cdkey]);
                    let uid = Number.parseInt(lastAdd[0]['maxUID']);
                    let userName = `随机用户${++addCount}`;
                    yield this._mysqlPool.query(this._updateUser, [userName, utils_1.default.md5(`${uid.toString()}:1`).toLowerCase(), uid]);
                    let registerTime = Math.floor(new Date().getTime() / 1000);
                    let sex = utils_1.default.randNumber(0, 1);
                    let headId = utils_1.default.randNumber(7, 20);
                    yield this._mysqlPool.query(this._insertGameUser, [uid, cdkey, userName, sex, 1, 0, headId, 100, 1000, registerTime, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '0000000000000000', 1, 0, '']);
                    if (addCount > count) {
                        process.exit();
                    }
                }
                catch (e) {
                    mylogger_1.myLogger.log(e.message);
                    process.exit();
                }
            } while (testCount < 10000);
        });
    }
    addUser(cdkey, sdkplat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let checkUser = yield this._mysqlPool.query(this._findUserByKey, [cdkey]);
                if (checkUser[0]['cnUser'] > 0) {
                    return;
                }
                yield this._mysqlPool.query(this._insertUser, [1, sdkplat, cdkey, cdkey]);
                let lastAdd = yield this._mysqlPool.query(this._maxUserId, [cdkey]);
                let uid = Number.parseInt(lastAdd[0]['maxUID']);
                let userName = `随机用户${uid}`;
                yield this._mysqlPool.query(this._updateUser, [userName, uid]);
                let registerTime = Math.floor(new Date().getTime() / 1000);
                let sex = utils_1.default.randNumber(0, 1);
                let headId = utils_1.default.randNumber(7, 20);
                yield this._mysqlPool.query(this._insertGameUser, [uid, cdkey, userName, sex, 1, 0, headId, 100, 1000, registerTime, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '0000000000000000', 1, 0, '']);
            }
            catch (e) {
                mylogger_1.myLogger.log(e.message);
                process.exit();
            }
        });
    }
}
exports.InitializeDatabase = InitializeDatabase;
//# sourceMappingURL=initdb.js.map