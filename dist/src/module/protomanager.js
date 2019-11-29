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
const ProtoBuf = require("protobufjs");
const hokserver_1 = require("./hokserver");
const mylogger_1 = require("../common/mylogger");
class ProtoManager {
    static getInstance() {
        if (!this._instance) {
            this._instance = new ProtoManager();
        }
        return this._instance;
    }
    constructor() {
        this._mapType2Proto = new Map();
        this._mapID2Types = new Map();
        this._mapType2ID = new Map();
        this._mapRequestMessage = new Map();
    }
    initialize(protoFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!protoFiles || protoFiles.length == 0) {
                return;
            }
            const roots = yield protoFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                const root = this.initProtoBuf(`./proto/${file}.proto`);
                return root;
            }));
            let fileId = 0;
            for (const root of roots) {
                this.onLoadFile(yield root, protoFiles[fileId++]);
            }
            mylogger_1.myLogger.trace(`ProtoManager :`, ...this._mapRequestMessage.keys());
            mylogger_1.myLogger.log('protobuf files initialize finished ...', protoFiles);
        });
    }
    initProtoBuf(pbFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProtoBuf.load(pbFile);
        });
    }
    onLoadFile(root, protoFile) {
        this.suckMessageAndEnum(root, protoFile);
    }
    suckMessageAndEnum(root, name) {
        let node = root.get(name);
        if (node) {
            let keywords = ['msgid'];
            let typeArray = node.nestedArray;
            let typeItems = new Array();
            typeArray.forEach(typeItem => {
                let item = typeItem;
                if (item.fields) { //Type
                    typeItems.push(typeItem);
                }
                else if (item.values) { //Enum
                    if (keywords.indexOf(item.name.toLowerCase()) >= 0) {
                        let msgNumKeys = Object.keys(item.values);
                        if (msgNumKeys) {
                            msgNumKeys.forEach(value => {
                                let msgId = item.values[value];
                                this._mapType2ID.set(value, msgId);
                                let typesData = this._mapID2Types.get(msgId);
                                if (!typesData) {
                                    this._mapID2Types.set(msgId, new Array(value));
                                }
                                else {
                                    typesData.push(value);
                                }
                            });
                        }
                    }
                }
            }, this);
            typeItems.forEach(element => {
                let item = element;
                let itemArray = item.fieldsArray;
                for (let index = 0; index < itemArray.length; index++) {
                    let field = itemArray[index];
                    if (keywords.indexOf(field.name.toLowerCase()) >= 0) {
                        if (field.options) {
                            // myLogger.error(field.options);
                            this._mapType2Proto.set(field.options.default, item);
                            mylogger_1.myLogger.debug(item.name, field.options.default, this._mapType2ID.get(field.options.default), name);
                            break;
                        }
                    }
                }
            });
        }
    }
    handlerRequests(handlerFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            let protocols = yield handlerFiles.map((className) => __awaiter(this, void 0, void 0, function* () {
                let xProtocol = `./proto/${className.toLowerCase()}`;
                let protoRequests = yield Promise.resolve().then(() => require(xProtocol));
                yield ProtoManager.getInstance().suckRequestFuncion(protoRequests[className]);
                return xProtocol;
            }));
            mylogger_1.myLogger.log(protocols);
        });
    }
    suckRequestFuncion(c) {
        let instance = new c;
        for (let funcName of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
            if (funcName.indexOf('on$$') == 0) {
                let messageName = funcName.replace('on$$', '');
                if (this._mapRequestMessage.get(messageName)) {
                    mylogger_1.myLogger.error(`${messageName} 已经在不同的模块存在了`);
                }
                this._mapRequestMessage.set(messageName, (message, client) => {
                    return instance[funcName](message, client);
                });
            }
        }
    }
    getMessage(messageType) {
        return this._mapType2Proto.get(messageType);
    }
    getMessageTypeById(messageId) {
        let protoTypes = this._mapID2Types.get(messageId);
        if (protoTypes.length > 0) {
            return protoTypes[protoTypes.length - 1];
        }
        return protoTypes[0];
    }
    getMessageById(messageId) {
        let protoTypes = this._mapID2Types.get(messageId);
        if (protoTypes.length > 0) {
            // myLogger.log(`message type: ${protoTypes[protoTypes.length-1]}`);
            return this.getMessage(protoTypes[protoTypes.length - 1]);
        }
        mylogger_1.myLogger.log(`message type: ${protoTypes[0]}`);
        return this.getMessage(protoTypes[0]);
    }
    processMessage(message, client) {
        let reqMessage = this.getMessageById(message.msgtype);
        try {
            let messageData = reqMessage.decode(message.msg);
            mylogger_1.myLogger.trace(`recv: ${reqMessage.fullName}, ${reqMessage.name}`);
            mylogger_1.myLogger.log(messageData);
            const requestFun = this._mapRequestMessage.get(reqMessage.name);
            if (requestFun) {
                let ret = requestFun(messageData, client);
                if (ret && ret != 0) {
                    if (Number.isInteger(ret)) {
                        this.askReturn(client, message.msgtype, ret);
                    }
                }
            }
            else {
                mylogger_1.myLogger.error(`no process message ${reqMessage.name} : ${message.msgtype}`);
            }
        }
        catch (e) {
            mylogger_1.myLogger.error(e.message);
        }
    }
    /**
     * 通过明确的消息类型以及相关内容来发送消息
     * @param {number} uid 用户ID
     * @param {*} payLoad 用户的消息封装
     * @param {*} messageFactory 消息类型message
     * @memberof ProtoManager
     */
    postDirectMessage(uid, payLoad, messageFactory = null) {
        let client = hokserver_1.HOKServer.getInstance().getClient(uid);
        if (client) {
            this.postClientDirectMessage(client, payLoad, messageFactory);
        }
        else {
            mylogger_1.myLogger.error(`no found client for id : ${uid}`);
        }
    }
    postClientDirectMessage(client, payLoad, messageFactory = null) {
        try {
            if (!messageFactory) {
                messageFactory = this.getMessageById(payLoad.msgid);
            }
            let errMsg = messageFactory.verify(payLoad);
            if (errMsg) {
                throw Error(errMsg);
            }
            let buffer = messageFactory.encode(payLoad).finish();
            let msg = {
                length: buffer.length,
                msgtype: payLoad.msgid,
                msg: buffer
            };
            mylogger_1.myLogger.trace(JSON.stringify(payLoad));
            // myLogger.trace(Utils.toHexString(buffer.buffer, ','));
            mylogger_1.myLogger.log(`====`.repeat(15));
            client.send(msg);
        }
        catch (e) {
            mylogger_1.myLogger.error(e.message);
        }
    }
    postMessage(uid, messageType, payload) {
        let client = hokserver_1.HOKServer.getInstance().getClient(uid);
        if (client) {
            this.responseMessage(client, payload, messageType);
        }
        else {
            mylogger_1.myLogger.error(`no found client for id : ${uid}`);
        }
    }
    postMessageById(uid, messageId, payload) {
        let client = hokserver_1.HOKServer.getInstance().getClient(uid);
        if (client) {
            let messageType = this.getMessageTypeById(messageId);
            this.responseMessage(client, payload, messageType);
        }
        else {
            mylogger_1.myLogger.error(`no found client for id : ${uid}`);
        }
    }
    packJsonMessage(messageType, payload) {
        let messageFactory = this.getMessage(messageType);
        let errMsg = messageFactory.verify(payload);
        if (errMsg) {
            throw Error(errMsg);
        }
        let body = messageFactory.create(payload);
        let buffer = messageFactory.encode(body).finish();
        let msg = {
            length: buffer.length,
            msgtype: this._mapType2ID.get(messageType),
            msg: buffer
        };
        // myLogger.trace(Utils.toHexString(buffer.buffer, ','));
        mylogger_1.myLogger.warn(messageFactory.decode(buffer));
        return msg;
    }
    responseMessage(client, payload, messageType) {
        try {
            mylogger_1.myLogger.trace(payload);
            mylogger_1.myLogger.log(`====`.repeat(15));
            client.send(this.packJsonMessage(messageType, payload));
        }
        catch (e) {
            mylogger_1.myLogger.error(e.message);
        }
    }
    askReturn(client, messageId, errorCode) {
        // let msg = GSToGC.AskRet.create();
        // msg.askid = messageId;
        // msg.errorcode = errorCode;
        // this.postClientDirectMessage(client, msg);
    }
    closeClient(client) {
    }
}
exports.ProtoManager = ProtoManager;
//# sourceMappingURL=protomanager.js.map