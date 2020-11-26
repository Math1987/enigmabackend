import { successOrFailData } from "./data";
import { World } from "../models/world";
import { buildWorldPlayerData } from "./player.data";
import { buildWorldSqueletonData } from "./squeleton.data";

const TABLE_NAME = "worlds";

const initWorldData = (callBack: CallableFunction) => {
  successOrFailData(
    `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
      (
      name VARCHAR(36) primary key,
      width INT,
      height INT,
      rounds INT
      )
      `,
    function (res) {
      readWorldsData(function (worlds: Array<World>) {

        /**
         * 
         * @param i iterate to check all world and reload everything for each of them
         * send call back when finish
         */
        function buildWorld(i) {
          if (i < worlds.length) {
            buildWorldData(worlds[i], function (worldRes) {
              buildWorld(i + 1);
            });
          } else {
            callBack("done");
          }
        }

        buildWorld(0);
      });
    }
  );
};
const readWorldData = (
  world_name: string,
  callBack: CallableFunction
): Array<World> => {
  successOrFailData(
    `
      SELECT ${TABLE_NAME}.*, clans.* FROM ${TABLE_NAME}
      INNER JOIN clans
      WHERE ${TABLE_NAME}.name = "${world_name}"
      `,
    function (res) {
      if (res && res.length > 0) {
        console.log('getting world', res[0]);
        callBack(JSON.parse(JSON.stringify(res[0])));
      } else {
        callBack([]);
      }
    }
  );
};
const readWorldsData = (callBack: CallableFunction): Array<World> => {
  successOrFailData(`
      SELECT ${TABLE_NAME}.*, clans.* FROM ${TABLE_NAME}
      INNER JOIN clans
      `,
    function (res) {
      if (res) {

        let worlds = [] ;
        for ( let row of res ){
          let focusWorld = null; 
          for ( let w of worlds ){
            if ( w['name'] === row['name']){
              focusWorld = w ;
              break ;
            }
          }

          if ( !focusWorld ){
            focusWorld = JSON.parse(JSON.stringify(row));
            focusWorld['clans'] = [] ;
            worlds.push(focusWorld);
          }

          let clan = {
            key_ : row['key_'],
            color : row['color'],
            img : row['img']
          };
          focusWorld['clans'].push(clan);


        }
        console.log(worlds);

        callBack(worlds);
      } else {
        callBack([]);
      }
    }
  );
};
const updateWorldConstantData = (worldName, key, value, callback){

  successOrFailData(`
    update ${TABLE_NAME} set ${key} = ${value} 
    where name = "${worldName}"
  `, res => {
    callback(res);
  })

}
const buildWorldData = (datas: World, callBack: CallableFunction) => {

  console.log('build world at start');

  successOrFailData(
    `
      INSERT INTO ${TABLE_NAME}
      (name, width, height)
      VALUES ("${datas.name}", ${datas.width}, ${datas.height})
      `,
    function (worldInsert) {

      successOrFailData(
        `
          ALTER TABLE ${TABLE_NAME}
          ADD COLUMN squeletons FLOAT NOT NULL DEFAULT 0.01 ;
          `,
        function (fieldRes) {
        
          buildWorldPlayerData(datas, (playerRes) => {
            buildWorldSqueletonData(datas, (squeletonsRes)=> {
              callBack("done");
            });
          });

        });

    }
  );
};

export {
   initWorldData,
   readWorldData, 
   readWorldsData,
   updateWorldConstantData,
   buildWorldData 
  };
