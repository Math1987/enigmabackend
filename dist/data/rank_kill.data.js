"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRankKillsData = exports.addRankKillData = exports.initRankKillData = void 0;
const data_1 = require("./data");
const player_data_1 = require("./player.data");
const TABLE_NAME = "rank_kills";
const initRankKillData = (callback) => {
    data_1.successOrFailData(`
  CREATE TABLE IF NOT EXISTS  ${TABLE_NAME}
  (
    world VARCHAR(36),
    id VARCHAR(36),
    targetId VARCHAR(36)
  );
  `, (res) => {
        callback(res);
    });
};
exports.initRankKillData = initRankKillData;
const addRankKillData = (world_name, killerId, targetId, callback) => {
    data_1.successOrFailData(`
  INSERT INTO ${TABLE_NAME}
  (world, id, targetId)
  VALUES ("${world_name}", "${killerId}", "${targetId}")
  `, (res) => {
        callback(res);
    });
};
exports.addRankKillData = addRankKillData;
const readRankKillsData = (world_name, id, callback) => {
    data_1.successOrFailData(`
  SELECT * FROM ${TABLE_NAME}
  WHERE world = "${world_name}" AND id = "${id}"
  `, (killsRes) => {
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
        player_data_1.readCharasById(world_name, ids, (charas) => {
            console.log(charas);
            if (charas) {
                for (let i = 0; i < charas.length; i++) {
                    let kills = 0;
                    for (let row of killsRes) {
                        if (charas[i]["id"] === row["id"]) {
                            kills++;
                        }
                    }
                    console.log(kills);
                    if (kills > 0) {
                        charas[i]["kills"] = kills;
                    }
                }
            }
            callback(charas);
        });
    });
};
exports.readRankKillsData = readRankKillsData;
