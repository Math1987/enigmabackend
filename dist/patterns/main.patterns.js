"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passPatterns = exports.getPattern = exports.initMainPatterns = void 0;
const chara_pattern_1 = require("./chara.pattern");
let PATTERNS = {};
const initMainPatterns = (callBack) => {
    PATTERNS = {
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
};
exports.initMainPatterns = initMainPatterns;
const getPattern = (key) => {
    return PATTERNS[key];
};
exports.getPattern = getPattern;
const passPatterns = (world_name, callback) => {
    let i = Object.keys(PATTERNS).length - 1;
    let func = () => {
        let key = Object.keys(PATTERNS)[i];
        let targetPattern = PATTERNS[key];
        targetPattern.pass(world_name, (resPass) => {
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
