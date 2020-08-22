"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerApi = void 0;
const meta_data_1 = require("../data/meta.data");
const security_1 = require("../services/security");
const valuesPatterns_data_1 = require("../data/valuesPatterns.data");
const express = require("express");
exports.routerApi = express.Router();
exports.routerApi.get(`/`, function (req, res) {
    res.status(200).send("test");
});
exports.routerApi.get(`/metadatas`, function (req, res) {
    meta_data_1.MetaData.readMetaDatas(function (metadatas) {
        res.status(200).json(metadatas);
    });
});
exports.routerApi.get(`/metavalues`, function (req, res) {
    valuesPatterns_data_1.ValuesPatternsData.readAll(function (metavalues) {
        res.status(200).json(metavalues);
    });
});
exports.routerApi.get("/user", function (req, res) {
    const token = req.headers.authorization;
    if (token) {
        security_1.Security.checkToken(token, function (userRes) {
            if (userRes) {
                res.status(200).json(userRes);
            }
            else {
                res.status(401).json("token invalid");
            }
        });
    }
    else {
        res.status(401).json("no token");
    }
});
exports.routerApi.get("/refreshToken", function (req, res) {
    const token = req.headers.authorization;
    if (token) {
        security_1.Security.checkToken(token, function (userRes) {
            if (userRes) {
                Reflect.deleteProperty(userRes, "exp");
                Reflect.deleteProperty(userRes, "iat");
                const newToken = security_1.Security.createToken(userRes);
                res.status(200).json(newToken);
            }
            else {
                res.status(401).json("wrong token");
            }
        });
    }
    else {
        res.status(403).json("no token to refresh!");
    }
});
exports.routerApi.post("/newToken", function (req, res) {
    const token = req.headers.authorization;
    if (token) {
        security_1.Security.checkToken(token, function (userRes) {
            if (userRes) {
                if (req.body.world) {
                    userRes["world"] = req.body.world;
                }
                Reflect.deleteProperty(userRes, "exp");
                Reflect.deleteProperty(userRes, "iat");
                const newToken = security_1.Security.createToken(userRes);
                res.status(200).json(newToken);
            }
            else {
                res.status(401).json("wrong token");
            }
        });
    }
    else {
        res.status(403).json("no token to refresh!");
    }
});
