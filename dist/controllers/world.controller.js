"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorldValueRequest = exports.getWorldsRequest = exports.passWorlds = exports.getWorld = exports.getOnPositions = exports.initWorld = void 0;
const world_data_1 = require("./../data/world.data");
const player_data_1 = require("./../data/player.data");
const grounds_controller_1 = require("./grounds.controller");
const main_patterns_1 = require("../patterns/main.patterns");
const squeleton_data_1 = require("../data/squeleton.data");
const clan_data_1 = require("../data/clan.data");
const initWorld = (callback) => {
    world_data_1.readWorldsData((worlds) => {
        if (!(worlds && worlds.length > 0)) {
            createWorld('world1', 100, 100, world => {
                callback("done");
            });
        }
        else {
            callback("done");
        }
    });
};
exports.initWorld = initWorld;
const createWorld = (worldName, width, height, callback) => {
    world_data_1.buildWorldData({ name: worldName, width: width, height: height }, world => {
        clan_data_1.insertClanData(worldName, "clan1", "blue", null, res => {
            clan_data_1.insertClanData(worldName, "clan2", "red", null, res => {
                callback('done');
            });
        });
    });
};
const getOnPositions = (world_name, positions, callback) => {
    let newPos = [];
    grounds_controller_1.getGroundsOnPositions(world_name, positions, (grounds) => {
        for (let ground of grounds) {
            newPos.push(ground);
        }
        player_data_1.readCharasByPositions(world_name, positions, (charas) => {
            if (charas && charas.length > 0) {
                for (let chara of charas) {
                    newPos.push(chara);
                }
            }
            squeleton_data_1.readSqueletonByPositions(world_name, positions, squeletons => {
                if (squeletons && squeletons.length > 0) {
                    for (let squeleton of squeletons) {
                        newPos.push(squeleton);
                    }
                }
                callback(newPos);
            });
        });
    });
};
exports.getOnPositions = getOnPositions;
const getWorldsRequest = (req, res) => {
    world_data_1.readWorldsData(worlds => {
        if (worlds) {
            res.status(200).send(worlds);
        }
        else {
            res.status(404).send(null);
        }
    });
};
exports.getWorldsRequest = getWorldsRequest;
const getWorld = (world_name, callback) => {
    world_data_1.readWorldData(world_name, callback);
};
exports.getWorld = getWorld;
const passWorlds = (callback) => {
    world_data_1.readWorldsData(worlds => {
        console.log('pass worlds', worlds);
        for (let world of worlds) {
            main_patterns_1.passPatterns(world, patternsRes => {
                callback('done');
            });
        }
    });
};
exports.passWorlds = passWorlds;
const updateWorldValueRequest = (req, res) => {
    if (req.body && req.body['worldName'] && req.body['target'] && req.body['key'] && req.body['value']) {
        main_patterns_1.updateValueInPattern(req.body['worldName'], req.body['target'], req.body['key'], req.body['value'], resPattern => {
            res.status(200).send(resPattern);
        });
    }
    else {
        res.status(401).send({ err: 'need datas' });
    }
};
exports.updateWorldValueRequest = updateWorldValueRequest;
