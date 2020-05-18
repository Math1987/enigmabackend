"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Data {
    static init(callBack) {
        let mysql = require('mysql');
        Data.CONNECTION = mysql.createConnection({
            host: Data.HOST,
            user: Data.USER,
            password: Data.PASSWORD,
            database: Data.DB_NAME
        });
        Data.initAccount(function (account) {
        });
    }
    static initAccount(callBack) {
        Data.CONNECTION.query(`
        create table if not exists ${Data.ACCOUNT}(
        id INT PRIMARY KEY,
        email varchar(154),
        password text,
        admin INT
        )
        `, function (err, res) {
            if (err) {
                console.error(err);
                callBack(null);
            }
            else {
                callBack(res);
            }
        });
    }
}
exports.Data = Data;
Data.HOST = 'localhost';
Data.USER = "root";
Data.PASSWORD = '';
Data.DB_NAME = "enigma_db";
Data.ACCOUNT = 'account';
Data.WORLDS = 'worlds';
