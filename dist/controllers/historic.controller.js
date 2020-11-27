"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHistoric2 = void 0;
const historic2_data_1 = require("../data/historic2.data");
const readHistoric = (world_name, id, key_, values, callback) => { };
const readHistoric2 = (world_name, id, callback) => {
    historic2_data_1.readHistoricUserData(world_name, id, rows => {
        console.log('historic2', rows);
        callback(rows);
    });
};
exports.readHistoric2 = readHistoric2;
