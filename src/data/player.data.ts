import { Data } from "./data";
import { World } from "../models/world";
import { Player } from "../models/player";
import { SkillsData } from "./skills.data";
import { WorldData } from "./world.data";
import { ValuesData } from "./values.data";
import { ValuesPatternsData } from "./valuesPatterns.data";

/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
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
        religion VARCHAR(36),
        xp INT
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
    Data.successOrFail(
      `
        INSERT INTO ${world_name}_${PlayerData.TABLE_PLAYERS_NAME}
        (id, religion, xp)
        VALUES ( "${character.id}", "${character.religion}", 0)
        `,
      function (playerRes) {
        if (playerRes) {
          Data.successOrFail(
            `
                UPDATE ${Data.TABLE_ACCOUNTS}
                set world = "${world_name}"
                WHERE id = "${character.id}"
                `,
            function (updateWorld) {
              ValuesData.createFromPattern(
                character.id,
                "player",
                world_name,
                (res) => {
                  character["world"] = world_name;

                  callBack(character);
                }
              );
            }
          );
        } else {
          callBack(null);
        }
      }
    );
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
