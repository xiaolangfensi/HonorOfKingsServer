"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const const_1 = require("./const");
class ServerBuilder {
    constructor(name) {
        this._config = this.initConfig(name);
        process.chdir(this._config.path);
    }
    startup(server) {
        if (!server || !this._config) {
            console.log('server object or config file has not created!');
            return false;
        }
        server.initialize(this._config.content); //创建连接，调用serverBase
        let exitAction = () => {
            server.dispose();
            process.exit(0);
        };
        //当服务要重启的时候需要处理结束前收尾的事情
        process.on(const_1.ProcessEvent.SIGINT, () => {
            exitAction();
        });
        //windows graceful stop
        process.on(const_1.ProcessEvent.MESSAGE, (msg) => {
            if (msg === const_1.ProcessMessageCmd.SHUTDOWN) {
                exitAction();
            }
        });
        return true;
    }
    initConfig(name) {
        let config = {
            path: '.',
            content: ''
        };
        let conFile = utils_1.default.readConfig(name);
        if (!conFile) {
            console.log('no config file');
            process.exit(1);
        }
        config.content = conFile;
        return config;
    }
}
exports.default = ServerBuilder;
//# sourceMappingURL=serverbuilder.js.map