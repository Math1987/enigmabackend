import { passWorlds } from "../controllers/world.controller";
import { readWorldsData } from "../data/world.data";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("world router.");
});

router.get("/getFreeWorld", (req, res) => {
  readWorldsData( worlds => {
    if ( worlds && worlds.length > 0 ){
      res.status(200).send(worlds[worlds.length-1]);
    }else{
      res.status(404).send('error');
    }
  });
});


router.get("/pass", (req, res) => {
  passWorlds((passWorldRes) => {
    res.status(200).send(passWorldRes);
  });
});

export const routerWorld = router;
