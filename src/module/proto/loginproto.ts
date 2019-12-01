import { HOKClient } from "../hokclient";
import { myLogger } from "../../common/mylogger";
import { ConfigManager } from "../configmanager";
import { GameClientConfigSection } from "../../common/const";
import { LSToGC } from "../hokprotobuf";
import { ProtoManager } from "../protomanager";
import { PreDefineErrorCodeEnum } from "../gameenum";

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
}