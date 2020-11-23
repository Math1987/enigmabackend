"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passPatterns = exports.getPattern = exports.initMainPatterns = void 0;
const chara_pattern_1 = require("./chara.pattern");
const squeleton_pattern_1 = require("./squeleton.pattern");
let PATTERNS = {};
const initMainPatterns = (callBack) => {
    PATTERNS = {
        humanmasculin: new chara_pattern_1.Player("humanmasculin"),
        humanfeminine: new chara_pattern_1.Player("humanfeminine"),
        dwarfmasculin: new chara_pattern_1.Player("dwarfmasculin"),
        dwarffeminine: new chara_pattern_1.Player("dwarffeminine"),
        elfmasculin: new chara_pattern_1.Player("elfmasculin"),
        elffeminine: new chara_pattern_1.Player("elffeminine"),
        vampiremasculin: new chara_pattern_1.Player("vampiremasculin"),
        vampirefeminine: new chara_pattern_1.Player("vampirefeminine"),
        squeleton: new squeleton_pattern_1.Squeleton('squeleton')
    };
    callBack("ok");
};
exports.initMainPatterns = initMainPatterns;
const getPattern = (key) => {
    return PATTERNS[key];
};
exports.getPattern = getPattern;
const passPatterns = (worldData, callback) => {
    let i = Object.keys(PATTERNS).length - 1;
    let func = () => {
        let key = Object.keys(PATTERNS)[i];
        let targetPattern = PATTERNS[key];
        targetPattern.pass(worldData, (resPass) => {
            if (i > 0) {
                i--;
                func();
            }
            else {
                callback("done");
            }
        });
    };
    func();
};
exports.passPatterns = passPatterns;
