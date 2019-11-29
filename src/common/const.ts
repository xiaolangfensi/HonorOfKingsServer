export enum SocketEvent {
    DATA = 'data',
    ERROR = 'error',
    MSG = 'msg',
    END = 'end'
};

export enum ServerEvent {
    ERROR = 'error'
}

export enum ClientEvent {
    DATA = 'data',
    ERROR = 'error',
    MSG = 'msg',
    END = 'end',
    SCHEDULE = 'schedule'
};

export enum GameClientConfigSection {
    SERVERLIST = 'serverlist',
    GATESERVERLIST = 'gateserverlist'
};

export enum ProcessEvent {
    SIGINT = 'SIGINT',
    MESSAGE = 'message'
};

export enum ProcessMessageCmd {
    SHUTDOWN = 'shutdown'
}

export enum HOKError {
    HOK_SUCCESS = 0,
    NOT_REGISTERED,
    UNKNOWN_ERROR,
    PASSWORD_WRONG
}

export enum ConfigFile {
    HeroBuyCfg = 'HeroBuyCfg',
    HotAndNewCfg = 'HotAndNewCfg', 
    dailybonus = 'dailybonus', 
    DiscountsCfg = 'DiscountsCfg', 
    OtherItemCfg = 'OtherItemCfg', 
    OtherItemCfgDescribe = 'OtherItemCfgDescribe', 
    RuneCfg = 'RuneCfg',
    SkinCfg = 'SkinCfg', 
    VIPIntegralCfg = 'VIPIntegralCfg',
    InfiniteTask = 'InfiniteTask'
}

// export { ProtoFileEnum, SocketEvent, ClientEvent, ServerEvent, GameClientConfigSection, ProcessEvent, ProcessMessageCmd };