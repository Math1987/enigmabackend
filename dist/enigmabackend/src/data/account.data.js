"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountData = exports.updateAccountWorld = void 0;
const data_1 = require("./data");
exports.updateAccountWorld = (id, value, callback) => {
    data_1.Data.successOrFail(`
    UPDATE ${data_1.Data.TABLE_ACCOUNTS}
    SET world = "${value}"
    WHERE id = "${id}"
  `, (res) => {
        callback(res);
    });
};
class AccountData {
    static initAccount(callBack) {
        let sql = `
            CREATE TABLE IF NOT EXISTS ${data_1.Data.TABLE_ACCOUNTS}(
            id VARCHAR(36) PRIMARY KEY,
            email VARCHAR(154),
            password text,
            name VARCHAR(154),
            world VARCHAR(36),
            admin INT
            )
        `;
        data_1.Data.successOrFail(sql, callBack);
    }
    static checkAccount(email, callBack) {
        let sql = `
            SELECT email from ${data_1.Data.TABLE_ACCOUNTS}
            WHERE email = "${email}"
        `;
        data_1.Data.findOrFail(sql, callBack);
    }
    static checkAccountName(name, callBack) {
        let sql = `
            SELECT email from ${data_1.Data.TABLE_ACCOUNTS}
            WHERE name = "${name}"
        `;
        data_1.Data.findOrFail(sql, callBack);
    }
    static createAccount(email, password, name, admin, callBack) {
        data_1.Data.CONNECTION.query(`
        INSERT INTO ${data_1.Data.TABLE_ACCOUNTS}
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
    }
    static readAccount(email, password, callBack) {
        data_1.Data.CONNECTION.query(`
        SELECT * FROM ${data_1.Data.TABLE_ACCOUNTS} 
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
    }
    static readAccountById(id, callBack) {
        data_1.Data.CONNECTION.query(`
        SELECT * FROM ${data_1.Data.TABLE_ACCOUNTS} 
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
    }
}
exports.AccountData = AccountData;
