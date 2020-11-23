import { successOrFailData } from "./data";
import { World } from "../models/world";
import { buildWorldPlayerData } from "./player.data";
import { buildWorldSqueletonData } from "./squeleton.data";

const TABLE_NAME = "worlds";

const initWorldData = (callBack: CallableFunction) => {
  successOrFailData(
    `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
      (
      name VARCHAR(36) primary key,
      width INT,
      height INT,
      rounds INT
      )
      `,
    function (res) {
      readWorldsData(function (worlds: Array<World>) {

        /**
         * 
         * @param i iterate to check all world and reload everything for each of them
         * send call back when finish
         */
        function buildWorld(i) {
          if (i < worlds.length) {
            buildWorldData(worlds[i], function (worldRes) {
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
};
const readWorldData = (
  world_name: string,
  callBack: CallableFunction
): Array<World> => {
  successOrFailData(
    `
      SELECT * FROM ${TABLE_NAME}
      WHERE name = "${world_name}"
      `,
    function (res) {
      if (res && res.length > 0) {
        callBack(JSON.parse(JSON.stringify(res[0])));
      } else {
        callBack([]);
      }
    }
  );
};
const readWorldsData = (callBack: CallableFunction): Array<World> => {
  successOrFailData(
    `
      SELECT * FROM ${TABLE_NAME}
      `,
    function (res) {
      if (res) {
        callBack(JSON.parse(JSON.stringify(res)));
      } else {
        callBack([]);
      }
    }
  );
};
const buildWorldData = (datas: World, callBack: CallableFunction) => {
  successOrFailData(
    `
      INSERT INTO ${TABLE_NAME}
      (name, width, height)
      VALUES ("${datas.name}", ${datas.width}, ${datas.height})
      `,
    function (worldInsert) {
      buildWorldPlayerData(datas, (playerRes) => {
        buildWorldSqueletonData(datas, (squeletonsRes)=> {
          callBack("done");
        });
      });
    }
  );
};

export { initWorldData, readWorldData, readWorldsData, buildWorldData };
