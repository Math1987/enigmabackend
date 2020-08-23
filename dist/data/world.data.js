"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorldData = exports.readWorldsData = exports.readWorldData = exports.initWorldData = void 0;
const data_1 = require("./data");
const player_data_1 = require("./player.data");
const TABLE_NAME = "worlds";
const initWorldData = (callBack) => {
    data_1.successOrFailData(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
      (
      name VARCHAR(36) primary key,
      width INT,
      height INT,
      rounds INT
      )
      `, function (res) {
        readWorldsData(function (worlds) {
            function buildWorld(i) {
                if (i < worlds.length) {
                    buildWorldData(worlds[i], function (worldRes) {
                        buildWorld(i + 1);
                    });
                }
                else {
                    callBack("done");
                }
            }
            buildWorld(0);
        });
    });
};
exports.initWorldData = initWorldData;
const readWorldData = (world_name, callBack) => {
    data_1.successOrFailData(`
      SELECT * FROM ${TABLE_NAME}
      WHERE name = "${world_name}"
      `, function (res) {
        if (res && res.length > 0) {
            callBack(JSON.parse(JSON.stringify(res[0])));
        }
        else {
            callBack([]);
        }
    });
};
exports.readWorldData = readWorldData;
const readWorldsData = (callBack) => {
    data_1.successOrFailData(`
      SELECT * FROM ${TABLE_NAME}
      `, function (res) {
        if (res) {
            callBack(JSON.parse(JSON.stringify(res)));
        }
        else {
            callBack([]);
        }
    });
};
exports.readWorldsData = readWorldsData;
const buildWorldData = (datas, callBack) => {
    data_1.successOrFailData(`
      INSERT INTO ${TABLE_NAME}
      (name, width, height)
      VALUES ("${datas.name}", ${datas.width}, ${datas.height})
      `, function (worldInsert) {
        player_data_1.buildWorldPlayerData(datas, function (playerRes) {
            callBack("done");
        });
    });
};
exports.buildWorldData = buildWorldData;
