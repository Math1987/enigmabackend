"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerWorld = void 0;
const world_controller_1 = require("../controllers/world.controller");
const world_data_1 = require("../data/world.data");
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.status(200).send("world router.");
});
router.get("/getFreeWorld", (req, res) => {
    world_data_1.readWorldsData(worlds => {
        if (worlds && worlds.length > 0) {
            res.status(200).send(worlds[worlds.length - 1]);
        }
        else {
            res.status(404).send('error');
        }
    });
});
router.get("/pass", (req, res) => {
    world_controller_1.passWorlds((passWorldRes) => {
        res.status(200).send(passWorldRes);
    });
});
exports.routerWorld = router;
