"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientbase_1 = require("../common/clientbase");
const const_1 = require("../common/const");
// import { Battle } from './battle/battle';
class HOKClient extends clientbase_1.default {
    // private _battle: Battle;
    constructor(s) {
        super(s);
        this._uId = -1;
        // this._battle = null;
    }
    getuId() {
        return this._uId;
    }
    setuId(userId) {
        this._uId = userId;
    }
    // public isInBattle(): boolean {
    //     return this._battle!=null;
    // }
    // public setBattle(battle: Battle): void {
    //     this._battle = battle;
    // }
    // public getBattle(): Battle {
    //     return this._battle;
    // }    
    send(message) {
        super.send(message);
        let buf = Buffer.alloc(message.length + 8);
        buf.writeInt32LE(message.length + 8, 0);
        buf.writeInt32LE(message.msgtype, 4);
        message.msg.copy(buf, 8, 0, message.length);
        this._socket.write(buf);
    }
    onError(error) {
        this.emit(const_1.ClientEvent.ERROR, error);
    }
    onSchedule() {
        this.emit(const_1.ClientEvent.SCHEDULE);
    }
    onMessage(message) {
        this.setActive();
        this.emit(const_1.ClientEvent.MSG, message);
    }
    onEnd() {
        this.emit(const_1.ClientEvent.END);
    }
}
exports.HOKClient = HOKClient;
//# sourceMappingURL=hokclient.js.map