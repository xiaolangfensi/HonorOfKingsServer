"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
var LoggerInitedType;
(function (LoggerInitedType) {
    LoggerInitedType[LoggerInitedType["CONSOLE"] = 1] = "CONSOLE";
    LoggerInitedType[LoggerInitedType["NORMAL"] = 2] = "NORMAL";
})(LoggerInitedType || (LoggerInitedType = {}));
class MyLogger {
    static getInstance() {
        if (!this._instance) {
            this._instance = new MyLogger();
            this._instance.initConsole();
        }
        return this._instance;
    }
    constructor() {
        this.mainLogger = {};
    }
    initialize(config) {
        if (this.initedType == LoggerInitedType.NORMAL) {
            return;
        }
        this.initedType = LoggerInitedType.NORMAL;
        log4js.configure(config);
        this.mainLogger = log4js.getLogger();
    }
    initConsole() {
        let config = {
            appenders: {
                out: {
                    type: 'console'
                }
            },
            categories: {
                default: {
                    appenders: ['out'],
                    level: 'all'
                }
            }
        };
        log4js.configure(config);
        this.mainLogger = log4js.getLogger();
        this.initedType = LoggerInitedType.CONSOLE;
    }
    warn(...args) {
        if (!this.mainLogger.isWarnEnabled()) {
            return;
        }
        this.mainLogger.warn(this.writeLog(args));
    }
    trace(...args) {
        if (!this.mainLogger.isTraceEnabled()) {
            return;
        }
        this.mainLogger.trace(this.writeLog(args));
    }
    log(...args) {
        this.info(...args);
    }
    fatal(...args) {
        if (!this.mainLogger.isFatalEnabled()) {
            return;
        }
        this.mainLogger.fatal(this.writeLog(args));
    }
    error(...args) {
        if (!this.mainLogger.isErrorEnabled()) {
            return;
        }
        this.mainLogger.error(this.writeLog(args));
    }
    info(...args) {
        if (!this.mainLogger.isInfoEnabled()) {
            return;
        }
        this.mainLogger.info(this.writeLog(args));
    }
    debug(...args) {
        if (!this.mainLogger.isDebugEnabled()) {
            return;
        }
        this.mainLogger.debug(this.writeLog(args));
    }
    writeLog(...args) {
        if (!this.initedType) {
            console.log('error: ', 'logger is not inited');
        }
        let str = '';
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (i > 0) {
                str += ' ';
                if (typeof arg == 'object') {
                    str += JSON.stringify(arg);
                }
                else {
                    str += arg;
                }
            }
            else {
                if (typeof arg == 'object') {
                    str = JSON.stringify(arg);
                }
                else {
                    str = arg;
                }
            }
        }
        return str;
    }
}
let myLogger = MyLogger.getInstance();
exports.myLogger = myLogger;
//# sourceMappingURL=mylogger.js.map