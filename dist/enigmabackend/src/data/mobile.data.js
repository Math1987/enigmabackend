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
        key_ VARCHAR(36), 
        name VARCHAR(36),
        position POINT,
        life FLOAT,
        life_max FLOAT
        )
        `, function (res) {
            callBack(res);
        });
    }
    static createMobile(world_name, id, draw_key, name, x, y, life, callBack) {
        const position = `POINT(${x},${y})`;
        data_1.Data.successOrFail(`
        INSERT INTO ${world_name}_${TABLE_NAME}
        (id, key_, name, position, life, life_max)
        VALUES
        ("${id}", "${draw_key}", "${name}", ${position}, ${life}, ${life})
        `, function (res) {
            callBack(res);
        });
    }
    static readByPositions(world_name, positions, callBack) {
        let posRequete = "";
        for (let p of positions) {
            if (posRequete.length > 0) {
                posRequete += ",";
            }
            posRequete += `POINT(${p.x},${p.y})`;
        }
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
    static readById(world_name, id, callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${world_name}_${TABLE_NAME}
        WHERE id = "${id}"
        `, function (res) {
            if (res && res.length > 0) {
                callBack(JSON.parse(JSON.stringify(res[0])));
            }
            else {
                callBack(null);
            }
        });
    }
    static updatePosition(world_name, id, x, y, callBack) {
        data_1.Data.successOrFail(`
            UPDATE ${world_name}_${TABLE_NAME} 
            SET position = POINT( ${x},${y})
            WHERE id = "${id}"
        `, (res) => {
            callBack(res);
        });
    }
}
exports.MobilesData = MobilesData;
