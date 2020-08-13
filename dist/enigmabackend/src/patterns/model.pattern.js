"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelPattern = void 0;
const mobile_data_1 = require("./../data/mobile.data");
const valuesPatterns_data_1 = require("./../data/valuesPatterns.data");
class ModelPattern {
    constructor() {
        this.values = {};
        valuesPatterns_data_1.ValuesPatternsData.read(this.readKey(), (values) => {
            for (let row of values) {
                this.values[row["key_"]] = row["start"];
            }
            console.log(this.values);
        });
    }
    readKey() {
        return "";
    }
    pops(world_name, user, callBack) {
        if (this.values["life"]) {
            mobile_data_1.MobilesData.updateLifeAndPosition(world_name, user["id"], this.values["life"], 0, 0, (resLife) => {
                if (resLife) {
                    callBack(this.values["life"]);
                }
                else {
                    callBack(null);
                }
            });
        }
        else {
            callBack(null);
        }
    }
}
exports.ModelPattern = ModelPattern;
