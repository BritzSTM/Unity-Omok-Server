import { createServer } from "http";
import { Socket } from "net";


//const httpServer = createServer();

//const io = new Server(httpServer, {
//    cors: {
//        methods: ["GET", "POST"]
//    },
//    transports: ["websocket"],
//    allowEIO3: true
///});
const io = require('socket.io')(7001);
const defualtPlayers = new Map<string, {NickName: string, Sock: Socket}>();

io.on("connection", (socket: Socket) => {
    console.log('Player Connected');

    io.on('disconnect', function () {
        console.log('A Player disconnected');
    });

    socket.on("Chat", function (data: any) {
        let obj = data;

        console.log("recived chat " + obj.Data);
        io.sockets.emit("ChatTo", obj.Data);
    });

    socket.emit("JoinedChannel", { Name: "default channel", Users: [] });
});

//httpServer.listen(7001);
console.log("Start service : 7001");
