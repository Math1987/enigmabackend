import * as SocketIO from "socket.io";
import {HttpBase} from "http";
import {Socket} from "socket.io";

export class SocketHandler{

    static io : WebSocket ;

    static init(http : HttpBase){

        SocketHandler.io = require("socket.io")(http);

        SocketHandler.io.on("connection", function (socket: Socket) {

        });

    }



}
