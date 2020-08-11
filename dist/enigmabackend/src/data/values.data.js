"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuesData = void 0;
const data_1 = require("./data");
const valuesPatterns_data_1 = require("./valuesPatterns.data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class ValuesData {
    static buildTable(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${ValuesData.TABLE_VALUES}
        ( 
        id VARCHAR(36),
        key_ VARCHAR(36),
        value FLOAT,
        primary key (id, key_)
        )
        `, function (res) {
            callBack(res);
        });
    }
    static createFromPattern(id, pattern, world_name, callBack) {
        valuesPatterns_data_1.ValuesPatternsData.read('player', (resourcePattern) => {
            let reqString = '';
            for (let resource of resourcePattern) {
                reqString += `("${id}","${resource.key_}", ${resource.start})`;
                if (resourcePattern[resourcePattern.length - 1] !== resource) {
                    reqString += ", ";
                }
            }
            data_1.Data.successOrFail(`
            INSERT INTO ${world_name}_${this.TABLE_VALUES}
            (id, key_, value)
            VALUES
            ${reqString}
            `, function (res) {
                callBack(res);
            });
        });
    }
    static readResources(id, world_name, callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${world_name}_${ValuesData.TABLE_VALUES}
        WHERE id = "${id}"
        `, function (res) {
            if (res && res.length > 0) {
                callBack(JSON.parse(JSON.stringify(res)));
            }
            else {
                callBack(null);
            }
        });
    }
    static addValue(id, world_name, key_, adder) {
        return new Promise((resolve, reject) => {
            data_1.Data.successOrFail(`
            
           UPDATE ${world_name}_${ValuesData.TABLE_VALUES}
           SET value = value + ${adder}
           WHERE id = "${id}" AND key_ = "${key_}"
            `, res => {
                if (res) {
                    resolve(true);
                }
                else {
                    reject();
                }
            });
        });
    }
    static updateValues(id, world_name, keysAdds) {
        let vals = ``;
        for (let row of keysAdds) {
            vals += `("${id}","${row.key_}", ${row.value})`;
            if (row !== keysAdds[keysAdds.length - 1]) {
                vals += ',';
            }
        }
        return new Promise((resolve, reject) => {
            data_1.Data.successOrFail(`
               INSERT INTO ${world_name}_${ValuesData.TABLE_VALUES} (id, key_, value)
               VALUES ${vals}
               ON DUPLICATE KEY UPDATE value=VALUES(value) 
            `, res => {
                if (res) {
                    resolve(true);
                }
                else {
                    reject();
                }
            });
        });
    }
}
exports.ValuesData = ValuesData;
ValuesData.TABLE_VALUES = `values`;
