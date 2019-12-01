import { HOKClient } from "../hokclient";
import { myLogger } from "../../common/mylogger";
import { ConfigManager } from "../configmanager";
import { GameClientConfigSection } from "../../common/const";
import { LSToGC, GCToBS, BSToGC } from "../hokprotobuf";
import { ProtoManager } from "../protomanager";
import { PreDefineErrorCodeEnum } from "../gameenum";
import { DBManager } from "../dbManager";
import Utils from "../../common/utils";
import { SessionManager } from "../sessionmanager";

export class LoginProto {
    public on$$AskLogin(message: any, client: HOKClient) {
        let serverList: any[] = ConfigManager.getInstance().getGameClientConfigData(GameClientConfigSection.SERVERLIST);
        let msg = LSToGC.ServerBSAddr.create();
        serverList.forEach(serverInfo => {
            let [addr, host] = serverInfo.addr.split(':');
            msg.serverinfo.push({ ServerName: serverInfo.name, ServerAddr: addr, ServerPort: host });
        });
        ProtoManager.getInstance().postClientDirectMessage(client, msg, LSToGC.ServerBSAddr);
        return PreDefineErrorCodeEnum.eNormal;
    }

    private async on$$OneClientLogin(message: GCToBS.OneClientLogin, client: HOKClient) {
        let msg = BSToGC.ClientLoginCheckRet.create();
        msg.loginsuccess = 1;
        let dbManager = DBManager.getInstance();
        await dbManager.checkUser(message).then((data) => {
            client.setuId(data.setuId);
        }).catch(e => {
            msg.loginsuccess = 0;
            myLogger.error(e.message);
        });
        ProtoManager.getInstance().postClientDirectMessage(client, msg, BSToGC.ClientLoginCheckRet);
        if (msg.loginsuccess == 1) {
            this.askGateAdressRet(message, client);
        }

        return PreDefineErrorCodeEnum.eNormal;
    }

    private askGateAdressRet(messageData: any, client: HOKClient) {
        let timeStamp = new Date().getTime();
        let token = Utils.md5(`${timeStamp}:${messageData.uin}`);
        let serverList: string[] = ConfigManager.getInstance().getGameClientConfigData(GameClientConfigSection.GATESERVERLIST);
        let msg = BSToGC.AskGateAddressRet.create();
        let [ipAdress, port] = serverList[0].split(':');
        msg.ip = ipAdress;
        msg.port = parseInt(port);
        msg.username = messageData.uin;
        msg.token = token;
        let ip = client.getSocket().remoteAddress;
        if (!ip) {
            ip = '';
        }
        SessionManager.getInstance().addData(messageData.uin, token, ip, client.getuId(), timeStamp);
        ProtoManager.getInstance().postClientDirectMessage(client, msg, BSToGC.AskGateAddressRet);
        return PreDefineErrorCodeEnum.eNormal;
    }

}