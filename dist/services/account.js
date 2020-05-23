"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_handler_1 = require("../https.handler");
const data_1 = require("../data/data");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const RSA_KEY_PRIVATE = fs.readFileSync('dist/rsa/key');
class AccountService {
    static init() {
        https_handler_1.HttpsHandler.app.get('/checkEmail', function (req, res) {
            if (req.query.email) {
                data_1.Data.checkAccount(req.query.email, function (accountRes) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(accountRes);
                });
            }
            else {
                res.send(false);
            }
        });
        https_handler_1.HttpsHandler.app.get('/checkAccountName', function (req, res) {
            if (req.query.name) {
                data_1.Data.checkAccountName(req.query.name, function (accountRes) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(accountRes);
                });
            }
            else {
                res.send(false);
            }
        });
        https_handler_1.HttpsHandler.app.post('/signup', function (req, res) {
            if (req.body) {
                data_1.Data.createAccount(req.body.email, req.body.password, req.body.name, 0, function (account) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(account);
                });
            }
            else {
                res.send(null);
            }
        });
        https_handler_1.HttpsHandler.app.post('/signIn', function (req, res) {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader("Access-Control-Allow-Origin", "*");
            if (req.body) {
                data_1.Data.readAccount(req.body.email, req.body.password, function (accountRes) {
                    if (accountRes) {
                        var token = jwt.sign(RSA_KEY_PRIVATE, 'text');
                        res.send(token);
                    }
                    else {
                        res.send(null);
                    }
                });
            }
            else {
                res.send(null);
            }
        });
    }
}
exports.AccountService = AccountService;
