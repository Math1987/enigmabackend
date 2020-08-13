"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const world_data_1 = require("./world.data");
const account_data_1 = require("./account.data");
const meta_data_1 = require("./meta.data");
const valuesPatterns_data_1 = require("./valuesPatterns.data");
/**
 * Data manage the only database of the game.
 * There are to kinds of tables: global tables,
 * as accounts, worlds, containing globals informations,
 * and world's tables, as world1_players, world1_positions,
 * world2_players etc... Each world got him tables.
 */
class Data {
    constructor() { }
    /**
     * init data create the game's database as "enigma_db"
     * if not exist,
     * then lauchn the initialisation of all datas
     * divised by categories ( as account, world etc...)
     * @param callBack
     */
    static init(callBack) {
        let mysql = require("mysql");
        let connection = mysql.createConnection({
            host: Data.HOST,
            user: Data.USER,
            password: Data.PASSWORD,
        });
        connection.query(`create database if not exists ${Data.DB_NAME}`, function (err, res) { });
        Data.CONNECTION = mysql.createConnection({
            host: Data.HOST,
            user: Data.USER,
            password: Data.PASSWORD,
            database: Data.DB_NAME,
        });
        meta_data_1.MetaData.init(function (metaDatasInit) {
            valuesPatterns_data_1.ValuesPatternsData.init(function (patternData) {
                account_data_1.AccountData.initAccount(function (account) {
                    world_data_1.WorldData.init(function (worldInit) {
                        callBack("init");
                    });
                });
            });
        });
    }
    /**
     * Query SQL or fail in console
     * @param sql
     * @param callBack
     */
    static successOrFail(sql, callBack) {
        Data.CONNECTION.query(sql, function (err, res) {
            if (err) {
                callBack(null);
            }
            else {
                callBack(res);
            }
        });
    }
    /**
     * Find at least one occurrence from SQL statement or fail in console
     * @param sql
     * @param callBack
     */
    static findOrFail(sql, callBack) {
        Data.CONNECTION.query(sql, function (err, res) {
            if (err) {
                console.error(err);
                callBack(null);
            }
            else {
                if (res && res.length > 0) {
                    callBack(true);
                }
                else {
                    callBack(false);
                }
            }
        });
    }
}
exports.Data = Data;
/**
 * the mysqljs informations to create a connection
 * when server launched
 */
Data.HOST = "localhost";
Data.USER = "root";
Data.PASSWORD = "";
Data.DB_NAME = "enigma_db";
Data.CONNECTION = null;
/**
 * Here are the global tables
 */
Data.TABLE_ACCOUNTS = `accounts`;
Data.TABLE_WORLDS = `worlds`;