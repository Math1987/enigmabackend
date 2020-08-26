import { passWorlds } from "../controllers/world.controller";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("world router.");
});

router.get("/pass", (req, res) => {
  passWorlds((passWorldRes) => {
    res.status(200).send(passWorldRes);
  });
});

export const routerWorld = router;
