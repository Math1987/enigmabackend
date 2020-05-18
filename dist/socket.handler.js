"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketHandler {
    static init(http) {
        SocketHandler.io = require("socket.io")(http);
        SocketHandler.io.on("connection", function (socket) {
        });
    }
}
exports.SocketHandler = SocketHandler;
