import { PatternPlayer } from "./patternPlayer";
import { Data } from "./data";
import { World } from "../models/world";
import { Player } from "../models/player";

/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */

const insertChara = (world_name, chara, callBack) => {
  Data.successOrFail(
    `
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
export const readCharaValue = (world_name, id, key, callback) => {
  Data.successOrFail(
    `
    SELECT ${key} FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
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
export const readCharaValues = (world_name, id, keys: string[], callback) => {
  let keysString = "";
  for (let i = 0; i < keys.length; i++) {
    keysString += `${keys[i]}`;
    if (i < keys.length - 1) {
      keysString += ",";
    }
  }

  Data.successOrFail(
    `
    SELECT ${keysString} FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
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
export const addValue = (
  world_name: string,
  id: string,
  key: string,
  value,
  callback
) => {
  Data.successOrFail(
    `
    UPDATE ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
    SET ${key} = ${key} + ${value}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      callback(updateRes);
    }
  );
};
export const addValues = (
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
    UPDATE ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
    ${updatesString}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      callback(updateRes);
    }
  );
};
export class PlayerData {
  static TABLE_PLAYERS_NAME = `players`;
  static TABLE_POSITIONS = `positions`;

  static buildPlayerTable(datas: World, callBack: CallableFunction) {
    Data.successOrFail(
      `
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
        `,
      function (res) {
        callBack(res);
      }
    );
  }

  static readChara(
    world_name: string,
    player: Player,
    callBack: CallableFunction
  ) {
    Data.successOrFail(
      `
        SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        WHERE id = ${player.id}
        `,
      function (charaRes) {
        callBack(charaRes);
      }
    );
  }
  static readCharaAsObj(
    world_name: string,
    id: string,
    callBack: CallableFunction
  ) {
    Data.successOrFail(
      `
        SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        WHERE id = "${id}"
        `,
      function (charaRes) {
        if (charaRes && charaRes.length > 0) {
          callBack(JSON.parse(JSON.stringify(charaRes[0])));
        } else {
          callBack(null);
        }
      }
    );
  }

  static createCharacter(
    world_name: string,
    character: { id: string; name: string; key_: string; religion: string },
    callBack: CallableFunction
  ) {
    PatternPlayer.read(character.key_, (pattern) => {
      if (pattern) {
        let finalObj = {};
        Object.assign(finalObj, pattern, character);
        insertChara(world_name, finalObj, (charaRes) => {
          if (charaRes) {
            callBack(finalObj);
          }
        });
      } else {
        callBack(null);
      }
    });
  }
  static readCharacter(
    world_name: string,
    id: string,
    callBack: CallableFunction
  ) {
    Data.successOrFail(
      `
        SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        WHERE id = "${id}"
        `,
      function (playerRes) {
        if (playerRes && playerRes.length > 0) {
          callBack(JSON.parse(JSON.stringify(playerRes[0])));
        } else {
          callBack(null);
        }
      }
    );
  }
}
export const readCharaById = (world_name, id: string, callback) => {
  Data.successOrFail(
    `
      SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
      WHERE id = "${id}"
      `,
    function (charaRes) {
      if (charaRes && charaRes.length > 0) {
        callback(JSON.parse(JSON.stringify(charaRes[0])));
      } else {
        callback(null);
      }
    }
  );
};
export const readCharasByPositions = (
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
      SELECT * FROM ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
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
