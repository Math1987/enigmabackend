"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSkill = exports.moveChara = exports.createChara = exports.getChara = void 0;
const chara_controller_1 = require("./chara.controller");
const player_data_1 = require("./../data/player.data");
const mobile_data_1 = require("./../data/mobile.data");
const values_data_1 = require("./../data/values.data");
const user_socket_1 = require("./../socket/user.socket");
exports.getChara = (world_name, id, callBack) => {
    let chara = {};
    player_data_1.PlayerData.readCharaAsObj(world_name, id, (player) => {
        if (player) {
            values_data_1.ValuesData.readAsObject(world_name, id, (values) => {
                if (values) {
                    mobile_data_1.MobilesData.readById(world_name, id, (mobile) => {
                        Object.assign(chara, player, values, mobile);
                        console.log(chara);
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
    console.log(datas);
    player_data_1.PlayerData.createCharacter("world1", datas, function (chara) {
        if (chara) {
            mobile_data_1.MobilesData.createMobile("world1", chara.id, `${datas['key_']}`, `${datas['name']}`, 0, 0, 100, (resMobile) => {
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
exports.addSkill = ((req, res) => {
    const user = req["user"];
    const values = req["chara"];
    if (user && values && req.body['adder'] && req.body['key_']) {
        console.log('value add');
        if (values[req.body['key_']] &&
            values["addskills"] &&
            values["addskills"] &&
            values["addskills"] >= req.body['adder']) {
            console.log('value add2');
            let skillVal = values["addskills"] - req.body['adder'];
            let valNewVal = values[req.body['key_']] + req.body['adder'];
            values_data_1.ValuesData.updateValues(user.id, user.world, [
                { key_: "addskills", value: skillVal },
                { key_: req.body['key_'], value: valNewVal },
            ]).then((addValueRes) => {
                console.log(addValueRes);
                let obj = { addskills: skillVal };
                obj[req.body['key_']] = valNewVal;
                res.status(200).send(obj);
            });
        }
    }
    else {
        res.status(204).send("not found");
    }
}
// routerChara.post("/addSkill", function (req: Request, res: Response) {
//   const tokenDatas = req.headers["userTokenValues"];
//   const values = req.headers["characterValuesAsObj"];
//   if (tokenDatas && values && req.body.adder && req.body.key_) {
//     if (
//       values[req.body.key_] &&
//       values["addskills"] &&
//       values["addskills"].value &&
//       values["addskills"].value >= req.body.adder
//     ) {
//       let skillVal = values["addskills"].value - req.body.adder;
//       let valNewVal = values[req.body.key_].value + req.body.adder;
//       ValuesData.updateValues(tokenDatas.id, tokenDatas.world, [
//         { key_: "addskills", value: skillVal },
//         { key_: req.body.key_, value: valNewVal },
//       ]).then((addValueRes) => {
//         let obj = { addskills: skillVal };
//         obj[req.body.key_] = valNewVal;
//         res.status(200).send(obj);
//       });
//     }
//   } else {
//     res.status(204).send("not found");
//   }
// });
);
// routerChara.post("/addSkill", function (req: Request, res: Response) {
//   const tokenDatas = req.headers["userTokenValues"];
//   const values = req.headers["characterValuesAsObj"];
//   if (tokenDatas && values && req.body.adder && req.body.key_) {
//     if (
//       values[req.body.key_] &&
//       values["addskills"] &&
//       values["addskills"].value &&
//       values["addskills"].value >= req.body.adder
//     ) {
//       let skillVal = values["addskills"].value - req.body.adder;
//       let valNewVal = values[req.body.key_].value + req.body.adder;
//       ValuesData.updateValues(tokenDatas.id, tokenDatas.world, [
//         { key_: "addskills", value: skillVal },
//         { key_: req.body.key_, value: valNewVal },
//       ]).then((addValueRes) => {
//         let obj = { addskills: skillVal };
//         obj[req.body.key_] = valNewVal;
//         res.status(200).send(obj);
//       });
//     }
//   } else {
//     res.status(204).send("not found");
//   }
// });
