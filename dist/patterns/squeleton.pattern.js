"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Squeleton = void 0;
const model_pattern_1 = require("./model.pattern");
const squeleton_controller_1 = require("../controllers/squeleton.controller");
class Squeleton extends model_pattern_1.ModelPattern {
    constructor(key) {
        super();
        this.values = {};
    }
    readKey() {
        return "squeleton";
    }
    pass(worldDatas, callback) {
        squeleton_controller_1.passSqueletons(worldDatas, callback);
    }
}
exports.Squeleton = Squeleton;
