"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSocketAccountChara = exports.sendToNear = exports.getSocketsNear = void 0;
const user_socket_1 = require("./../socket/user.socket");
exports.getSocketsNear = (world_name, x, y, rayon, callBack) => {
    user_socket_1.io.in(world_name).clients((err, clients) => {
        let targets = {};
        for (let socketID of clients) {
            let targetSocket = user_socket_1.io["sockets"]["connected"][socketID];
            if (targetSocket["chara"]) {
                let targetPos = {
                    x: targetSocket["chara"]["position"].x,
                    y: targetSocket["chara"]["position"].y,
                };
                if (targetPos.x >= x - rayon &&
                    targetPos.x <= x + rayon &&
                    targetPos.y >= y - rayon &&
                    targetPos.y <= y + rayon) {
                    targets[socketID] = targetSocket;
                }
            }
        }
        callBack(targets);
    });
};
exports.sendToNear = (world_name, position, rayon, emitAttribute, emitValues, callBack) => {
    user_socket_1.io.in(world_name).clients((err, clients) => {
        let targets = {};
        for (let socketID of clients) {
            let targetSocket = user_socket_1.io["sockets"]["connected"][socketID];
            if (targetSocket["account"]) {
                let targetPos = {
                    x: targetSocket["account"]["chara"]["position"].x,
                    y: targetSocket["account"]["chara"]["position"].y,
                };
                if (targetPos.x >= position.x - rayon &&
                    targetPos.x <= position.x + rayon &&
                    targetPos.y >= position.y - rayon &&
                    targetPos.y <= position.y + rayon) {
                    targets[socketID] = targetSocket;
                    targets[socketID].emit(emitAttribute, emitValues);
                }
            }
        }
        callBack(targets);
    });
};
exports.updateSocketAccountChara = (world_name, chara) => {
    user_socket_1.io.in(world_name).clients((err, clients) => {
        let targets = {};
        for (let socketID of clients) {
            let targetSocket = user_socket_1.io["sockets"]["connected"][socketID];
            if (targetSocket["account"] &&
                targetSocket["account"]["chara"] &&
                targetSocket["account"]["chara"]["id"] === chara["id"]) {
                targetSocket["account"]["chara"] = chara;
                break;
            }
        }
    });
};
