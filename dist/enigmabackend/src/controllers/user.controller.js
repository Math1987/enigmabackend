"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAccount = void 0;
const email_controller_1 = require("./email.controller");
const account_data_1 = require("./../data/account.data");
(req, res) => {
    if (req.query['confirm'] && email_controller_1.confirmEmail(req.query['confirm'])) {
        account_data_1.AccountData.createAccount(req.body.email, req.body.password, req.body.name, 0, function (account) {
            res.status(200).json(account);
        });
    }
    else {
        res.status(401).send('need confirm code');
    }
};
