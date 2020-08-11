"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobilesData = void 0;
const data_1 = require("./data");
const TABLE_NAME = "mobiles";
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class MobilesData {
    static buildMobileDatas(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
        ( 
        id VARCHAR(36) primary key,
        image_key VARCHAR(36), 
        position POINT
        )
        `, function (res) {
            console.log(res);
            callBack(res);
        });
    }
    static createMobile(world_name, id, draw_key, x, y, callBack) {
        const position = `POINT(${x},${y})`;
        data_1.Data.successOrFail(`
        INSERT INTO ${world_name}_${TABLE_NAME}
        (id, image_key, position)
        VALUES
        ("${id}", "${draw_key}", ${position})
        `, function (res) {
            console.log(res);
            callBack(res);
        });
    }
    static readByPositions(world_name, positions, callBack) {
        let posRequete = '';
        for (let p of positions) {
            if (posRequete.length > 0) {
                posRequete += ',';
            }
            posRequete += `POINT(${p.x},${p.y})`;
        }
        console.log(world_name);
        console.log(posRequete);
        data_1.Data.successOrFail(`
        SELECT * FROM ${world_name}_${TABLE_NAME}
        WHERE position IN (${posRequete})
        `, function (res) {
            if (res) {
                callBack(JSON.parse(JSON.stringify(res)));
            }
            else {
                callBack(null);
            }
        });
    }
}
exports.MobilesData = MobilesData;
