"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainPatterns = void 0;
const main_patterns_1 = require("./main.patterns");
const chara_pattern_1 = require("./chara.pattern");
class MainPatterns {
    static init(callBack) {
        console.log("init");
        main_patterns_1.MainPatterns.PATTERNS = {
            dwarfmasculin: new chara_pattern_1.Player(),
            dwarffeminine: new chara_pattern_1.Player(),
            vampiremasculin: new chara_pattern_1.Player(),
            vampirefeminine: new chara_pattern_1.Player(),
        };
        console.log(main_patterns_1.MainPatterns.PATTERNS);
        callBack("ok");
    }
    static getPattern(key) {
        return main_patterns_1.MainPatterns.PATTERNS[key];
    }
}
exports.MainPatterns = MainPatterns;
MainPatterns.PATTERNS = {};
