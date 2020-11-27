"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDeadByIdData = exports.addDeadData = exports.initDeadData = void 0;
const data_1 = require("./data");
const TABLE_NAME = "deads";
const initDeadData = (callback) => {
    data_1.successOrFailData(`
    create table if not exists ${TABLE_NAME}
    (
      world VARCHAR(36),
      id VARCHAR(36),
      key_ VARCHAR(36),
      primary key( world, id)
    )
  `, (res) => {
        callback(res);
    });
};
exports.initDeadData = initDeadData;
const addDeadData = (world_name, obj, callback) => {
    data_1.successOrFailData(`
  INSERT INTO ${TABLE_NAME}
  (world,id,key_)
  VALUES
  ("${world_name}","${obj['id']}","${obj['key_']}")
  `, (insertRes) => {
        callback(insertRes);
    });
};
exports.addDeadData = addDeadData;
const readDeadByIdData = (world_name, id, callback) => {
    data_1.successOrFailData(`
    SELECT * FROM ${TABLE_NAME}
    WHERE world = "${world_name}" AND id = "${id}" 
  `, (res) => {
        if (res && res.length > 0) {
            let finalRes = JSON.parse(JSON.stringify(res[0]));
            finalRes['key'] = finalRes['key_'];
            callback(finalRes);
        }
        else {
            callback(null);
        }
    });
};
exports.readDeadByIdData = readDeadByIdData;
