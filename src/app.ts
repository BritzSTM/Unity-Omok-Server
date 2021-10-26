import { SSL_OP_EPHEMERAL_RSA } from "constants";
import { Socket } from "dgram";
import { IncomingMessage } from "http";
import { Http2ServerRequest } from "http2";
import { WebSocket, WebSocketServer } from "ws";

const path = require("path");
const express = require('express'); const app = express();
app.use("/", (req: any, res: any) => {
    //res.send("Wellcom");
    res.sendFile(path.join(__dirname, "../", "index.html"));
})
const HTTPServer = app.listen(4000, '0.0.0.0', () => { console.log("Server is open at port:4000"); });


const wsModule = require('ws');
const webSockServer: WebSocketServer = new wsModule.Server({
    server: HTTPServer
    //port: 4000
});

webSockServer.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    console.log(`새로운 클라이언트[${ip}] 접속`);
    // 2) 클라이언트에게 메시지 전송
    if (ws.readyState === ws.OPEN) {
        // 연결 여부 체크
        ws.send(`클라이언트[${ip}] 접속을 환영합니다 from 서버`);
    }
    // 3) 클라이언트로부터 메시지 수신 이벤트 처리
    ws.on('message', (msg) => {
        console.log(`클라이언트[${ip}]에게 수신한 메시지 : ${msg}`);
        ws.send('메시지 잘 받았습니다! from 서버');
        setTimeout(() => { ws.send("5초후 메시지"); }, 5000)
    })
    // 4) 에러 처러
    ws.on('error', (error) => { console.log(`클라이언트[${ip}] 연결 에러발생 : ${error}`); })
    // 5) 연결 종료 이벤트 처리
    ws.on('close', () => { console.log(`클라이언트[${ip}] 웹소켓 연결 종료`); })

});

// class App
// {
//     public application: express.Application;
//     constructor() {
//         this.application = express();
//     }
// }

// const app = new App().application;
// app.get("/", (req: express.Request, res: express.Response) => {
//     res.send("start");
// })

// app.listen(4000, () => console.log("Start server"));
