import { MobilesData } from "./mobile.data";
import { WorldData } from "./world.data";
import { AccountData } from "./account.data";
import { MetaData } from "./meta.data";
import { ValuesPatternsData } from "./valuesPatterns.data";

/**
 * Data manage the only database of the game.
 * There are to kinds of tables: global tables,
 * as accounts, worlds, containing globals informations,
 * and world's tables, as world1_players, world1_positions,
 * world2_players etc... Each world got him tables.
 */
export class Data {
  constructor() {}

  /**
   * the mysqljs informations to create a connection
   * when server launched
   */
  private static HOST = "localhost";
  private static USER = "root";
  private static PASSWORD = "";
  private static DB_NAME = "enigma_db";
  private static CONNECTION = null;

  /**
   * Here are the global tables
   */
  private static TABLE_ACCOUNTS = `accounts`;
  private static TABLE_WORLDS = `worlds`;

  /**
   * init data create the game's database as "enigma_db"
   * if not exist,
   * then lauchn the initialisation of all datas
   * divised by categories ( as account, world etc...)
   * @param callBack
   */
  static init(callBack: CallableFunction) {
    let mysql = require("mysql");
    let connection = mysql.createConnection({
      host: Data.HOST,
      user: Data.USER,
      password: Data.PASSWORD,
    });
    connection.query(`create database if not exists ${Data.DB_NAME}`, function (
      err,
      res
    ) {});

    Data.CONNECTION = mysql.createConnection({
      host: Data.HOST,
      user: Data.USER,
      password: Data.PASSWORD,
      database: Data.DB_NAME,
    });
    MetaData.init(function (metaDatasInit) {
      ValuesPatternsData.init(function (patternData) {
        AccountData.initAccount(function (account) {
          WorldData.init(function (worldInit) {
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
  public static successOrFail(sql: String, callBack: CallableFunction) {
    Data.CONNECTION.query(sql, function (err, res) {
      if (err) {
        callBack(null);
      } else {
        callBack(res);
      }
    });
  }
  /**
   * Find at least one occurrence from SQL statement or fail in console
   * @param sql
   * @param callBack
   */
  public static findOrFail(sql: String, callBack: CallableFunction) {
    Data.CONNECTION.query(sql, function (err, res) {
      if (err) {
        console.error(err);
        callBack(null);
      } else {
        if (res && res.length > 0) {
          callBack(true);
        } else {
          callBack(false);
        }
      }
    });
  }
}
