"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSocket = exports.io = void 0;
const main_patterns_1 = require("./../patterns/main.patterns");
const account_controller_1 = require("../controllers/account.controller");
const world_controller_1 = require("../controllers/world.controller");
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
                    const id = account["id"];
                    const world_name = account["world"];
                    const key = account["chara"]["key_"];
                    console.log(id, key);
                    socket.on("getOnPositions", (positions, callback) => {
                        world_controller_1.getOnPositions(account["world"], positions, callback);
                    });
                    socket.on("move", (x, y, callback) => {
                        console.log(id);
                        let pattern = main_patterns_1.MainPatterns.getPattern(key);
                        if (pattern) {
                            pattern.move(world_name, id, x, y, callback);
                        }
                    });
                }
            });
        }
    });
};
