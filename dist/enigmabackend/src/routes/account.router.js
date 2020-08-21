"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerAccount = void 0;
const account_controller_1 = require("./../controllers/account.controller");
const express = require("express");
const router = express.Router();
router.get(`/`, function (req, res) {
    res.status(200).send("account route");
});
router.get("/checkEmail", account_controller_1.checkEmailRequest);
router.get("/checkName", account_controller_1.checkNameRequest);
router.post("/signup", function (req, res) { });
router.post("/confirm", (req, res) => { });
router.post("/signIn", function (req, res) { });
exports.routerAccount = router;
