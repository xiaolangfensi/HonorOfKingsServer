interface IBaseData {
    latestStamp: number; //数据更新时间
}

export interface IHOKAcount extends IBaseData {
    id: number;
    cdKey: string;
    userName: string;
    password: string;
    csId: number;
    sdkId: number;
}

export interface IHOKData {
    account?: IHOKAcount;
    game?: IHOKGameData;
}

export interface IHOKGameData extends IBaseData {
    user?: IGameUser;
    userHeros?: IGameUserHero[];
    userMoney?: IGameUserMoney;
    userRunnes?: IGameUserRunne[];
    userItems?: IGameUserItem[];
    userNotices?: IGameUserNotice[];
    userMails?: IGameMail[];
    userSNS?: IGameUserSNS[];
}

export interface IGameUser {
    id: number;
    objId: number;
    sdkId: number;
    objCDKey: string;
    objName: string;
    objSex: number;
    objLV: number;
    objScore: number;
    objHeadId: number;
    objDiamond: number;
    objGold: number;
    objRegisterTime: number;
    objLastLoginTime: number;
    objGameInns: number;
    objGameWinns: number;
    objKillHeroNum: number;
    objASSKillNum: number;
    objDestBuildingNum: number;
    objDeadNum: number;
    objFirstWinTime: number;
    objCurLevelExp: number;
    objCLDays: number;
    objFriends: number;
    objLastLoginRewardTime: string;
    objVIPLevel: number;
    objVIPScore: number;
    objTaskData: number;
}

export interface IGameUserItem {
    userId: number;
    itemId: number;
    itemNum: number;
    buyTime: number;
    endTime: number;
}

export interface IGameUserHero {
    id: number;
    userId: number;
    heroId: number;
    heroEndTime: number;
    heroBuyTime: number;
    delState: number;
}

interface IGameUserGuide {
    objId: number;
    objCSGuideComSteps: string;
    objSSBattleSteps: string;
}

interface IGameUserMoney {
    id: number;
    objId: number;
    objDiamond: number;
    objGold: number;
}

export interface IGameUserRunne {
    id: number;
    userId: number;
    runneBagJson: any;
    runneSlotJson: any;
}

export interface IGameUserSNS {
    userId: number;
    relatedId: number;
    relation: number;
}

interface IGameUserMail {
    id: number;
    mainId: number;
    userId: number;
    mailState: number;
}

interface IGameUserNotice {
    id: number;
    platformId: number;
    title: string;
    eflag: number;
    estate: number;
    priority: number;
    notice: string;
    startTime: number;
    endTime: number;
}

interface IGameMail {
    mailId: number;
    mailSDK: number;
    mailType: number;
    mailUserId: number;
    mailTitle: string;
    mailContent: string;
    mailGift: string;
    mailSend: string;
    mailCreateTime: string;
    mailOverTime: string;
    mailDelState: number;
}

interface IGameLog {
    id: number;
    logTime: number;
    logType: number;
    logStr: string;
    logIP: string;
}

interface IGameRobe {
    id: number;
    robeBatchId: number;
    robeChannel: string;
    partCS: string;
    robeType: number;
    robeUseState: number;
    robeStartTime: number;
    robeEndTime: number;
    robeDelState: number;
}

export interface IHOKTokenData {
    uid: number,
    token: string,
    ip: string,
    timestamp: number
}