"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TCP = require("net");
let client = TCP.connect({ port: 49996, host: "127.0.0.1" }, () => {
    client.write("我来测试一下");
    client.end();
});
//# sourceMappingURL=client.js.map