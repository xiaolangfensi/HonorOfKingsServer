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
const const_1 = require("../../common/const");
const hokprotobuf_1 = require("../hokprotobuf");
const protomanager_1 = require("../protomanager");
const gameenum_1 = require("../gameenum");
const dbManager_1 = require("../dbManager");
const utils_1 = require("../../common/utils");
const sessionmanager_1 = require("../sessionmanager");
class LoginProto {
    on$$AskLogin(message, client) {
        let serverList = configmanager_1.ConfigManager.getInstance().getGameClientConfigData(const_1.GameClientConfigSection.SERVERLIST);
        let msg = hokprotobuf_1.LSToGC.ServerBSAddr.create();
        serverList.forEach(serverInfo => {
            let [addr, host] = serverInfo.addr.split(':');
            msg.serverinfo.push({ ServerName: serverInfo.name, ServerAddr: addr, ServerPort: host });
        });
        protomanager_1.ProtoManager.getInstance().postClientDirectMessage(client, msg, hokprotobuf_1.LSToGC.ServerBSAddr);
        return gameenum_1.PreDefineErrorCodeEnum.eNormal;
    }
    on$$OneClientLogin(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = hokprotobuf_1.BSToGC.ClientLoginCheckRet.create();
            msg.loginsuccess = 1;
            let dbManager = dbManager_1.DBManager.getInstance();
            yield dbManager.checkUser(message).then((data) => {
                client.setuId(data.setuId);
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
        let msg = hokprotobuf_1.BSToGC.AskGateAddressRet.create();
        let [ipAdress, port] = serverList[0].split(':');
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
}
exports.LoginProto = LoginProto;
//# sourceMappingURL=loginproto.js.map