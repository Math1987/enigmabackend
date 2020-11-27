"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCharaSocket = void 0;
const world_controller_1 = require("../controllers/world.controller");
const main_patterns_1 = require("../patterns/main.patterns");
const player_data_1 = require("../data/player.data");
const initCharaSocket = (socket, account) => {
    const id = account["id"];
    const world_name = account["world"];
    const key = account["chara"]["key_"];
    const pattern = main_patterns_1.getPattern(key);
    if (pattern) {
        socket.on("getOnPositions", (positions, callback) => {
            world_controller_1.getOnPositions(account["world"], positions, callback);
        });
        socket.on("move", (x, y, callback) => {
            pattern.move(world_name, id, x, y, false, callback);
        });
        socket.on("attack", (target, callback) => {
            console.log("attack!", target);
            player_data_1.readCharaById(world_name, account['chara']['id'], chara => {
                pattern.sendAttack(world_name, chara, target, callback);
            });
        });
    }
};
exports.initCharaSocket = initCharaSocket;
