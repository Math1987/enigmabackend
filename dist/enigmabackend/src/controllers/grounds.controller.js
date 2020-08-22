"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroundsOnPositions = void 0;
const world_controller_1 = require("./world.controller");
exports.getGroundsOnPositions = (world_name, positions, callback) => {
    world_controller_1.getWorld(world_name, (world) => {
        let grounds = [];
        for (let pos of positions) {
            if (pos.x >= -world.width / 2 &&
                pos.x <= world.width / 2 &&
                pos.y >= -world.height / 2 &&
                pos.y <= world.height / 2) {
                grounds.push({ x: pos.x, y: pos.y, key: "desert" });
            }
        }
        callback(grounds);
    });
};
