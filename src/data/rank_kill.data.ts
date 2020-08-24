import { successOrFailData } from "./data";
import { readCharasById } from "./player.data";

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
  SELECT * FROM ${TABLE_NAME}
  WHERE world = "${world_name}" AND id = "${id}"
  `,
    (killsRes) => {
      let ids = [];
      for (let row of killsRes) {
        let got = false;
        for (let row2 of ids) {
          if (row2 === row["id"]) {
            got = true;
            break;
          }
        }
        if (!got) {
          ids.push(row["id"]);
        }
      }
      readCharasById(world_name, ids, (charas) => {
        if (charas) {
          for (let i = 0; i < charas.length; i++) {
            let kills = 0;
            for (let row of killsRes) {
              if (charas[i]["id"] === row["id"]) {
                kills++;
              }
            }
            if (kills > 0) {
              charas[i]["kills"] = kills;
            }
          }
        }
        callback(charas);
      });
    }
  );
};

export { initRankKillData, addRankKillData, readRankKillsData };
