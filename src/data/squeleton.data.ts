import { successOrFailData } from "./data";
import { World } from "../models/world";
import { Squeleton } from "../patterns/squeleton.pattern";


/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
const TABLE_NAME = "squeletons" ;
export const TABLE_SQUELETONS = TABLE_NAME ;
const buildWorldSqueletonData = (datas: World, callBack: CallableFunction) =>{

    console.log('create table for squeletons', TABLE_NAME );

  successOrFailData(
    `
      CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
      ( 
      id VARCHAR(36) primary key,
      position POINT,
      life FLOAT
      )
      `,
    function (res) {
      callBack(res);
    }
  );



}
const insertSqueletonData = (world_name, squeleton, callBack) => {
  
  console.log('insert squeleton', squeleton.x, squeleton.y);

  successOrFailData(
    `
        INSERT INTO ${world_name}_${TABLE_NAME}
        (
        id,
        position,
        life
        )
        VALUES ( 
        uuid(), 
        POINT(${squeleton.x},${squeleton.y}),
        ${squeleton.life}
        )
        `,
    function (playerRes) {
      callBack(playerRes);

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

const insertSqueletonsData = (world_name, squeletons, callback) => {

  let values = '' ;
  for ( let squeleton of squeletons ){
    values += '(' ;
    values += `uuid(),` ;
    values += `POINT(${squeleton.x},${squeleton.y}),`;
    values += `${squeleton.life}`;
    values += ')' ;
    if ( squeleton !== squeletons[squeletons.length-1]){
      values += ', ' ;
    }
  }

  successOrFailData(
    `
    INSERT INTO ${world_name}_${TABLE_NAME}
    (
    id,
    position,
    life
    )
    VALUES ${values}
  `,
    (dataRes) => {
      if (dataRes) {
        callback(dataRes);
      } else {
        callback(null);
      }
    }
  );

}


const readSqueletonValue = (world_name, id, key, callback) => {
  successOrFailData(
    `
    SELECT ${key} FROM ${world_name}_${TABLE_NAME}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      if (updateRes && updateRes.length > 0) {
        callback(updateRes[0][key]);
      } else {
        callback(null);
      }
    }
  );
};
const readSqueletonValues = (world_name, id, keys: string[], callback) => {
  let keysString = "";
  for (let i = 0; i < keys.length; i++) {
    keysString += `${keys[i]}`;
    if (i < keys.length - 1) {
      keysString += ",";
    }
  }

  successOrFailData(
    `
    SELECT ${keysString} FROM ${world_name}_${TABLE_NAME}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      if (updateRes && updateRes.length > 0) {
        callback(JSON.stringify(updateRes[0]));
      } else {
        callback(null);
      }
    }
  );
};
const addSqueletonValueData = (
  world_name: string,
  id: string,
  key: string,
  value,
  callback
) => {
  successOrFailData(
    `
    UPDATE ${world_name}_${TABLE_NAME}
    SET ${key} = GREATEST(0,${key} + ${value})
    WHERE id = "${id}"
  `,
    (updateRes) => {
      callback(updateRes);
    }
  );
};
const addSqueletonValuesData = (
  world_name: string,
  id: string,
  keyVals: Object,
  callback
) => {
  let updatesString = `SET `;
  let i = 0;
  for (let key in keyVals) {
    updatesString += `${key} = ${key} + ${keyVals[key]}`;
    if (i < Object.keys(keyVals).length - 1) {
      updatesString += ",";
      i++;
    }
  }
  successOrFailData(
    `
    UPDATE ${world_name}_${TABLE_NAME}
    ${updatesString}
    WHERE id = "${id}"
  `,
    (updateRes) => {
      callback(updateRes);
    }
  );
};
const readSqueletonById = (world_name, id: string, callback) => {
  successOrFailData(
    `
      SELECT * FROM ${world_name}_${TABLE_NAME}
      WHERE id = "${id}"
      `,
    function (charaRes) {
      if (charaRes && charaRes.length > 0) {
        charaRes[0]['key'] = charaRes[0]['key_'];
        callback(JSON.parse(JSON.stringify(charaRes[0])));
      } else {
        callback(null);
      }
    }
  );
};
const readSqueletonsById = (world_name, ids: string[], callback) => {

  let idsStrings = '(' ;
  for ( let id of ids ){
    idsStrings += `"${id}"` ;
    if ( id !== ids[ids.length-1]){
      idsStrings += ',';
    }
  }
  idsStrings += ')' ;
  successOrFailData(
    `
      SELECT * FROM ${world_name}_${TABLE_NAME}
      WHERE id IN ${idsStrings}
      `,
    function (charaRes) {
      if (charaRes && charaRes.length > 0) {
        for ( let i = 0 ; i < charaRes.length ; i ++ ){
          charaRes[i]['key'] = charaRes[i]['key_'];
        }

        callback(JSON.parse(JSON.stringify(charaRes)));
      } else {
        callback(null);
      }
    }
  );
};
const readSqueletonByPositions = (
  world_name,
  positions: { x: number; y: number }[],
  callback
) => {
  let posRequete = "";
  for (let p of positions) {
    if (posRequete.length > 0) {
      posRequete += ",";
    }
    posRequete += `POINT(${p.x},${p.y})`;
  }

  if ( posRequete.length > 0 ){
    successOrFailData(
      `
        SELECT * FROM ${world_name}_${TABLE_NAME}
        WHERE position IN (${posRequete})
        `,
      function (res) {
        if (res) {
          let finalObj = [];
          for (let row of res) {
            let newObj = row;
            newObj["x"] = row["position"]["x"];
            newObj["y"] = row["position"]["y"];
            newObj["key"] = "squeleton" ;
            finalObj.push(newObj);
          }
          callback(JSON.parse(JSON.stringify(finalObj)));
        } else {
          callback(null);
        }
      }
    );
  }else{callback(null)};

};
const readAllSqueletonsData = (world_name, callback) =>{

  successOrFailData(`
  SELECT * FROM ${world_name}_${TABLE_NAME}
  `, players =>{
    callback(players);
  })

}
const updateSqueletonPositionData = (world_name:string, id: string, x : number, y : number, callback => {

  successOrFailData(
    `
          UPDATE ${world_name}_${TABLE_NAME}
          SET position = POINT( ${x},${y})
          WHERE id = "${id}"
      `,
    (res) => {
      callback(res);
    }
  );
    

});
const updateSqueletonData = (world_name:string, chara, pattern, callback )=>{

  let stringCharas = '' ;
  for ( let key in chara ){
    if ( typeof chara[key] === "number" && key in pattern ){
      stringCharas += `${key} = ${chara[key]},`;
    } 
  }
  if ( stringCharas.length > 0 ){
    stringCharas = stringCharas.substring(0, stringCharas.length-1);
    successOrFailData(`
      UPDATE ${world_name}_${TABLE_NAME}  
      SET ${stringCharas}
      WHERE id = "${chara['id']}"
    `, updateRes => {
      callback(updateRes);
    })
  }else{
    callback(null);
  }


}

const removeSqueletonDataById = (  world_name: string, id: String,callback : CallableFunction) => {
  successOrFailData(
    `
  DELETE FROM ${world_name}_${TABLE_NAME}  
  WHERE id = "${id}"
          `,
    (res) => {
      if (res ) {
        console.log('remove done', res);
        callback('done');
      } else {
        callback(null);
      }
    }
  );
}
const removeSqueletonsData  = ( world_name, squeletons : string[], callback : CallableFunction) => {

  let ids = '(' ;
  for ( let id of squeletons ){
    ids += `'${id}'`
    if ( id !== squeletons[squeletons.length-1]){
      ids += ', ' ;
    }
  }
  ids += ')' ;

  successOrFailData(
    `
      DELETE FROM ${world_name}_${TABLE_NAME}  
      WHERE id IN ${ids}
          `,
    (res) => {
      if (res ) {
        console.log('remove done', res);
        callback('done');
      } else {
        callback(null);
      }
    }
  );
}

export {
  buildWorldSqueletonData, 
  insertSqueletonData,
  insertSqueletonsData,
  readSqueletonValue,
  readSqueletonValues,
  addSqueletonValueData,
  addSqueletonValuesData,
  readSqueletonById,
  readSqueletonsById,
  readAllSqueletonsData,
  updateSqueletonData,
  readSqueletonByPositions,
  updateSqueletonPositionData,
  removeSqueletonDataById,
  removeSqueletonsData
};
