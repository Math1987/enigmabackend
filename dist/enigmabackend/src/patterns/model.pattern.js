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
        });
    }
    readKey() {
        return "";
    }
    create(world_name, id, callback) { }
    move(world_name, id, x, y, callback) {
        callback(null);
    }
    addValue(world_name, id, key, value, callback) {
        callback(null);
    }
    pops(world_name, user, callBack) {
        if (this.values["life"]) {
            mobile_data_1.MobilesData.updateLifeAndPosition(world_name, user["id"], this.values["life"], 0, 0, (resLife) => {
                if (resLife) {
                    user["life"] = this.values["life"];
                    user["position"] = { x: 0, y: 0 };
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
