"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorldData = exports.updateWorldConstantData = exports.readWorldsData = exports.readWorldData = exports.initWorldData = void 0;
const data_1 = require("./data");
const player_data_1 = require("./player.data");
const squeleton_data_1 = require("./squeleton.data");
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
      SELECT ${TABLE_NAME}.*, clans.* FROM ${TABLE_NAME}
      INNER JOIN clans
      WHERE ${TABLE_NAME}.name = "${world_name}"
      `, function (res) {
        if (res && res.length > 0) {
            console.log('getting world', res[0]);
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
      SELECT ${TABLE_NAME}.*, clans.* FROM ${TABLE_NAME}
      INNER JOIN clans
      `, function (res) {
        if (res) {
            let worlds = [];
            for (let row of res) {
                let focusWorld = null;
                for (let w of worlds) {
                    if (w['name'] === row['name']) {
                        focusWorld = w;
                        break;
                    }
                }
                if (!focusWorld) {
                    focusWorld = JSON.parse(JSON.stringify(row));
                    focusWorld['clans'] = [];
                    worlds.push(focusWorld);
                }
                let clan = {
                    key_: row['key_'],
                    color: row['color'],
                    img: row['img']
                };
                focusWorld['clans'].push(clan);
            }
            console.log(worlds);
            callBack(worlds);
        }
        else {
            callBack([]);
        }
    });
};
exports.readWorldsData = readWorldsData;
const updateWorldConstantData = (worldName, key, value, callback) => {
    data_1.successOrFailData(`
    update ${TABLE_NAME} set ${key} = ${value} 
    where name = "${worldName}"
  `, res => {
        callback(res);
    });
};
exports.updateWorldConstantData = updateWorldConstantData;
const buildWorldData = (datas, callBack) => {
    console.log('build world at start');
    data_1.successOrFailData(`
      INSERT INTO ${TABLE_NAME}
      (name, width, height)
      VALUES ("${datas.name}", ${datas.width}, ${datas.height})
      `, function (worldInsert) {
        data_1.successOrFailData(`
          ALTER TABLE ${TABLE_NAME}
          ADD COLUMN squeletons FLOAT NOT NULL DEFAULT 0.01 ;
          `, function (fieldRes) {
            player_data_1.buildWorldPlayerData(datas, (playerRes) => {
                squeleton_data_1.buildWorldSqueletonData(datas, (squeletonsRes) => {
                    callBack("done");
                });
            });
        });
    });
};
exports.buildWorldData = buildWorldData;
