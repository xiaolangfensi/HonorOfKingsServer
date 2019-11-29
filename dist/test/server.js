"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TCP = require("net");
TCP.createServer((socket) => {
    console.debug(`onConnect call: a socket connect to me. ${socket}`);
    socket.on("error", (e) => {
        console.log("socket is error");
    });
    socket.on("end", () => {
        console.log("socket is close");
    });
    socket.on("data", (data) => {
        console.log(data.toString());
    });
}).listen(49996, "127.0.0.1");
console.log("server is starting");
//# sourceMappingURL=server.js.map