"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSkillRequest = exports.createCharaRequest = exports.addSkill = exports.getCharasOnPositions = exports.createChara = void 0;
const main_patterns_1 = require("./../patterns/main.patterns");
const account_data_1 = require("./../data/account.data");
const player_data_1 = require("./../data/player.data");
const patternPlayer_1 = require("../data/patternPlayer");
const createChara = (world_name, datas, callback) => {
    if (datas["sexe"] && datas["race"]) {
        datas["key_"] = `${datas["race"]}${datas["sexe"]}`;
    }
    patternPlayer_1.readPlayerPatternData(datas["key_"], (patternPlayer) => {
        if (patternPlayer) {
            let finalObj = {};
            Object.assign(finalObj, patternPlayer, datas);
            player_data_1.insertCharaData(world_name, finalObj, (chara) => {
                if (chara) {
                    let pattern = main_patterns_1.getPattern(finalObj["key_"]);
                    if (pattern) {
                        pattern.move(world_name, finalObj["id"], 0, 0, (moveRes) => { });
                    }
                }
                console.log(chara);
                callback(chara);
            });
        }
        else {
            callback(null);
        }
    });
};
exports.createChara = createChara;
const getCharasOnPositions = (world_name, positions, callback) => {
    callback(null);
};
exports.getCharasOnPositions = getCharasOnPositions;
const addSkill = (req, res) => {
    const user = req["user"];
    const values = req["chara"];
    if (user && values && req.body["adder"] && req.body["key_"]) {
        if (values[req.body["key_"]] &&
            values["addskills"] &&
            values["addskills"] &&
            values["addskills"] >= req.body["adder"]) {
            let skillVal = values["addskills"] - req.body["adder"];
            let valNewVal = values[req.body["key_"]] + req.body["adder"];
            ValuesData.updateValues(user.id, user.world, [
                { key_: "addskills", value: skillVal },
                { key_: req.body["key_"], value: valNewVal },
            ]).then((addValueRes) => {
                let obj = { addskills: skillVal };
                obj[req.body["key_"]] = valNewVal;
                res.status(200).send(obj);
            });
        }
    }
    else {
        res.status(204).send("not found");
    }
};
exports.addSkill = addSkill;
exports.createCharaRequest = (req, res) => {
    if (req["account"] &&
        req["account"]["id"] &&
        !req["account"]["chara"] &&
        req.body &&
        req.body.name &&
        req.body.race &&
        req.body.religion) {
        let objFinal = {};
        Object.assign(objFinal, req.body, req["account"]);
        createChara("world1", objFinal, (chara) => {
            if (chara) {
                account_data_1.updateAccountWorldData(req["account"]["id"], "world1", (accountRes) => {
                    console.log("chara created succesfully");
                    res.status(200).send(chara);
                });
            }
            else {
                res.status(401).json("erreur de création du personnage");
            }
        });
    }
    else {
        res.status(401).send("need correct datas");
    }
};
exports.addSkillRequest = (req, res) => {
    if (req["account"] &&
        req["account"]["world"] &&
        req["account"]["id"] &&
        req["account"]["chara"] &&
        req.body &&
        req.body["key"] &&
        req.body["adder"]) {
        if (req["account"]["chara"]["xp"] >= req.body["adder"]) {
            let obj = {};
            obj[req.body["key"]] = req.body["adder"];
            obj["xp"] = -req.body["adder"];
            player_data_1.addCharaValuesData(req["account"]["world"], req["account"]["id"], obj, (resUpdate) => {
                if (resUpdate) {
                    player_data_1.readCharaValues(req["account"]["world"], req["account"]["id"], [req.body["key"], "xp"], (values) => {
                        if (values) {
                            res.status(200).send(values);
                        }
                        else {
                            res.status(200).send(null);
                        }
                    });
                }
                else {
                    res.status(501).send("error adding value");
                }
            });
        }
        else {
            res.status(401).send("not enought xp");
        }
    }
    else {
        res.status(401).send("need key and value");
    }
};
