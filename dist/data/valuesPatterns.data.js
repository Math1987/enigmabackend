"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAllPatternData = exports.readPatterValueData = exports.initValuesData = exports.initPatternValueData = void 0;
const data_1 = require("./data");
const TABLE_NAME = "valuesPatterns";
const initPatternValueData = (callBack) => {
    data_1.successOrFailData(`
      DROP TABLE ${TABLE_NAME}
      `, function (res) { });
    data_1.successOrFailData(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
      (
      key_ VARCHAR(36),
      icon INT,
      user VARCHAR(36),
      start FLOAT,
      PRIMARY KEY (key_, user)
      )
      `, function (res) {
        initValuesData(function (end) {
            callBack(end);
        });
    });
};
exports.initPatternValueData = initPatternValueData;
const initValuesData = (callBack) => {
    let values = [
        //LIFE
        {
            key_: "life",
            icon: 0,
            user: "player",
            start: 100,
        },
        {
            key_: "life_max",
            icon: 0,
            user: "player",
            start: 100,
        },
        {
            key_: "counter",
            icon: 0,
            user: "player",
            start: 0.5,
        },
        //RESOURCES
        {
            key_: "water",
            icon: 7,
            user: "player",
            start: 10,
        },
        {
            key_: "food",
            icon: 9,
            user: "player",
            start: 10,
        },
        {
            key_: "faith",
            icon: 8,
            user: "player",
            start: 10,
        },
        {
            key_: "wood",
            icon: 2,
            user: "player",
            start: 10,
        },
        //SKILLS
        {
            key_: "skill_attack",
            icon: 1,
            user: "player",
            start: 10,
        },
        {
            key_: "skill_defense",
            icon: 5,
            user: "player",
            start: 10,
        },
        {
            key_: "skill_food",
            icon: 9,
            user: "player",
            start: 10,
        },
        {
            key_: "skill_water",
            icon: 7,
            user: "player",
            start: 10,
        },
        {
            key_: "skill_faith",
            icon: 8,
            user: "player",
            start: 10,
        },
        {
            key_: "skill_wood",
            icon: 10,
            user: "player",
            start: 10,
        },
        //STOCK
        {
            key_: "move",
            icon: 6,
            user: "player",
            start: 20,
        },
        {
            key_: "action",
            icon: 0,
            user: "player",
            start: 8,
        },
        {
            key_: "addskills",
            icon: 5,
            user: "player",
            start: 50,
        },
        //ACTIONS
        {
            key_: "attack",
            icon: 1,
            user: "player",
            start: 20,
        },
    ];
    let valString = "";
    for (let row of values) {
        if (valString.length > 0) {
            valString += ", ";
        }
        valString += `("${row.key_}",${row.icon},"${row.user}","${row.start}")`;
    }
    data_1.successOrFailData(`
          INSERT INTO ${TABLE_NAME}
          (key_, icon, user, start)
          VALUES ${valString}
      `, function (res) {
        callBack(res);
    });
};
exports.initValuesData = initValuesData;
const readPatterValueData = (key, callback) => {
    data_1.successOrFailData(`
          SELECT * FROM ${TABLE_NAME}
          WHERE user = "${key}"
      `, (res) => {
        callback(JSON.parse(JSON.stringify(res)));
    });
};
exports.readPatterValueData = readPatterValueData;
const readAllPatternData = (callBack) => {
    data_1.successOrFailData(`
          SELECT * FROM ${TABLE_NAME}
      `, (res) => {
        callBack(JSON.parse(JSON.stringify(res)));
    });
};
exports.readAllPatternData = readAllPatternData;
