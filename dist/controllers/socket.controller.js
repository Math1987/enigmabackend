"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSocketAccountChara = exports.sendToSocketId = exports.sendToNear = exports.getSocketsNear = void 0;
const user_socket_1 = require("./../socket/user.socket");
const chara_controller_1 = require("./chara.controller");
const getSocketsNear = (world_name, x, y, rayon, callBack) => {
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
exports.getSocketsNear = getSocketsNear;
const sendToNear = (world_name, position, rayon, emitAttribute, emitValues, callBack) => {
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
                    console.log("sendnear", emitAttribute, emitValues);
                    targets[socketID] = targetSocket;
                    targets[socketID].emit(emitAttribute, emitValues);
                }
            }
        }
        callBack(targets);
    });
};
exports.sendToNear = sendToNear;
const sendToSocketId = (world_name, id, emitAttribute, emiteObj, callback) => {
    user_socket_1.io.in(world_name).clients((err, clients) => {
        let targets = {};
        for (let socketID of clients) {
            let targetSocket = user_socket_1.io["sockets"]["connected"][socketID];
            if (targetSocket["account"] &&
                targetSocket["account"]["chara"] &&
                targetSocket["account"]["chara"]["id"] === id) {
                targets[socketID] = targetSocket;
                targets[socketID].emit(emitAttribute, emiteObj);
                callback(targets);
                break;
            }
        }
    });
};
exports.sendToSocketId = sendToSocketId;
const updateSocketAccountChara = (world_name, chara) => {
    user_socket_1.io.in(world_name).clients((err, clients) => {
        let targets = {};
        for (let socketID of clients) {
            let targetSocket = user_socket_1.io["sockets"]["connected"][socketID];
            if (targetSocket["account"] &&
                targetSocket["account"]["chara"] &&
                targetSocket["account"]["chara"]["id"] === chara["id"]) {
                chara_controller_1.readChara(world_name, chara["id"], (newChara) => {
                    if (newChara) {
                        targetSocket["account"]["chara"] = newChara;
                    }
                });
                break;
            }
        }
    });
};
exports.updateSocketAccountChara = updateSocketAccountChara;
