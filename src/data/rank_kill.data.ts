import { successOrFailData } from "./data";
import { readCharasById, TABLE_PLAYERS } from "./player.data";

const TABLE_NAME = "rank_kills";
const initRankKillData = (callback) => {
  successOrFailData(
    `
  CREATE TABLE IF NOT EXISTS  ${TABLE_NAME}
  (
    world VARCHAR(36),
    id VARCHAR(36),
    targetId VARCHAR(36)
  );
  `,
    (res) => {
      callback(res);
    }
  );
};

const addRankKillData = (world_name, killerId, targetId, callback) => {
  console.log("kill", world_name, killerId, targetId);
  successOrFailData(
    `
  INSERT INTO ${TABLE_NAME}
  (world, id, targetId)
  VALUES ("${world_name}", "${killerId}", "${targetId}")
  `,
    (res) => {
      callback(res);
    }
  );
};

const readRankKillsData = (world_name, id, callback) => {
  successOrFailData(
    `
    SELECT k.*, p.*  FROM ${TABLE_NAME} as k LEFT JOIN ${world_name}_${TABLE_PLAYERS} as p ON k.
    id = p.id  WHERE k.world = "world1";
  `,
    (killsRes) => {
      if (killsRes && killsRes.length > 0) {
        let ids = {};
        for (let i = killsRes.length - 1; i >= 0; i--) {
          if (ids[killsRes[i]["id"]]) {
            ids[killsRes[i]["id"]].kills++;
          } else {
            ids[killsRes[i]["id"]] = killsRes[i];
            ids[killsRes[i]["id"]]["kills"] = 1;
          }
        }
        let finalArray = [];
        for (let key in ids) {
          if (finalArray.length <= 0) {
            finalArray.push(JSON.parse(JSON.stringify(ids[key])));
          } else {
            let insertOk = false;
            for (let i = 0; i < finalArray.length; i++) {
              if (ids[key]["kills"] > finalArray[i]["kills"]) {
                finalArray.splice(i, JSON.parse(JSON.stringify(ids[key])));
                insertOk = true;
                break;
              }
            }
            if (!insertOk) {
              finalArray.push(JSON.parse(JSON.stringify(ids[key])));
            }
          }
        }
        callback(finalArray);
      } else {
        callback([]);
      }
    }
  );
};

export { initRankKillData, addRankKillData, readRankKillsData };
