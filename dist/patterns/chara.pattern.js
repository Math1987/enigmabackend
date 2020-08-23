"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const model_pattern_1 = require("./model.pattern");
const world_controller_1 = require("../controllers/world.controller");
const player_data_1 = require("../data/player.data");
const socket_controller_1 = require("../controllers/socket.controller");
class Player extends model_pattern_1.ModelPattern {
    constructor() {
        super();
    }
    readKey() {
        return "player";
    }
    move(world_name, id, x, y, callback) {
        player_data_1.readCharaById(world_name, id, (chara) => {
            console.log(chara);
            let moveCost = Math.abs(x) + Math.abs(y);
            let newX = chara["position"]["x"] + x;
            let newY = chara["position"]["y"] + y;
            world_controller_1.getWorld(world_name, (world) => {
                if (chara["move"] >= moveCost &&
                    newX >= -world.width / 2 &&
                    newX <= world.width / 2 &&
                    newY >= -world.height / 2 &&
                    newY <= world.height / 2) {
                    player_data_1.updateCharaPosition(world_name, id, newX, newY, (updateRes) => {
                        if (updateRes) {
                            chara["position"]["x"] = newX;
                            chara["position"]["y"] = newY;
                            socket_controller_1.sendToNear(world_name, { x: chara["position"]["x"], y: chara["position"]["y"] }, 8, "move", chara, (moveRes) => {
                                socket_controller_1.updateSocketAccountChara(world_name, chara);
                                callback(true);
                            });
                        }
                        else {
                            callback(null);
                        }
                        console.log(updateRes);
                    });
                }
                else {
                    callback(false);
                }
            });
        });
    }
    create(world_name, id, callback) { }
}
exports.Player = Player;