"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class SkillsData {
    static init(callBack) {
        data_1.Data.successOrFail(`
        `, (res) => {
        });
    }
    static buildTable(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${SkillsData.TABLE_SKILLS_NAME}
        ( 
        id VARCHAR(36) primary key,
        key_ VARCHAR(36),
        value FLOAT
        )
        `, function (res) {
            callBack(res);
        });
    }
}
exports.SkillsData = SkillsData;
SkillsData.TABLE_SKILLS_NAME = `skills`;
