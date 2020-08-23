"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCharaPosition = exports.readCharasByPositions = exports.readCharaById = exports.addValues = exports.addValue = exports.readCharaValues = exports.readCharaValue = exports.insertCharaData = exports.buildWorldPlayerData = void 0;
const data_1 = require("./data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
const TABLE_NAME = "players";
const buildWorldPlayerData = (datas, callBack) => {
    data_1.successOrFailData(`
      CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
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
};
exports.buildWorldPlayerData = buildWorldPlayerData;
const insertCharaData = (world_name, chara, callBack) => {
    console.log(chara);
    data_1.successOrFailData(`
        INSERT INTO ${world_name}_${TABLE_NAME}
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
exports.insertCharaData = insertCharaData;
const readCharaValue = (world_name, id, key, callback) => {
    data_1.successOrFailData(`
    SELECT ${key} FROM ${world_name}_${TABLE_NAME}
    WHERE id = "${id}"
  `, (updateRes) => {
        if (updateRes && updateRes.length > 0) {
            callback(updateRes[0][key]);
        }
        else {
            callback(null);
        }
    });
};
exports.readCharaValue = readCharaValue;
const readCharaValues = (world_name, id, keys, callback) => {
    let keysString = "";
    for (let i = 0; i < keys.length; i++) {
        keysString += `${keys[i]}`;
        if (i < keys.length - 1) {
            keysString += ",";
        }
    }
    data_1.successOrFailData(`
    SELECT ${keysString} FROM ${world_name}_${TABLE_NAME}
    WHERE id = "${id}"
  `, (updateRes) => {
        if (updateRes && updateRes.length > 0) {
            callback(JSON.stringify(updateRes[0]));
        }
        else {
            callback(null);
        }
    });
};
exports.readCharaValues = readCharaValues;
const addValue = (world_name, id, key, value, callback) => {
    data_1.successOrFailData(`
    UPDATE ${world_name}_${TABLE_NAME}
    SET ${key} = ${key} + ${value}
    WHERE id = "${id}"
  `, (updateRes) => {
        callback(updateRes);
    });
};
exports.addValue = addValue;
const addValues = (world_name, id, keyVals, callback) => {
    let updatesString = `SET `;
    let i = 0;
    for (let key in keyVals) {
        updatesString += `${key} = ${key} + ${keyVals[key]}`;
        if (i < Object.keys(keyVals).length - 1) {
            updatesString += ",";
            i++;
        }
    }
    data_1.successOrFailData(`
    UPDATE ${world_name}_${TABLE_NAME}
    ${updatesString}
    WHERE id = "${id}"
  `, (updateRes) => {
        callback(updateRes);
    });
};
exports.addValues = addValues;
const readCharaById = (world_name, id, callback) => {
    data_1.successOrFailData(`
      SELECT * FROM ${world_name}_${TABLE_NAME}
      WHERE id = "${id}"
      `, function (charaRes) {
        if (charaRes && charaRes.length > 0) {
            charaRes[0]['key'] = charaRes[0]['key_'];
            callback(JSON.parse(JSON.stringify(charaRes[0])));
        }
        else {
            callback(null);
        }
    });
};
exports.readCharaById = readCharaById;
const readCharasByPositions = (world_name, positions, callback) => {
    let posRequete = "";
    for (let p of positions) {
        if (posRequete.length > 0) {
            posRequete += ",";
        }
        posRequete += `POINT(${p.x},${p.y})`;
    }
    data_1.successOrFailData(`
      SELECT * FROM ${world_name}_${TABLE_NAME}
      WHERE position IN (${posRequete})
      `, function (res) {
        if (res) {
            let finalObj = [];
            for (let row of res) {
                let newObj = row;
                newObj["x"] = row["position"]["x"];
                newObj["y"] = row["position"]["y"];
                newObj["key"] = row["key_"];
                finalObj.push(newObj);
            }
            callback(JSON.parse(JSON.stringify(finalObj)));
        }
        else {
            callback(null);
        }
    });
};
exports.readCharasByPositions = readCharasByPositions;
const updateCharaPosition = (world_name, id, x, y, callback) => {
    data_1.successOrFailData(`
          UPDATE ${world_name}_${TABLE_NAME}
          SET position = POINT( ${x},${y})
          WHERE id = "${id}"
      `, (res) => {
        callback(res);
    });
};
exports.updateCharaPosition = updateCharaPosition;