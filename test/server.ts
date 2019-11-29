import * as TCP from 'net';

TCP.createServer((socket: TCP.Socket) => {
    console.debug(`onConnect call: a socket connect to me. ${socket}`);
    socket.on("error",(e: Error)=>{
        console.log("socket is error");
    });
    socket.on("end", ()=>{
        console.log("socket is close");
    });
    socket.on("data", (data: any)=>{
        console.log(data.toString());
    });
}).listen(49996,"127.0.0.1");
console.log("server is starting");