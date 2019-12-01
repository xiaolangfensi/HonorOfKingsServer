"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configmanager_1 = require("../configmanager");
const const_1 = require("../../common/const");
const hokprotobuf_1 = require("../hokprotobuf");
const protomanager_1 = require("../protomanager");
const gameenum_1 = require("../gameenum");
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
}
exports.LoginProto = LoginProto;
//# sourceMappingURL=loginproto.js.map