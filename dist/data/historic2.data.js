"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHistoricUserData = exports.addInHistoric2 = exports.initHistoric2Data = void 0;
const data_1 = require("./data");
const TABLE_NAME = "historic2";
const initHistoric2Data = (callback) => {
    console.log('init historic 2 datasz');
    data_1.successOrFailData(`
    create table if not exists ${TABLE_NAME}
    (
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      world VARCHAR(36),
      key_ VARCHAR(36),
      user VARCHAR(36),
      target VARCHAR(36),
      status VARCHAR(36),
      d100 INT,
      value FLOAT
      )
  `, (res) => {
        callback(res);
    });
};
exports.initHistoric2Data = initHistoric2Data;
const addInHistoric2 = (world_name, key, user, target, status, d100, value, callback) => {
    data_1.successOrFailData(`
  INSERT INTO ${TABLE_NAME}
  (time,world,key_,user,target,status,d100,value)
  VALUES
  (now(),"${world_name}","${key}","${user}","${target}", "${status}", ${d100}, ${value})
  `, (insertRes) => {
        callback(insertRes);
    });
};
exports.addInHistoric2 = addInHistoric2;
const readHistoricUserData = (world_name, id, callback) => {
    data_1.successOrFailData(`
    SELECT * FROM ${TABLE_NAME}
    WHERE world = "${world_name}" AND user = "${id}" 
    ORDER BY time DESC;
  `, (res) => {
        if (res && res.length > 0) {
            callback(res);
        }
        else {
            callback(null);
        }
    });
};
exports.readHistoricUserData = readHistoricUserData;
