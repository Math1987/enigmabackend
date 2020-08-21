"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNameRequest = exports.checkEmailRequest = void 0;
const account_data_1 = require("./../data/account.data");
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
