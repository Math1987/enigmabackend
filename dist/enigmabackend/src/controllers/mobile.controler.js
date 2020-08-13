"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMobile = void 0;
const mobile_data_1 = require("./../data/mobile.data");
const values_data_1 = require("./../data/values.data");
exports.getMobile = (world_name, id, callBack) => {
    let mobileObj = {};
    values_data_1.ValuesData.readAsObject(world_name, id, (values) => {
        if (values) {
            mobile_data_1.MobilesData.readById(world_name, id, (mobile) => {
                Object.assign(mobileObj, values, mobile);
                callBack(mobileObj);
            });
        }
        else {
            callBack(null);
        }
    });
};
