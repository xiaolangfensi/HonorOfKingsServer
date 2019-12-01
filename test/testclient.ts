import * as TCP from 'net';
import { GCToCS, GCToLS } from '../src/module/hokprotobuf';

class TestClient {
    //创建一个client客户端
    client: TCP.Socket;
    constructor() {
        this.client = null;
    }

    //与服务器建立连接
    connect() {
        this.client = TCP.connect({ host: "127.0.0.1", port: 49996 }, () => {
            setTimeout(() => {
                this.setData();
            }, 300)
        })
    }

    setData() {
        let login = GCToCS.Login.create();
        login.name = '1';
        login.passwd = '1';
        login.platform = 10;
        login.sdk = 0;

        let buffer = GCToCS.Login.encode(login).finish();
        let msg = <Message>{
            length: buffer.length,
            msgtype: GCToLS.MsgID.eMsgToLSFromGC_AskLogin,
            msg: buffer
        };
        this.send(msg);
    }

    send(message: Message): any {
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