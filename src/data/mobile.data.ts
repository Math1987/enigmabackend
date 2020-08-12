import { Data } from "./data";
import { World } from "../models/world";

const TABLE_NAME = "mobiles";
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
export class MobilesData {
  static buildMobileDatas(datas: World, callBack: CallableFunction) {
    Data.successOrFail(
      `
        CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
        ( 
        id VARCHAR(36) primary key,
        key_ VARCHAR(36), 
        position POINT,
        life FLOAT
        )
        `,
      function (res) {
        callBack(res);
      }
    );
  }
  static createMobile(
    world_name: string,
    id: string,
    draw_key: string,
    x,
    y,
    life,
    callBack
  ) {
    const position = `POINT(${x},${y})`;

    Data.successOrFail(
      `
        INSERT INTO ${world_name}_${TABLE_NAME}
        (id, key_, position, life)
        VALUES
        ("${id}", "${draw_key}", ${position}, ${life})
        `,
      function (res) {
        callBack(res);
      }
    );
  }
  static readByPositions(
    world_name: string,
    positions: { x: number; y: number }[],
    callBack
  ) {
    let posRequete = "";
    for (let p of positions) {
      if (posRequete.length > 0) {
        posRequete += ",";
      }
      posRequete += `POINT(${p.x},${p.y})`;
    }

    Data.successOrFail(
      `
        SELECT * FROM ${world_name}_${TABLE_NAME}
        WHERE position IN (${posRequete})
        `,
      function (res) {
        if (res) {
          callBack(JSON.parse(JSON.stringify(res)));
        } else {
          callBack(null);
        }
      }
    );
  }
  static readById(world_name: string, id: string, callBack: Function) {
    Data.successOrFail(
      `
        SELECT * FROM ${world_name}_${TABLE_NAME}
        WHERE id = "${id}"
        `,
      function (res) {
        if (res && res.length > 0) {
          callBack(JSON.parse(JSON.stringify(res[0])));
        } else {
          callBack(null);
        }
      }
    );
  }
  static updatePosition(
    world_name: string,
    id: string,
    x: number,
    y: number,
    callBack: Function
  ) {
    Data.successOrFail(
      `
            UPDATE ${world_name}_${TABLE_NAME} 
            SET position = POINT( ${x},${y})
            WHERE id = "${id}"
        `,
      (res) => {
        callBack(res);
      }
    );
  }
}
