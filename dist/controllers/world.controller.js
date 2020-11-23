"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passWorlds = exports.getWorld = exports.getOnPositions = exports.initWorld = void 0;
const world_data_1 = require("./../data/world.data");
const player_data_1 = require("./../data/player.data");
const grounds_controller_1 = require("./grounds.controller");
const main_patterns_1 = require("../patterns/main.patterns");
const squeleton_data_1 = require("../data/squeleton.data");
const initWorld = (callback) => {
    world_data_1.readWorldsData((worlds) => {
        if (!(worlds && worlds.length > 0)) {
            world_data_1.buildWorldData({ name: "world1", width: 100, height: 100 }, world => {
                callback("done");
            });
        }
        else {
            callback("done");
        }
    });
};
exports.initWorld = initWorld;
const getOnPositions = (world_name, positions, callback) => {
    let newPos = [];
    grounds_controller_1.getGroundsOnPositions(world_name, positions, (grounds) => {
        for (let ground of grounds) {
            newPos.push(ground);
        }
        console.log(positions);
        player_data_1.readCharasByPositions(world_name, positions, (charas) => {
            if (charas && charas.length > 0) {
                for (let chara of charas) {
                    newPos.push(chara);
                }
            }
            console.log(positions);
            squeleton_data_1.readSqueletonByPositions(world_name, positions, squeletons => {
                console.log('squeletons found', squeletons);
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
