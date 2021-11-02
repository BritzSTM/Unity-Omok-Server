// https://medium.com/@nikolaystoykov/build-custom-protocol-on-top-of-tcp-with-node-js-part-1-fda507d5a262
// http://adrichman.github.io/nodejs-parsing-binary-from-the-tcp-layer/
// https://www.derpturkey.com/extending-tcp-socket-in-node-js/
// https://blog.irowell.io/blog/use-a-message-buffer-stack-to-handle-data/
// https://stackoverflow.com/questions/6805432/how-to-uniquely-identify-a-socket-with-node-js

import { createServer } from "http";
import { Socket } from "net";
import { deflate } from "zlib";
var Struct = require('struct');

const ServerConfig: any = {
    PublishAddress: '127.0.0.1',
    Port: 7001
};

const io = require('socket.io')(ServerConfig.Port);
interface PlayerSession{
    Sock: Socket;
    NickName: string;
    Id: number;
};

let defualtPlayers: Array<PlayerSession> = [];
let simpleNextId: number = 0;

io.on("connection", (socket: Socket) => {
    console.log('Player Connected');
    const playerID: number = simpleNextId++;
    let NickName: string;

    socket.on("Chat", function (data: any) {
        let obj = data;
        console.log("recived chat " + obj.Data);
        obj.NickName = NickName;

        defualtPlayers.forEach((value: PlayerSession) => {
            if (playerID != value.Id)
                value.Sock.emit("ChatTo", obj);
        });
    });

    socket.on("JoinChannel", function (nickName: string) {
        console.log("Joined Nick : " + nickName);
        NickName = nickName;
        defualtPlayers.push({ Sock: socket, NickName: nickName, Id: playerID });

        let nickNames: string[] = [];
        defualtPlayers.forEach((value: PlayerSession) => {
            nickNames.push(value.NickName);
        });

        socket.emit("JoinedChannel", { Name: "default channel", Users: nickNames });
        defualtPlayers.forEach((value: PlayerSession) => {
            if (playerID != value.Id)
                value.Sock.emit("JoinedNewPlayer", nickName);
        });
    });

    socket.on('LeaveChannel', function () {
        console.log('Player leave channel : ' + playerID);
        defualtPlayers = defualtPlayers.filter((value: PlayerSession) => {
            return value.Id == playerID;
        });
    });

    socket.on('disconnect', function () {
        console.log('Player disconnected : ' + playerID);
    });
});

console.log('Publish address : ' + ServerConfig.PublishAddress +
' listen port : ' + ServerConfig.Port);
