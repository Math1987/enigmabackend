"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAccountRequest = exports.singInRequest = exports.confirmRequest = exports.signUpRequest = exports.checkNameRequest = exports.checkEmailRequest = exports.readAccountByToken = void 0;
const account_data_1 = require("./../data/account.data");
const email_controller_1 = require("./email.controller");
const token_controller_1 = require("./token.controller");
const player_data_1 = require("../data/player.data");
const checkEmail = (email, callback) => {
    account_data_1.AccountData.checkAccount(email, (accountRes) => {
        callback(accountRes);
    });
};
const checkName = (name, callback) => {
    account_data_1.AccountData.checkAccountName(name, (accountRes) => {
        callback(accountRes);
    });
};
const readAccountByToken = (token, callback) => {
    if (token) {
        token_controller_1.readToken(token, tokenRes => {
            if (tokenRes && tokenRes['id']) {
                account_data_1.AccountData.readAccountById(tokenRes['id'], accountRes => {
                    if (accountRes && accountRes['world']) {
                        player_data_1.readCharaById(accountRes['world'], accountRes['id'], charaRes => {
                            accountRes['chara'] = charaRes;
                            callback(accountRes);
                        });
                    }
                    else {
                        callback(accountRes);
                    }
                });
            }
            else {
                callback(null);
            }
        });
    }
    else {
        callback(null);
    }
};
exports.readAccountByToken = readAccountByToken;
exports.checkEmailRequest = (req, res) => {
    if (req.query && req.query.email) {
        checkEmail(req.query.email, (checkRes) => {
            res.status(200).send(checkRes);
        });
    }
    else {
        res.status(401).send("need data");
    }
};
exports.checkNameRequest = (req, res) => {
    if (req.query && req.query.name) {
        checkName(req.query.name, (checkRes) => {
            res.status(200).send(checkRes);
        });
    }
    else {
        res.status(401).send("need data");
    }
};
exports.signUpRequest = (req, res) => {
    console.log(req.body);
    if (req.body && req.body.email && req.body.password && req.body.name) {
        account_data_1.AccountData.checkAccount(req.body.email, (accountRes) => {
            if (accountRes) {
                res.status(401).send('already exist');
            }
            else {
                account_data_1.AccountData.checkAccountName(req.body.name, (nameRes) => {
                    if (!nameRes) {
                        email_controller_1.sendWelcomEmail(req.body);
                        res.status(200).json(req.body);
                    }
                    else {
                        res.status(403).json("email or name incorrect");
                    }
                });
            }
        });
    }
    else {
        res.status(403).json("body request incorrect");
    }
};
exports.confirmRequest = (req, res) => {
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
};
exports.singInRequest = (req, res) => {
    console.log('signIn');
    if (req.body && req.body.email && req.body.password) {
        account_data_1.AccountData.readAccount(req.body.email, req.body.password, function (accountRes) {
            if (accountRes) {
                let tokenVal = { id: accountRes.id };
                const token = token_controller_1.createToken(tokenVal);
                let finalObj = {};
                Object.assign(finalObj, accountRes);
                finalObj['token'] = token;
                if (finalObj && finalObj['world']) {
                    player_data_1.readCharaById(finalObj['world'], finalObj['id'], charaRes => {
                        finalObj['chara'] = charaRes;
                        res.status(200).json(finalObj);
                    });
                }
                else {
                    res.status(200).json(finalObj);
                }
            }
            else {
                res.status(401).json("error");
            }
        });
    }
    else {
        res.status(403).json("body invalid");
    }
};
exports.readAccountRequest = (req, res) => {
    if (req.body && req.body.token) {
        readAccountByToken(req.body.token, accountRes => {
            if (accountRes) {
                res.status(200).send(accountRes);
            }
            else {
                res.status(404).send(null);
            }
        });
    }
    else {
        res.status(401).send(null);
    }
};
