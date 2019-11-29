"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const const_1 = require("./const");
const gameconst_1 = require("../module/gameconst");
class ClientBase extends events_1.EventEmitter {
    constructor(s) {
        super();
        this._clientId = 0;
        this._socket = s;
        this._buffer = null;
        this._lastActive = Date.now();
        this._lostHeartbeat = false;
        this._checkActiveIntervalId = setInterval(() => {
            let now = Date.now();
            if (now - this._lastActive > 1000 * 60 * 10) {
                this.onError('lost heartbeat.');
                this._lostHeartbeat = true;
            }
            else {
                this.onSchedule();
            }
        }, 1000 * 5 * 12);
    }
    initialize(clientId) {
        this._clientId = clientId;
        this._socket.on(const_1.SocketEvent.ERROR, (e) => {
            this.onError(`error ${e}`);
        });
        this._socket.on(const_1.SocketEvent.END, () => {
            this.onEnd();
        });
        this._socket.on(const_1.SocketEvent.DATA, (data) => {
            if (this._buffer) {
                let buf = Buffer.alloc(this._buffer.length + data.length);
                this._buffer.copy(buf, 0, 0, this._buffer.length);
                data.copy(buf, this._buffer.length, 0, data.length);
                this._buffer = buf;
            }
            else {
                this._buffer = data;
            }
            while (this._buffer && this._buffer.length >= 8) {
                let len = this._buffer.readInt32LE(0);
                if (len > gameconst_1.ConstMaxMsgLen || len < 0) {
                    this._buffer = null;
                    this.onError(`invalid msg length: ${len}`);
                    break;
                }
                if (len > this._buffer.length) {
                    break;
                }
                let inMessage = {};
                inMessage.length = len;
                inMessage.msgtype = this._buffer.readInt32LE(4);
                if (len > 0) {
                    inMessage.msg = Buffer.alloc(len - 8);
                    this._buffer.copy(inMessage.msg, 0, 8, len);
                }
                this.onMessage(inMessage);
                if (this._buffer.length > len) {
                    this._buffer = this._buffer.slice(len);
                }
                else {
                    this._buffer = null;
                }
            }
        });
    }
    getClientId() {
        return this._clientId;
    }
    getSocket() {
        return this._socket;
    }
    close() {
        this._socket.destroy();
        clearInterval(this._checkActiveIntervalId);
    }
    setActive() {
        this._lastActive = Date.now();
    }
    send(message) {
        this.setActive();
    }
}
exports.default = ClientBase;
//# sourceMappingURL=clientbase.js.map