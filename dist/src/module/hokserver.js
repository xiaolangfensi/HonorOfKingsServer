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
const serverbase_1 = require("../common/serverbase");
const hokclient_1 = require("./hokclient");
const mylogger_1 = require("../common/mylogger");
const const_1 = require("../common/const");
const dbManager_1 = require("./dbManager");
const protomanager_1 = require("./protomanager");
class HOKServer extends serverbase_1.default {
    static getInstance() {
        return this._instance;
    }
    constructor(name) {
        super(name);
        HOKServer._instance = this;
        this._socketClientMap = new Map();
        this._idClientMap = new Map();
        this._gClientId = 1;
        this._usePB = false;
    }
    initialize(serverConfig) {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize },
            listen: { get: () => super.listen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.initialize.call(this, serverConfig);
            if (serverConfig.mysql && serverConfig.mysql.use) {
                dbManager_1.DBManager.getInstance().initialize(serverConfig.mysql);
            }
            if (serverConfig.protobuf && serverConfig.protobuf.use) {
                this._usePB = true;
                yield protomanager_1.ProtoManager.getInstance().initialize(serverConfig.protobuf.proto);
                yield protomanager_1.ProtoManager.getInstance().handlerRequests(serverConfig.protobuf.handler);
            }
            _super.listen.call(this, function (err) {
                if (err) {
                    mylogger_1.myLogger.error(err);
                    process.exit(1);
                }
            });
        });
    }
    closeSocket(socket) {
        if (this._socketClientMap.has(socket)) {
            let client = this._socketClientMap.get(socket);
            if (client) {
                mylogger_1.myLogger.info(`close socket id: ${client.getClientId()}`);
                this._idClientMap.delete(client.getClientId());
                this._socketClientMap.delete(socket);
                if (this._usePB) {
                    protomanager_1.ProtoManager.getInstance().closeClient(client);
                }
                client.close();
            }
        }
    }
    onConnection(socket) {
        mylogger_1.myLogger.debug(`onConnect call: a socket connect to me. ${socket}`);
        socket.pause();
        let client = new hokclient_1.HOKClient(socket);
        if (client) {
            let clientId = this._gClientId++;
            client.initialize(clientId);
            this._idClientMap.set(clientId, client);
            this._socketClientMap.set(socket, client);
            socket.resume();
        }
        client.on(const_1.ClientEvent.END, () => {
            mylogger_1.myLogger.warn(`socket receive end by peer ${socket}`);
            this.closeSocket(socket);
        });
        client.on(const_1.ClientEvent.MSG, (msg) => {
            if (this._usePB) {
                protomanager_1.ProtoManager.getInstance().processMessage(msg, client);
            }
        });
        client.on(const_1.ClientEvent.ERROR, (e) => {
            mylogger_1.myLogger.error(`client have some error ${client.getClientId()} : ${client.getSocket()}`);
            this.closeSocket(client.getSocket());
        });
        client.on(const_1.ClientEvent.SCHEDULE, () => {
            mylogger_1.myLogger.info('receive a schedule message');
        });
    }
    getClient(uid) {
        for (let client of this._socketClientMap.values()) {
            if (client.getuId() == uid) {
                return client;
            }
        }
        return undefined;
    }
}
exports.HOKServer = HOKServer;
//# sourceMappingURL=hokserver.js.map