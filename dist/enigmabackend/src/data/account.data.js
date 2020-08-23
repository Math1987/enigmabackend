"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAccountDataById = exports.readAccountData = exports.createAccountData = exports.updateAccountWorldData = exports.checkAccountNameData = exports.checkEmailData = exports.initAccountData = void 0;
const data_1 = require("./data");
const TABLE_NAME = `accounts`;
exports.initAccountData = (callBack) => {
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
    data_1.Data.successOrFail(sql, callBack);
};
exports.checkEmailData = (email, callBack) => {
    let sql = `
          SELECT email from ${TABLE_NAME}
          WHERE email = "${email}"
      `;
    data_1.Data.findOrFail(sql, callBack);
};
exports.checkAccountNameData = (name, callBack) => {
    let sql = `
          SELECT email from ${TABLE_NAME}
          WHERE name = "${name}"
      `;
    data_1.Data.findOrFail(sql, callBack);
};
exports.updateAccountWorldData = (id, value, callback) => {
    data_1.Data.successOrFail(`
    UPDATE ${TABLE_NAME}
    SET world = "${value}"
    WHERE id = "${id}"
  `, (res) => {
        callback(res);
    });
};
exports.createAccountData = (email, password, name, admin, callBack) => {
    data_1.Data.CONNECTION.query(`
      INSERT INTO ${TABLE_NAME}
      (id, email, password, name, admin)
      VALUES (uuid(), "${email}", MD5("${password}"), "${name}", ${admin})
      `, function (err, res) {
        if (err) {
            console.error(err);
            callBack(null);
        }
        else {
            callBack({ email: email, password: password });
        }
    });
};
exports.readAccountData = (email, password, callBack) => {
    data_1.Data.CONNECTION.query(`
      SELECT * FROM ${TABLE_NAME} 
      WHERE email = "${email}" AND password = MD5("${password}")
      `, function (err, res) {
        if (err) {
            console.error(err);
            callBack(null);
        }
        else {
            if (res && res.length > 0) {
                delete res[0]["password"];
                let json = JSON.parse(JSON.stringify(res[0]));
                callBack(json);
            }
            else {
                callBack(null);
            }
        }
    });
};
exports.readAccountDataById = (id, callBack) => {
    data_1.Data.CONNECTION.query(`
      SELECT * FROM ${TABLE_NAME} 
      WHERE id = "${id}"
              `, function (err, res) {
        if (err) {
            console.error(err);
            callBack(null);
        }
        else {
            if (res && res.length > 0) {
                delete res[0]["password"];
                let json = JSON.parse(JSON.stringify(res[0]));
                callBack(json);
            }
            else {
                callBack(null);
            }
        }
    });
};
