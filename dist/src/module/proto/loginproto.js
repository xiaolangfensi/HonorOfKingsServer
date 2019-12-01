"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mylogger_1 = require("../../common/mylogger");
class LoginProto {
    on$$AskLogin(message, client) {
        mylogger_1.myLogger.log("I have recieved your loginRequest");
    }
}
exports.LoginProto = LoginProto;
//# sourceMappingURL=loginproto.js.map