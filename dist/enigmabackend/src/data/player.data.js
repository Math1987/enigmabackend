"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCharaById = exports.PlayerData = void 0;
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
        comp_getwater,
        comp_getfood,
        comp_getfaith,
        comp_getwood,
        comp_attack,
        comp_defense,
        xp,
        move,
        attack
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
        ${chara.comp_getwater},
        ${chara.comp_getfood},
        ${chara.comp_getfaith},
        ${chara.comp_getwood},
        ${chara.comp_attack},
        ${chara.comp_defense},
        ${chara.xp},
        ${chara.move},
        ${chara.attack}
           )
        `, function (playerRes) {
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

        comp_getwater FLOAT, 
        comp_getfood FLOAT,
        comp_getfaith FLOAT,
        comp_getwood FLOAT, 
        comp_attack FLOAT,
        comp_defense FLOAT,

        xp FLOAT,
        move INT,
        attack INT

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
        // Data.successOrFail(
        //   `
        //     INSERT INTO ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        //     (id,
        //     key_,
        //     name,
        //     position,
        //     life,
        //     life_max,
        //     water,
        //     food,
        //     faith,
        //     wood,
        //     comp_water,
        //     comp_getfood,
        //     comp_getfaith,
        //     comp_getwood,
        //     comp_attack,
        //     comp_defense,
        //     xp,
        //     move,
        //     attack)
        //     VALUES ( "${character.id}", "${character.religion}", 0)
        //     `,
        //   function (playerRes) {
        //     if (playerRes) {
        //       Data.successOrFail(
        //         `
        //             UPDATE ${Data.TABLE_ACCOUNTS}
        //             set world = "${world_name}"
        //             WHERE id = "${character.id}"
        //             `,
        //         function (updateWorld) {
        //           ValuesData.createFromPattern(
        //             character.id,
        //             "player",
        //             world_name,
        //             (res) => {
        //               character["world"] = world_name;
        //               callBack(character);
        //             }
        //           );
        //         }
        //       );
        //     } else {
        //       callBack(null);
        //     }
        //   }
        // );
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
