"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAccountDataById = exports.readAccountData = exports.createAccountData = exports.updateAccountWorldData = exports.checkAccountNameData = exports.checkEmailData = exports.initAccountData = void 0;
const data_1 = require("./data");
const TABLE_NAME = `accounts`;
const initAccountData = (callBack) => {
    let sql = `
          CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(154),
          password text,
          name VARCHAR(154),
          world VARCHAR(36),
          admin INT
          )
      `;
    data_1.successOrFailData(sql, callBack);
};
exports.initAccountData = initAccountData;
const checkEmailData = (email, callBack) => {
    let sql = `
          SELECT email from ${TABLE_NAME}
          WHERE email = "${email}"
      `;
    data_1.successOrFailData(sql, callBack);
};
exports.checkEmailData = checkEmailData;
const checkAccountNameData = (name, callback) => {
    let sql = `
          SELECT name from ${TABLE_NAME}
          WHERE name = "${name}"
      `;
    data_1.successOrFailData(sql, (res) => {
        callback(res);
    });
};
exports.checkAccountNameData = checkAccountNameData;
const updateAccountWorldData = (id, value, callback) => {
    data_1.successOrFailData(`
    UPDATE ${TABLE_NAME}
    SET world = "${value}"
    WHERE id = "${id}"
  `, (res) => {
        callback(res);
    });
};
exports.updateAccountWorldData = updateAccountWorldData;
const createAccountData = (email, password, name, admin, callBack) => {
    data_1.successOrFailData(`
  INSERT INTO ${TABLE_NAME}
  (id, email, password, name, admin)
  VALUES (uuid(), "${email}", MD5("${password}"), "${name}", ${admin})
  `, (res) => {
        if (res) {
            callBack({ email: email, password: password });
        }
        else {
            callBack(null);
        }
    });
};
exports.createAccountData = createAccountData;
const readAccountData = (email, password, callBack) => {
    data_1.successOrFailData(`
  SELECT * FROM ${TABLE_NAME} 
  WHERE email = "${email}" AND password = MD5("${password}")
  `, (res) => {
        if (res && res.length > 0) {
            delete res[0]["password"];
            let json = JSON.parse(JSON.stringify(res[0]));
            callBack(json);
        }
        else {
            callBack(null);
        }
    });
};
exports.readAccountData = readAccountData;
const readAccountDataById = (id, callBack) => {
    data_1.successOrFailData(`
  SELECT * FROM ${TABLE_NAME} 
  WHERE id = "${id}"
          `, (res) => {
        if (res && res.length > 0) {
            delete res[0]["password"];
            let json = JSON.parse(JSON.stringify(res[0]));
            callBack(json);
        }
        else {
            callBack(null);
        }
    });
};
exports.readAccountDataById = readAccountDataById;
