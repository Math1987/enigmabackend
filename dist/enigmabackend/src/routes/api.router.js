"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerApi = void 0;
const email_controller_1 = require("./../controllers/email.controller");
const account_data_1 = require("../data/account.data");
const meta_data_1 = require("../data/meta.data");
const security_1 = require("../services/security");
const valuesPatterns_data_1 = require("../data/valuesPatterns.data");
const email_controller_2 = require("../controllers/email.controller");
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
exports.routerApi.get("/checkEmail", (req, res) => {
    if (req && req.query.email) {
        account_data_1.AccountData.checkAccount(req.query.email, function (accountRes) {
            res.send(accountRes);
        });
    }
    else {
        res.send(false);
    }
});
exports.routerApi.get("/checkAccountName", function (req, res) {
    if (req.query.name) {
        account_data_1.AccountData.checkAccountName(req.query.name, function (accountRes) {
            res.send(accountRes);
        });
    }
    else {
        res.send(false);
    }
});
exports.routerApi.post("/signup", function (req, res) {
    if (req.body && req.body.email && req.body.password && req.body.name) {
        account_data_1.AccountData.checkAccount(req.body.email, function (accountRes) {
            account_data_1.AccountData.checkAccountName(req.body.name, function (nameRes) {
                if (!accountRes && !nameRes) {
                    email_controller_2.sendWelcomEmail(req.body);
                    res.status(200).json(req.body);
                }
                else {
                    res.status(403).json("email or name incorrect");
                }
            });
        });
    }
    else {
        res.status(403).json("body request incorrect");
    }
});
exports.routerApi.post("/confirm", (req, res) => {
    console.log(req.body);
    if (req.body["code"]) {
        console.log(req.body["code"]);
        email_controller_1.confirmEmail(req.body["code"], (confirmRes) => {
            console.log(confirmRes);
            res.status(200).send(confirmRes);
        });
    }
    else {
        res.status(200).send(false);
    }
});
exports.routerApi.post("/signIn", function (req, res) {
    if (req.body && req.body.email && req.body.password) {
        account_data_1.AccountData.readAccount(req.body.email, req.body.password, function (accountRes) {
            if (accountRes) {
                var token = security_1.Security.createToken(accountRes);
                res.status(200).json(token);
            }
            else {
                res.status(401).json("error");
            }
        });
    }
    else {
        res.status(403).json("body invalid");
    }
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
