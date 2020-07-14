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
        start FLOAT        
        )
        `, function (res) {
            console.log(res);
            SkillsPatternsData.initValues(function (end) {
                callBack(end);
            });
        });
    }
    static initValues(callBack) {
        let values = [
            {
                name: "attack",
                user: "player",
                start: 10
            },
            {
                name: "defense",
                user: "player",
                start: 10
            },
            {
                name: "priest",
                user: "player",
                start: 10
            },
            {
                name: "woodcutter",
                user: "player",
                start: 10
            }
        ];
        let valString = '';
        for (let row of values) {
            if (valString.length > 0) {
                valString += ', ';
            }
            valString += `("${row.name}","${row.user}","${row.start}","${row.skill_start}")`;
        }
        data_1.Data.successOrFail(`
            INSERT INTO ${SkillsPatternsData.TABLE_NAME}
            (name, user, start, skill_start)
            VALUES ${valString}
        `, function (res) {
            callBack(res);
        });
    }
    static read(key, callback) {
        data_1.Data.successOrFail(`
            SELECT * FROM ${SkillsPatternsData.TABLE_NAME}
            WHERE user = "${key}"
        `, (res) => {
            callback(JSON.parse(JSON.stringify(res)));
        });
    }
}
exports.SkillsPatternsData = SkillsPatternsData;
SkillsPatternsData.TABLE_NAME = "skillpatterns";
