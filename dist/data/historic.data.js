"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHistoricData = exports.addInHistoric = exports.initHistoricData = void 0;
const data_1 = require("./data");
const TABLE_NAME = "historic";
const TABLE_NAME_VALUES = TABLE_NAME + "_values";
const initHistoricData = (callback) => {
    data_1.successOrFailData(`
    create table if not exists ${TABLE_NAME}
    (
      message_id int PRIMARY KEY AUTO_INCREMENT,
      world VARCHAR(36),
      key_ VARCHAR(36),
      id VARCHAR(36),
      message TEXT,
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
  `, (res) => {
        data_1.successOrFailData(`
        create table if not exists ${TABLE_NAME_VALUES}
        (
          message_id INT,
          attribute VARCHAR(36),
          value FLOAT
          )
      `, (res2) => {
            callback(res2);
        });
    });
};
exports.initHistoricData = initHistoricData;
const addInHistoric = (world_name, id, key_, message, values, callback) => {
    data_1.successOrFailData(`
  INSERT INTO ${TABLE_NAME}
  (world,id,key_,message, time)
  VALUES
  ("${world_name}","${id}","${key_}","${message}", now())
  `, (insertRes) => {
        if (insertRes && insertRes["insertId"]) {
            let valuesString = "";
            for (let k in values) {
                valuesString += `(${insertRes["insertId"]},"${k}",${values[k]}),`;
            }
            if (valuesString.length > 0) {
                valuesString = valuesString.slice(0, valuesString.length - 1);
                data_1.successOrFailData(`
          INSERT INTO ${TABLE_NAME_VALUES}
          (message_id, attribute, value)
          VALUES
          ${valuesString}
        `, (resValues) => {
                    callback(resValues);
                });
            }
            else {
                callback(null);
            }
        }
        else {
            callback(null);
        }
    });
};
exports.addInHistoric = addInHistoric;
const readHistoricData = (world_name, id, callback) => {
    data_1.successOrFailData(`
    SELECT t.*, vs.* FROM ${TABLE_NAME}  as t LEFT JOIN ${TABLE_NAME_VALUES} as vs ON t.message_id = vs.message_id
    WHERE t.world = "${world_name}" AND t.id = "${id}" 
    ORDER BY t.time DESC;
  `, (res) => {
        if (res && res.length > 0) {
            let mess = {};
            let arr = [];
            for (let row of res) {
                let got = false;
                for (let ar of arr) {
                    if (ar["message_id"] == row["message_id"]) {
                        ar[row["attribute"]] = row["value"];
                        got = true;
                        break;
                    }
                }
                if (!got) {
                    let newRow = JSON.parse(JSON.stringify(row));
                    newRow[row["attribute"]] = row["value"];
                    arr.push(newRow);
                }
            }
            for (let ar of arr) {
                Reflect.deleteProperty(ar, "attribute");
                Reflect.deleteProperty(ar, "value");
            }
            console.log("arr historic", arr);
            callback(arr);
        }
        else {
            callback(null);
        }
    });
};
exports.readHistoricData = readHistoricData;
