"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainPatterns = void 0;
const main_patterns_1 = require("./main.patterns");
const chara_pattern_1 = require("./chara.pattern");
class MainPatterns {
    static init(callBack) {
        main_patterns_1.MainPatterns.PATTERNS = {
            humanmasculin: new chara_pattern_1.Player(),
            dwarhumanfeminine: new chara_pattern_1.Player(),
            dwarfmasculin: new chara_pattern_1.Player(),
            dwarffeminine: new chara_pattern_1.Player(),
            elfmasculin: new chara_pattern_1.Player(),
            elffeminine: new chara_pattern_1.Player(),
            vampiremasculin: new chara_pattern_1.Player(),
            vampirefeminine: new chara_pattern_1.Player(),
        };
        callBack("ok");
    }
    static getPattern(key) {
        return main_patterns_1.MainPatterns.PATTERNS[key];
    }
}
exports.MainPatterns = MainPatterns;
MainPatterns.PATTERNS = {};
