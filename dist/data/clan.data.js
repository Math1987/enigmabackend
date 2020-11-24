"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readClans = exports.insertClanData = exports.buildWorldClanData = exports.TABLE_SQUELETONS = void 0;
const data_1 = require("./data");
const TABLE_NAME = "clan";
exports.TABLE_SQUELETONS = TABLE_NAME;
const buildWorldClanData = (datas, callBack) => {
    console.log('create table for clans', TABLE_NAME);
    data_1.successOrFailData(`
      CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
      ( 
      key_ VARCHAR(36) primary key,
      color VARCHAR(36),
      img TEXT
      )
      `, function (res) {
        callBack(res);
    });
};
exports.buildWorldClanData = buildWorldClanData;
const insertClanData = (world_name, clanName, color, image, callBack) => {
    console.log('insert clan', clanName);
    data_1.successOrFailData(`
        INSERT INTO ${world_name}_${TABLE_NAME}
        (
        key_,
        color,
        img
        )
        VALUES ( 
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
    SELECT * FROM ${world_name}_${TABLE_NAME}
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
