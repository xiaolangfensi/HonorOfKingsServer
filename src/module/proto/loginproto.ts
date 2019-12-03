import { HOKClient } from "../hokclient";
import { myLogger } from "../../common/mylogger";
import { ConfigManager } from "../configmanager";
import { LSToGC, GCToBS, BSToGC, GCToCS, GSToGC } from "../hokprotobuf";
import { ProtoManager } from "../protomanager";
import { GameClientConfigSection } from "../../common/const";
import { PreDefineErrorCodeEnum, AllErrorCodeEnum } from "../gameenum";
import Utils from "../../common/utils";
import { SessionManager } from "../sessionmanager";
import { UserManager } from "../usermanager";
import DBManager from "../dbManager";

export class LoginProto {
    public on$$AskLogin(message: any, client: HOKClient) {
        let serverList: any[] = ConfigManager.getInstance().getGameClientConfigData(GameClientConfigSection.SERVERLIST);
        let msg = LSToGC.ServerBSAddr.create();

        serverList.forEach(serverInfo => {
            let [addr, host] = serverInfo.addr.split(':');
            msg.serverinfo.push({ ServerName: serverInfo.name, ServerAddr: addr, ServerPort: parseInt(host) });
        });

        ProtoManager.getInstance().postClientDirectMessage(client, msg, LSToGC.ServerBSAddr);
        return PreDefineErrorCodeEnum.eNormal;
    }

    private async on$$OneClientLogin(message: GCToBS.OneClientLogin, client: HOKClient) {
        let msg = BSToGC.ClientLoginCheckRet.create();
        msg.loginsuccess = 1;
        let dbManager = DBManager.getInstance();
        await dbManager.checkUser(message).then((data) => {
            client.setuId(data.id);
            msg.loginsuccess = 1;
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

    private askGateAdressRet(messageData: any, client: HOKClient): number {
        let timeStamp = new Date().getTime();
        let token = Utils.md5(`${timeStamp}:${messageData.uin}`);
        let serverList: string[] = ConfigManager.getInstance().getGameClientConfigData(GameClientConfigSection.GATESERVERLIST);
        let [ipAdress, port] = serverList[0].split(':');
        let msg = BSToGC.AskGateAddressRet.create();
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

    private async on$$Login(messageData: GCToCS.Login, client: HOKClient) {
        let ret = await UserManager.getInstance().userAskLogin(messageData, client);
        if (ret != 0) {
            myLogger.log('登录或者注册失败');
            return AllErrorCodeEnum.eEc_91LoginFail;
        }

        let ip = client.getSocket().remoteAddress;
        if (!ip) {
            ip = '';
        }

        let uid = SessionManager.getInstance().verifyToken(messageData.name, messageData.passwd, ip);
        if (uid>0) {
            client.setuId(uid);
            await this.notifyUserBaseInfo(messageData, client);
        } else {
            let msg = BSToGC.ClientLoginCheckRet.create();
            msg.loginsuccess = 0;
            ProtoManager.getInstance().postClientDirectMessage(client, msg, BSToGC.ClientLoginCheckRet);
        }
        return PreDefineErrorCodeEnum.eNormal;
    }

    private async notifyUserBaseInfo(messageData: any, client:HOKClient) {
        let gameData = await DBManager.getInstance().readGameData(messageData.name);
        if (gameData) {
            let gameUser = gameData.user;
            if (gameUser) {
                let msg = GSToGC.UserBaseInfo.create();
                msg.guid = Number.parseInt(gameUser.objId.toString());
                msg.name = gameUser.objCDKey;
                msg.nickname = gameUser.objName;
                msg.headid = gameUser.objHeadId;
                msg.sex = gameUser.objSex;
                msg.curscore = gameUser.objScore;
                msg.curdiamoand = Number.parseInt(gameUser.objDiamond.toString());
                msg.curgold = Number.parseInt(gameUser.objGold.toString());
                msg.mapid = 0;
                msg.ifreconnect = false;
                msg.battleid = 0;
                msg.level = gameUser.objLV;
                msg.viplevel = gameUser.objVIPLevel;
                msg.vipscore = gameUser.objScore;
                msg.curexp = gameUser.objCurLevelExp;

                ProtoManager.getInstance().postClientDirectMessage(client, msg, GSToGC.UserBaseInfo);
            }
        }
        return Promise.resolve;
    }
}