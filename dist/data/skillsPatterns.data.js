"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
class SkillsPatternsData {
    static init(callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${SkillsPatternsData.TABLE_NAME}
        (
        name VARCHAR(36) PRIMARY KEY,
        user VARCHAR(36),
        user VARCHAR(36),
        value FLOAT        
        )
        `, function (res) {
        });
    }
}
exports.SkillsPatternsData = SkillsPatternsData;
SkillsPatternsData.TABLE_NAME = "skills";
