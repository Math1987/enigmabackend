"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successOrFailData = exports.initData = void 0;
const patternPlayer_1 = require("./patternPlayer");
const world_data_1 = require("./world.data");
const account_data_1 = require("./account.data");
const meta_data_1 = require("./meta.data");
const valuesPatterns_data_1 = require("./valuesPatterns.data");
const calcul_data_1 = require("./calcul.data");
const environment_1 = require("./../environment/environment");
const HOST = environment_1.environment.db.host;
const USER = environment_1.environment.db.user;
const PASSWORD = environment_1.environment.db.password;
const DB_NAME = environment_1.environment.db.name;
let co = null;
const initData = (callBack) => {
    let mysql = require("mysql");
    let connection = mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
    });
    connection.query(`create database if not exists ${DB_NAME}`, function (err, res) { });
    co = mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DB_NAME,
    });
    meta_data_1.initMetaData(function (metaDatasInit) {
        calcul_data_1.initCalculationData((calculation) => {
            patternPlayer_1.initPatternPlayerData((patternPlayerRes) => {
                valuesPatterns_data_1.ValuesPatternsData.init(function (patternData) {
                    account_data_1.initAccountData(function (account) {
                        world_data_1.WorldData.init(function (worldInit) {
                            callBack("init");
                        });
                    });
                });
            });
        });
    });
};
exports.initData = initData;
const successOrFailData = (sql, callBack) => {
    co.query(sql, function (err, res) {
        if (err) {
            console.log("error data");
            callBack(null);
        }
        else {
            callBack(res);
        }
    });
};
exports.successOrFailData = successOrFailData;
