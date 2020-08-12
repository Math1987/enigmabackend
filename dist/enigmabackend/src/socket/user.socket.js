"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocket = exports.io = void 0;
const chara_controller_1 = require("./../controllers/chara.controller");
const security_1 = require("./../services/security");
exports.io = null;
class UserSocket {
    constructor() { }
    init(http) {
        exports.io = require("socket.io")(http);
        exports.io.on("connection", (socket) => {
            if (socket.handshake.query["token"] != null) {
                security_1.Security.checkToken(socket.handshake.query["token"], (user) => {
                    if (user && user["world"]) {
                        socket["user"] = user;
                        socket["chara"] = {};
                        socket.join(user["world"]);
                        chara_controller_1.getChara(user["world"], user["id"], (chara) => {
                            socket["chara"] = chara;
                            socket.on("move", (x, y) => {
                                chara_controller_1.moveChara(user["world"], socket["chara"], x, y, (moveRes) => { });
                            });
                        });
                    }
                    socket.on("disconnect", () => { });
                });
            }
        });
    }
}
exports.UserSocket = UserSocket;
