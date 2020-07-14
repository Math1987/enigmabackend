"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
class ResourcePatternsData {
    static init(callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${ResourcePatternsData.TABLE_NAME}
        (
        name VARCHAR(36),
        user VARCHAR(36),
        start FLOAT,
        PRIMARY KEY (name, user)
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
                start: 10
            },
            {
                name: "food",
                user: "player",
                start: 10
            },
            {
                name: "faith",
                user: "player",
                start: 10
            },
            {
                name: "wood",
                user: "player",
                start: 10
            },
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
            }
        ];
        let valString = '';
        for (let row of values) {
            if (valString.length > 0) {
                valString += ', ';
            }
            valString += `("${row.name}","${row.user}","${row.start}")`;
        }
        data_1.Data.successOrFail(`
            INSERT INTO ${ResourcePatternsData.TABLE_NAME}
            (name, user, start)
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
