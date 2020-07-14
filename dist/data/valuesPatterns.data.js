"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
class ValuesPatternsData {
    static init(callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${ValuesPatternsData.TABLE_NAME}
        (
        key_ VARCHAR(36),
        icon INT,
        user VARCHAR(36),
        start FLOAT,
        PRIMARY KEY (key_, user)
        )
        `, function (res) {
            ValuesPatternsData.initValues(function (end) {
                callBack(end);
            });
        });
    }
    static initValues(callBack) {
        let values = [
            {
                key_: "water",
                icon: 53,
                user: "player",
                start: 10
            },
            {
                key_: "food",
                icon: 55,
                user: "player",
                start: 10
            },
            {
                key_: "faith",
                icon: 7,
                user: "player",
                start: 10
            },
            {
                key_: "wood",
                icon: 18,
                user: "player",
                start: 10
            },
            {
                key_: "attack",
                icon: 32,
                user: "player",
                start: 10
            },
            {
                key_: "defense",
                icon: 34,
                user: "player",
                start: 10
            },
            {
                key_: "hunter",
                icon: 32,
                user: "player",
                start: 10
            },
            {
                key_: "dowser",
                icon: 17,
                user: "player",
                start: 10
            },
            {
                key_: "priest",
                icon: 8,
                user: "player",
                start: 10
            },
            {
                key_: "woodcutter",
                icon: 35,
                user: "player",
                start: 10
            }
        ];
        let valString = '';
        for (let row of values) {
            if (valString.length > 0) {
                valString += ', ';
            }
            valString += `("${row.key_}",${row.icon},"${row.user}","${row.start}")`;
        }
        data_1.Data.successOrFail(`
            INSERT INTO ${ValuesPatternsData.TABLE_NAME}
            (key_, icon, user, start)
            VALUES ${valString}
        `, function (res) {
            callBack(res);
        });
    }
    static read(key, callback) {
        data_1.Data.successOrFail(`
            SELECT * FROM ${ValuesPatternsData.TABLE_NAME}
            WHERE user = "${key}"
        `, (res) => {
            callback(JSON.parse(JSON.stringify(res)));
        });
    }
    static readAll(callBack) {
        data_1.Data.successOrFail(`
            SELECT * FROM ${ValuesPatternsData.TABLE_NAME}
        `, (res) => {
            callBack(JSON.parse(JSON.stringify(res)));
        });
    }
}
exports.ValuesPatternsData = ValuesPatternsData;
ValuesPatternsData.TABLE_NAME = "valuesPatterns";
