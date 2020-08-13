"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attack = exports.makeAttack = exports.attackProba = exports.attackPower = void 0;
const main_patterns_1 = require("./../patterns/main.patterns");
const mobile_data_1 = require("./../data/mobile.data");
const socket_controller_1 = require("./socket.controller");
const calculation_controller_1 = require("./calculation.controller");
exports.attackPower = (user, target, D100, callBack) => {
    calculation_controller_1.getCalculation((calculs) => {
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
        callBack(power);
    });
};
exports.attackProba = (user, userPattern, target, targetPattern, callBack) => {
    console.log(targetPattern);
    if (targetPattern && targetPattern['values']['counter']) {
        calculation_controller_1.getCalculation((calculs) => {
            let calculation = calculs["attack"];
            let proba_skillAttack = 10;
            let proba_getFood = 10;
            let proba_defense = 10;
            let proba_getFaith = 10;
            if ("attack" in user) {
                proba_skillAttack = user.attack;
            }
            if ("getFood" in user) {
                proba_getFood = user.getFood;
            }
            if ("defense" in target) {
                proba_defense = target.defense;
            }
            if ("getFaith" in target) {
                proba_getFaith = target.getFaith;
            }
            let proba = Math.max(0.05, Math.min(9.95, calculation.proba_min +
                (Math.log10(proba_skillAttack) +
                    Math.log10((proba_getFood + calculation.proba_getFood_min) *
                        calculation.proba_getFood) *
                        calculation.proba_factor1) -
                (Math.log10(proba_defense) +
                    Math.log10((proba_getFaith + calculation.proba_getFaith_min) *
                        calculation.proba_getFaith) *
                        calculation.proba_factor2)));
            if (Math.random() <= proba) {
                callBack('attack');
            }
            else {
                callBack('counter');
            }
        });
    }
    else {
        callBack(1);
    }
};
exports.makeAttack = (world_name, user, target, power, callback) => {
    mobile_data_1.MobilesData.addValue(world_name, target["id"], "life", -power, (resTarget) => {
        if (resTarget) {
            if (target["life"] - power <= 0) {
                console.log("kill");
            }
            callback("done");
        }
        else {
            callback(null);
        }
    });
};
exports.attack = (worldName, user, target, callBack) => {
    let patternUser = main_patterns_1.MainPatterns.getPattern(user['key_']);
    let patternTarget = main_patterns_1.MainPatterns.getPattern(target['key_']);
    exports.attackProba(user, patternUser, target, patternTarget, (attackType) => {
        let D100 = 1 + Math.floor(Math.random() * 99);
        if (attackType == "attack") {
            exports.attackPower(user, target, D100, (dammage) => {
                console.log("attack " + dammage);
                exports.makeAttack(worldName, user, target, dammage, (attackRes) => {
                    socket_controller_1.getSocketsNear(worldName, user["position"].x, user["position"].y, 5, (sockets) => {
                        for (let socket in sockets) {
                            sockets[socket].emit("attack", user, target, "attack", D100, dammage);
                        }
                    });
                    callBack('attack', "hurt");
                });
            });
        }
        else {
            exports.attackPower(target, user, D100, (dammage) => {
                exports.makeAttack(worldName, target, user, dammage * 0.5, (attackRes) => {
                    socket_controller_1.getSocketsNear(worldName, user["position"].x, user["position"].y, 5, (sockets) => {
                        for (let socket in sockets) {
                            sockets[socket].emit("attack", user, target, "counter", D100, dammage);
                        }
                    });
                    callBack('counter', "hurt");
                });
            });
        }
    });
};
