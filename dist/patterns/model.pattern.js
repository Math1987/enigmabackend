"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelPattern = void 0;
const calculation_controller_1 = require("../controllers/calculation.controller");
const socket_controller_1 = require("../controllers/socket.controller");
const main_patterns_1 = require("./main.patterns");
class ModelPattern {
    constructor() {
        this.values = {};
    }
    readKey() {
        return "";
    }
    readDatas(world_name, obj, callback) {
        callback({
            id: obj['id']
        });
    }
    create(world_name, id, callback) { }
    addValue(world_name, id, key, value, callback) {
        callback(null);
    }
    updateValue(world_name, obj, key, value, callback) {
        console.log('I am a pattern ready to update the value', this.readKey());
        callback(false);
    }
    pass(worldDatas, callback) {
        callback("done");
    }
    move(world_name, id, x, y, free, callback) {
        callback(null);
    }
    sendAttack(world_name, attacker, receiver, callBack) {
        this.canMakeAttack(world_name, attacker, receiver, canAttackRes => {
            if (canAttackRes['status']) {
                console.log('send Attack receiver', receiver);
                this.readDatas(world_name, attacker, attackerValues => {
                    let receiverPatter = main_patterns_1.getPattern(receiver['key']);
                    receiverPatter.readDatas(world_name, receiver, receiverValues => {
                        receiverPatter.counterAttack2(world_name, receiverValues, this, attackerValues, counterRes => {
                            if (!counterRes) {
                                this.attack2(world_name, attackerValues, receiverPatter, receiverValues, 1, attackRes => {
                                    if (attackRes) {
                                        this.readDatas(world_name, attackerValues, lastAttacker => {
                                            receiverPatter.readDatas(world_name, receiverValues, lastReceiver => {
                                                if (!lastReceiver) {
                                                    lastReceiver = receiverValues;
                                                }
                                                socket_controller_1.sendToNear(world_name, {
                                                    x: attackerValues["position"]["x"],
                                                    y: attackerValues["position"]["y"],
                                                }, 8, "attack", {
                                                    attacker: lastAttacker,
                                                    receiver: lastReceiver,
                                                    datas: attackRes,
                                                }, (sendRes) => { });
                                            });
                                        });
                                        callBack(attackRes);
                                    }
                                });
                            }
                            else {
                                callBack(counterRes);
                            }
                        });
                    });
                });
            }
            else {
                callBack(canAttackRes);
            }
        });
    }
    canMakeAttack(world_name, attacker, receiver, callBack) {
        callBack({
            status: true
        });
    }
    attack2(world_name, attacker, receiverPattern, receiver, intensity, callBack) {
        calculation_controller_1.getCalculation(calculs => {
            let calculation = calculs["attack"];
            let D100 = Math.floor(Math.random() * 99 + 1);
            let skillAttack = 10;
            let getMaterial = 10;
            let skillDefense = 10;
            let getWater = 10;
            if ("attack" in attacker) {
                skillAttack = attacker["attack"];
            }
            if ("wood" in attacker) {
                getMaterial = attacker["wood"];
            }
            if ("defense" in receiver) {
                skillDefense = receiver["defense"];
            }
            if ("dowser" in receiver) {
                getWater = receiver["dowser"];
            }
            let dammages = Math.max(1, Math.floor((D100 *
                (Math.log10(skillAttack) +
                    Math.log10((getMaterial +
                        calculation.getMaterial_min) *
                        calculation.getMaterial))) /
                ((Math.log10(skillDefense) +
                    Math.log10((getWater + calculation.getWater_min) *
                        calculation.getWater)) *
                    calculation.factor)));
            receiverPattern.receiveDammages(world_name, receiver, { D100: D100, dammages: dammages }, dammageRes => {
                if (dammageRes) {
                    callBack({
                        status: dammageRes['status'],
                        attackData: { D100: D100, dammages: dammages }
                    });
                }
            });
        });
    }
    receiveDammages(world_name, values, dammagesValues, callback) {
        let lastLife = Math.max(0, values['life'] - dammagesValues.dammages);
        if (lastLife <= 0) {
            this.die(world_name, values, dieRes => {
                callback({
                    status: "kill"
                });
            });
        }
        else {
            this.updateValue(world_name, values, 'life', lastLife, res => {
                callback({
                    status: "dammages"
                });
            });
        }
    }
    counterAttack2(world_name, counterAttacker, attackerPattern, attacker, callback) {
        callback(false);
        // getCalculation( calculs => {
        //   let calculation = calculs["attack"];
        //   let proba_skillAttack = 10;
        //   let proba_getFood = 10;
        //   let proba_defense = 10;
        //   let proba_getFaith = 10;
        //   if ("attack" in counterAttacker) {
        //     proba_skillAttack = counterAttacker.attack;
        //   }
        //   if ("getFood" in counterAttacker) {
        //     proba_getFood = counterAttacker.getFood;
        //   }
        //   if ("defense" in attacker) {
        //     proba_defense = attacker.defense;
        //   }
        //   if ("getFaith" in attacker) {
        //     proba_getFaith = attacker.getFaith;
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
        //   let rand = Math.random();
        //   if ( rand <= 0 ){
        //     this.attack2(world_name, counterAttacker, attackerPattern, attacker, 0.5, attackRes => {
        //       callback(true);
        //     });
        //   }else{
        //     callback(false) ;
        //   }
        // });
    }
    attack(world_name, attacker, receiver, callBack) {
    }
    receiveAttack(world_name, attacker, receiver, callBack) {
    }
    counterAttack(world_name, counterAttacker, attackerPatter, attacker, callback) {
        callback(false);
    }
    getDammage(world_name, user, value, callback) { }
    die(world_name, user, callback) { }
    pops(world_name, user, callBack) {
        // if (this.values["life"]) {
        //   MobilesData.updateLifeAndPosition(
        //     world_name,
        //     user["id"],
        //     this.values["life"],
        //     0,
        //     0,
        //     (resLife) => {
        //       if (resLife) {
        //         user["life"] = this.values["life"];
        //         user["position"] = { x: 0, y: 0 };
        //         callBack(this.values["life"]);
        //       } else {
        //         callBack(null);
        //       }
        //     }
        //   );
        // } else {
        //   callBack(null);
        // }
    }
}
exports.ModelPattern = ModelPattern;
