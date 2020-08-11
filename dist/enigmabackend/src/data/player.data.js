"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerData = void 0;
const data_1 = require("./data");
const values_data_1 = require("./values.data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class PlayerData {
    static buildPlayerTable(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${PlayerData.TABLE_PLAYERS_NAME}
        ( 
        id VARCHAR(36) primary key,
        name VARCHAR(36),
        race VARCHAR(36),
        religion VARCHAR(36),
        life FLOAT,
        life_max FLOAT,
        xp INT
        )
        `, function (res) {
            callBack(res);
        });
    }
    static readChara(world_name, player, callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        WHERE id = ${player.id}
        `, function (charaRes) {
            callBack(charaRes);
        });
    }
    static createCharacter(world_name, character, callBack) {
        data_1.Data.successOrFail(`
        INSERT INTO ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        (id, name, race, religion)
        VALUES ( "${character.id}", "${character.name}","${character.race}","${character.religion}")
        `, function (playerRes) {
            if (playerRes) {
                data_1.Data.successOrFail(`
                UPDATE ${data_1.Data.TABLE_ACCOUNTS}
                set world = "${world_name}"
                WHERE id = "${character.id}"
                `, function (updateWorld) {
                    values_data_1.ValuesData.createFromPattern(character.id, 'player', world_name, (res) => {
                        character['world'] = world_name;
                        callBack(character);
                    });
                });
            }
            else {
                callBack(null);
            }
        });
    }
    static readCharacter(world_name, id, callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        WHERE id = "${id}"
        `, function (playerRes) {
            if (playerRes && playerRes.length > 0) {
                callBack(JSON.parse(JSON.stringify(playerRes[0])));
            }
            else {
                callBack(null);
            }
        });
    }
}
exports.PlayerData = PlayerData;
PlayerData.TABLE_PLAYERS_NAME = `players`;
PlayerData.TABLE_POSITIONS = `positions`;
