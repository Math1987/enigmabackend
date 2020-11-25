"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAdminSocket = void 0;
const world_controller_1 = require("../controllers/world.controller");
const initAdminSocket = (socket) => {
    console.log('run admin socket connection');
    let worldName = "world1";
    socket.join(worldName);
    socket.on("switchWorld", (world, callback) => {
        console.log('switch world', world);
        worldName = world;
        callback(true);
    });
    socket.on("getOnPositions", (positions, callback) => {
        if (worldName) {
            world_controller_1.getOnPositions(worldName, positions, callback);
        }
        else {
            callback('need world name');
        }
    });
    socket.on("move", (x, y, callback) => {
        //socket.emit('move', x, y, test=>{});
    });
};
exports.initAdminSocket = initAdminSocket;
