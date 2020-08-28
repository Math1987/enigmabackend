import { ModelPattern } from "./model.pattern";
import { getWorld } from "../controllers/world.controller";
import {
  readCharaById,
  updateCharaPositionData,
  addCharaValueData,
  readCharaValue,
  readCharasById,
  readAllPlayersData,
  updateCharaData,
} from "../data/player.data";
import {
  sendToNear,
  updateSocketAccountChara,
  sendToSocketId,
} from "../controllers/socket.controller";
import { getPattern } from "./main.patterns";
import { readPlayerPatternData } from "../data/patternPlayer";
import { getCalculation } from "../controllers/calculation.controller";
import { addRankKillData } from "../data/rank_kill.data";
import { addInHistoric } from "../data/historic.data";
import { readChara, readCharas } from "../controllers/chara.controller";

export class Player extends ModelPattern {
  constructor(key: string) {
    super();
    readPlayerPatternData(key, (res) => {
      this.values = res;
    });
  }
  readKey() {
    return "player";
  }
  pass(world_name, callback) {
    console.log("pass", this.values["key_"]);
    readAllPlayersData(world_name, (players) => {
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
          updateCharaData(world_name, players[i], this.values, (updateRes) => {
            addInHistoric(
              world_name,
              players[i]["id"],
              "pass",
              "passage de tour",
              {
                move: players[i]["moveAdder"],
                action: players[i]["actionAdder"],
              },
              (historicRes) => {}
            );
            if (i < players.length - 1) {
              i++;
              func();
            } else {
              callback("done");
            }
          });
          console.log("update pass");
        } else {
          if (i < players.length - 1) {
            i++;
            func();
          } else {
            callback("done");
          }
        }
      };
      func();
    });
  }
  move(
    world_name: string,
    id: number,
    x: number,
    y: number,
    free: boolean,
    callback: Function
  ) {
    readCharaById(world_name, id, (chara) => {
      let moveCost = Math.abs(x) + Math.abs(y);
      let newX = chara["position"]["x"] + x;
      let newY = chara["position"]["y"] + y;
      getWorld(world_name, (world) => {
        if (
          (free || chara["move"] >= moveCost) &&
          newX >= -world.width / 2 &&
          newX <= world.width / 2 &&
          newY >= -world.height / 2 &&
          newY <= world.height / 2
        ) {
          addCharaValueData(world_name, id, "move", -1, (moveRes) => {
            if (moveRes) {
              updateCharaPositionData(
                world_name,
                id,
                newX,
                newY,
                (updateRes) => {
                  if (updateRes) {
                    readChara(world_name, id, (newChara) => {
                      if (newChara) {
                        chara["position"]["x"] = newX;
                        chara["position"]["y"] = newY;
                        callback({ chara: newChara });
                        sendToNear(
                          world_name,
                          {
                            x: newChara["position"]["x"],
                            y: newChara["position"]["y"],
                          },
                          8,
                          "move",
                          newChara,
                          (sendRes) => {
                            updateSocketAccountChara(world_name, newChara);
                          }
                        );
                      } else {
                        callback({ err: "no chara updated found" });
                      }
                    });
                  } else {
                    callback({ err: "update position fail" });
                  }
                }
              );
            } else {
              callback({ err: "update move value fail" });
            }
          });
        } else {
          callback({ err: "move value insufficient or move out of map" });
        }
      });
    });
  }
  attack(
    world_name: string,
    userId: string,
    targetId: string,
    callback: Function
  ) {
    readCharasById(world_name, [userId, targetId], (charas) => {
      if (charas && charas.length == 2) {
        let user = null;
        let target = null;
        for (let chara of charas) {
          if (chara["id"] === userId) {
            user = chara;
          } else if (chara["id"] === targetId) {
            target = chara;
          }
        }
        if (
          user &&
          user["action"] &&
          user["action"] > 0 &&
          target &&
          user.position.x === target.position.x &&
          user.position.y === target.position.y
        ) {
          let patternTarget = getPattern(target["key"]);
          if (patternTarget) {
            addCharaValueData(
              world_name,
              user.id,
              "action",
              -1,
              (actionRes) => {
                if (actionRes) {
                  patternTarget.counterAttack(
                    world_name,
                    target,
                    this,
                    user,
                    (counterAttackRes) => {
                      if (!counterAttackRes) {
                        getCalculation((calculs) => {
                          if (calculs) {
                            let calculation = calculs["attack"];
                            let D100 = Math.floor(Math.random() * 99 + 1);
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
                            let power = Math.max(
                              1,
                              Math.floor(
                                (D100 *
                                  (Math.log10(skillAttack) +
                                    Math.log10(
                                      (getMaterial +
                                        calculation.getMaterial_min) *
                                        calculation.getMaterial
                                    ))) /
                                  ((Math.log10(skillDefense) +
                                    Math.log10(
                                      (getWater + calculation.getWater_min) *
                                        calculation.getWater
                                    )) *
                                    calculation.factor)
                              )
                            );
                            patternTarget.getDammage(
                              world_name,
                              target,
                              power,
                              (dammageRes) => {
                                if (dammageRes) {
                                  addInHistoric(
                                    world_name,
                                    userId,
                                    "attack",
                                    "attaque contre " + target["name"],
                                    { D100: D100, power: power },
                                    (historicRes) => {
                                      console.log("historic res", historicRes);
                                      addInHistoric(
                                        world_name,
                                        targetId,
                                        "attack",
                                        user["name"] + " vous a attaqué.",
                                        { D100: D100, power: power },
                                        (historicRes) => {}
                                      );

                                      readCharas(
                                        world_name,
                                        [userId, targetId],
                                        (charas) => {
                                          console.log(charas);
                                          if (charas && charas.length == 2) {
                                            let newUser = null;
                                            let newTarget = null;
                                            for (let chara of charas) {
                                              if (chara["id"] === userId) {
                                                newUser = chara;
                                              } else if (
                                                chara["id"] === targetId
                                              ) {
                                                newTarget = chara;
                                              }
                                            }
                                            if (newUser && newTarget) {
                                              callback({ user: newUser });
                                              sendToNear(
                                                world_name,
                                                user.position,
                                                8,
                                                "attack",
                                                {
                                                  user: newUser,
                                                  target: newTarget,
                                                },
                                                (sendRes) => {}
                                              );
                                            } else {
                                              callback({
                                                err: "compatibility datas pb",
                                              });
                                            }
                                          } else {
                                            callback({
                                              err: "no datas at end",
                                            });
                                          }
                                        }
                                      );
                                    }
                                  );

                                  if (dammageRes["die"]) {
                                    addRankKillData(
                                      world_name,
                                      userId,
                                      targetId,
                                      (resKillRank) => {}
                                    );
                                  }
                                } else {
                                  callback({
                                    err: "problem target getting damage",
                                  });
                                }
                              }
                            );
                          } else {
                            callback({ err: "no calculation found" });
                          }
                        });
                      } else {
                        readChara(world_name, userId, (chara) => {
                          if (chara) {
                            callback({ user: chara });
                          } else {
                            callback({ err: "no datas at end", user: chara });
                          }
                        });
                      }
                    }
                  );
                } else {
                  callback({ err: "problen updating action" });
                }
              }
            );
          } else {
            callback({ err: "target pattern not found" });
          }
        } else {
          callback({ err: "need to be in same position or no action" });
        }
      } else {
        callback({ err: "user or target not found in db" });
      }
    });
  }
  counterAttack(
    world_name,
    counterAttacker,
    patternAttacker,
    attacker,
    callback
  ) {
    getCalculation((calculs) => {
      let calculation = calculs["attack"];
      let proba_skillAttack = 10;
      let proba_getFood = 10;
      let proba_defense = 10;
      let proba_getFaith = 10;

      if ("attack" in counterAttacker) {
        proba_skillAttack = counterAttacker.attack;
      }
      if ("getFood" in counterAttacker) {
        proba_getFood = counterAttacker.getFood;
      }
      if ("defense" in attacker) {
        proba_defense = attacker.defense;
      }
      if ("getFaith" in attacker) {
        proba_getFaith = attacker.getFaith;
      }

      let proba = Math.max(
        0.05,
        Math.min(
          9.95,
          calculation.proba_min +
            (Math.log10(proba_skillAttack) +
              Math.log10(
                (proba_getFood + calculation.proba_getFood_min) *
                  calculation.proba_getFood
              ) *
                calculation.proba_factor1) -
            (Math.log10(proba_defense) +
              Math.log10(
                (proba_getFaith + calculation.proba_getFaith_min) *
                  calculation.proba_getFaith
              ) *
                calculation.proba_factor2)
        )
      );

      let rand = Math.random();
      if (rand <= proba) {
        callback(false);
      } else {
        callback(true);
        let skillAttack = 10;
        let getMaterial = 10;
        let skillDefense = 10;
        let getWater = 10;
        let D100 = Math.floor(1 + Math.random() * 99);
        if ("attack" in counterAttacker) {
          skillAttack = counterAttacker["attack"];
        }
        if ("wood" in counterAttacker) {
          getMaterial = counterAttacker["wood"];
        }
        if ("defense" in attacker) {
          skillDefense = attacker["defense"];
        }
        if ("dowser" in attacker) {
          getWater = attacker["dowser"];
        }
        let power = Math.max(
          1,
          Math.floor(
            ((D100 *
              (Math.log10(skillAttack) +
                Math.log10(
                  (getMaterial + calculation.getMaterial_min) *
                    calculation.getMaterial
                ))) /
              ((Math.log10(skillDefense) +
                Math.log10(
                  (getWater + calculation.getWater_min) * calculation.getWater
                )) *
                calculation.factor)) *
              0.5
          )
        );
        patternAttacker.getDammage(
          world_name,
          attacker,
          power,
          (dammageRes) => {
            if (dammageRes["die"]) {
              addRankKillData(
                world_name,
                counterAttacker["id"],
                attacker["id"],
                (resKillRank) => {}
              );
            }

            addInHistoric(
              world_name,
              attacker["id"],
              "counterAttack",
              counterAttacker["name"] + " vous a contre-attaqué.",
              { D100: D100, power: power },
              (historicRes) => {}
            );

            addInHistoric(
              world_name,
              counterAttacker["id"],
              "counterAttack",
              "vous contre-attaquez " + attacker["name"],
              { D100: D100, power: power },
              (historicRes) => {
                readCharas(
                  world_name,
                  [counterAttacker.id, attacker.id],
                  (charas) => {
                    if (charas && charas.length == 2) {
                      let newCounterAttacker = null;
                      let newAttacker = null;
                      for (let chara of charas) {
                        if (chara["id"] === counterAttacker.id) {
                          newCounterAttacker = chara;
                        } else if (chara["id"] === attacker.id) {
                          newAttacker = chara;
                        }
                      }
                      if (newCounterAttacker && newAttacker) {
                        sendToNear(
                          world_name,
                          newCounterAttacker["position"],
                          8,
                          "counterAttack",
                          {
                            counterAttacker: newCounterAttacker,
                            attacker: newAttacker,
                          },
                          (sendRes) => {}
                        );
                      }
                    }
                  }
                );
              }
            );
          }
        );
      }
    });
  }
  getDammage(world_name, user, value, callback) {
    addCharaValueData(world_name, user.id, "life", -value, (addValueRes) => {
      readCharaValue(world_name, user.id, "life", (lifeRes) => {
        if (lifeRes <= 0) {
          this.die(world_name, user, (dieRes) => {
            callback({ die: true });
          });
        } else {
          user["life"] = lifeRes;
          callback({});
        }
      });
    });
  }
  die(world_name, user, callback) {
    this.move(
      world_name,
      user.id,
      -user["position"]["x"],
      -user["position"]["y"],
      true,
      (updatePosition) => {
        if (this.values["life_max"]) {
          addCharaValueData(
            world_name,
            user.id,
            "life",
            this.values["life_max"],
            (addLifeRes) => {
              readCharaById(world_name, user["id"], (newChara) => {
                callback(true);
                sendToSocketId(
                  world_name,
                  user["id"],
                  "die",
                  { chara: newChara },
                  (sendSocketRes) => {}
                );
              });
            }
          );
        } else {
          callback(true);
        }
      }
    );
  }
}
