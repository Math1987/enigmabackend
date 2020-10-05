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
router.post("/signup", account_controller_1.signUpRequest);
router.post("/confirm", account_controller_1.confirmRequest);
router.post("/signIn", account_controller_1.singInRequest);
router.post("/readAccount", account_controller_1.readAccountRequest);
router.post("/resetPassword", account_controller_1.resetPasswordRequest);
router.post("/confirmResetPassword", account_controller_1.confirmResetPasswordRequest);
exports.routerAccount = router;
