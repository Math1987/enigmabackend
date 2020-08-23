"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerAdmin = void 0;
const world_data_1 = require("../data/world.data");
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
    res.status(200).send("welcom to admin api.");
});
router.post("/createWorld", (req, res) => {
    if (req.body && req.body.name && req.body.width && req.body.height) {
        world_data_1.buildWorldData(req.body, (worldBuild) => { });
    }
    res.status(200).send("ok");
});
exports.routerAdmin = router;
