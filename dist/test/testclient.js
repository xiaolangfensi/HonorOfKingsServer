"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TCP = require("net");
const hokprotobuf_1 = require("../src/module/hokprotobuf");
class TestClient {
    constructor() {
        this.client = null;
    }
    //与服务器建立连接
    connect() {
        this.client = TCP.connect({ host: "127.0.0.1", port: 49996 }, () => {
            setTimeout(() => {
                this.setData();
            }, 300);
        });
    }
    setData() {
        let login = hokprotobuf_1.GCToCS.Login.create();
        login.name = '1';
        login.passwd = '1';
        login.platform = 10;
        login.sdk = 0;
        let buffer = hokprotobuf_1.GCToCS.Login.encode(login).finish();
        let msg = {
            length: buffer.length,
            msgtype: hokprotobuf_1.GCToLS.MsgID.eMsgToLSFromGC_AskLogin,
            msg: buffer
        };
        this.send(msg);
    }
    send(message) {
        let buf = Buffer.alloc(message.length + 8);
        buf.writeInt32LE(message.length + 8, 0);
        buf.writeInt32LE(message.msgtype, 4);
        message.msg.copy(buf, 8, 0, message.length);
        this.client.write(buf);
    }
    main() {
        if (!this.client) {
            this.connect();
        }
    }
}
new TestClient().main();
//# sourceMappingURL=testclient.js.map