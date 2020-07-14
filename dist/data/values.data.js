"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const valuesPatterns_data_1 = require("./valuesPatterns.data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class ValuesData {
    static buildTable(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${ValuesData.TABLE_RESOURCE}
        ( 
        id VARCHAR(36),
        key_ VARCHAR(36),
        value FLOAT,
        skill FLOAT,
        primary key (id, key_)
        )
        `, function (res) {
            callBack(res);
        });
    }
    static createFromPattern(id, pattern, world_name, callBack) {
        valuesPatterns_data_1.ValuesPatternsData.read('player', (resourcePattern) => {
            console.log('read resources pattenrs');
            console.log(resourcePattern);
            let reqString = '';
            for (let resource of resourcePattern) {
                reqString += `("${id}","${resource.name}", ${resource.start})`;
                if (resourcePattern[resourcePattern.length - 1] !== resource) {
                    reqString += ", ";
                }
            }
            data_1.Data.successOrFail(`
            INSERT INTO ${world_name}_${this.TABLE_RESOURCE}
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
        SELECT * FROM ${world_name}_${ValuesData.TABLE_RESOURCE}
        WHERE id = "${id}"
        `, function (res) {
            callBack(JSON.parse(JSON.stringify(res)));
        });
    }
}
exports.ValuesData = ValuesData;
ValuesData.TABLE_RESOURCE = `values`;
