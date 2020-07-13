"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
class ResourcePatternsData {
    static init(callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${ResourcePatternsData.TABLE_NAME}
        (
        name VARCHAR(36) PRIMARY KEY,
        user VARCHAR(36),
        
        start FLOAT,
        skill_start FLOAT      
        )
        `, function (res) {
            ResourcePatternsData.initValues(function (end) {
                callBack(end);
            });
        });
    }
    static initValues(callBack) {
        let values = [
            {
                name: "water",
                user: "player",
                start: 10,
                skill_start: 10
            },
            {
                name: "food",
                user: "player",
                start: 10,
                skill_start: 10
            },
            {
                name: "faith",
                user: "player",
                start: 10,
                skill_start: 10
            },
            {
                name: "wood",
                user: "player",
                start: 10,
                skill_start: 10
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
            INSERT INTO ${ResourcePatternsData.TABLE_NAME}
            (name, user, start, skill_start)
            VALUES ${valString}
        `, function (res) {
            callBack(res);
        });
    }
    static read(key, callback) {
        data_1.Data.successOrFail(`
            SELECT * FROM ${ResourcePatternsData.TABLE_NAME}
            WHERE user = "${key}"
        `, (res) => {
            callback(JSON.parse(JSON.stringify(res)));
        });
    }
}
exports.ResourcePatternsData = ResourcePatternsData;
ResourcePatternsData.TABLE_NAME = "ressourcePatterns";
