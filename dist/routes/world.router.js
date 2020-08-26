"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerWorld = void 0;
const world_controller_1 = require("../controllers/world.controller");
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.status(200).send("world router.");
});
router.get("/pass", (req, res) => {
    world_controller_1.passWorlds((passWorldRes) => {
        res.status(200).send(passWorldRes);
    });
});
exports.routerWorld = router;
