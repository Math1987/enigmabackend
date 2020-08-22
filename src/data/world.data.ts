import { MobilesData } from "./mobile.data";
import { Data } from "./data";
import { World } from "../models/world";
import { SkillsData } from "./skills.data";
import { PlayerData } from "./player.data";
import { ValuesData } from "./values.data";

/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
export class WorldData {
  static TABLE_PLAYERS = `players`;
  static TABLE_POSITIONS = `positions`;

  /**
   * Init worlds dataas create the main world table if not exist,
   * and check all the existing worlds written in this main table,
   * build them. It's mean than the tables of each world will
   * be created if they not exists.
   * @param callBack: whatever...just say when work is finish.
   */
  static init(callBack: CallableFunction) {
    Data.successOrFail(
      `
        CREATE TABLE IF NOT EXISTS ${Data.TABLE_WORLDS}
        (
        name VARCHAR(36) primary key,
        width INT,
        height INT,
        rounds INT
        )
        `,
      function (res) {
        WorldData.readWorlds(function (worlds: Array<World>) {
          function buildWorld(i) {
            if (i < worlds.length) {
              WorldData.buildWorld(worlds[i], function (worldRes) {
                buildWorld(i + 1);
              });
            } else {
              callBack("done");
            }
          }
          buildWorld(0);
        });
      }
    );
  }

  /**
   * Read all actived worlds written in the main global world table.
   * eatch row contain infos as name, width, height, rounds etc...
   * @param callBack: send back and arrays of worlds
   */
  static readWorld(
    world_name: string,
    callBack: CallableFunction
  ): Array<World> {
    Data.successOrFail(
      `
        SELECT * FROM ${Data.TABLE_WORLDS}
        WHERE name = "${world_name}"
        `,
      function (res) {
        if (res) {
          callBack(JSON.parse(JSON.stringify(res)));
        } else {
          callBack([]);
        }
      }
    );
  }
  static readWorlds(callBack: CallableFunction): Array<World> {
    Data.successOrFail(
      `
        SELECT * FROM ${Data.TABLE_WORLDS}
        `,
      function (res) {
        if (res) {
          callBack(JSON.parse(JSON.stringify(res)));
        } else {
          callBack([]);
        }
      }
    );
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
  static buildWorld(datas: World, callBack: CallableFunction) {
    Data.successOrFail(
      `
        INSERT INTO ${Data.TABLE_WORLDS}
        (name, width, height)
        VALUES ("${datas.name}", ${datas.width}, ${datas.height})
        `,
      function (worldInsert) {
        PlayerData.buildPlayerTable(datas, function (playerRes) {
          ValuesData.buildTable(datas, function (resourceCB) {
            MobilesData.buildMobileDatas(datas, (resMObiles) => {
              callBack("done");
            });
          });
        });
      }
    );
  }
}
