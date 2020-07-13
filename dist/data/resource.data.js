"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const resourcePatterns_data_1 = require("./resourcePatterns.data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class ResourceData {
    static buildTable(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${ResourceData.TABLE_RESOURCE}
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
        resourcePatterns_data_1.ResourcePatternsData.read('player', (resourcePattern) => {
            let reqString = '';
            for (let resource of resourcePattern) {
                reqString += `("${id}","${resource.name}", ${resource.start}, ${resource.skill_start})`;
                if (resourcePattern[resourcePattern.length - 1] !== resource) {
                    reqString += ", ";
                }
            }
            data_1.Data.successOrFail(`
            INSERT INTO ${world_name}_${this.TABLE_RESOURCE}
            (id, key_, value, skill)
            VALUES
            ${reqString}
            `, function (res) {
                callBack(res);
            });
        });
    }
    static readResources(id, world_name, callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${world_name}_${ResourceData.TABLE_RESOURCE}
        WHERE id = "${id}"
        `, function (res) {
            callBack(JSON.parse(JSON.stringify(res)));
        });
    }
}
exports.ResourceData = ResourceData;
ResourceData.TABLE_RESOURCE = `resources`;
