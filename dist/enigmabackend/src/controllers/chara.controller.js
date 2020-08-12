"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.move = exports.getChara = void 0;
const mobile_data_1 = require("./../data/mobile.data");
const values_data_1 = require("./../data/values.data");
exports.getChara = (world_name, id, callBack) => {
    let chara = {};
    values_data_1.ValuesData.readAsObject(world_name, id, (values) => {
        if (values) {
            chara = values;
            mobile_data_1.MobilesData.readById(world_name, id, (mobile) => {
                for (let key in mobile) {
                    chara[key] = mobile[key];
                }
                callBack(chara);
            });
        }
        else {
            callBack(null);
        }
    });
};
exports.move = (id, x, y) => { };
