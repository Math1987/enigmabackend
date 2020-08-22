"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldData = void 0;
const mobile_data_1 = require("./mobile.data");
const data_1 = require("./data");
const player_data_1 = require("./player.data");
const values_data_1 = require("./values.data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class WorldData {
    /**
     * Init worlds dataas create the main world table if not exist,
     * and check all the existing worlds written in this main table,
     * build them. It's mean than the tables of each world will
     * be created if they not exists.
     * @param callBack: whatever...just say when work is finish.
     */
    static init(callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${data_1.Data.TABLE_WORLDS}
        (
        name VARCHAR(36) primary key,
        width INT,
        height INT,
        rounds INT
        )
        `, function (res) {
            WorldData.readWorlds(function (worlds) {
                function buildWorld(i) {
                    if (i < worlds.length) {
                        WorldData.buildWorld(worlds[i], function (worldRes) {
                            buildWorld(i + 1);
                        });
                    }
                    else {
                        callBack("done");
                    }
                }
                buildWorld(0);
            });
        });
    }
    /**
     * Read all actived worlds written in the main global world table.
     * eatch row contain infos as name, width, height, rounds etc...
     * @param callBack: send back and arrays of worlds
     */
    static readWorld(world_name, callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${data_1.Data.TABLE_WORLDS}
        WHERE name = "${world_name}"
        `, function (res) {
            if (res) {
                callBack(JSON.parse(JSON.stringify(res)));
            }
            else {
                callBack([]);
            }
        });
    }
    static readWorlds(callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${data_1.Data.TABLE_WORLDS}
        `, function (res) {
            if (res) {
                callBack(JSON.parse(JSON.stringify(res)));
            }
            else {
                callBack([]);
            }
        });
    }
    /**
     * buildWorld: this function is called with a World model interface
     * to check world already exist (create all the necessary tables if not exists)
     * or create a new world, adding the name, width, height etc...
     * in the main global worlds table, then create all
     * the tables as the nameOfWorld + "_" + nameOfTable
     * @param datas
     * @param callBack
     */
    static buildWorld(datas, callBack) {
        data_1.Data.successOrFail(`
        INSERT INTO ${data_1.Data.TABLE_WORLDS}
        (name, width, height)
        VALUES ("${datas.name}", ${datas.width}, ${datas.height})
        `, function (worldInsert) {
            player_data_1.PlayerData.buildPlayerTable(datas, function (playerRes) {
                values_data_1.ValuesData.buildTable(datas, function (resourceCB) {
                    mobile_data_1.MobilesData.buildMobileDatas(datas, (resMObiles) => {
                        callBack("done");
                    });
                });
            });
        });
    }
}
exports.WorldData = WorldData;
WorldData.TABLE_PLAYERS = `players`;
WorldData.TABLE_POSITIONS = `positions`;
