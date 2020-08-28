import { successOrFailData } from "./data";
const TABLE_NAME = "historic";
const TABLE_NAME_VALUES = TABLE_NAME + "_values";
const initHistoricData = (callback) => {
  successOrFailData(
    `
    create table if not exists ${TABLE_NAME}
    (
      message_id int PRIMARY KEY AUTO_INCREMENT,
      world VARCHAR(36),
      key_ VARCHAR(36),
      id VARCHAR(36),
      message TEXT,
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
  `,
    (res) => {
      successOrFailData(
        `
        create table if not exists ${TABLE_NAME_VALUES}
        (
          message_id INT,
          attribute VARCHAR(36),
          value FLOAT
          )
      `,
        (res2) => {
          callback(res2);
        }
      );
    }
  );
};

const addInHistoric = (
  world_name: string,
  id: string,
  key_: string,
  message: string,
  values: Object,
  callback: Function
) => {
  successOrFailData(
    `
  INSERT INTO ${TABLE_NAME}
  (world,id,key_,message, time)
  VALUES
  ("${world_name}","${id}","${key_}","${message}", now())
  `,
    (insertRes) => {
      if (insertRes && insertRes["insertId"]) {
        let valuesString = "";
        for (let k in values) {
          valuesString += `(${insertRes["insertId"]},"${k}",${values[k]}),`;
        }
        if (valuesString.length > 0) {
          valuesString = valuesString.slice(0, valuesString.length - 1);
          successOrFailData(
            `
          INSERT INTO ${TABLE_NAME_VALUES}
          (message_id, attribute, value)
          VALUES
          ${valuesString}
        `,
            (resValues) => {
              callback(resValues);
            }
          );
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }
  );
};

const readHistoricData = (world_name, id, callback) => {
  successOrFailData(
    `
    SELECT t.*, vs.* FROM ${TABLE_NAME}  as t LEFT JOIN ${TABLE_NAME_VALUES} as vs ON t.message_id = vs.message_id
    WHERE t.world = "${world_name}" AND t.id = "${id}" 
  `,
    (res) => {
      if (res && res.length > 0) {
        let mess = {};
        for (let row of res) {
          if (mess[row["message_id"]]) {
            mess[row["message_id"]][row["attribute"]] = row["value"];
          } else {
            mess[row["message_id"]] = row;
            mess[row["message_id"]][row["attribute"]] = row["value"];
          }
        }
        for (let obj in mess) {
          Reflect.deleteProperty(mess[obj], "attribute");
          Reflect.deleteProperty(mess[obj], "value");
        }
        callback(JSON.parse(JSON.stringify(mess)));
      } else {
        callback(null);
      }
    }
  );
};

export { initHistoricData, addInHistoric, readHistoricData };
