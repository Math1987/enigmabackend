"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccountStringsData = exports.removeAccountDataById = exports.replacePasswordData = exports.readAccountDataById = exports.readAccountData = exports.createAccountData = exports.updateAccountWorldData = exports.checkAccountNameData = exports.checkEmailData = exports.initAccountData = void 0;
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
    data_1.successOrFailData(sql, createRes => {
        data_1.successOrFailData(` 
    ALTER TABLE ${TABLE_NAME}
    ADD inscription TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `, callBack);
    });
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
const updateAccountStringsData = (account, values, callback) => {
    let updates_ = `UPDATE ${TABLE_NAME} SET `;
    for (let key in values) {
        updates_ += `${key} = "${values[key]}",`;
    }
    if (updates_[updates_.length - 1] === ",") {
        let dataReq = updates_.slice(0, -1);
        dataReq += ` WHERE id = "${account.id}"`;
        data_1.successOrFailData(dataReq, res => {
            if (res) {
                readAccountDataById(account.id, callback);
            }
            else {
                callback(res);
            }
        });
    }
    callback(null);
};
exports.updateAccountStringsData = updateAccountStringsData;
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
const removeAccountDataById = (id, callback) => {
    data_1.successOrFailData(`
  DELETE FROM ${TABLE_NAME} 
  WHERE id = "${id}"
          `, (res) => {
        if (res) {
            console.log('remove done', res);
            callback('done');
        }
        else {
            callback(null);
        }
    });
};
exports.removeAccountDataById = removeAccountDataById;
const replacePasswordData = (email, password, callback) => {
    data_1.successOrFailData(`
  UPDATE ${TABLE_NAME} 
  SET password =  MD5("${password}")
  WHERE email = "${email}" 
  `, (res) => {
        if (res && res.length > 0) {
            callback(true);
        }
        else {
            callback(null);
        }
    });
};
exports.replacePasswordData = replacePasswordData;
