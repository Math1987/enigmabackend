import { initPatternPlayerData } from "./patternPlayer";
import { initWorldData } from "./world.data";
import { initAccountData } from "./account.data";
import { initMetaData } from "./meta.data";
import { initPatternValueData } from "./valuesPatterns.data";
import { initCalculationData } from "./calcul.data";
import { environment } from "./../environment/environment";
import { initRankKillData } from "./rank_kill.data";
import { initHistoricData } from "./historic.data";
import { initClansData } from "./clan.data";
import { initHistoric2Data } from "./historic2.data";
import { readCharaById } from "./player.data";
import { readSqueletonById } from "./squeleton.data";
import { initDeadData, readDeadByIdData } from "./dead.data";

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
  initMetaData((metaDatasInit) => {
    initCalculationData((calculation) => {
      initPatternPlayerData((patternPlayerRes) => {
        initPatternValueData((patternData) => {
          initAccountData((account) => {
            initHistoricData((resHistoric) => {
              initHistoric2Data((resHistoric) => {
                initDeadData((resDeads) => {
                  initRankKillData((resRankKill) => {
                    initWorldData((worldInit) => {
                      initClansData(clanRes => {
                        callBack("init");
                      })
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
const successOrFailData = (sql: String, callBack: CallableFunction) => {
  co.query(sql, function (err, res) {
    if (err) {
      console.log("error data", err);
      callBack(null);
    } else {
      callBack(res);
    }
  });
};


const readObjById = (world_name, id, callback ){

  console.log('readObjById');

  readCharaById(world_name, id, charaRes => {

    if ( !charaRes ){

      readSqueletonById(world_name, id, squeletonRes => {

        if ( !squeletonRes ){

          readDeadByIdData(world_name, id, deadRes => {

            if ( deadRes ){
              let lastDatas = JSON.parse(JSON.stringify(deadRes));
              lastDatas['key'] = lastDatas['key_'];
              console.log('dead thing found', lastDatas);
              callback(lastDatas);
            }else{
              callback(null);
            }


          });

        }else{
          callback(squeletonRes);
        }

      });

    }else{
      callback(charaRes);
    }
  })

}

export { initData, successOrFailData, readObjById };
