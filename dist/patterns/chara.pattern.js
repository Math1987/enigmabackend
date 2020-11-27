"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const model_pattern_1 = require("./model.pattern");
const world_controller_1 = require("../controllers/world.controller");
const player_data_1 = require("../data/player.data");
const socket_controller_1 = require("../controllers/socket.controller");
const patternPlayer_1 = require("../data/patternPlayer");
const historic_data_1 = require("../data/historic.data");
const chara_controller_1 = require("../controllers/chara.controller");
class Player extends model_pattern_1.ModelPattern {
    constructor(key) {
        super();
        this.typeOfPlayer = "player";
        this.typeOfPlayer = key;
        patternPlayer_1.readPlayerPatternData(key, (res) => {
            this.values = res;
        });
    }
    readKey() {
        return this.typeOfPlayer;
    }
    readDatas(world_name, obj, callback) {
        player_data_1.readCharaById(world_name, obj['id'], callback);
    }
    pass(worldDatas, callback) {
        console.log("pass", this.values["key_"]);
        player_data_1.readAllPlayersData(worldDatas['name'], (players) => {
            for (let player of players) {
                player["moveAdder"] = this.values["move_max"] - player["move"];
                player["actionAdder"] = this.values["action_max"] - player["action"];
                player["move"] = this.values["move_max"];
                player["action"] = this.values["action_max"];
            }
            let i = 0;
            let func = () => {
                console.log(players[i]["key_"], this.values["key_"]);
                if (players[i]["key_"] === this.values["key_"]) {
                    console.log(this.values);
                    player_data_1.updateCharaData(worldDatas['name'], players[i], this.values, (updateRes) => {
                        historic_data_1.addInHistoric(worldDatas['name'], players[i]["id"], "pass", "passage de tour", {
                            move: players[i]["moveAdder"],
                            action: players[i]["actionAdder"],
                        }, (historicRes) => { });
                        if (i < players.length - 1) {
                            i++;
                            func();
                        }
                        else {
                            callback("done");
                        }
                    });
                    console.log("update pass");
                }
                else {
                    if (i < players.length - 1) {
                        i++;
                        func();
                    }
                    else {
                        callback("done");
                    }
                }
            };
            func();
        });
    }
    updateValue(world_name, obj, key, value, callback) {
        console.log('I am a pattern ready to update the value', this.readKey());
        player_data_1.updateCharaValueData(world_name, obj['id'], key, value, res => {
            if (res) {
                obj[key] = value;
                callback(obj);
            }
            else {
                callback(null);
            }
        });
    }
    move(world_name, id, x, y, free, callback) {
        player_data_1.readCharaById(world_name, id, (chara) => {
            let moveCost = Math.abs(x) + Math.abs(y);
            let newX = chara["position"]["x"] + x;
            let newY = chara["position"]["y"] + y;
            world_controller_1.getWorld(world_name, (world) => {
                if ((free || chara["move"] >= moveCost) &&
                    newX >= -world.width / 2 &&
                    newX <= world.width / 2 &&
                    newY >= -world.height / 2 &&
                    newY <= world.height / 2) {
                    player_data_1.addCharaValueData(world_name, id, "move", -1, (moveRes) => {
                        if (moveRes) {
                            player_data_1.updateCharaPositionData(world_name, id, newX, newY, (updateRes) => {
                                if (updateRes) {
                                    chara_controller_1.readChara(world_name, id, (newChara) => {
                                        if (newChara) {
                                            chara["position"]["x"] = newX;
                                            chara["position"]["y"] = newY;
                                            callback({ chara: newChara });
                                            socket_controller_1.sendToNear(world_name, {
                                                x: newChara["position"]["x"],
                                                y: newChara["position"]["y"],
                                            }, 8, "move", newChara, (sendRes) => {
                                                socket_controller_1.updateSocketAccountChara(world_name, newChara);
                                            });
                                        }
                                        else {
                                            callback({ err: "no chara updated found" });
                                        }
                                    });
                                }
                                else {
                                    callback({ err: "update position fail" });
                                }
                            });
                        }
                        else {
                            callback({ err: "update move value fail" });
                        }
                    });
                }
                else {
                    callback({ err: "move value insufficient or move out of map" });
                }
            });
        });
    }
    useAction(world_name, chara, number, callback) {
        if (chara['action'] >= number) {
            let actions = Math.max(0, chara['action'] - number);
            player_data_1.updateCharaValueData(world_name, chara['id'], "action", actions, updateRes => {
                if (updateRes) {
                    this.readDatas(world_name, chara, lastAttacker => {
                        callback(lastAttacker);
                    });
                }
                else {
                    callback({
                        status: false,
                        err: "error using action"
                    });
                }
            });
        }
        else {
            callback({
                status: false,
                err: "need more actions"
            });
        }
    }
    canMakeAttack(world_name, attacker, receiver, callBack) {
        if (attacker['action'] > 0) {
            super.canMakeAttack(world_name, attacker, receiver, canRes => {
                if (canRes) {
                    this.useAction(world_name, attacker, 1, useActionRes => {
                        callBack(canRes);
                    });
                }
                else {
                    callBack(true);
                }
            });
        }
        else {
            callBack({
                status: false
            });
        }
    }
    // sendAttack(
    //   world_name: string,
    //   attacker: Object,
    //   receiver: Object,
    //   callBack: Function
    // ){
    //   super.sendAttack(
    //     world_name, 
    //     attacker, 
    //     receiver, 
    //     resSendAttack => {
    //       if ( resSendAttack ){
    //         this.useAction( world_name, attacker, 1, charaAfterUsingAction => {
    //         });
    //       }
    //     }
    //   )
    // }
    // attack2(
    //   world_name: string,
    //   attacker: Object,
    //   receiverPattern: ModelPattern,
    //   receiver: Object,
    //   intensity : Number,
    //   callBack: Function
    // ) {
    //   console.log('attack 2 from chara patern');
    //   let actions = Math.max(0, attacker['action'] -1 );
    //   updateCharaValueData(world_name, attacker['id'], "action", actions, updateRes => {
    //     this.readDatas(world_name, attacker, lastAttacker => {
    //       super.attack2(world_name, lastAttacker, receiverPattern, receiver, intensity, callBack);
    //     })
    //   });
    // }
    // attack(
    //   world_name: string,
    //   userId: string,
    //   targetId: string,
    //   callback: Function
    // ) {
    //   readCharasById(world_name, [userId, targetId], (charas) => {
    //     console.log('chara attack');
    //     if (charas && charas.length == 2) {
    //       let user = null;
    //       let target = null;
    //       for (let chara of charas) {
    //         if (chara["id"] === userId) {
    //           user = chara;
    //         } else if (chara["id"] === targetId) {
    //           target = chara;
    //         }
    //       }
    //       if ( user && target ){
    //         if ( !isOnNeutralZone(user.position.x, user.position.y ) ){
    //           if (
    //             user["action"] &&
    //             user["action"] > 0 &&
    //             target["clan"] !== user["clan"] &&
    //             user.position.x === target.position.x &&
    //             user.position.y === target.position.y
    //           ) {
    //             let patternTarget = getPattern(target["key"]);
    //             console.log('patternTarget found:', patternTarget);
    //             if (patternTarget) {
    //               addCharaValueData(
    //                 world_name,
    //                 user.id,
    //                 "action",
    //                 -1,
    //                 (actionRes) => {
    //                   if (actionRes) {
    //                     patternTarget.counterAttack(
    //                       world_name,
    //                       target,
    //                       this,
    //                       user,
    //                       (counterAttackRes) => {
    //                         if (!counterAttackRes) {
    //                           getCalculation((calculs) => {
    //                             if (calculs) {
    //                               let calculation = calculs["attack"];
    //                               let D100 = Math.floor(Math.random() * 99 + 1);
    //                               let skillAttack = 10;
    //                               let getMaterial = 10;
    //                               let skillDefense = 10;
    //                               let getWater = 10;
    //                               if ("attack" in user) {
    //                                 skillAttack = user["attack"];
    //                               }
    //                               if ("wood" in user) {
    //                                 getMaterial = user["wood"];
    //                               }
    //                               if ("defense" in target) {
    //                                 skillDefense = target["defense"];
    //                               }
    //                               if ("dowser" in target) {
    //                                 getWater = target["dowser"];
    //                               }
    //                               let power = Math.max(
    //                                 1,
    //                                 Math.floor(
    //                                   (D100 *
    //                                     (Math.log10(skillAttack) +
    //                                       Math.log10(
    //                                         (getMaterial +
    //                                           calculation.getMaterial_min) *
    //                                           calculation.getMaterial
    //                                       ))) /
    //                                     ((Math.log10(skillDefense) +
    //                                       Math.log10(
    //                                         (getWater + calculation.getWater_min) *
    //                                           calculation.getWater
    //                                       )) *
    //                                       calculation.factor)
    //                                 )
    //                               );
    //                               patternTarget.getDammage(
    //                                 world_name,
    //                                 target,
    //                                 power,
    //                                 (dammageRes) => {
    //                                   if (dammageRes) {
    //                                     addInHistoric(
    //                                       world_name,
    //                                       userId,
    //                                       "attack",
    //                                       "vous avez attaqué " + target["name"],
    //                                       { D100: D100, power: power },
    //                                       (historicRes) => {
    //                                         console.log("historic res", historicRes);
    //                                         addInHistoric(
    //                                           world_name,
    //                                           targetId,
    //                                           "attack",
    //                                           user["name"] + " vous a attaqué.",
    //                                           { D100: D100, power: power },
    //                                           (historicRes) => {}
    //                                         );
    //                                         readCharas(
    //                                           world_name,
    //                                           [userId, targetId],
    //                                           (charas) => {
    //                                             console.log(charas);
    //                                             if (charas && charas.length == 2) {
    //                                               let newUser = null;
    //                                               let newTarget = null;
    //                                               for (let chara of charas) {
    //                                                 if (chara["id"] === userId) {
    //                                                   newUser = chara;
    //                                                 } else if (
    //                                                   chara["id"] === targetId
    //                                                 ) {
    //                                                   newTarget = chara;
    //                                                 }
    //                                               }
    //                                               if (newUser && newTarget) {
    //                                                 callback({ user: newUser });
    //                                                 sendToNear(
    //                                                   world_name,
    //                                                   user.position,
    //                                                   8,
    //                                                   "attack",
    //                                                   {
    //                                                     user: newUser,
    //                                                     target: newTarget,
    //                                                   },
    //                                                   (sendRes) => {}
    //                                                 );
    //                                               } else {
    //                                                 callback({
    //                                                   err: "compatibility datas pb",
    //                                                 });
    //                                               }
    //                                             } else {
    //                                               callback({
    //                                                 err: "no datas at end",
    //                                               });
    //                                             }
    //                                           }
    //                                         );
    //                                       }
    //                                     );
    //                                     if (dammageRes["die"]) {
    //                                       addInHistoric(
    //                                         world_name,
    //                                         userId,
    //                                         "kill",
    //                                         "vous avez tué " + target["name"],
    //                                         {},
    //                                         (historicRes) => {}
    //                                       );
    //                                       addRankKillData(
    //                                         world_name,
    //                                         userId,
    //                                         targetId,
    //                                         (resKillRank) => {}
    //                                       );
    //                                     }
    //                                   } else {
    //                                     callback({
    //                                       err: "problem target getting damage",
    //                                     });
    //                                   }
    //                                 }
    //                               );
    //                             } else {
    //                               callback({ err: "no calculation found" });
    //                             }
    //                           });
    //                         } else {
    //                           readChara(world_name, userId, (chara) => {
    //                             if (chara) {
    //                               callback({ user: chara });
    //                             } else {
    //                               callback({ err: "no datas at end", user: chara });
    //                             }
    //                           });
    //                         }
    //                       }
    //                     );
    //                   } else {
    //                     callback({ err: "problen updating action" });
    //                   }
    //                 }
    //               );
    //             } else {
    //               callback({ err: "target pattern not found" });
    //             }
    //           } else {
    //             callback({ err: "need to be in same position or no action" });
    //           }
    //         }else{
    //           callback({ err: "cannot attack in neutral zone" });
    //         }
    //       }else{
    //         callback({ err: "need user and target values" });
    //       }
    //     } else {
    //       callback({ err: "user or target not found in db" });
    //     }
    //   });
    // }
    // counterAttack(
    //   world_name,
    //   counterAttacker,
    //   patternAttacker,
    //   attacker,
    //   callback
    // ) {
    //   getCalculation((calculs) => {
    //     let calculation = calculs["attack"];
    //     let proba_skillAttack = 10;
    //     let proba_getFood = 10;
    //     let proba_defense = 10;
    //     let proba_getFaith = 10;
    //     if ("attack" in counterAttacker) {
    //       proba_skillAttack = counterAttacker.attack;
    //     }
    //     if ("getFood" in counterAttacker) {
    //       proba_getFood = counterAttacker.getFood;
    //     }
    //     if ("defense" in attacker) {
    //       proba_defense = attacker.defense;
    //     }
    //     if ("getFaith" in attacker) {
    //       proba_getFaith = attacker.getFaith;
    //     }
    //     let proba = Math.max(
    //       0.05,
    //       Math.min(
    //         9.95,
    //         calculation.proba_min +
    //           (Math.log10(proba_skillAttack) +
    //             Math.log10(
    //               (proba_getFood + calculation.proba_getFood_min) *
    //                 calculation.proba_getFood
    //             ) *
    //               calculation.proba_factor1) -
    //           (Math.log10(proba_defense) +
    //             Math.log10(
    //               (proba_getFaith + calculation.proba_getFaith_min) *
    //                 calculation.proba_getFaith
    //             ) *
    //               calculation.proba_factor2)
    //       )
    //     );
    //     let rand = Math.random();
    //     if (rand <= proba) {
    //       callback(false);
    //     } else {
    //       callback(true);
    //       let skillAttack = 10;
    //       let getMaterial = 10;
    //       let skillDefense = 10;
    //       let getWater = 10;
    //       let D100 = Math.floor(1 + Math.random() * 99);
    //       if ("attack" in counterAttacker) {
    //         skillAttack = counterAttacker["attack"];
    //       }
    //       if ("wood" in counterAttacker) {
    //         getMaterial = counterAttacker["wood"];
    //       }
    //       if ("defense" in attacker) {
    //         skillDefense = attacker["defense"];
    //       }
    //       if ("dowser" in attacker) {
    //         getWater = attacker["dowser"];
    //       }
    //       let power = Math.max(
    //         1,
    //         Math.floor(
    //           ((D100 *
    //             (Math.log10(skillAttack) +
    //               Math.log10(
    //                 (getMaterial + calculation.getMaterial_min) *
    //                   calculation.getMaterial
    //               ))) /
    //             ((Math.log10(skillDefense) +
    //               Math.log10(
    //                 (getWater + calculation.getWater_min) * calculation.getWater
    //               )) *
    //               calculation.factor)) *
    //             0.5
    //         )
    //       );
    //       patternAttacker.getDammage(
    //         world_name,
    //         attacker,
    //         power,
    //         (dammageRes) => {
    //           if (dammageRes["die"]) {
    //             addRankKillData(
    //               world_name,
    //               counterAttacker["id"],
    //               attacker["id"],
    //               (resKillRank) => {}
    //             );
    //           }
    //           addInHistoric(
    //             world_name,
    //             attacker["id"],
    //             "counterAttack",
    //             counterAttacker["name"] + " vous a contre-attaqué.",
    //             { D100: D100, power: power },
    //             (historicRes) => {}
    //           );
    //           addInHistoric(
    //             world_name,
    //             counterAttacker["id"],
    //             "counterAttack",
    //             "vous contre-attaquez " + attacker["name"],
    //             { D100: D100, power: power },
    //             (historicRes) => {
    //               readCharas(
    //                 world_name,
    //                 [counterAttacker.id, attacker.id],
    //                 (charas) => {
    //                   if (charas && charas.length == 2) {
    //                     let newCounterAttacker = null;
    //                     let newAttacker = null;
    //                     for (let chara of charas) {
    //                       if (chara["id"] === counterAttacker.id) {
    //                         newCounterAttacker = chara;
    //                       } else if (chara["id"] === attacker.id) {
    //                         newAttacker = chara;
    //                       }
    //                     }
    //                     if (newCounterAttacker && newAttacker) {
    //                       sendToNear(
    //                         world_name,
    //                         newCounterAttacker["position"],
    //                         8,
    //                         "counterAttack",
    //                         {
    //                           counterAttacker: newCounterAttacker,
    //                           attacker: newAttacker,
    //                         },
    //                         (sendRes) => {}
    //                       );
    //                     }
    //                   }
    //                 }
    //               );
    //             }
    //           );
    //         }
    //       );
    //     }
    //   });
    // }
    getDammage(world_name, user, value, callback) {
        player_data_1.addCharaValueData(world_name, user.id, "life", -value, (addValueRes) => {
            player_data_1.readCharaValue(world_name, user.id, "life", (lifeRes) => {
                if (lifeRes <= 0) {
                    callback({ die: true });
                    this.die(world_name, user, (dieRes) => { });
                }
                else {
                    user["life"] = lifeRes;
                    callback({});
                }
            });
        });
    }
    die(world_name, user, callback) {
        this.move(world_name, user.id, -user["position"]["x"], -user["position"]["y"], true, (updatePosition) => {
            if (this.values["life_max"]) {
                setTimeout(() => {
                    player_data_1.addCharaValueData(world_name, user.id, "life", this.values["life_max"], (addLifeRes) => {
                        historic_data_1.addInHistoric(world_name, user["id"], "death", "vous êtes mort.", {}, (historicRes) => { });
                        chara_controller_1.readChara(world_name, user["id"], (newChara) => {
                            callback(true);
                            socket_controller_1.sendToSocketId(world_name, user["id"], "die", { chara: newChara }, (sendSocketRes) => { });
                        });
                    });
                }, 1000);
            }
            else {
                callback(true);
            }
        });
    }
}
exports.Player = Player;
