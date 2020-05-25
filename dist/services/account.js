"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_handler_1 = require("../https.handler");
const data_1 = require("../data/data");
const security_1 = require("./security");
/**
 * The account service manage all the requests about user's account,
 * as singin, singup, geting user informations etc...
 */
class AccountService {
    /**
     * The initiation use HttpsHandle static app as express with bodyparser
     */
    static init() {
        /**
         * echeckEmail request check if mail exist or not.
         * send true or false
         */
        https_handler_1.HttpsHandler.app.get('/checkEmail', function (req, res) {
            if (req.query.email) {
                data_1.Data.checkAccount(req.query.email, function (accountRes) {
                    res.send(accountRes);
                });
            }
            else {
                res.send(false);
            }
        });
        /**
         * checkAccountName request check if name exist or not.
         * send true or false
         */
        https_handler_1.HttpsHandler.app.get('/checkAccountName', function (req, res) {
            if (req.query.name) {
                data_1.Data.checkAccountName(req.query.name, function (accountRes) {
                    res.send(accountRes);
                });
            }
            else {
                res.send(false);
            }
        });
        /**
         * signup request try to create a new account in database.
         * check if the body contain all the requireds informations,
         * then check if the email and name are free, (if not, send error 403)
         * then create account and send the user informations as json
         */
        https_handler_1.HttpsHandler.app.post('/signup', function (req, res) {
            if (req.body && req.body.email && req.body.password && req.body.name) {
                data_1.Data.checkAccount(req.query.email, function (accountRes) {
                    data_1.Data.checkAccountName(req.query.email, function (nameRes) {
                        if (!accountRes && !nameRes) {
                            data_1.Data.createAccount(req.body.email, req.body.password, req.body.name, 0, function (account) {
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
        /**
         * signin create a token if email and password
         * send the token back if correct,
         * send error 401 if not, or 403 if body invalid
         */
        https_handler_1.HttpsHandler.app.post('/signIn', function (req, res) {
            if (req.body && req.body.email && req.body.password) {
                data_1.Data.readAccount(req.body.email, req.body.password, function (accountRes) {
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
        /**
         * user send the user informations as email, name, admin rights etc...
         * only if the token in the header is valid,
         * else send 401 if not or 403 if body invalid
         */
        https_handler_1.HttpsHandler.app.get('/user', function (req, res) {
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
        /**
         * RefreshToken create a new token from an other token if valid
         * if not, send error 401, or 403 if no token in header
         */
        https_handler_1.HttpsHandler.app.get('/refreshToken', function (req, res) {
            const token = req.headers.authorization;
            if (token) {
                security_1.Security.checkToken(token, function (userRes) {
                    if (userRes) {
                        delete userRes['exp'];
                        delete userRes['iat'];
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
    }
}
exports.AccountService = AccountService;
