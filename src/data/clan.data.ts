import { successOrFailData } from "./data";
import { World } from "../models/world";


const TABLE_NAME = "clan" ;
export const TABLE_SQUELETONS = TABLE_NAME ;
const buildWorldClanData = (datas: World, callBack: CallableFunction) =>{

    console.log('create table for clans', TABLE_NAME );

  successOrFailData(
    `
      CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
      ( 
      key_ VARCHAR(36) primary key,
      color VARCHAR(36),
      img TEXT
      )
      `,
    function (res) {
      callBack(res);
    }
  );



}
const insertClanData = (world_name, clanName, color, image, callBack) => {
  
  console.log('insert clan', clanName );

  successOrFailData(
    `
        INSERT INTO ${world_name}_${TABLE_NAME}
        (
        key_,
        color,
        img
        )
        VALUES ( 
        "${clanName}", 
        "${color}", 
        "${image}"
        )
        `,
    function (clanRes) {
      callBack(clanRes);

      // if (playerRes) {
      //   Data.successOrFail(
      //     `
      //           UPDATE ${Data.TABLE_ACCOUNTS}
      //           set world = "${world_name}"
      //           WHERE id = "${character.id}"
      //           `,
      //     function (updateWorld) {
      //       ValuesData.createFromPattern(
      //         character.id,
      //         "player",
      //         world_name,
      //         (res) => {
      //           character["world"] = world_name;
      //           callBack(character);
      //         }
      //       );
      //     }
      //   );
      // } else {
      //   callBack(null);
      // }
    }
  );
};


const readClans = (world_name, callback) => {
  successOrFailData(
    `
    SELECT * FROM ${world_name}_${TABLE_NAME}
  `,
    (updateRes) => {
      if (updateRes && updateRes.length > 0) {
        callback(updateRes);
      } else {
        callback(null);
      }
    }
  );
};


export {
    buildWorldClanData,
    insertClanData,
    readClans
};
