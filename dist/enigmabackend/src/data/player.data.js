"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCharaById = exports.PlayerData = exports.addValue = exports.readCharaValue = void 0;
const patternPlayer_1 = require("./patternPlayer");
const data_1 = require("./data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
const insertChara = (world_name, chara, callBack) => {
    data_1.Data.successOrFail(`
        INSERT INTO ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        (
        id,
        key_,
        name,
        position,
        life,
        life_max,
        water,
        food,
        faith,
        wood,
        skill_water, 
        skill_food,
        skill_faith,
        skill_wood, 
        skill_attack,
        skill_defense,
        xp,
        move,
        action
        )
        VALUES ( 
          "${chara.id}", 
        "${chara.key_}",
        "${chara.name}",
        POINT(0,0),
        ${chara.life},
        ${chara.life_max},
        ${chara.water},
        ${chara.food},
        ${chara.faith},
        ${chara.wood},
        ${chara.skill_water},
        ${chara.skill_food},
        ${chara.skill_faith},
        ${chara.skill_wood},
        ${chara.skill_attack},
        ${chara.skill_defense},
        ${chara.xp},
        ${chara.move},
        ${chara.action}
           )
        `, function (playerRes) {
        console.log(playerRes);
        callBack(playerRes);
        // if (playerRes) {
        //   Data.successOrFail(
        //     `
        //           UPDATE ${Data.TABLE_ACCOUNTS}
        //           set world = "${world_name}"
        //           WHERE id = "${character.id}"
        //           `,
        //     function (updateWorld) {
        //       ValuesData.createFromPattern(
        //         character.id,
        //         "player",
        //         world_name,
        //         (res) => {
        //           character["world"] = world_name;
        //           callBack(character);
        //         }
        //       );
        //     }
        //   );
        // } else {
        //   callBack(null);
        // }
    });
};
exports.readCharaValue = (world_name, id, key, callback) => {
    data_1.Data.successOrFail(`
    SELECT ${key} FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
    WHERE id = "${id}"
  `, (updateRes) => {
        if (updateRes && updateRes.length > 0) {
            let json = JSON.parse(JSON.stringify(updateRes[0]));
            console.log(updateRes[0][key]);
            callback(updateRes[0][key]);
        }
        else {
            callback(null);
        }
    });
};
exports.addValue = (world_name, id, key, value, callback) => {
    console.log("updateing value", key, value, id, world_name);
    data_1.Data.successOrFail(`
    UPDATE ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
    SET ${key} = ${key} + ${value}
    WHERE id = "${id}"
  `, (updateRes) => {
        callback(updateRes);
    });
};
class PlayerData {
    static buildPlayerTable(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${PlayerData.TABLE_PLAYERS_NAME}
        ( 
        id VARCHAR(36) primary key,
        key_ VARCHAR(36),
        name VARCHAR(36),
        position POINT,

        life FLOAT,
        life_max FLOAT,

        water FLOAT,
        food FLOAT, 
        faith FLOAT, 
        wood FLOAT,

        skill_water FLOAT, 
        skill_food FLOAT,
        skill_faith FLOAT,
        skill_wood FLOAT, 
        skill_attack FLOAT,
        skill_defense FLOAT,

        xp FLOAT,
        action INT,
        move INT

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
    static readCharaAsObj(world_name, id, callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        WHERE id = "${id}"
        `, function (charaRes) {
            if (charaRes && charaRes.length > 0) {
                callBack(JSON.parse(JSON.stringify(charaRes[0])));
            }
            else {
                callBack(null);
            }
        });
    }
    static createCharacter(world_name, character, callBack) {
        console.log("createchara");
        patternPlayer_1.PatternPlayer.read(character.key_, (pattern) => {
            console.log(pattern);
            if (pattern) {
                let finalObj = {};
                Object.assign(finalObj, pattern, character);
                insertChara(world_name, finalObj, (charaRes) => {
                    if (charaRes) {
                        console.log(finalObj);
                        callBack(finalObj);
                    }
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
exports.readCharaById = (world_name, id, callback) => {
    data_1.Data.successOrFail(`
      SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
      WHERE id = "${id}"
      `, function (charaRes) {
        if (charaRes && charaRes.length > 0) {
            callback(JSON.parse(JSON.stringify(charaRes[0])));
        }
        else {
            callback(null);
        }
    });
};
