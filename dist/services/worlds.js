"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const world_data_1 = require("../data/world.data");
/**
 * Manage all worlds functions
 * 1 world = 1 database
 */
class Worlds {
    /**
     * check all worlds from databases.
     * If no world found, create a new world,
     * else, use "buildWorld" function to run
     * migration system database => if a table needed
     * doesnt exist, it will create it.
     * @param callBack
     */
    static init(callBack) {
        world_data_1.WorldData.readWorldsDbs(function (dbs) {
            if (dbs) {
                function initWorld(i) {
                    if (i < dbs.length) {
                        world_data_1.WorldData.buildWorld(dbs[i], { width: 100, height: 100 }, function (world) {
                            initWorld(i + 1);
                        });
                    }
                    else {
                        callBack('done');
                    }
                }
                initWorld(0);
            }
            else {
                world_data_1.WorldData.buildWorld('enigma_1', { width: 100, height: 100 }, function (world) {
                    callBack('done');
                });
            }
        });
    }
    static createCharacter(character, callBack) {
    }
}
exports.Worlds = Worlds;
