"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.move = exports.moveChara = exports.createChara = exports.getChara = void 0;
const chara_controller_1 = require("./chara.controller");
const player_data_1 = require("./../data/player.data");
const mobile_data_1 = require("./../data/mobile.data");
const values_data_1 = require("./../data/values.data");
const user_socket_1 = require("./../socket/user.socket");
exports.getChara = (world_name, id, callBack) => {
    let chara = {};
    values_data_1.ValuesData.readAsObject(world_name, id, (values) => {
        if (values) {
            chara = values;
            mobile_data_1.MobilesData.readById(world_name, id, (mobile) => {
                for (let key in mobile) {
                    chara[key] = mobile[key];
                }
                callBack(chara);
            });
        }
        else {
            callBack(null);
        }
    });
};
exports.createChara = (world_name, datas, callBack) => {
    player_data_1.PlayerData.createCharacter("world1", datas, function (chara) {
        if (chara) {
            mobile_data_1.MobilesData.createMobile("world1", chara.id, "elf", 0, 0, 100, (resMobile) => {
                chara = datas;
                chara["world"] = world_name;
                console.log(chara);
                exports.getChara(world_name, chara['id'], (charaRes) => {
                    if (charaRes) {
                        console.log(charaRes);
                        exports.moveChara(world_name, charaRes, 0, 0, (moveRes) => {
                        });
                    }
                });
                callBack(chara);
            });
        }
        else {
            callBack(null);
        }
    });
};
exports.moveChara = (world_name, chara, x, y, callBack) => {
    if (world_name && chara) {
        let position = chara['position'];
        mobile_data_1.MobilesData.updatePosition(world_name, chara['id'], position.x + x, position.y + y, (resMove) => {
            if (resMove) {
                let newPosition = { x: position.x + x, y: position.y + y };
                chara['position']['x'] = newPosition.x;
                chara['position']['y'] = newPosition.y;
                user_socket_1.io.in(world_name).clients((err, clients) => {
                    for (let socketID of clients) {
                        let targetSocket = user_socket_1.io['sockets']['connected'][socketID];
                        if (targetSocket['chara']) {
                            console.log(targetSocket['chara']);
                            let targetPos = { x: targetSocket['chara']['position'].x, y: targetSocket['chara']['position'].y };
                            if (targetPos.x >= newPosition.x - 5 && targetPos.x <= newPosition.x + 5
                                && targetPos.y >= newPosition.y - 5 && targetPos.y <= newPosition.y + 5) {
                                let sender = {
                                    id: chara['id'],
                                    key: chara['key_'],
                                    life: chara['life'],
                                    life_max: chara['life_max'],
                                    x: chara['position']['x'],
                                    y: chara['position']['y'],
                                    z: 1
                                };
                                targetSocket.emit('move', sender, x, y);
                                callBack(newPosition);
                            }
                        }
                    }
                });
            }
        });
    }
    else {
        callBack(null);
    }
};
exports.move = (id, x, y) => { };
