"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerApi = void 0;
const express = require("express");
exports.routerApi = express.Router();
exports.routerApi.get(`/`, function (req, res) {
    res.status(200).send("welcom to EnigmaJDR api.");
});
