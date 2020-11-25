"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerAdmin = void 0;
const admin_controller_1 = require("../controllers/admin.controller");
const world_controller_1 = require("../controllers/world.controller");
const world_data_1 = require("../data/world.data");
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
    res.status(200).send("welcom to admin api.");
});
router.post("/login", admin_controller_1.adminLoginReq);
router.post("/readToken", admin_controller_1.adminReadTokenReq);
router.use(admin_controller_1.midleWearTokenSecurADMIN);
router.get('/getWorlds', world_controller_1.getWorldsRequest);
router.post("/createWorld", (req, res) => {
    if (req.body && req.body.name && req.body.width && req.body.height) {
        world_data_1.buildWorldData(req.body, (worldBuild) => { });
    }
    res.status(200).send("ok");
});
router.post("/updateWorldValue", world_controller_1.updateWorldValueRequest);
exports.routerAdmin = router;
