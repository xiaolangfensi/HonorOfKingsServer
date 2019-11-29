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
const TCP = require("net");
const ProtoBuf = require("protobufjs");
const mylogger_1 = require("./mylogger");
const const_1 = require("./const");
class ServerBase {
    constructor(name) {
        this._host = '';
        this._name = name;
        this._port = 0;
        this._server = {};
    }
    initialize(serverConfig) {
        if (serverConfig.serverInfo != undefined) {
            this._host = serverConfig.serverInfo.host;
            this._port = serverConfig.serverInfo.port;
        }
        if (serverConfig.logger) {
            mylogger_1.myLogger.initialize(serverConfig.logger);
        }
    }
    //系统process.on('SIGINT')后需要处理收尾的事情。builder处理，不要手动调用
    dispose() {
        mylogger_1.myLogger.info('server will dispose ...');
        if (this._server.listening) {
            this._server.close();
        }
    }
    initProtoBuf(pbFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProtoBuf.load(pbFile);
        });
    }
    listen(cb) {
        this._server = TCP.createServer((socket) => {
            this.onConnection(socket);
        });
        if (this._server) {
            this._server.on(const_1.ServerEvent.ERROR, (e) => {
                mylogger_1.myLogger.error('tcp server error: ', e);
                process.exit(1);
            });
            this._server.listen(this._port, this._host, cb);
            mylogger_1.myLogger.log('server is starting...');
        }
    }
}
exports.default = ServerBase;
//# sourceMappingURL=serverbase.js.map