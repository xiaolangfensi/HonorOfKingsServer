export enum PreDefineErrorCodeEnum { 
	eEC_UseSkillTargetWrongType = -14,//使用技能错误的类型
	eEC_UseSkillTargetWrongCamp = -13,//使用技能错误的阵营
	eEC_UseSkillTargetIsDead = -12,//使用技能目标已经死亡
	eEC_OverTime = -4,
	eEC_InsertFail  = -3,
	eEC_ConstInvalid = -2,
	eEC_OperatePending = -1,
	eNormal = 0,
}

export enum	AllErrorCodeEnum {
	//Server model error code.
	eEC_Begin = -0x00010000 * 2,
	eEC_InvalidModelStatus, //非法的模块状态
	eEC_InvalidModelID, //非法的模块ID
	eEC_InvalidGSID, //非法的GSID
	eEC_InvalidSSID, //非法的SSID
	eEC_NullDataSource, //找不到数据源
	eEC_NullObjMgr, //找不到ObjMgr
	eEC_NullDataMgr, //找不到DataMgr
	eEC_NullWorldMgr, //找不到WorldMgr
	eEC_NullSceneServer, //找不到SceneServer
	eEC_NullGateServer, //找不到GateServer
	eEC_NullCentralServer, //找不到CentralServer
	eEC_InvalidUserPwd, //非法的用户口令
	eEC_InvalidPosition, //非法的位置
	eEC_InvalidRegionID, //非法的区域ID
	eEC_InvalidAreaID, //非法的区域ID
	eEC_NetSessionCollide, //网络会话冲突
	eEC_NullUser, //找不到用户
	eEC_UserExist, //用户已经存在
	eEC_GameObjectAlreadyExist, //游戏对象已经存在
	eEC_NullGameUnit, //找不到游戏单元
	eEC_LoadLibarayFail, //加载模块失败
	eEC_OpenCfgFileFail, //找开配置文件失败
	eEC_NoneNetListener, //没有网络监听器
	eEC_NoneNetConnector, //没有网络连接器
	eEC_OpenConnectorFail, //打开网络连接器失败
	eEC_TooManyConnectorOpened, //打开了太多的连接
	eEC_InitModelTimeOut, //初始化模块失败
	eEC_StartModelTimeOut, //启动模块超时
	eEC_NullMasterUser, //找不到主用户
	eEC_InvalidAttackTarget, //非法的技能目标
	eEC_NetConnectionClosed, //网络连接已经关闭
	eEC_NetProtocalDataError, //网络协议数据错误
	eEC_TooManySSNum, //SS数量过多
	eEC_TooManyGSNum, //GS数量过多
	eEC_InvalidNetState, //非法的网络状态
	eEC_JustInBattle, //当前正在战役中
	eEC_InvalidBattlePos, //非法的战役座位
	eEC_TheBattleUserFull, //战役用户已满
	eEC_UserDonotInTheBattle, //用户不在战役之中
	eEC_JustNotInBattle, //当前不在战役之中
	eEC_InvalidBattleState, //非法的战役状态
	eEC_InvalidBattleID, //非法的战役ID
	eEC_HeroExist, //英雄已经存在
	eEC_InvalidUserNetInfo, //非法的用户网络信息
	eEC_BattleExist, //战役已经存在
	eEC_BattleDonotExist, //战役不存在
	eEC_MapLoaded, //地图已经加载
	eEC_BattleLocalObjIdxOverflow, //战役本地对象溢出
	eEC_CannotFindoutTheObject, //找不到对象
	eEC_NullHero, //找不到英雄
	eEC_NotAllUserReady, //不是所有用户已经准备好
	eEC_YouAreNotBattleManager, //你不是战役管理员
	eEC_InvalidOrderCate, //非法的Order类别
	eEC_InvalidGameObjectCamp, //非法的游戏对象阵营
	eEC_CreateOrderFail, //创建Order失败
	eEC_InvalidOrderState, //非法的Order状态
	eEC_OrderNoMasterGO, //Order没有主对象
	eEC_AbsentOrderPriority, //Order优先级不够
	eEC_NullBattle, //找不到战役
	eEC_MoveBlocked, //移动被阻挡
	eEC_ReadCfgFileFail, //读取配置文件失败
	eEC_TooManyNPCCfgNum, //NPC配置数量太多
	eEC_TooManyHeroCfgNum, //英雄配置数量太多
	eEc_TooManMapDataCfgNum, //地图配置数量太多
	eEC_InvalidHeroSeat, //非法的英雄座位
	eEC_InvalidMapID, //非法的地图ID
	eEc_InvalidPos, //非法的位置
	eEC_InvalidCellID, //非法的单元格ID
	eEC_NullArea, //非法的区域
	eEC_InvalidScriptParameters, //非法的脚本参数
	eEC_InvalidObjTypeID, //非法的对象类型ID
	eEC_InvalidPathNodeNum, //非法的路径节点数量
	eEC_InvalidVector3D, //非法的3D向量
	eEC_UserInfoUnComplete, //用户信息不全
	eEC_GenerateGUIDFail, //创建GUID失败
	eEC_NotEnemy, //没有敌人
	eEC_NotNormalAttackSkill, //没有普通攻击技能
	eEC_CanNotFindTheSkill, //找不到指定技能ID
	eEC_NotOrderInfo, //没有Order信息
	eEC_InvalidSkillID, //非法的技能ID
	eEC_InvalidSkillState, //非法的技能状态
	eEC_InvalidSkillTarget, //非法的技能目标
	eEC_NullSkillData, //没有技能数据
	eEC_InvalidGameObjectCate, //非法的游戏对象类型
	eEC_HasChoosedHero, //已经选择了英雄
	eEC_OthersHasChoosedHero, //
	eEC_HasNoTheHero,
	eEC_AbsentAttackDistance, //攻击距离不足
	eEC_TargetIsDead, //目标已经死亡
	eEC_InvalidTargetActionState, //目标行为状态非法
	eEC_InvalidBattle, //非法的战役
	eEC_TheBattlIsFull,	 //战役已经满员
	eEC_BattlePDWNotMatch, 
	eEC_NullGameObject,//找不到游戏对象
	eEC_NULLNickName, //找不到昵称
	eEC_TimeExpire, //时间超时
	eEC_NoneAvailbleBuff, //没有有效BUFF
	eEC_BuffOverlapUpperLimit, //超过BUFF上限
	eEC_InvalidCurHPNum, //非法的当前HP
	eEC_InvalidCurMPNum, //非法的当前MP
	eEc_NoPathNode, //找不到路径节点
	eEC_InvalidBuffTypeID, //非法的缓冲类型ID
	eEC_AbsentSkillDistance, //技能距离不足
	eEC_BuildingCanNotMove, //建筑不能移动
	eEC_AbsentCP, //CP不足
	eEC_AbsentMP, //MP不足
	eEC_AbsentHP, //HP不足
	eEC_BuildingCanNotAddBuff, //建筑不能添加BUFF
	eEC_InvalidActionState, //非法的行为状态
	eEC_JustSkillAction,  //正在使用技能
	eEC_AbsorbMonsterFailForLackLevel, 
	eEC_AbsorbMonsterFailForHasFullAbsorb,
	eEC_AbsorbMonsterFailForHasSameSkillID,
	eEC_AbsorbMonsterFailForLackCP,
	eEC_AbsorbMonsterFailForMonsterDead,
	eEC_AbsorbMonsterFailForMonsterCannotBeConstrol,
	eEC_AbsorbMonsterFailForHeroDead,
	eEC_AbsorbMonsterFailForNotMonster,
	eEC_AbsorbMonsterFailForDiffNPC,
	eEC_AbsorbMonsterFailForErrorState,
	eEC_AbsorbMonsterFailForDizziness,
	eEC_NULLNPC, //找不到NPC
	eEC_NULLCfg, //找不到配置信息
	eEC_InvaildSkillID, //非法的技能ID
	eEC_RemoveAbsorbSkillFailed, //移除吸附技能失败
	eEC_StateCanNotUseGas,
	eEc_ExistWildMonsterBornPos, 
	eEc_InvalidControlNPCType,
	eEC_GasExplosionNotFull,
	eEC_MultiAbsortNotAllowed,
	eEC_StaticBlock, //静态阻挡
	eEC_DynamicBlock, //动态阻挡
	eEC_NoDistanceToMove, //没有距离需要移动
	eEC_CannotFindFullPathNode, //找不到完整的路径
	eEC_HeroNotDead, //英雄没有死亡
	eEC_NotEnoughGold, //金币不足
	eEC_NoRebornTimes,
	eEC_BattleIsPlaying,
	eEC_RemoveBuffFailed,	
	eEc_DeadAltar,
	eEC_InvaildCampID,
	eEC_NotInSameBattle,
	eEC_AskBuyRunesFail,
	eEC_AskComposeRunesFail,
	eEC_AskUnUseRunesFail,
	eEC_AskUseRunesFail,
	eEC_AskMoveGoodsFail,
	eEC_AskSellGoodsFail,
	eEC_InvaildGridID,
	eEC_AskUseGoodsFailForCoolDown,
	eEC_rInvalidGoodsNum,
	eEC_AskBuyGoodsFailForLackCP,
	eEC_AskBuyGoodsFailForInvalidCPType,
	eEC_AskBuyGoodsFailForHasSameTypeID,
	eEC_AskBuyGoodsFailForHasFunType,
	eEC_AskBuyGoodsFailForBagFull,
	eEC_CannotCreateVoipServer,
	eEc_AttackOneObj,
	eEc_ExistObj,
	eEc_TheSkillEnd,
	eEc_ErrorSkillId,
	eEc_InvalidMastType,
	eEC_NickNameCollision, //昵称冲突
	eEC_ObjectAlreadyExist,
	eEC_ForbitAbWMSolder, //不能吸附野怪兵
	eEC_TargetCannotLooked,//目标不能锁定
	eEC_ErrorAreaId,//错误的areaId
	eEc_NoWatchUser,//没有观察者
	eEc_MaxBornSolder,
	eEC_AddBattleFailForLackOfGold,
	eEC_CampNotBalance,
	eEC_AskBuyGoodsFailForSole,

	eEC_TimeOut,
	eEC_AddEffectFailed,
	eEC_EffectEnd,

	eEC_UseSkillFailForSilenced,
	eEC_UseSkillFailForDisarmed,
	eEC_UseSkillFailForLackHP,
	eEC_UseSkillFailForLackMP,
	eEC_UseSkillFailForLackCP,
	eEC_UseSkillFailForSkillCoolDown,
	eEC_UseSkillFailForNULLTarget,
	eEC_UseSkillFailForBuildingNullity,

	eEC_UseGoodsFailForDizziness,
	eEC_UseGoodsFailForBuildingNullity,
	eEC_UseGoodsFailForNULLTarget, 
	eEC_UseGoodslFailForSilenced,
	eEC_UseGoodslFailForErrorCamp,
	eEC_UseSkillGasNotInRunState,
	eEC_UseSkillGasHasInRunState,
	eEC_NoAbsorbSkill,

	eEC_UseSkillFailForDizziness,
	eEC_AskBuyGoodsFailForLackTeamCP,
	eEC_CanntAbsorb,
	eEC_SkillPrepareFailed,
	eEC_CancelSkillOrderFailed,

	eEC_TheBattleObserverNotFull,
	eEC_TheBattleObserverFull,
	eEC_BeginBattleFailForNullPlayer,
	eEC_AddBattleFailForAllFull,
	eEC_AddBattleFailForUserFull,
	eEC_WarningToSelectHero,
	eEC_GuideNotOn,
	eEC_HasCompGuideStep,
	eEc_InvalidStepId,
	eEc_DelAbsorbICOFailed,
	eEC_AbsorbMonsterFail,
	eEC_ZeroGUID,
	eEc_NoObjList,

	eEC_JustInThatSeatPos,
	eEC_NickNameNotAllowed,
	eEc_InvalidTarget,	//错误的对象:箭塔
	eEC_GUDead,
	eEC_TooManyUserInBattle,
	eEc_NoAtkObj,
	eEC_InvalidMapInfo,
	eEc_InvalidMapId,
	eEc_NullLuaCfg,
	eEC_NullMapCfg,
	eEC_LoadFilterCfgFailed,
	eEC_RemoveEffectFailed,
	eEC_UserNotExist,
	eEC_BattleFinished,

	eEC_UserWasInFriendList,
	eEC_UserWasInBlackList,
	eEC_UserNotOnline,
	eEC_MsgTooLarge,
	eEC_UserRefuseReceiveYourMsg,
	eEC_UserOfflineFull,

	eEC_HaveBuySameGoods,
	eEC_BuyGoodsFailedLackGold,
	eEC_BuyGoodsFailedLackDiamond,
	eEc_ExistGuidCfg,
	eEC_NullInfo,
	eEC_UserRSExist,
	eEc_ErrorGuideStepId,
	eEc_invalidObjId,
	eEC_NothingContent,
	eEc_DoneDBWrong,
	eEC_AskTooFrequently,
	eEC_UserOfflineMsgFull,
	eEc_InvalidAbsorbTar,
	eEC_BeginAIFailed,
	eEC_CanNotUseChinese,

	eEC_TipsObjAppear,
	eEC_TipsNPCBorn,
	eEC_TipsSuperNPCBorn,
	eEc_ErrorType,
	eEC_FriendsListFull,
	eEC_BlackListFull,
	eEC_JustInFriendsList,
	eEC_JustInBlackList,
	eEC_NullUserRSInfo,
	eEC_UserBusy,
	eEC_YouInOppositeBlackList,
	eEC_CounterpartFriendListFull,
	eEC_UserInYourBlackList,
	eEC_AskHaveSend,
	eEc_existBattle,
 	eEC_CannotBuygoodsWhenDeath,
	eEc_TimeToSaveDB,

	eEc_91LoginFail,
	eEc_91InvalidAppID,
	eEc_91InvalidAct,
	eEc_91InvalidPara,
	eEc_91InvalidSign,
	eEc_91InvalidSessionID,

	eEc_UserNotHaveHero,
	eEC_CannotSellgoodsWhenDeath,
	eEC_PPUserNameRuleWrong,
	eEC_PPUserNotExist,
	eEC_PPInvalidAct,
	eEC_PPUserExisted,
	eEC_PPPwdCheckError,
	eEC_PPUserProhibited,
	eEC_PPDataError,
	eEC_PPSessionTimeout,
	eEC_PPUserHaveBinding,

	eEC_TBInvalidToken,
	eEC_TBInvalidFormat,

	eEc_FunClosed,
	eEC_BattleClosing,	//用于重连
	eEC_InvalidPwdLength,
	eEC_PleaseEnterPwd,
	eEC_InvalidUserNameLegth,

	eEC_NullPointer,
	eEC_InvalidMsgProtocalID,
	eEC_NullMsgHandler,
	eEc_InvalidGUID,
	eEC_NullMsg,
	eEC_InvalidNSID,
	eEC_GUIDCollision,
	eEC_InvalidUserName,
	eEc_InvalidMailId,
	eEC_UserOfflineOrNullUser,
	eEC_UserWasPlaying,
	eEC_RequestSended,
	eEC_AddFriendSeccuse,
	eEC_OppositeSideFriendFull,
	eEC_ReEnterRoomFail,//重进房间失败
	eEC_DiamondNotEnough,
	eEC_ParseProtoError,//解析PB错误
	eEC_UnKnownError,//未知错误//
	eEC_ErrorTimes,
	eEC_MatchLinkInvalid,//匹配链接已失效//
	eEC_AddMatchTeamError,//加入匹配队伍失败
	eEC_NotEnoughItem,		//item number not enough
	eEC_DidNotHaveThisItem,    
	eEC_UserRefuseAddFriends,
	eEC_MatchTeamateStoped,//等待匹配队友
	eEc_ExistGuideTaskId,	//存在的任务id
	eEC_UnknowPlatform,
	eEC_MsgAnalysisFail,
	eEC_PostLoginMsgFail,
	eEC_NickNameTooShort,
	eEC_GuideUserForbit,
	eEC_InvalidCDKey,
	eEC_WashRuneFail,
	eEC_GetCDKeyGiftSuccess,

	eEc_MailHasTimeOver, //邮件邮件过期
	eEc_MailHasRecv, //邮件已经领取 
	eEC_HavedPerpetualHero,
	eEC_InvalidPara,
}