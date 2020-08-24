"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerRank = void 0;
const rank_kill_data_1 = require("../data/rank_kill.data");
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.status(200).send("route rank");
});
router.get("/kills", (req, res) => {
    console.log(req.query);
    if (req.query["world"] && req.query["id"]) {
        rank_kill_data_1.readRankKillsData(req.query["world"], req.query["id"], (kills) => {
            res.status(200).send(kills);
        });
    }
    else {
        res.status(401).send("need world name and id");
    }
});
exports.routerRank = router;
