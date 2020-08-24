"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSocket = exports.io = void 0;
const account_controller_1 = require("../controllers/account.controller");
const chara_socket_1 = require("./chara.socket");
exports.io = null;
exports.runSocket = (http) => {
    exports.io = require("socket.io")(http, { origin: "*:*" });
    exports.io.on("connection", (socket) => {
        socket.on("test", (val) => {
            console.log(val);
        });
        if (socket.handshake.query["token"] != null) {
            account_controller_1.readAccountByToken(socket.handshake.query["token"], (account) => {
                if (account && account["world"] && account["chara"]) {
                    socket["account"] = account;
                    socket.join(account["world"]);
                    chara_socket_1.initCharaSocket(socket, account);
                }
            });
        }
    });
};
