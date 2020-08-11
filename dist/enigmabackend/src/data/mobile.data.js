"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobilesData = void 0;
const data_1 = require("./data");
const TABLE_NAME = "mobiles";
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
class MobilesData {
    static buildMobileDatas(datas, callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
        ( 
        id VARCHAR(36) primary key,
        image_key VARCHAR(36), 
        position POINT
        )
        `, function (res) {
            console.log(res);
            callBack(res);
        });
    }
}
exports.MobilesData = MobilesData;
