"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Squeleton = void 0;
const model_pattern_1 = require("./model.pattern");
const squeleton_controller_1 = require("../controllers/squeleton.controller");
const squeleton_data_1 = require("../data/squeleton.data");
class Squeleton extends model_pattern_1.ModelPattern {
    constructor(key) {
        super();
        this.values = {};
    }
    readKey() {
        return "squeleton";
    }
    readDatas(world_name, obj, callback) {
        squeleton_data_1.readSqueletonById(world_name, obj['id'], callback);
    }
    updateValue(world_name, obj, key, value, callback) {
        console.log('I am a squeleton ready to update the value', obj['id'], key, value);
        squeleton_data_1.updateSqueletonData(world_name, obj['id'], key, value, callback);
    }
    die(world_name, obj, callback) {
        squeleton_data_1.updateSqueletonData(world_name, obj['id'], "life", -1, callback);
        //removeSqueletonDataById(world_name, obj['id'], callback);
    }
    pass(worldDatas, callback) {
        squeleton_controller_1.passSqueletons(worldDatas, callback);
    }
}
exports.Squeleton = Squeleton;
