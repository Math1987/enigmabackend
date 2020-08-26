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
    SELECT k.*, p.*  FROM ${TABLE_NAME} as k LEFT JOIN ${world_name}_${player_data_1.TABLE_PLAYERS} as p ON k.
    id = p.id  WHERE k.world = "world1";
  `, (killsRes) => {
        if (killsRes && killsRes.length > 0) {
            let ids = {};
            for (let i = killsRes.length - 1; i >= 0; i--) {
                if (ids[killsRes[i]["id"]]) {
                    ids[killsRes[i]["id"]].kills++;
                }
                else {
                    ids[killsRes[i]["id"]] = killsRes[i];
                    ids[killsRes[i]["id"]]["kills"] = 1;
                }
            }
            let finalArray = [];
            for (let key in ids) {
                let insertOk = false;
                for (let i = 0; i < finalArray.length; i++) {
                    if (ids[key]["kills"] > finalArray[i]["kills"]) {
                        finalArray.splice(i, 0, JSON.parse(JSON.stringify(ids[key])));
                        insertOk = true;
                        break;
                    }
                }
                if (!insertOk) {
                    finalArray.push(JSON.parse(JSON.stringify(ids[key])));
                }
            }
            callback(finalArray);
        }
        else {
            callback([]);
        }
    });
};
exports.readRankKillsData = readRankKillsData;
