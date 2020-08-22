"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const model_pattern_1 = require("./model.pattern");
class Player extends model_pattern_1.ModelPattern {
    constructor() {
        super();
    }
    readKey() {
        return "player";
    }
    create(world_name, id, callback) { }
}
exports.Player = Player;
