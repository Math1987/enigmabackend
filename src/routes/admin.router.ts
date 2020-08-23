import { buildWorldData } from "../data/world.data";

const express = require("express");
const router = express.Router();

router.get("/", function (req: Request, res: Response) {
  res.status(200).send("welcom to admin api.");
});

router.post("/createWorld", (req: Request, res: Response) => {
  if (req.body && req.body.name && req.body.width && req.body.height) {
    buildWorldData(req.body, (worldBuild) => {});
  }
  res.status(200).send("ok");
});

export const routerAdmin = router;
