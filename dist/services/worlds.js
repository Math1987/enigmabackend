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
        world_data_1.WorldData.readWorlds(function (worlds) {
            if (!(worlds && worlds.length > 0)) {
                world_data_1.WorldData.buildWorld({ name: 'world1', width: 100, height: 100 }, function (world) {
                    callBack('done');
                });
            }
            else {
                callBack('done');
            }
        });
        //Chara.init();
    }
}
exports.Worlds = Worlds;
