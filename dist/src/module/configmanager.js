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
const autobuffcfg_1 = require("../../tools/autots/autobuffcfg");
const autocombinecfg_1 = require("../../tools/autots/autocombinecfg");
const autocsaward_1 = require("../../tools/autots/autocsaward");
const autodailybonus_1 = require("../../tools/autots/autodailybonus");
const autodiscountscfg_1 = require("../../tools/autots/autodiscountscfg");
const autoheadselect_1 = require("../../tools/autots/autoheadselect");
const autoherobuycfg_1 = require("../../tools/autots/autoherobuycfg");
const autoherocfg_1 = require("../../tools/autots/autoherocfg");
const autoherochoosecfg_1 = require("../../tools/autots/autoherochoosecfg");
const autohotandnewcfg_1 = require("../../tools/autots/autohotandnewcfg");
const autoinfinitetask_1 = require("../../tools/autots/autoinfinitetask");
const autoitemcfg_1 = require("../../tools/autots/autoitemcfg");
const automaploadcfg_1 = require("../../tools/autots/automaploadcfg");
const automapobjcfg_1 = require("../../tools/autots/automapobjcfg");
const automsgcfg_1 = require("../../tools/autots/automsgcfg");
const automsgsettingcfg_1 = require("../../tools/autots/automsgsettingcfg");
const autonpccfg_1 = require("../../tools/autots/autonpccfg");
const autootheritemcfg_1 = require("../../tools/autots/autootheritemcfg");
const autootheritemcfgdescribe_1 = require("../../tools/autots/autootheritemcfgdescribe");
const autorobotaicfg_1 = require("../../tools/autots/autorobotaicfg");
const autorobotpath_1 = require("../../tools/autots/autorobotpath");
const autorunecfg_1 = require("../../tools/autots/autorunecfg");
const autoruneslotcfg_1 = require("../../tools/autots/autoruneslotcfg");
const autoscenecfg_1 = require("../../tools/autots/autoscenecfg");
const autoshopcfg_1 = require("../../tools/autots/autoshopcfg");
const autoskillcfg_1 = require("../../tools/autots/autoskillcfg");
const autoskillcfgaccount_1 = require("../../tools/autots/autoskillcfgaccount");
const autoskillcfgarea_1 = require("../../tools/autots/autoskillcfgarea");
const autoskillcfgbloodseek_1 = require("../../tools/autots/autoskillcfgbloodseek");
const autoskillcfgbuff_1 = require("../../tools/autots/autoskillcfgbuff");
const autoskillcfgemit_1 = require("../../tools/autots/autoskillcfgemit");
const autoskillcfgfly_1 = require("../../tools/autots/autoskillcfgfly");
const autoskillcfgleading_1 = require("../../tools/autots/autoskillcfgleading");
const autoskillcfglinks_1 = require("../../tools/autots/autoskillcfglinks");
const autoskillcfgmanager_1 = require("../../tools/autots/autoskillcfgmanager");
const autoskillcfgmove_1 = require("../../tools/autots/autoskillcfgmove");
const autoskillcfgoverlap_1 = require("../../tools/autots/autoskillcfgoverlap");
const autoskillcfgpassitive_1 = require("../../tools/autots/autoskillcfgpassitive");
const autoskillcfgpurification_1 = require("../../tools/autots/autoskillcfgpurification");
const autoskillcfgrebound_1 = require("../../tools/autots/autoskillcfgrebound");
const autoskillcfgrelive_1 = require("../../tools/autots/autoskillcfgrelive");
const autoskillcfgsummon_1 = require("../../tools/autots/autoskillcfgsummon");
const autoskillcfgswitch_1 = require("../../tools/autots/autoskillcfgswitch");
const autoskincfg_1 = require("../../tools/autots/autoskincfg");
const autoskinspurchasecfg_1 = require("../../tools/autots/autoskinspurchasecfg");
const autossaltarconfig_1 = require("../../tools/autots/autossaltarconfig");
const autossbornhero_1 = require("../../tools/autots/autossbornhero");
const autossbornnpc_1 = require("../../tools/autots/autossbornnpc");
const autossbuildbehurt_1 = require("../../tools/autots/autossbuildbehurt");
const autosscreepsconfig_1 = require("../../tools/autots/autosscreepsconfig");
const autossdelayconfig_1 = require("../../tools/autots/autossdelayconfig");
const autossherobirthconfig_1 = require("../../tools/autots/autossherobirthconfig");
const autossmapbaseconfig_1 = require("../../tools/autots/autossmapbaseconfig");
const autosssoldierwaypoints_1 = require("../../tools/autots/autosssoldierwaypoints");
const autossuserhero_1 = require("../../tools/autots/autossuserhero");
const autouseraccountcfg_1 = require("../../tools/autots/autouseraccountcfg");
const autousercfg_1 = require("../../tools/autots/autousercfg");
const autovipintegralcfg_1 = require("../../tools/autots/autovipintegralcfg");
const autowildmonstercfg_1 = require("../../tools/autots/autowildmonstercfg");
class ConfigManager {
    static getInstance() {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }
    constructor() {
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this._autoBuffCfg = yield autobuffcfg_1.AutoBuffCfg.getInstance();
            this._autoCombineCfg = yield autocombinecfg_1.AutoCombineCfg.getInstance();
            this._autoCSAward = yield autocsaward_1.AutoCSAward.getInstance();
            this._autoDailyBonus = yield autodailybonus_1.AutoDailyBonus.getInstance();
            this._autoDiscountsCfg = yield autodiscountscfg_1.AutoDiscountsCfg.getInstance();
            this._autoHeadSelect = yield autoheadselect_1.AutoHeadSelect.getInstance();
            this._autoHeroBuyCfg = yield autoherobuycfg_1.AutoHeroBuyCfg.getInstance();
            this._autoHeroCfg = yield autoherocfg_1.AutoHeroCfg.getInstance();
            this._autoHeroChooseCfg = yield autoherochoosecfg_1.AutoHeroChooseCfg.getInstance();
            this._autoHotAndNewCfg = yield autohotandnewcfg_1.AutoHotAndNewCfg.getInstance();
            this._autoInfiniteTask = yield autoinfinitetask_1.AutoInfiniteTask.getInstance();
            this._autoItemCfg = yield autoitemcfg_1.AutoItemCfg.getInstance();
            this._autoMapLoadCfg = yield automaploadcfg_1.AutoMapLoadCfg.getInstance();
            this._autoMapObjCfg = yield automapobjcfg_1.AutoMapObjCfg.getInstance();
            this._autoMsgCfg = yield automsgcfg_1.AutoMsgCfg.getInstance();
            this._autoMsgSettingCfg = yield automsgsettingcfg_1.AutoMsgSettingCfg.getInstance();
            this._autoNPCCfg = yield autonpccfg_1.AutoNPCCfg.getInstance();
            this._autoOtherItemCfg = yield autootheritemcfg_1.AutoOtherItemCfg.getInstance();
            this._autoOtherItemCfgDescribe = yield autootheritemcfgdescribe_1.AutoOtherItemCfgDescribe.getInstance();
            this._autoRobotAICfg = yield autorobotaicfg_1.AutoRobotAICfg.getInstance();
            this._autoRobotPath = yield autorobotpath_1.AutoRobotPath.getInstance();
            this._autoRuneCfg = yield autorunecfg_1.AutoRuneCfg.getInstance();
            this._autoRuneSlotCfg = yield autoruneslotcfg_1.AutoRuneSlotCfg.getInstance();
            this._autoSceneCfg = yield autoscenecfg_1.AutoSceneCfg.getInstance();
            this._autoShopCfg = yield autoshopcfg_1.AutoShopCfg.getInstance();
            this._autoSkillCfg = yield autoskillcfg_1.AutoSkillCfg.getInstance();
            this._autoSkillCfgaccount = yield autoskillcfgaccount_1.AutoSkillCfgaccount.getInstance();
            this._autoSkillCfgarea = yield autoskillcfgarea_1.AutoSkillCfgarea.getInstance();
            this._autoSkillCfgbloodseek = yield autoskillcfgbloodseek_1.AutoSkillCfgbloodseek.getInstance();
            this._autoSkillCfgbuff = yield autoskillcfgbuff_1.AutoSkillCfgbuff.getInstance();
            this._autoSkillCfgemit = yield autoskillcfgemit_1.AutoSkillCfgemit.getInstance();
            this._autoSkillCfgfly = yield autoskillcfgfly_1.AutoSkillCfgfly.getInstance();
            this._autoSkillCfgleading = yield autoskillcfgleading_1.AutoSkillCfgleading.getInstance();
            this._autoSkillCfglinks = yield autoskillcfglinks_1.AutoSkillCfglinks.getInstance();
            this._autoSkillCfgmanager = yield autoskillcfgmanager_1.AutoSkillCfgmanager.getInstance();
            this._autoSkillCfgmove = yield autoskillcfgmove_1.AutoSkillCfgmove.getInstance();
            this._autoSkillCfgoverlap = yield autoskillcfgoverlap_1.AutoSkillCfgoverlap.getInstance();
            this._autoSkillCfgpassitive = yield autoskillcfgpassitive_1.AutoSkillCfgpassitive.getInstance();
            this._autoSkillCfgpurification = yield autoskillcfgpurification_1.AutoSkillCfgpurification.getInstance();
            this._autoSkillCfgrebound = yield autoskillcfgrebound_1.AutoSkillCfgrebound.getInstance();
            this._autoSkillCfgrelive = yield autoskillcfgrelive_1.AutoSkillCfgrelive.getInstance();
            this._autoSkillCfgsummon = yield autoskillcfgsummon_1.AutoSkillCfgsummon.getInstance();
            this._autoSkillCfgswitch = yield autoskillcfgswitch_1.AutoSkillCfgswitch.getInstance();
            this._autoSkinCfg = yield autoskincfg_1.AutoSkinCfg.getInstance();
            this._autoSkinsPurchaseCfg = yield autoskinspurchasecfg_1.AutoSkinsPurchaseCfg.getInstance();
            this._autoSSAltarConfig = yield autossaltarconfig_1.AutoSSAltarConfig.getInstance();
            this._autoSSbornhero = yield autossbornhero_1.AutoSSbornhero.getInstance();
            this._autoSSbornnpc = yield autossbornnpc_1.AutoSSbornnpc.getInstance();
            this._autoSSBuildBeHurt = yield autossbuildbehurt_1.AutoSSBuildBeHurt.getInstance();
            this._autoSSCreepsConfig = yield autosscreepsconfig_1.AutoSSCreepsConfig.getInstance();
            this._autoSSDelayConfig = yield autossdelayconfig_1.AutoSSDelayConfig.getInstance();
            this._autoSSHeroBirthConfig = yield autossherobirthconfig_1.AutoSSHeroBirthConfig.getInstance();
            this._autoSSMapBaseConfig = yield autossmapbaseconfig_1.AutoSSMapBaseConfig.getInstance();
            this._autoSSSoldierWaypoints = yield autosssoldierwaypoints_1.AutoSSSoldierWaypoints.getInstance();
            this._autoSSuserHero = yield autossuserhero_1.AutoSSuserHero.getInstance();
            this._autoUserAccountCfg = yield autouseraccountcfg_1.AutoUserAccountCfg.getInstance();
            this._autoUserCfg = yield autousercfg_1.AutoUserCfg.getInstance();
            this._autoVIPIntegralCfg = yield autovipintegralcfg_1.AutoVIPIntegralCfg.getInstance();
            this._autoWildMonsterCfg = yield autowildmonstercfg_1.AutoWildMonsterCfg.getInstance();
        });
    }
    getAutoBuffCfgInfoItem(keyId) {
        return this._autoBuffCfg.getAutoBuffCfgInfoItem(keyId);
    }
    getAutoCombineCfgInfoItem(keyId) {
        return this._autoCombineCfg.getAutoCombineCfgInfoItem(keyId);
    }
    getAutoCSAwardInfoItem(keyId) {
        return this._autoCSAward.getAutoCSAwardInfoItem(keyId);
    }
    getAutoDailyBonusInfoItem(keyId) {
        return this._autoDailyBonus.getAutoDailyBonusInfoItem(keyId);
    }
    getAutoDiscountsCfgInfoItem(keyId) {
        return this._autoDiscountsCfg.getAutoDiscountsCfgInfoItem(keyId);
    }
    getAutoHeadSelectInfoItem(keyId) {
        return this._autoHeadSelect.getAutoHeadSelectInfoItem(keyId);
    }
    getAutoHeroBuyCfgInfoItem(keyId) {
        return this._autoHeroBuyCfg.getAutoHeroBuyCfgInfoItem(keyId);
    }
    getAutoHeroCfgInfoItem(keyId) {
        return this._autoHeroCfg.getAutoHeroCfgInfoItem(keyId);
    }
    getAutoHeroChooseCfgInfoItem(keyId) {
        return this._autoHeroChooseCfg.getAutoHeroChooseCfgInfoItem(keyId);
    }
    getAutoHotAndNewCfgInfoItem(keyId) {
        return this._autoHotAndNewCfg.getAutoHotAndNewCfgInfoItem(keyId);
    }
    getAutoInfiniteTaskInfoItem(keyId) {
        return this._autoInfiniteTask.getAutoInfiniteTaskInfoItem(keyId);
    }
    getAutoItemCfgInfoItem(keyId) {
        return this._autoItemCfg.getAutoItemCfgInfoItem(keyId);
    }
    getAutoMapLoadCfgInfoItem(keyId) {
        return this._autoMapLoadCfg.getAutoMapLoadCfgInfoItem(keyId);
    }
    getAutoMapObjCfgInfoItem(keyId) {
        return this._autoMapObjCfg.getAutoMapObjCfgInfoItem(keyId);
    }
    getAutoMsgCfgInfoItem(keyId) {
        return this._autoMsgCfg.getAutoMsgCfgInfoItem(keyId);
    }
    getAutoMsgSettingCfgInfoItem(keyId) {
        return this._autoMsgSettingCfg.getAutoMsgSettingCfgInfoItem(keyId);
    }
    getAutoNPCCfgInfoItem(keyId) {
        return this._autoNPCCfg.getAutoNPCCfgInfoItem(keyId);
    }
    getAutoOtherItemCfgInfoItem(keyId) {
        return this._autoOtherItemCfg.getAutoOtherItemCfgInfoItem(keyId);
    }
    getAutoOtherItemCfgDescribeInfoItem(keyId) {
        return this._autoOtherItemCfgDescribe.getAutoOtherItemCfgDescribeInfoItem(keyId);
    }
    getAutoRobotAICfgInfoItem(keyId) {
        return this._autoRobotAICfg.getAutoRobotAICfgInfoItem(keyId);
    }
    getAutoRobotPathInfoItem(keyId) {
        return this._autoRobotPath.getAutoRobotPathInfoItem(keyId);
    }
    getAutoRuneCfgInfoItem(keyId) {
        return this._autoRuneCfg.getAutoRuneCfgInfoItem(keyId);
    }
    getAutoRuneSlotCfgInfoItem(keyId) {
        return this._autoRuneSlotCfg.getAutoRuneSlotCfgInfoItem(keyId);
    }
    getAutoSceneCfgInfoItem(keyId) {
        return this._autoSceneCfg.getAutoSceneCfgInfoItem(keyId);
    }
    getAutoShopCfgInfoItem(keyId) {
        return this._autoShopCfg.getAutoShopCfgInfoItem(keyId);
    }
    getAutoSkillCfgInfoItem(keyId) {
        return this._autoSkillCfg.getAutoSkillCfgInfoItem(keyId);
    }
    getAutoSkillCfgaccountInfoItem(keyId) {
        return this._autoSkillCfgaccount.getAutoSkillCfgaccountInfoItem(keyId);
    }
    getAutoSkillCfgareaInfoItem(keyId) {
        return this._autoSkillCfgarea.getAutoSkillCfgareaInfoItem(keyId);
    }
    getAutoSkillCfgbloodseekInfoItem(keyId) {
        return this._autoSkillCfgbloodseek.getAutoSkillCfgbloodseekInfoItem(keyId);
    }
    getAutoSkillCfgbuffInfoItem(keyId) {
        return this._autoSkillCfgbuff.getAutoSkillCfgbuffInfoItem(keyId);
    }
    getAutoSkillCfgemitInfoItem(keyId) {
        return this._autoSkillCfgemit.getAutoSkillCfgemitInfoItem(keyId);
    }
    getAutoSkillCfgflyInfoItem(keyId) {
        return this._autoSkillCfgfly.getAutoSkillCfgflyInfoItem(keyId);
    }
    getAutoSkillCfgleadingInfoItem(keyId) {
        return this._autoSkillCfgleading.getAutoSkillCfgleadingInfoItem(keyId);
    }
    getAutoSkillCfglinksInfoItem(keyId) {
        return this._autoSkillCfglinks.getAutoSkillCfglinksInfoItem(keyId);
    }
    getAutoSkillCfgmanagerInfoItem(keyId) {
        return this._autoSkillCfgmanager.getAutoSkillCfgmanagerInfoItem(keyId);
    }
    getAutoSkillCfgmoveInfoItem(keyId) {
        return this._autoSkillCfgmove.getAutoSkillCfgmoveInfoItem(keyId);
    }
    getAutoSkillCfgoverlapInfoItem(keyId) {
        return this._autoSkillCfgoverlap.getAutoSkillCfgoverlapInfoItem(keyId);
    }
    getAutoSkillCfgpassitiveInfoItem(keyId) {
        return this._autoSkillCfgpassitive.getAutoSkillCfgpassitiveInfoItem(keyId);
    }
    getAutoSkillCfgpurificationInfoItem(keyId) {
        return this._autoSkillCfgpurification.getAutoSkillCfgpurificationInfoItem(keyId);
    }
    getAutoSkillCfgreboundInfoItem(keyId) {
        return this._autoSkillCfgrebound.getAutoSkillCfgreboundInfoItem(keyId);
    }
    getAutoSkillCfgreliveInfoItem(keyId) {
        return this._autoSkillCfgrelive.getAutoSkillCfgreliveInfoItem(keyId);
    }
    getAutoSkillCfgsummonInfoItem(keyId) {
        return this._autoSkillCfgsummon.getAutoSkillCfgsummonInfoItem(keyId);
    }
    getAutoSkillCfgswitchInfoItem(keyId) {
        return this._autoSkillCfgswitch.getAutoSkillCfgswitchInfoItem(keyId);
    }
    getAutoSkinCfgInfoItem(keyId) {
        return this._autoSkinCfg.getAutoSkinCfgInfoItem(keyId);
    }
    getAutoSkinsPurchaseCfgInfoItem(keyId) {
        return this._autoSkinsPurchaseCfg.getAutoSkinsPurchaseCfgInfoItem(keyId);
    }
    getAutoSSAltarConfigInfoItem(keyId) {
        return this._autoSSAltarConfig.getAutoSSAltarConfigInfoItem(keyId);
    }
    getAutoSSbornheroInfoItem(keyId) {
        return this._autoSSbornhero.getAutoSSbornheroInfoItem(keyId);
    }
    getAutoSSbornnpcInfoItem(keyId) {
        return this._autoSSbornnpc.getAutoSSbornnpcInfoItem(keyId);
    }
    getAutoSSBuildBeHurtInfoItem(keyId) {
        return this._autoSSBuildBeHurt.getAutoSSBuildBeHurtInfoItem(keyId);
    }
    getAutoSSCreepsConfigInfoItem(keyId) {
        return this._autoSSCreepsConfig.getAutoSSCreepsConfigInfoItem(keyId);
    }
    getAutoSSDelayConfigInfoItem(keyId) {
        return this._autoSSDelayConfig.getAutoSSDelayConfigInfoItem(keyId);
    }
    getAutoSSHeroBirthConfigInfoItem(keyId) {
        return this._autoSSHeroBirthConfig.getAutoSSHeroBirthConfigInfoItem(keyId);
    }
    getAutoSSMapBaseConfigInfoItem(keyId) {
        return this._autoSSMapBaseConfig.getAutoSSMapBaseConfigInfoItem(keyId);
    }
    getAutoSSSoldierWaypointsInfoItem(keyId) {
        return this._autoSSSoldierWaypoints.getAutoSSSoldierWaypointsInfoItem(keyId);
    }
    getAutoSSuserHeroInfoItem(keyId) {
        return this._autoSSuserHero.getAutoSSuserHeroInfoItem(keyId);
    }
    getAutoUserAccountCfgInfoItem(keyId) {
        return this._autoUserAccountCfg.getAutoUserAccountCfgInfoItem(keyId);
    }
    getAutoUserCfgInfoItem(keyId) {
        return this._autoUserCfg.getAutoUserCfgInfoItem(keyId);
    }
    getAutoVIPIntegralCfgInfoItem(keyId) {
        return this._autoVIPIntegralCfg.getAutoVIPIntegralCfgInfoItem(keyId);
    }
    getAutoWildMonsterCfgInfoItem(keyId) {
        return this._autoWildMonsterCfg.getAutoWildMonsterCfgInfoItem(keyId);
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=configmanager.js.map