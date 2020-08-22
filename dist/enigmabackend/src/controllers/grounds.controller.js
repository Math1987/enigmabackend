"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroundsOnPositions = void 0;
exports.getGroundsOnPositions = (world_name, positions, callback) => {
    let grounds = [];
    for (let pos of positions) {
        grounds.push({ x: pos.x, y: pos.y, key: "desert" });
    }
    callback(grounds);
};
