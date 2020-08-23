import { initPatternPlayerData } from "./patternPlayer";
import { WorldData } from "./world.data";
import { initAccountData } from "./account.data";
import { initMetaData } from "./meta.data";
import { initPatternValueData } from "./valuesPatterns.data";
import { initCalculationData } from "./calcul.data";
import { environment } from "./../environment/environment";

const HOST = environment.db.host;
const USER = environment.db.user;
const PASSWORD = environment.db.password;
const DB_NAME = environment.db.name;
let co = null;

const initData = (callBack: CallableFunction) => {
  let mysql = require("mysql");
  let connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
  });
  connection.query(`create database if not exists ${DB_NAME}`, function (
    err,
    res
  ) {});

  co = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB_NAME,
  });
  initMetaData(function (metaDatasInit) {
    initCalculationData((calculation) => {
      initPatternPlayerData((patternPlayerRes) => {
        initPatternValueData(function (patternData) {
          initAccountData(function (account) {
            WorldData.init(function (worldInit) {
              callBack("init");
            });
          });
        });
      });
    });
  });
};
const successOrFailData = (sql: String, callBack: CallableFunction) => {
  co.query(sql, function (err, res) {
    if (err) {
      console.log("error data");
      callBack(null);
    } else {
      callBack(res);
    }
  });
};

export { initData, successOrFailData };
