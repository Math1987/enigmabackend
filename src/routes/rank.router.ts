import { readRankKillsData } from "../data/rank_kill.data";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("route rank");
});

router.get("/kills", (req, res) => {
  console.log(req.query);
  if (req.query["world"] && req.query["id"]) {
    readRankKillsData(req.query["world"], req.query["id"], (kills) => {
      res.status(200).send(kills);
    });
  } else {
    res.status(401).send("need world name and id");
  }
});

export const routerRank = router;
