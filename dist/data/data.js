"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readObjById = exports.successOrFailData = exports.initData = void 0;
const patternPlayer_1 = require("./patternPlayer");
const world_data_1 = require("./world.data");
const account_data_1 = require("./account.data");
const meta_data_1 = require("./meta.data");
const valuesPatterns_data_1 = require("./valuesPatterns.data");
const calcul_data_1 = require("./calcul.data");
const environment_1 = require("./../environment/environment");
const rank_kill_data_1 = require("./rank_kill.data");
const historic_data_1 = require("./historic.data");
const clan_data_1 = require("./clan.data");
const historic2_data_1 = require("./historic2.data");
const player_data_1 = require("./player.data");
const squeleton_data_1 = require("./squeleton.data");
const dead_data_1 = require("./dead.data");
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
    meta_data_1.initMetaData((metaDatasInit) => {
        calcul_data_1.initCalculationData((calculation) => {
            patternPlayer_1.initPatternPlayerData((patternPlayerRes) => {
                valuesPatterns_data_1.initPatternValueData((patternData) => {
                    account_data_1.initAccountData((account) => {
                        historic_data_1.initHistoricData((resHistoric) => {
                            historic2_data_1.initHistoric2Data((resHistoric) => {
                                dead_data_1.initDeadData((resDeads) => {
                                    rank_kill_data_1.initRankKillData((resRankKill) => {
                                        world_data_1.initWorldData((worldInit) => {
                                            clan_data_1.initClansData(clanRes => {
                                                callBack("init");
                                            });
                                        });
                                    });
                                });
                            });
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
            console.log("error data", err);
            callBack(null);
        }
        else {
            callBack(res);
        }
    });
};
exports.successOrFailData = successOrFailData;
const readObjById = (world_name, id, callback) => {
    console.log('readObjById');
    player_data_1.readCharaById(world_name, id, charaRes => {
        if (!charaRes) {
            squeleton_data_1.readSqueletonById(world_name, id, squeletonRes => {
                if (!squeletonRes) {
                    dead_data_1.readDeadByIdData(world_name, id, deadRes => {
                        if (deadRes) {
                            let lastDatas = JSON.parse(JSON.stringify(deadRes));
                            lastDatas['key'] = lastDatas['key_'];
                            console.log('dead thing found', lastDatas);
                            callback(lastDatas);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
                else {
                    callback(squeletonRes);
                }
            });
        }
        else {
            callback(charaRes);
        }
    });
};
exports.readObjById = readObjById;
