"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerUser = void 0;
const account_controller_1 = require("./../controllers/account.controller");
const express = require("express");
exports.routerUser = express.Router();
exports.routerUser.use((req, res, next) => {
    const token = req.headers.authtoken;
    if (token) {
        account_controller_1.readAccountByToken(token, (values) => {
            req["account"] = values;
            next();
        });
    }
    else {
        res.status(401).send("need token");
    }
});
