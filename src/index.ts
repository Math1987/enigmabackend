import express, {NextFunction, Request, Response} from 'express';
import {SocketHandler} from "./socket";
const PORT = 7070 ;

const app = express();
app.set("port", PORT);
const http = require("http").Server(app);

SocketHandler.init(http);


app.get('/', function (req: Request, res : Response) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send('typescript base with express and socket.io');
});

app.use(function (req: Request, res : Response, next : NextFunction) {

    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});


const server = http.listen(PORT, function () {
    console.log("listening on : http://localhost:" + PORT);
});


