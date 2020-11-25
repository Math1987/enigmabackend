import { midleWearTokenSecur } from "../controllers/account.controller";
import { adminLoginReq, adminReadTokenReq, midleWearTokenSecurADMIN } from "../controllers/admin.controller";
import { createClanRequest } from "../controllers/clan.controller";
import { getWorldsRequest, updateWorldValueRequest } from "../controllers/world.controller";
import { buildWorldData } from "../data/world.data";

const express = require("express");
const router = express.Router();

router.get("/", function (req: Request, res: Response) {
  res.status(200).send("welcom to admin api.");
});

router.post("/login", adminLoginReq);
router.post("/readToken", adminReadTokenReq);

router.use(midleWearTokenSecurADMIN);

router.get('/getWorlds', getWorldsRequest);
router.post("/createWorld", (req: Request, res: Response) => {
  if (req.body && req.body.name && req.body.width && req.body.height) {
    buildWorldData(req.body, (worldBuild) => {});
  }
  res.status(200).send("ok");
});
router.post("/updateWorldValue", updateWorldValueRequest);
router.post("/createClan", createClanRequest);


export const routerAdmin = router;
