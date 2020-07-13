"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const world_data_1 = require("../data/world.data");
const express = require('express');
exports.routerWorld = express.Router();
exports.routerWorld.get('/', function (req, res) {
    res.status(200).send('ok');
});
exports.routerWorld.post('/create', (req, res) => {
    //WorldData.buildWorld({name : })
    if (req.body && req.body.name && req.body.width && req.body.height) {
        world_data_1.WorldData.buildWorld(req.body, (worldBuild) => {
            console.log(worldBuild);
        });
    }
    res.status(200).send('ok');
});
