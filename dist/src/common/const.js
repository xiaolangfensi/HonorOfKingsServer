"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["DATA"] = "data";
    SocketEvent["ERROR"] = "error";
    SocketEvent["MSG"] = "msg";
    SocketEvent["END"] = "end";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
;
var ServerEvent;
(function (ServerEvent) {
    ServerEvent["ERROR"] = "error";
})(ServerEvent = exports.ServerEvent || (exports.ServerEvent = {}));
var ClientEvent;
(function (ClientEvent) {
    ClientEvent["DATA"] = "data";
    ClientEvent["ERROR"] = "error";
    ClientEvent["MSG"] = "msg";
    ClientEvent["END"] = "end";
    ClientEvent["SCHEDULE"] = "schedule";
})(ClientEvent = exports.ClientEvent || (exports.ClientEvent = {}));
;
var GameClientConfigSection;
(function (GameClientConfigSection) {
    GameClientConfigSection["SERVERLIST"] = "serverlist";
    GameClientConfigSection["GATESERVERLIST"] = "gateserverlist";
})(GameClientConfigSection = exports.GameClientConfigSection || (exports.GameClientConfigSection = {}));
;
var ProcessEvent;
(function (ProcessEvent) {
    ProcessEvent["SIGINT"] = "SIGINT";
    ProcessEvent["MESSAGE"] = "message";
})(ProcessEvent = exports.ProcessEvent || (exports.ProcessEvent = {}));
;
var ProcessMessageCmd;
(function (ProcessMessageCmd) {
    ProcessMessageCmd["SHUTDOWN"] = "shutdown";
})(ProcessMessageCmd = exports.ProcessMessageCmd || (exports.ProcessMessageCmd = {}));
var HOKError;
(function (HOKError) {
    HOKError[HOKError["HOK_SUCCESS"] = 0] = "HOK_SUCCESS";
    HOKError[HOKError["NOT_REGISTERED"] = 1] = "NOT_REGISTERED";
    HOKError[HOKError["UNKNOWN_ERROR"] = 2] = "UNKNOWN_ERROR";
    HOKError[HOKError["PASSWORD_WRONG"] = 3] = "PASSWORD_WRONG";
})(HOKError = exports.HOKError || (exports.HOKError = {}));
var ConfigFile;
(function (ConfigFile) {
    ConfigFile["HeroBuyCfg"] = "HeroBuyCfg";
    ConfigFile["HotAndNewCfg"] = "HotAndNewCfg";
    ConfigFile["dailybonus"] = "dailybonus";
    ConfigFile["DiscountsCfg"] = "DiscountsCfg";
    ConfigFile["OtherItemCfg"] = "OtherItemCfg";
    ConfigFile["OtherItemCfgDescribe"] = "OtherItemCfgDescribe";
    ConfigFile["RuneCfg"] = "RuneCfg";
    ConfigFile["SkinCfg"] = "SkinCfg";
    ConfigFile["VIPIntegralCfg"] = "VIPIntegralCfg";
    ConfigFile["InfiniteTask"] = "InfiniteTask";
})(ConfigFile = exports.ConfigFile || (exports.ConfigFile = {}));
// export { ProtoFileEnum, SocketEvent, ClientEvent, ServerEvent, GameClientConfigSection, ProcessEvent, ProcessMessageCmd };
//# sourceMappingURL=const.js.map