"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSocket = exports.io = void 0;
const account_controller_1 = require("../controllers/account.controller");
const chara_socket_1 = require("./chara.socket");
const token_controller_1 = require("../controllers/token.controller");
const admin_socket_1 = require("./admin.socket");
exports.io = null;
exports.runSocket = (http) => {
    exports.io = require("socket.io")(http, { origin: "*:*" });
    exports.io.on("connection", (socket) => {
        socket.on("test", (val) => {
            console.log(val);
        });
        console.log('socket try connection', socket.handshake.query);
        if (socket.handshake.query["token"] != null) {
            token_controller_1.readToken(socket.handshake.query["token"], resToken => {
                console.log('token found for socket co', resToken);
                if (resToken && resToken['id']) {
                    account_controller_1.readAccountByToken(socket.handshake.query["token"], (account) => {
                        if (account && account["world"] && account["chara"]) {
                            socket["account"] = account;
                            socket.join(account["world"]);
                            chara_socket_1.initCharaSocket(socket, account);
                        }
                    });
                }
                else if (resToken && resToken['admin']) {
                    socket["admin"] = resToken;
                    admin_socket_1.initAdminSocket(socket);
                }
            });
        }
    });
};
