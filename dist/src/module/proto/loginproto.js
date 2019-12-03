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
const mylogger_1 = require("../../common/mylogger");
const configmanager_1 = require("../configmanager");
const hokprotobuf_1 = require("../hokprotobuf");
const protomanager_1 = require("../protomanager");
const const_1 = require("../../common/const");
const gameenum_1 = require("../gameenum");
const utils_1 = require("../../common/utils");
const sessionmanager_1 = require("../sessionmanager");
const usermanager_1 = require("../usermanager");
const dbManager_1 = require("../dbManager");
class LoginProto {
    on$$AskLogin(message, client) {
        let serverList = configmanager_1.ConfigManager.getInstance().getGameClientConfigData(const_1.GameClientConfigSection.SERVERLIST);
        let msg = hokprotobuf_1.LSToGC.ServerBSAddr.create();
        serverList.forEach(serverInfo => {
            let [addr, host] = serverInfo.addr.split(':');
            msg.serverinfo.push({ ServerName: serverInfo.name, ServerAddr: addr, ServerPort: parseInt(host) });
        });
        protomanager_1.ProtoManager.getInstance().postClientDirectMessage(client, msg, hokprotobuf_1.LSToGC.ServerBSAddr);
        return gameenum_1.PreDefineErrorCodeEnum.eNormal;
    }
    on$$OneClientLogin(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = hokprotobuf_1.BSToGC.ClientLoginCheckRet.create();
            msg.loginsuccess = 1;
            let dbManager = dbManager_1.default.getInstance();
            yield dbManager.checkUser(message).then((data) => {
                client.setuId(data.id);
                msg.loginsuccess = 1;
            }).catch(e => {
                msg.loginsuccess = 0;
                mylogger_1.myLogger.error(e.message);
            });
            protomanager_1.ProtoManager.getInstance().postClientDirectMessage(client, msg, hokprotobuf_1.BSToGC.ClientLoginCheckRet);
            if (msg.loginsuccess == 1) {
                this.askGateAdressRet(message, client);
            }
            return gameenum_1.PreDefineErrorCodeEnum.eNormal;
        });
    }
    askGateAdressRet(messageData, client) {
        let timeStamp = new Date().getTime();
        let token = utils_1.default.md5(`${timeStamp}:${messageData.uin}`);
        let serverList = configmanager_1.ConfigManager.getInstance().getGameClientConfigData(const_1.GameClientConfigSection.GATESERVERLIST);
        let [ipAdress, port] = serverList[0].split(':');
        let msg = hokprotobuf_1.BSToGC.AskGateAddressRet.create();
        msg.ip = ipAdress;
        msg.port = parseInt(port);
        msg.username = messageData.uin;
        msg.token = token;
        let ip = client.getSocket().remoteAddress;
        if (!ip) {
            ip = '';
        }
        sessionmanager_1.SessionManager.getInstance().addData(messageData.uin, token, ip, client.getuId(), timeStamp);
        protomanager_1.ProtoManager.getInstance().postClientDirectMessage(client, msg, hokprotobuf_1.BSToGC.AskGateAddressRet);
        return gameenum_1.PreDefineErrorCodeEnum.eNormal;
    }
    on$$Login(messageData, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield usermanager_1.UserManager.getInstance().userAskLogin(messageData, client);
            if (ret != 0) {
                mylogger_1.myLogger.log('登录或者注册失败');
                return gameenum_1.AllErrorCodeEnum.eEc_91LoginFail;
            }
            let ip = client.getSocket().remoteAddress;
            if (!ip) {
                ip = '';
            }
            let uid = sessionmanager_1.SessionManager.getInstance().verifyToken(messageData.name, messageData.passwd, ip);
            if (uid > 0) {
                client.setuId(uid);
                yield this.notifyUserBaseInfo(messageData, client);
            }
            else {
                let msg = hokprotobuf_1.BSToGC.ClientLoginCheckRet.create();
                msg.loginsuccess = 0;
                protomanager_1.ProtoManager.getInstance().postClientDirectMessage(client, msg, hokprotobuf_1.BSToGC.ClientLoginCheckRet);
            }
            return gameenum_1.PreDefineErrorCodeEnum.eNormal;
        });
    }
    notifyUserBaseInfo(messageData, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let gameData = yield dbManager_1.default.getInstance().readGameData(messageData.name);
            if (gameData) {
                let gameUser = gameData.user;
                if (gameUser) {
                    let msg = hokprotobuf_1.GSToGC.UserBaseInfo.create();
                    msg.guid = Number.parseInt(gameUser.objId.toString());
                    msg.name = gameUser.objCDKey;
                    msg.nickname = gameUser.objName;
                    msg.headid = gameUser.objHeadId;
                    msg.sex = gameUser.objSex;
                    msg.curscore = gameUser.objScore;
                    msg.curdiamoand = Number.parseInt(gameUser.objDiamond.toString());
                    msg.curgold = Number.parseInt(gameUser.objGold.toString());
                    msg.mapid = 0;
                    msg.ifreconnect = false;
                    msg.battleid = 0;
                    msg.level = gameUser.objLV;
                    msg.viplevel = gameUser.objVIPLevel;
                    msg.vipscore = gameUser.objScore;
                    msg.curexp = gameUser.objCurLevelExp;
                    protomanager_1.ProtoManager.getInstance().postClientDirectMessage(client, msg, hokprotobuf_1.GSToGC.UserBaseInfo);
                }
            }
            return Promise.resolve;
        });
    }
}
exports.LoginProto = LoginProto;
//# sourceMappingURL=loginproto.js.map