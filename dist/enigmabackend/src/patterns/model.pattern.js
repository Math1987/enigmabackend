"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelPattern = void 0;
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
}
exports.ModelPattern = ModelPattern;
