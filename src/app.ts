// https://medium.com/@nikolaystoykov/build-custom-protocol-on-top-of-tcp-with-node-js-part-1-fda507d5a262
// http://adrichman.github.io/nodejs-parsing-binary-from-the-tcp-layer/
// https://www.derpturkey.com/extending-tcp-socket-in-node-js/
// https://blog.irowell.io/blog/use-a-message-buffer-stack-to-handle-data/
// https://stackoverflow.com/questions/6805432/how-to-uniquely-identify-a-socket-with-node-js

import { v4 as uuidv4 } from 'uuid';
import { createServer, Server, Socket } from 'net';
import { UserContext } from './type';

var Struct = require('struct');
const ServerConfig: any = {
    PublishAddress: '127.0.0.1',
    Port: 7001
}

let nextSocketId: number = 0;
let clientSocks = new Map<number, UserContext>();
let PacketData = Struct()
    .word32Sle('Length')
    .word32Sle('Type');

const serverInst: Server = createServer((clientSock: Socket) => {
    console.log('connect client : ' + clientSock.remoteAddress);
    console.log('id : ' + nextSocketId + ' uuid : ' + uuidv4());

    const socketId = nextSocketId++;
    clientSocks.set(socketId, { Sock: clientSock, NickName: "" });

    var buf = PacketData.allocate();

    clientSock.on('data', (data) => {
        console.log('recive data : ' + data.toString());
        buf.set(data);
        var proxy = buf.fields;

        console.log('buffer : ' + buf.buffer());
        console.log("Length : " + proxy.Length + " Type : " + proxy.Type);
    });
});

serverInst.listen(ServerConfig.Port, ServerConfig.PublishAddress, () => {
    console.log('Publish address : ' + ServerConfig.PublishAddress +
        ' listen port : ' + ServerConfig.Port);
});
