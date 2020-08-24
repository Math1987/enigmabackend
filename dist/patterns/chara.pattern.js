"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const model_pattern_1 = require("./model.pattern");
const world_controller_1 = require("../controllers/world.controller");
const player_data_1 = require("../data/player.data");
const socket_controller_1 = require("../controllers/socket.controller");
const main_patterns_1 = require("./main.patterns");
const patternPlayer_1 = require("../data/patternPlayer");
const calculation_controller_1 = require("../controllers/calculation.controller");
class Player extends model_pattern_1.ModelPattern {
    constructor() {
        super();
        patternPlayer_1.readPlayerPatternData("humanmasculin", (res) => {
            this.values = res;
        });
    }
    readKey() {
        return "player";
    }
    move(world_name, id, x, y, callback) {
        player_data_1.readCharaById(world_name, id, (chara) => {
            let moveCost = Math.abs(x) + Math.abs(y);
            let newX = chara["position"]["x"] + x;
            let newY = chara["position"]["y"] + y;
            world_controller_1.getWorld(world_name, (world) => {
                if (chara["move"] >= moveCost &&
                    newX >= -world.width / 2 &&
                    newX <= world.width / 2 &&
                    newY >= -world.height / 2 &&
                    newY <= world.height / 2) {
                    player_data_1.updateCharaPositionData(world_name, id, newX, newY, (updateRes) => {
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
                    });
                }
                else {
                    callback(false);
                }
            });
        });
    }
    attack(world_name, userId, targetId, callback) {
        player_data_1.readCharasById(world_name, [userId, targetId], charas => {
            if (charas && charas.length == 2) {
                let user = null;
                let target = null;
                for (let chara of charas) {
                    if (chara['id'] === userId) {
                        user = chara;
                    }
                    else if (chara['id'] === targetId) {
                        target = chara;
                    }
                }
                if (user &&
                    user['action'] &&
                    user['action'] > 0 &&
                    target &&
                    user.position.x === target.position.x &&
                    user.position.y === target.position.y) {
                    let patternTarget = main_patterns_1.getPattern(target["key"]);
                    if (patternTarget) {
                        patternTarget.counterAttack(world_name, user, target, counterAttackRes => {
                            if (!counterAttackRes) {
                                calculation_controller_1.getCalculation((calculs) => {
                                    let D100 = Math.floor(Math.random() * 99 + 1);
                                    let calculation = calculs["attack"];
                                    let skillAttack = 10;
                                    let getMaterial = 10;
                                    let skillDefense = 10;
                                    let getWater = 10;
                                    if ("attack" in user) {
                                        skillAttack = user["attack"];
                                    }
                                    if ("wood" in user) {
                                        getMaterial = user["wood"];
                                    }
                                    if ("defense" in target) {
                                        skillDefense = target["defense"];
                                    }
                                    if ("dowser" in target) {
                                        getWater = target["dowser"];
                                    }
                                    let power = Math.floor((D100 *
                                        (Math.log10(skillAttack) +
                                            Math.log10((getMaterial + calculation.getMaterial_min) *
                                                calculation.getMaterial))) /
                                        ((Math.log10(skillDefense) +
                                            Math.log10((getWater + calculation.getWater_min) * calculation.getWater)) *
                                            calculation.factor));
                                    patternTarget.getDammage(world_name, target, power, dammageRes => {
                                        player_data_1.addCharaValueData(world_name, user.id, 'action', -1, actionRes => {
                                            player_data_1.readCharasById(world_name, [userId, targetId], charas => {
                                                if (charas && charas.length == 2) {
                                                    let newUser = null;
                                                    let newTarget = null;
                                                    for (let chara of charas) {
                                                        if (chara['id'] === userId) {
                                                            newUser = chara;
                                                        }
                                                        else if (chara['id'] === targetId) {
                                                            newTarget = chara;
                                                        }
                                                    }
                                                    if (newUser && newTarget) {
                                                        socket_controller_1.sendToNear(world_name, user.position, 8, 'attack', { user: newUser, target: newTarget }, sendRes => { });
                                                    }
                                                    callback(newUser);
                                                }
                                                else {
                                                    callback('done');
                                                }
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                    else {
                        callback('need to be in same position or no action');
                    }
                }
                else {
                    callback('user or target not found in db');
                }
            }
        });
    }
    counterAttack(world_name, user, target, callback) {
        callback(false);
        // getCalculation((calculs) => {
        //   let calculation = calculs["attack"];
        //   let proba_skillAttack = 10;
        //   let proba_getFood = 10;
        //   let proba_defense = 10;
        //   let proba_getFaith = 10;
        //   if ("attack" in user) {
        //     proba_skillAttack = user.attack;
        //   }
        //   if ("getFood" in user) {
        //     proba_getFood = user.getFood;
        //   }
        //   if ("defense" in target) {
        //     proba_defense = target.defense;
        //   }
        //   if ("getFaith" in target) {
        //     proba_getFaith = target.getFaith;
        //   }
        //   let proba = Math.max(
        //     0.05,
        //     Math.min(
        //       9.95,
        //       calculation.proba_min +
        //         (Math.log10(proba_skillAttack) +
        //           Math.log10(
        //             (proba_getFood + calculation.proba_getFood_min) *
        //               calculation.proba_getFood
        //           ) *
        //             calculation.proba_factor1) -
        //         (Math.log10(proba_defense) +
        //           Math.log10(
        //             (proba_getFaith + calculation.proba_getFaith_min) *
        //               calculation.proba_getFaith
        //           ) *
        //             calculation.proba_factor2)
        //     )
        //   );
        //   if (Math.random() <= proba) {
        //     console.log('no counter');
        //     callback(false) ;
        //   } else {
        //     console.log('counter');
        //     callback(true) ;
        //   }
        // });
    }
    getDammage(world_name, user, value, callback) {
        player_data_1.addCharaValueData(world_name, user.id, 'life', -value, addValueRes => {
            player_data_1.readCharaValue(world_name, user.id, 'life', lifeRes => {
                if (lifeRes <= 0) {
                    this.die(world_name, user, dieRes => {
                        callback(dieRes);
                    });
                }
                else {
                    user['life'] = lifeRes;
                    callback(user);
                }
            });
        });
    }
    die(world_name, user, callback) {
        this.move(world_name, user.id, -user['position']['x'], -user['position']['y'], updatePosition => {
            if (this.values['life_max']) {
                player_data_1.addCharaValueData(world_name, user.id, 'life', this.values['life_max'], callback);
            }
        });
    }
}
exports.Player = Player;
