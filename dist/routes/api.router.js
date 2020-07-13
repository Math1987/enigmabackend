"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_data_1 = require("../data/account.data");
const meta_data_1 = require("../data/meta.data");
const security_1 = require("../services/security");
const express = require('express');
exports.routerApi = express.Router();
exports.routerApi.get(`/`, function (req, res) {
    res.status(200).send('test');
});
exports.routerApi.get(`/metadatas`, function (req, res) {
    meta_data_1.MetaData.readMetaDatas(function (metadatas) {
        res.status(200).json(metadatas);
    });
});
exports.routerApi.get('/checkEmail', (req, res) => {
    if (req && req.query.email) {
        account_data_1.AccountData.checkAccount(req.query.email, function (accountRes) {
            res.send(accountRes);
        });
    }
    else {
        res.send(false);
    }
});
exports.routerApi.get('/checkAccountName', function (req, res) {
    if (req.query.name) {
        account_data_1.AccountData.checkAccountName(req.query.name, function (accountRes) {
            res.send(accountRes);
        });
    }
    else {
        res.send(false);
    }
});
exports.routerApi.post('/signup', function (req, res) {
    if (req.body && req.body.email && req.body.password && req.body.name) {
        account_data_1.AccountData.checkAccount(req.body.email, function (accountRes) {
            account_data_1.AccountData.checkAccountName(req.body.name, function (nameRes) {
                if (!accountRes && !nameRes) {
                    account_data_1.AccountData.createAccount(req.body.email, req.body.password, req.body.name, 0, function (account) {
                        res.status(200).json(account);
                    });
                }
                else {
                    res.status(403).json('email or name incorrect');
                }
            });
        });
    }
    else {
        res.status(403).json('body request incorrect');
    }
});
exports.routerApi.post('/signIn', function (req, res) {
    if (req.body && req.body.email && req.body.password) {
        account_data_1.AccountData.readAccount(req.body.email, req.body.password, function (accountRes) {
            if (accountRes) {
                var token = security_1.Security.createToken(accountRes);
                res.status(200).json(token);
            }
            else {
                res.status(401).json('error');
            }
        });
    }
    else {
        res.status(403).json('body invalid');
    }
});
exports.routerApi.get('/user', function (req, res) {
    const token = req.headers.authorization;
    if (token) {
        security_1.Security.checkToken(token, function (userRes) {
            if (userRes) {
                res.status(200).json(userRes);
            }
            else {
                res.status(401).json('token invalid');
            }
        });
    }
    else {
        res.status(401).json('no token');
    }
});
exports.routerApi.get('/refreshToken', function (req, res) {
    const token = req.headers.authorization;
    if (token) {
        security_1.Security.checkToken(token, function (userRes) {
            if (userRes) {
                Reflect.deleteProperty(userRes, 'exp');
                Reflect.deleteProperty(userRes, 'iat');
                const newToken = security_1.Security.createToken(userRes);
                res.status(200).json(newToken);
            }
            else {
                res.status(401).json('wrong token');
            }
        });
    }
    else {
        res.status(403).json('no token to refresh!');
    }
});
