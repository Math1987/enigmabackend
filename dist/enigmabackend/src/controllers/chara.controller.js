"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAttack = exports.popsChara = exports.addSkill = exports.moveChara = exports.createChara = exports.getChara = void 0;
const mobile_controler_1 = require("./mobile.controler");
const valuesPatterns_data_1 = require("./../data/valuesPatterns.data");
const player_data_1 = require("./../data/player.data");
const mobile_data_1 = require("./../data/mobile.data");
const values_data_1 = require("./../data/values.data");
const user_socket_1 = require("./../socket/user.socket");
const attack_controller_1 = require("./attack.controller");
exports.getChara = (world_name, id, callBack) => {
    let chara = {};
    player_data_1.PlayerData.readCharaAsObj(world_name, id, (player) => {
        if (player) {
            values_data_1.ValuesData.readAsObject(world_name, id, (values) => {
                if (values) {
                    mobile_data_1.MobilesData.readById(world_name, id, (mobile) => {
                        Object.assign(chara, player, values, mobile);
                        callBack(chara);
                    });
                }
                else {
                    callBack(null);
                }
            });
        }
        else {
            callBack(null);
        }
    });
};
exports.createChara = (world_name, datas, callBack) => {
    if (datas['sexe'] && datas['race']) {
        datas['key_'] = `${datas['race']}${datas['sexe']}`;
    }
    player_data_1.PlayerData.createCharacter("world1", datas, function (chara) {
        if (chara) {
            mobile_data_1.MobilesData.createMobile("world1", chara.id, `${datas['key_']}`, `${datas['name']}`, 0, 0, 100, (resMobile) => {
                chara = datas;
                chara["world"] = world_name;
                exports.getChara(world_name, chara['id'], (charaRes) => {
                    if (charaRes) {
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
            else {
                callBack(null);
            }
        });
    }
};
exports.addSkill = (req, res) => {
    const user = req["user"];
    const values = req["chara"];
    if (user && values && req.body['adder'] && req.body['key_']) {
        if (values[req.body['key_']] &&
            values["addskills"] &&
            values["addskills"] &&
            values["addskills"] >= req.body['adder']) {
            let skillVal = values["addskills"] - req.body['adder'];
            let valNewVal = values[req.body['key_']] + req.body['adder'];
            values_data_1.ValuesData.updateValues(user.id, user.world, [
                { key_: "addskills", value: skillVal },
                { key_: req.body['key_'], value: valNewVal },
            ]).then((addValueRes) => {
                let obj = { addskills: skillVal };
                obj[req.body['key_']] = valNewVal;
                res.status(200).send(obj);
            });
        }
    }
    else {
        res.status(204).send("not found");
    }
};
exports.popsChara = (world_name, chara, callBack) => {
    valuesPatterns_data_1.ValuesPatternsData.read('player', (playerPattern) => {
    });
};
exports.httpAttack = (req, res) => {
    const user = req["user"];
    const chara = req["chara"];
    const userFinal = {};
    Object.assign(userFinal, user, chara);
    if (req.body && req.body["target"]) {
        mobile_controler_1.getMobile(user["world"], req.body["target"]["id"], (target) => {
            attack_controller_1.attack(user['world'], userFinal, target, (resAttack) => {
                if (resAttack) {
                    res.status(200).send(resAttack);
                }
            });
        });
    }
    else {
        res.status(204).send("not found");
    }
};
