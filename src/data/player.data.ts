import { Data } from "./data";
import { World } from "../models/world";


/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
const TABLE_NAME = "players" ;
const buildWorldPlayerData = (datas: World, callBack: CallableFunction) =>{
  Data.successOrFail(
    `
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
      `,
    function (res) {
      callBack(res);
    }
  );
}
const insertCharaData = (world_name, chara, callBack) => {
  console.log(chara);
  Data.successOrFail(
    `
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
        `,
    function (playerRes) {
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
    }
  );
};
const readCharaValue = (world_name, id, key, callback) => {
  Data.successOrFail(
    `
    SELECT ${key} FROM ${world_name}_${TABLE_NAME}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      if (updateRes && updateRes.length > 0) {
        callback(updateRes[0][key]);
      } else {
        callback(null);
      }
    }
  );
};
const readCharaValues = (world_name, id, keys: string[], callback) => {
  let keysString = "";
  for (let i = 0; i < keys.length; i++) {
    keysString += `${keys[i]}`;
    if (i < keys.length - 1) {
      keysString += ",";
    }
  }

  Data.successOrFail(
    `
    SELECT ${keysString} FROM ${world_name}_${TABLE_NAME}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      if (updateRes && updateRes.length > 0) {
        callback(JSON.stringify(updateRes[0]));
      } else {
        callback(null);
      }
    }
  );
};
const addValue = (
  world_name: string,
  id: string,
  key: string,
  value,
  callback
) => {
  Data.successOrFail(
    `
    UPDATE ${world_name}_${TABLE_NAME}
    SET ${key} = ${key} + ${value}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      callback(updateRes);
    }
  );
};
const addValues = (
  world_name: string,
  id: string,
  keyVals: Object,
  callback
) => {
  let updatesString = `SET `;
  let i = 0;
  for (let key in keyVals) {
    updatesString += `${key} = ${key} + ${keyVals[key]}`;
    if (i < Object.keys(keyVals).length - 1) {
      updatesString += ",";
      i++;
    }
  }
  Data.successOrFail(
    `
    UPDATE ${world_name}_${TABLE_NAME}
    ${updatesString}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      callback(updateRes);
    }
  );
};
const readCharaById = (world_name, id: string, callback) => {
  Data.successOrFail(
    `
      SELECT * FROM ${world_name}_${TABLE_NAME}
      WHERE id = "${id}"
      `,
    function (charaRes) {
      if (charaRes && charaRes.length > 0) {
        charaRes[0]['key'] = charaRes[0]['key_'];
        callback(JSON.parse(JSON.stringify(charaRes[0])));
      } else {
        callback(null);
      }
    }
  );
};
const readCharasByPositions = (
  world_name,
  positions: { x: number; y: number }[],
  callback
) => {
  let posRequete = "";
  for (let p of positions) {
    if (posRequete.length > 0) {
      posRequete += ",";
    }
    posRequete += `POINT(${p.x},${p.y})`;
  }

  Data.successOrFail(
    `
      SELECT * FROM ${world_name}_${TABLE_NAME}
      WHERE position IN (${posRequete})
      `,
    function (res) {
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
      } else {
        callback(null);
      }
    }
  );
};
const updateCharaPosition = (world_name:string, id: string, x : number, y : number, callback => {

  Data.successOrFail(
    `
          UPDATE ${world_name}_${TABLE_NAME}
          SET position = POINT( ${x},${y})
          WHERE id = "${id}"
      `,
    (res) => {
      callback(res);
    }
  );
    

});

export {buildWorldPlayerData, 
  insertCharaData,
  readCharaValue,
  readCharaValues,
  addValue,
  addValues,
  readCharaById,
   readCharasByPositions,
    updateCharaPosition
  };
