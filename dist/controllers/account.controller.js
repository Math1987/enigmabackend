"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmResetPasswordRequest = exports.resetPasswordRequest = exports.readAccountRequest = exports.singInRequest = exports.confirmRequest = exports.signUpRequest = exports.checkNameRequest = exports.checkEmailRequest = exports.readAccountByToken = void 0;
const account_data_1 = require("./../data/account.data");
const email_controller_1 = require("./email.controller");
const token_controller_1 = require("./token.controller");
const player_data_1 = require("../data/player.data");
const chara_controller_1 = require("./chara.controller");
const checkEmail = (email, callback) => {
    account_data_1.checkEmailData(email, (accountRes) => {
        if (accountRes && accountRes.length > 0) {
            callback(true);
        }
        else {
            callback(null);
        }
    });
};
const checkName = (name, callback) => {
    account_data_1.checkAccountNameData(name, (accountRes) => {
        if (accountRes && accountRes.length > 0) {
            callback(true);
        }
        else {
            callback(null);
        }
    });
};
const readAccountByToken = (token, callback) => {
    if (token) {
        token_controller_1.readToken(token, tokenRes => {
            if (tokenRes && tokenRes['id']) {
                account_data_1.readAccountDataById(tokenRes['id'], accountRes => {
                    if (accountRes && accountRes['world']) {
                        chara_controller_1.readChara(accountRes['world'], accountRes['id'], charaRes => {
                            if (charaRes) {
                                accountRes['chara'] = charaRes;
                            }
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
    if (req.body && req.body.email && req.body.password && req.body.name) {
        account_data_1.checkEmailData(req.body.email, (accountRes) => {
            if (accountRes && accountRes.length > 0) {
                res.status(401).send('already exist');
            }
            else {
                account_data_1.checkAccountNameData(req.body.name, (nameRes) => {
                    if (!nameRes || nameRes.length <= 0) {
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
        email_controller_1.confirmEmail(req.body["code"], (confirmRes) => {
            res.status(200).send(confirmRes);
        });
    }
    else {
        res.status(200).send(false);
    }
};
exports.singInRequest = (req, res) => {
    if (req.body && req.body.email && req.body.password) {
        account_data_1.readAccountData(req.body.email, req.body.password, (accountRes) => {
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
                res.status(401).json({ error: "wrong password" });
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
exports.resetPasswordRequest = (req, res) => {
    checkEmail(req.body['email'], resEmail => {
        if (resEmail) {
            email_controller_1.sendResetEmail(req.body['email']);
            res.status(200).send('ok');
        }
        else {
            res.status(404).send('email not found');
        }
    });
};
exports.confirmResetPasswordRequest = (req, res) => {
    console.log(req.body['code']);
    const email = email_controller_1.decrypt({ iv: email_controller_1.IV, encryptedData: req.body['code'] });
    if (email) {
        account_data_1.replacePasswordData(email, req.body['password'], resData => {
            res.status(200).send(resData);
        });
    }
};
