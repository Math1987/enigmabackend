"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOnNeutralZone = exports.getGroundsOnPositions = void 0;
const world_controller_1 = require("./world.controller");
const NEUTRAL_ZONE_SIZE = 4;
const isOnNeutralZone = (x, y) => {
    if (x >= -NEUTRAL_ZONE_SIZE / 2 &&
        x <= NEUTRAL_ZONE_SIZE / 2 &&
        y >= -NEUTRAL_ZONE_SIZE / 2 &&
        y <= NEUTRAL_ZONE_SIZE / 2) {
        return true;
    }
    else {
        return false;
    }
};
exports.isOnNeutralZone = isOnNeutralZone;
const getGroundsOnPositions = (world_name, positions, callback) => {
    world_controller_1.getWorld(world_name, (world) => {
        let grounds = [];
        for (let pos of positions) {
            if (pos.x >= -world.width / 2 &&
                pos.x <= world.width / 2 &&
                pos.y >= -world.height / 2 &&
                pos.y <= world.height / 2) {
                if (isOnNeutralZone(pos.x, pos.y)) {
                    grounds.push({ x: pos.x, y: pos.y, key: "neutral" });
                }
                else {
                    grounds.push({ x: pos.x, y: pos.y, key: "desert" });
                }
            }
        }
        callback(grounds);
    });
};
exports.getGroundsOnPositions = getGroundsOnPositions;
