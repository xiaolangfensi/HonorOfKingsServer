"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverbuilder_1 = require("./src/common/serverbuilder");
const hokserver_1 = require("./src/module/hokserver");
const mylogger_1 = require("./src/common/mylogger");
class Main {
    static main(name) {
        let builder = new serverbuilder_1.default(name);
        if (builder && builder.startup(new hokserver_1.HOKServer(name))) {
            mylogger_1.myLogger.debug('builder initialized finished ...');
        }
        return 0;
    }
}
Main.main('hok');
//# sourceMappingURL=main.js.map