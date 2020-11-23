"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSqueletonDataById = exports.updateSqueletonPositionData = exports.readSqueletonByPositions = exports.updateSqueletonData = exports.readAllSqueletonsData = exports.readSqueletonsById = exports.readSqueletonById = exports.addSqueletonValuesData = exports.addSqueletonValueData = exports.readSqueletonValues = exports.readSqueletonValue = exports.insertSqueletonData = exports.buildWorldSqueletonData = exports.TABLE_SQUELETONS = void 0;
const data_1 = require("./data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
const TABLE_NAME = "squeletons";
exports.TABLE_SQUELETONS = TABLE_NAME;
const buildWorldSqueletonData = (datas, callBack) => {
    console.log('create table for squeletons', TABLE_NAME);
    data_1.successOrFailData(`
      CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
      ( 
      id VARCHAR(36) primary key,
      position POINT,
      life FLOAT ,
      life_max FLOAT,
      skill_attack FLOAT,
      skill_defense FLOAT
      )
      `, function (res) {
        callBack(res);
    });
};
exports.buildWorldSqueletonData = buildWorldSqueletonData;
const insertSqueletonData = (world_name, squeleton, callBack) => {
    console.log('insert squeleton', squeleton.x, squeleton.y);
    data_1.successOrFailData(`
        INSERT INTO ${world_name}_${TABLE_NAME}
        (
        id,
        position,
        life,
        life_max,
        skill_attack,
        skill_defense
        )
        VALUES ( 
        uuid(), 
        POINT(${squeleton.x},${squeleton.y}),
        ${squeleton.life},
        ${squeleton.life_max},
        ${squeleton.skill_attack},
        ${squeleton.skill_defense}
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
exports.insertSqueletonData = insertSqueletonData;
const readSqueletonValue = (world_name, id, key, callback) => {
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
exports.readSqueletonValue = readSqueletonValue;
const readSqueletonValues = (world_name, id, keys, callback) => {
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
exports.readSqueletonValues = readSqueletonValues;
const addSqueletonValueData = (world_name, id, key, value, callback) => {
    data_1.successOrFailData(`
    UPDATE ${world_name}_${TABLE_NAME}
    SET ${key} =  GREATEST(0,${key} + ${value})
    WHERE id = "${id}"
  `, (updateRes) => {
        callback(updateRes);
    });
};
exports.addSqueletonValueData = addSqueletonValueData;
const addSqueletonValuesData = (world_name, id, keyVals, callback) => {
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
exports.addSqueletonValuesData = addSqueletonValuesData;
const readSqueletonById = (world_name, id, callback) => {
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
exports.readSqueletonById = readSqueletonById;
const readSqueletonsById = (world_name, ids, callback) => {
    let idsStrings = '(';
    for (let id of ids) {
        idsStrings += `"${id}"`;
        if (id !== ids[ids.length - 1]) {
            idsStrings += ',';
        }
    }
    idsStrings += ')';
    data_1.successOrFailData(`
      SELECT * FROM ${world_name}_${TABLE_NAME}
      WHERE id IN ${idsStrings}
      `, function (charaRes) {
        if (charaRes && charaRes.length > 0) {
            for (let i = 0; i < charaRes.length; i++) {
                charaRes[i]['key'] = charaRes[i]['key_'];
            }
            callback(JSON.parse(JSON.stringify(charaRes)));
        }
        else {
            callback(null);
        }
    });
};
exports.readSqueletonsById = readSqueletonsById;
const readSqueletonByPositions = (world_name, positions, callback) => {
    let posRequete = "";
    for (let p of positions) {
        if (posRequete.length > 0) {
            posRequete += ",";
        }
        posRequete += `POINT(${p.x},${p.y})`;
    }
    console.log('pos request', posRequete);
    if (posRequete.length > 0) {
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
                    newObj["key"] = "squeleton";
                    finalObj.push(newObj);
                }
                callback(JSON.parse(JSON.stringify(finalObj)));
            }
            else {
                callback(null);
            }
        });
    }
    else {
        callback(null);
    }
    ;
};
exports.readSqueletonByPositions = readSqueletonByPositions;
const readAllSqueletonsData = (world_name, callback) => {
    data_1.successOrFailData(`
  SELECT * FROM ${world_name}_${TABLE_NAME}
  `, players => {
        callback(players);
    });
};
exports.readAllSqueletonsData = readAllSqueletonsData;
const updateSqueletonPositionData = (world_name, id, x, y, callback) => {
    data_1.successOrFailData(`
          UPDATE ${world_name}_${TABLE_NAME}
          SET position = POINT( ${x},${y})
          WHERE id = "${id}"
      `, (res) => {
        callback(res);
    });
};
exports.updateSqueletonPositionData = updateSqueletonPositionData;
const updateSqueletonData = (world_name, chara, pattern, callback) => {
    let stringCharas = '';
    for (let key in chara) {
        if (typeof chara[key] === "number" && key in pattern) {
            stringCharas += `${key} = ${chara[key]},`;
        }
    }
    if (stringCharas.length > 0) {
        stringCharas = stringCharas.substring(0, stringCharas.length - 1);
        data_1.successOrFailData(`
      UPDATE ${world_name}_${TABLE_NAME}  
      SET ${stringCharas}
      WHERE id = "${chara['id']}"
    `, updateRes => {
            callback(updateRes);
        });
    }
    else {
        callback(null);
    }
};
exports.updateSqueletonData = updateSqueletonData;
const removeSqueletonDataById = (world_name, id, callback) => {
    data_1.successOrFailData(`
  DELETE FROM ${world_name}_${TABLE_NAME}  
  WHERE id = "${id}"
          `, (res) => {
        if (res) {
            console.log('remove done', res);
            callback('done');
        }
        else {
            callback(null);
        }
    });
};
exports.removeSqueletonDataById = removeSqueletonDataById;
