"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readClans = exports.insertClanData = exports.initClansData = exports.TABLE_SQUELETONS = void 0;
const data_1 = require("./data");
const TABLE_NAME = "clans";
exports.TABLE_SQUELETONS = TABLE_NAME;
const initClansData = (callBack) => {
    console.log('create table for clans', TABLE_NAME);
    data_1.successOrFailData(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
      ( 
      world VARCHAR(36),
      key_ VARCHAR(36),
      color VARCHAR(36),
      img TEXT,
      PRIMARY KEY (world, key_)
      )
      `, function (res) {
        callBack(res);
    });
};
exports.initClansData = initClansData;
const insertClanData = (world_name, clanName, color, image, callBack) => {
    console.log('insert clan', clanName);
    data_1.successOrFailData(`
        INSERT INTO ${TABLE_NAME}
        (
        world,
        key_,
        color,
        img
        )
        VALUES ( 
        "${world_name}",
        "${clanName}", 
        "${color}", 
        "${image}"
        )
        `, function (clanRes) {
        callBack(clanRes);
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
    });
};
exports.insertClanData = insertClanData;
const readClans = (world_name, callback) => {
    data_1.successOrFailData(`
    SELECT * FROM ${TABLE_NAME}
    WHERE world = "${world_name}"
  `, (updateRes) => {
        if (updateRes && updateRes.length > 0) {
            callback(updateRes);
        }
        else {
            callback(null);
        }
    });
};
exports.readClans = readClans;
